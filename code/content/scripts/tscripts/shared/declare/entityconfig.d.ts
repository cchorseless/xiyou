
declare interface IEntityJson {
    _t: string;
    _id: string;
    BelongPlayerid: PlayerID;
    _p_instanceid?: string;
    _d_props?: { [k: string]: any };
    Children?: { [k: string]: IEntityJson };
    C?: { [k: string]: IEntityJson };
    [K: string]: any;
}

declare namespace BuildingConfig {

    /**玩家建造数据 */
    interface IBuildingDamageInfo {
        name: string;
        phyD: number;
        magD: number;
        pureD: number,
        byphyD: number;
        bymagD: number;
        bypureD: number,
    }
}

