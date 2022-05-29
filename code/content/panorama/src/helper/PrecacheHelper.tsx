import { LogHelper } from "./LogHelper";


export class PrecacheHelper {
    /**所有缓存的资源 */
    public static allRes: { [k: string]: Array<string> } = {};

    private static allClassType: { [k: string]: any } = {};

    public static RegClass(cls: any[]) {
        for (let c of cls) {
            PrecacheHelper.allClassType[c.name] = c;
            LogHelper.print("RegClass:", c.name);
        }
    }
    public static GetRegClass<T>(className: string) {
        let r = PrecacheHelper.allClassType[className];
        if (r == null) {
            LogHelper.error("NOT RegClass " + className);
        }
        return r as T;
    }
}