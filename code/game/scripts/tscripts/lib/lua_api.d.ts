// interface UNIT_BASE {
//     ____constructor?: () => void;
//     /**出生 */
//     Spawn?: (entityKeyValues: CScriptKeyValues) => void;
//     /**Spawn后执行 */
//     onSpawned?: (event: NpcSpawnedEvent) => void;
//     /**是否是第一次创建 */
//     __bIsFirstSpawn?: boolean;
//     /**添加的组件 */
//     __bindComponent__?: { [k: string]: Array<any> };
//     /**对应dota内的名字 */
//     __IN_DOTA_NAME__?: string;
//     /**对应dota内的数据 */
//     __IN_DOTA_DATA__?: any;
// }

// interface CDOTA_BaseNPC_Plus extends CDOTA_BaseNPC, UNIT_BASE {
//     /**所有的BUFF信息 */
//     __allModifiersInfo__?: { [v: string]: Array<any> };
//     /**是否由建造系统创建 */
//     __belong_System_Building?: any;
// }

// /**unit 创建回调到脚本的实体指针 */
// declare const thisEntity: CDOTA_BaseNPC_Plus;
// /**unit 创建回调到脚本的函数指针 */
declare let Precache: any;
declare let Spawn: any;
declare let Activate: any;
declare let UpdateOnRemove: any;
declare let OnStartTouch: any;



/**创建modeifier数据结构 */
interface ModifierTable  {
    /**时间 */
    duration?: number;
    /**hash id */
    hashtableUUid?: string;
    /**在OnCreated执行 */
    IsOnCreated?: boolean;
    /**在OnRefresh执行 */
    IsOnRefresh?: boolean;
    [k: string]: any;
}
