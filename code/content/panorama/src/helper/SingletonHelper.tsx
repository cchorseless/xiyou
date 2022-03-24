
export class SingletonClass {
    public constructor(...args: any[]) { }
    public static _instance_: any;
    /**
     * 获取一个单例
     * @returns
     */
    public static GetInstance<T extends typeof SingletonClass>(this: T, ...args: any[]): InstanceType<T> {
        let Class: T = this;
        if (!Class._instance_) {
            const argsLen: number = args.length;
            if (argsLen == 0) {
                Class._instance_ = new Class();
            } else {
                Class._instance_ = new Class(...args);
            }
        }
        return Class._instance_ as InstanceType<T>;
    }

}




