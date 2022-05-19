export module ClassHelper {
    const _ClassMap: { [k: string]: any } = {};
    export function regClass(className: string, classDef: any) {
        _ClassMap[className] = classDef;
    }
    export function regShortClassName(classes: any[]) {
        for (let i = 0; i < classes.length; i++) {
            let classDef = classes[i];
            let className = classDef.name;
            _ClassMap[className] = classDef;
        }
    }
    export function getRegClass<T>(className: string): T {
        return _ClassMap[className];
    }
}
