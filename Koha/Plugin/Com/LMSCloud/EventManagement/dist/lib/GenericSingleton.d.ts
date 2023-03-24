export default abstract class GenericSingleton<T extends GenericSingleton<T>> {
    private static instances;
    constructor();
    static getInstance<T extends GenericSingleton<T>>(this: new () => T): T;
}
//# sourceMappingURL=GenericSingleton.d.ts.map