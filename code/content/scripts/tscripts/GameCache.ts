import { BattleHelper } from "./helper/BattleHelper";
import { BaseModifier } from "./npc/entityPlus/Base_Plus";
/**全局缓存变量 */
@GReloadable
export class GameCache {
    /**攻击伤害记录 */
    static readonly RECORD_SYSTEM_DUMMY: {
        DAMAGE_SYSTEM: { [k: string]: BattleHelper.enum_EOM_DAMAGE_FLAGS },
        ATTACK_SYSTEM: { [k: string]: BattleHelper.AttackOptions },
        iLastRecord: number;
    } = {} as any;
    /**所有的游戏自带事件 */
    static readonly allGameEvent: { [v: string]: IGHandler[] } = {};
    /**所有自定义事件 */
    static readonly allCustomEvent: { [v: string]: IGHandler[] } = {};
    /**所有的JS协议事件 */
    static readonly allCustomProtocolEvent: { [k: string]: IGHandler[] } = {};
    /**所有的buff实例 */
    static readonly allModifiersIntance: { [modifiername: string]: { [UUID: string]: InstanceType<typeof BaseModifier> } } = {};
    /**全部注册的BUFF事件信息 */
    static readonly allRegisterEvent: { [v: string]: Set<IModifier_Plus> } = {};
    /**全局计时器 */
    static readonly TimerEntity: CBaseEntity;
    /**所有报错信息 */
    static readonly allErrorInfo: { [key: string]: any } = {};

    static Init() {
    }

}


declare global {
    var GGameCache: typeof GameCache;
}
if (_G.GGameCache == null) {
    _G.GGameCache = GameCache;
}




