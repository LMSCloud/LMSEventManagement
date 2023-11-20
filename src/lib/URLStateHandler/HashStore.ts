export class HashStore {
    private _hash?: string;

    constructor(hash: string) {
        this._hash = this._sanititze(hash);
    }

    set hash(hash: string) {
        this._hash = this._sanititze(hash);
    }

    get hash() {
        return this._hash ?? "";
    }

    private _sanititze(hash: string) {
        return window.decodeURIComponent(hash.replace("#", ""));
    }
}
