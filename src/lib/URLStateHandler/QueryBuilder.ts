import { match } from "ts-pattern";

export type Params = Record<string, any>;

export type ParamKeysList = Array<string>;

type Repeatables = Record<string, any[]>;

export interface QueryBuilderOptions {
    query?: string;
    forbiddenParams?: ParamKeysList;
    optionalParams?: ParamKeysList;
    repeatableParams?: ParamKeysList;
    staticParams?: ParamKeysList;
}

export interface WithoutOptions {
    staticParams: boolean;
    useParams?: string;
}

/** QueryBuilder is a class that manages global state via the URL. */
export class QueryBuilder {
    private _query?: string;

    private _forbiddenParams?: ParamKeysList;

    private _optionalParams?: ParamKeysList;

    private _repeatableParams?: ParamKeysList;

    private _staticParams?: ParamKeysList;

    private _paramMap: URLSearchParams = new URLSearchParams();

    constructor({
        query,
        forbiddenParams,
        optionalParams,
        repeatableParams,
        staticParams,
    }: QueryBuilderOptions = {}) {
        this._query = query ? this._constrain(query).toString() : undefined;
        this._forbiddenParams = forbiddenParams;
        this._optionalParams = optionalParams;
        this._repeatableParams = repeatableParams;
        this._staticParams = staticParams;
    }

    get forbiddenParams() {
        return this._forbiddenParams ?? [];
    }

    set forbiddenParams(forbiddenParams: ParamKeysList) {
        this._forbiddenParams = forbiddenParams;
    }

    get optionalParams() {
        return this._optionalParams ?? [];
    }

    set optionalParams(optionalParams: ParamKeysList) {
        this._optionalParams = optionalParams;
    }

    get repeatableParams() {
        return this._repeatableParams ?? [];
    }

    set repeatableParams(repeatableParams: ParamKeysList) {
        this._repeatableParams = repeatableParams;
    }

    get staticParams() {
        return this._staticParams ?? [];
    }

    set staticParams(staticParams: ParamKeysList) {
        this._staticParams = staticParams;

        this.staticParams.forEach((staticParam) => {
            this._paramMap.set(staticParam, "");
        });
    }

    get query() {
        return this._query ?? "";
    }

    set query(query: string) {
        this.paramMap = new URLSearchParams(this._constrain(query));

        this._query = this.paramMap.toString();
    }

    get paramMap() {
        return this._paramMap;
    }

    set paramMap(paramMap: URLSearchParams) {
        this._paramMap = paramMap;
    }

    private _isForbidden(key: string) {
        return this.forbiddenParams.includes(key);
    }

    private _isRepeatable(key: string) {
        return this.repeatableParams.includes(key);
    }

    private _isStatic(key: string) {
        return this.staticParams.includes(key);
    }

    private _constrain(query: string) {
        const params = new URLSearchParams(query);
        params.forEach((value, key) => {
            match(key)
                .when(
                    (key) => this._isForbidden(key),
                    () => {}
                )
                .when(
                    (key) => this._isRepeatable(key),
                    () => {
                        this.paramMap.append(key, value);
                    }
                )
                .when(
                    (key) => this._isStatic(key),
                    () => {
                        if (!this.paramMap.has(key)) {
                            this.paramMap.set(key, value);
                        }
                    }
                )
                .otherwise(() => {
                    this.paramMap.set(key, value);
                });
        });

        return params;
    }

    private _diffValues(setA: Set<any>, setB: Set<any>) {
        return [
            [...setB].filter((item) => !setA.has(item)),
            [...setA].filter((item) => !setB.has(item)),
        ];
    }

    public getValue(key: string) {
        return this.paramMap.get(key);
    }

    public getValues(...keys: string[]) {
        return keys.map((key) => this.paramMap.get(key));
    }

    public without({ staticParams, useParams }: WithoutOptions) {
        const current = new URLSearchParams(
            useParams ?? this.paramMap.toString()
        );

        if (staticParams) {
            this.staticParams.forEach((staticParam) => {
                current.delete(staticParam);
            });
        }

        return current.toString();
    }

    public merge(params: Params) {
        const current = new URLSearchParams(this.paramMap.toString());
        const merging = new URLSearchParams(params);

        const currentRepeatables: Repeatables = {};
        const mergingRepeatables: Repeatables = {};
        this.repeatableParams.map((repeatableParam) => {
            currentRepeatables[repeatableParam] =
                current.getAll(repeatableParam);
            mergingRepeatables[repeatableParam] =
                merging.getAll(repeatableParam);
        });

        this.repeatableParams.forEach((repeatableParam) => {
            const [appended, removed] = this._diffValues(
                new Set(currentRepeatables[repeatableParam]),
                new Set(mergingRepeatables[repeatableParam])
            );

            current.delete(repeatableParam);
            merging.delete(repeatableParam);

            let values = currentRepeatables[repeatableParam]
                ?.filter((item) => !removed?.includes(item))
                .concat(appended);

            values?.forEach((value) => {
                current.append(repeatableParam, value);
            });
        });

        this.optionalParams.forEach((optionalParam) => {
            const [_, removed] = this._diffValues(
                new Set([current.get(optionalParam)]),
                new Set([merging.get(optionalParam)])
            );

            current.delete(optionalParam);

            if (removed?.includes(optionalParam)) {
                merging.delete(optionalParam);
            }
        });

        merging.forEach((value, key) => {
            current.set(key, value);
        });

        return current.toString();
    }
}
