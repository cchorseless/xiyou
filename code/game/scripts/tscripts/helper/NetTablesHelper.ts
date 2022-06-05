export module NetTablesHelper {
    type tablename = keyof CustomNetTableInfo;
    /**
     * 获取表
     * @param tablename
     * @param key
     * @returns
     */
    export function GetData(tablename: tablename, key: string) {
        let _tablename = tablename as never;
        return (CustomNetTables.GetTableValue(_tablename, key) || {}) as any;
    }
    export function SetData(tablename: tablename, key: string, data: any) {
        let _tablename = tablename as never;
        CustomNetTables.SetTableValue(_tablename, key, data as never);
    }
}
