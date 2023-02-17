export default class Observable {
    private observers;
    private caller;
    constructor(caller: any);
    subscribe(func: Function): void;
    unsubscribe(func: Function): void;
    notify(data: any): void;
}
//# sourceMappingURL=Observable.d.ts.map