declare interface LUA_TO_LUA_DATA {
    /**玩家ID */
    PlayerID?: PlayerID;
    /**实体ID */
    entindex?: EntityIndex;
    /**协议号 */
    protocol?: string;
    /**数据 */
    data?: any;
    /**数据发送完成标记 todo */
    isFinish?: boolean;
}
declare interface JS_TO_LUA_DATA extends LUA_TO_LUA_DATA {
    /**是否成功 */
    state?: boolean;
    /**报错描述 */
    message?: string;
    /**是否有回调 */
    hasCB?: boolean;
    /**服务器模拟自己触发的事件 */
    IsfromServer?: boolean;
}

declare interface CLIENT_DATA<T> extends JS_TO_LUA_DATA {
    data?: T;
}

declare interface ArrayLikeObject<T> {
    [k: string]: T;
}
/**
 * 自定义游戏事件
 */
declare interface CustomGameEventDeclarations {
    /**服务器内部事件 */
    // LUA_TO_LUA_EVENT: LUA_TO_LUA_DATA;
    /**JS 请求 LUA data */
    JS_TO_LUA_EVENT: JS_TO_LUA_DATA;
}



declare interface IGet_ability_data {
    ability_entindex: EntityIndex, level: number, key_name: string | "cool_down" | "mana_cost" | "gold_cost";
}

declare interface IGet_unit_data {
    unit_entindex: EntityIndex, func_name: string;
}

declare interface IGet_player_data {
    PlayerID: PlayerID, func_name: string;
}

/**
 * 客户端JS调用客户端lua
 */
declare interface GameEventDeclarations {
    call_get_ability_data: IGet_ability_data;
    call_get_unit_data: IGet_unit_data;
    call_get_player_data: IGet_player_data;
}