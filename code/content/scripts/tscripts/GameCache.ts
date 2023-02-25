import { BattleHelper } from "./helper/BattleHelper";
/**全局缓存变量 */
@GReloadable
export class GameCache {
    /**攻击伤害记录 */
    static readonly RECORD_SYSTEM_DUMMY: {
        DAMAGE_SYSTEM: { [k: string]: BattleHelper.enum_CC_DAMAGE_FLAGS },
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
    static readonly allBuffIntance: { [modifiername: string]: { [UUID: string]: IModifier_Plus } } = {};
    /**全部注册的BUFF事件信息 */
    static readonly allBuffRegisterEvent: { [v: string]: Set<IModifier_Plus> } = {};
    /**全局计时器 */
    static readonly TimerEntity: CBaseEntity;
    /**所有报错信息 */
    static readonly allErrorInfo: { [key: string]: any } = {};

    /**
     * @Both
     */
    static Init() {
    }
    /**
     * 
     * @Both
     */
    static RegBuff(buff: IModifier_Plus, isreg: boolean) {
        if (buff && buff.UUID) {
            // let buffname = buff.UUID.split("@")[1];
            let buffname = buff.GetName();
            if (isreg) {
                if (buff.__AllRegisterEvent) {
                    for (let k in buff.__AllRegisterEvent) {
                        k = k + "";
                        GGameCache.allBuffRegisterEvent[k] = GGameCache.allBuffRegisterEvent[k] || new Set();
                        GGameCache.allBuffRegisterEvent[k].add(buff);
                    }
                }
                GGameCache.allBuffIntance[buffname] = GGameCache.allBuffIntance[buffname] || {};
                GGameCache.allBuffIntance[buffname][buff.UUID] = buff;
            }
            else {
                // 删除事件
                if (buff.__AllRegisterEvent) {
                    for (let k in buff.__AllRegisterEvent) {
                        k = k + "";
                        if (GGameCache.allBuffRegisterEvent[k]) {
                            GGameCache.allBuffRegisterEvent[k].delete(buff);
                        }
                    }
                }
                if (GGameCache.allBuffIntance[buffname]) {
                    if (GGameCache.allBuffIntance[buffname][buff.UUID]) {
                        delete GGameCache.allBuffIntance[buffname][buff.UUID];
                    }
                    if (Object.keys(GGameCache.allBuffIntance[buffname]).length == 0) {
                        delete GGameCache.allBuffIntance[buffname];
                    }
                }
            }

        }
    }

    static DebugReload() {
        for (let clsname in GGameCache.allBuffIntance) {
            const buffs = GGameCache.allBuffIntance[clsname];
            for (let k in buffs) {
                buffs[k].onDebugReload(GGetRegClass(clsname) as any);
            }
        }
    }

}


declare global {
    var GGameCache: typeof GameCache;
}
if (_G.GGameCache == null) {
    _G.GGameCache = GameCache;
}




