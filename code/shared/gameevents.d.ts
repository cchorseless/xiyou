
interface LUA_TO_LUA_DATA {
    /**玩家ID */
    PlayerID?: PlayerID,
    /**实体ID */
    entindex?: EntityIndex,
    /**协议号 */
    protocol?: string,
    /**数据 */
    data?: any,
    /**数据发送完成标记 todo */
    isFinish?: boolean,

}
interface JS_TO_LUA_DATA extends LUA_TO_LUA_DATA {
    /**是否成功 */
    state?: boolean,
    /**是否有回调 */
    hasCB?: boolean,
    /**服务器模拟自己触发的事件 */
    IsfromServer?: boolean,
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

