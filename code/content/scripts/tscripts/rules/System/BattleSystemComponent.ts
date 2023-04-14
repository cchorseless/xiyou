import { GameFunc } from "../../GameFunc";
import { modifier_event } from "../../npc/propertystat/modifier_event";
import { ET } from "../../shared/lib/Entity";

/**
 *自定义伤害flag
 */
export enum EBATTLE_DAMAGE_FLAGS {
    DAMAGE_FLAG_NONE = 0,
    /**无视大多数伤害加成效果(主要包含物理、魔法、纯粹、全伤害四种泛类型加成，ps=例如毒伤害拥有此flag，但是还是能收到毒伤害加成效果) */
    DAMAGE_FLAG_NO_DAMAGE_AMPLIFY = 1 << 0,
    /**技能暴击(√) */
    DAMAGE_FLAG_SPELL_CRIT = 1 << 1,
    /**不会触发技能暴击(√) */
    DAMAGE_FLAG_NO_SPELL_CRIT = 1 << 2,
    /**毒伤害(√) */
    DAMAGE_FLAG_POISON = 1 << 3,
    /**持续伤害(√) */
    DAMAGE_FLAG_DOT = 1 << 4,
    /**分裂伤害(√) */
    DAMAGE_FLAG_CLEAVE = 1 << 5,
    /** 流血伤害(√) */
    DAMAGE_FLAG_BLEEDING = 1 << 6,
    /**触电伤害 */
    DAMAGE_FLAG_SHOCK = 1 << 7,

}


/**
 * 普通攻击状态枚举
 */
export enum EBATTLE_ATTACK_STATE {
    ATTACK_STATE__NONE = 0,
    /**不触发攻击法球 */
    ATTACK_STATE_NOT_USECASTATTACKORB = 1, //
    /**不触发攻击流程 */
    ATTACK_STATE_NOT_PROCESSPROCS = 2, //
    /**无视攻击间隔 */
    ATTACK_STATE_SKIPCOOLDOWN = 8, //
    /**不触发破影一击 */
    ATTACK_STATE_IGNOREINVIS = 16, //
    /**没有攻击弹道 */
    ATTACK_STATE_NOT_USEPROJECTILE = 32, //
    /**假攻击 */
    ATTACK_STATE_FAKEATTACK = 64, //
    /**攻击不会丢失 */
    ATTACK_STATE_NEVERMISS = 128, //
    /**没有分裂攻击 */
    ATTACK_STATE_NO_CLEAVE = 256, //
    /**没有触发额外攻击 */
    ATTACK_STATE_NO_EXTENDATTACK = 512, //
    /**不减少各种攻击计数 */
    ATTACK_STATE_SKIPCOUNTING = 1024, //
    /**不触发暴击 */
    ATTACK_STATE_NO_CRIT = 2048,
    /**暴击*/
    ATTACK_STATE_CRIT = 4096, //

}

declare global {
    interface IBattleDamageOptions extends ApplyDamageOptions {
        extra_flags?: EBATTLE_DAMAGE_FLAGS;
    }

    interface IBattleAttackOptions {
        /**攻击标签 */
        attack_flags?: EBATTLE_ATTACK_STATE,
        /**是否暴击 */
        isCrit?: boolean;
    }
}


@GReloadable
export class BattleSystemComponent extends ET.SingletonComponent {

    /**全局战斗伤害记录 */
    public Npc_RECORD_SYSTEM: CDOTA_BaseNPC;
    /**全局buff事件监听 */
    public Npc_MODIFIER_EVENTS: CDOTA_BaseNPC;
    static readonly RECORD_SYSTEM_DUMMY: {
        DAMAGE_SYSTEM: { [k: string]: EBATTLE_DAMAGE_FLAGS },
        ATTACK_SYSTEM: { [k: string]: IBattleAttackOptions },
        iLastRecord: number;
    } = {} as any;
    /**
     * 初始化全局NPC
     */
    private CreateGlobalEventNPC() {
        if (this.Npc_MODIFIER_EVENTS) {
            SafeDestroyUnit(this.Npc_MODIFIER_EVENTS);
            this.Npc_MODIFIER_EVENTS = null;
        }
        this.Npc_MODIFIER_EVENTS = modifier_event.applyThinker(Vector(0, 0, 0), GameRules.Addon.Instance as any, null, null, DOTATeam_t.DOTA_TEAM_NOTEAM, false);
    }

    public onAwake(...args: any[]): void {
        this.CreateGlobalEventNPC();
    }

    onDestroy(): void {
        if (this.Npc_MODIFIER_EVENTS) {
            SafeDestroyUnit(this.Npc_MODIFIER_EVENTS);
            this.Npc_MODIFIER_EVENTS = null;
        }
        if (this.Npc_RECORD_SYSTEM) {
            SafeDestroyUnit(this.Npc_RECORD_SYSTEM);
            this.Npc_RECORD_SYSTEM = null;
        }
        (BattleSystemComponent.RECORD_SYSTEM_DUMMY as any) = {};
    }

    /**
     * 进行一次普通攻击
     * @param hCaster 攻击者
     * @param hTarget 收集者
     * @param iAttackState 攻击特效参数
      */
    public static Attack(hCaster: IBaseNpc_Plus, hTarget: IBaseNpc_Plus, iAttackState: EBATTLE_ATTACK_STATE = 0) {
        if (this.RECORD_SYSTEM_DUMMY.ATTACK_SYSTEM == null) {
            this.RECORD_SYSTEM_DUMMY.ATTACK_SYSTEM = {}
        }
        let iNextRecord = this.GetNextRecord()
        this.RECORD_SYSTEM_DUMMY.ATTACK_SYSTEM['' + iNextRecord] = {
            attack_flags: iAttackState
        };
        let [a, b, c, d, e, f, g] = GameFunc.IncludeArgs(iAttackState,
            EBATTLE_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB,
            EBATTLE_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS,
            EBATTLE_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN,
            EBATTLE_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS,
            EBATTLE_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE,
            EBATTLE_ATTACK_STATE.ATTACK_STATE_FAKEATTACK,
            EBATTLE_ATTACK_STATE.ATTACK_STATE_NEVERMISS,
        )
        hCaster.PerformAttack(hTarget, a, b, c, d, e, f, g)
        return iNextRecord;
    }

    public static AttackOnce(hCaster: IBaseNpc_Plus, hTarget: IBaseNpc_Plus,
        useCastAttackOrb: boolean,
        processProcs: boolean,
        skipCooldown: boolean,
        ignoreInvis: boolean,
        useProjectile: boolean,
        fakeAttack: boolean,
        neverMiss: boolean) {
        if (this.RECORD_SYSTEM_DUMMY.ATTACK_SYSTEM == null) {
            this.RECORD_SYSTEM_DUMMY.ATTACK_SYSTEM = {}
        }
        let iNextRecord = this.GetNextRecord();
        let iAttackState = 0;
        if (useCastAttackOrb) {
            iAttackState += EBATTLE_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB;
        }
        if (processProcs) {
            iAttackState += EBATTLE_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS;
        }
        if (skipCooldown) {
            iAttackState += EBATTLE_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN;
        }
        if (ignoreInvis) {
            iAttackState += EBATTLE_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS;
        }
        if (useProjectile) {
            iAttackState += EBATTLE_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE;
        }
        if (fakeAttack) {
            iAttackState += EBATTLE_ATTACK_STATE.ATTACK_STATE_FAKEATTACK;
        }
        if (neverMiss) {
            iAttackState += EBATTLE_ATTACK_STATE.ATTACK_STATE_NEVERMISS;
        }
        this.RECORD_SYSTEM_DUMMY.ATTACK_SYSTEM['' + iNextRecord] = {
            attack_flags: iAttackState
        };
        hCaster.PerformAttack(hTarget, useCastAttackOrb, processProcs, skipCooldown, ignoreInvis, useProjectile, fakeAttack, neverMiss)
        return iNextRecord;
    }

    /**
     * 只要有参数中的任何一个DAMAGE_FLAG就返回true
     * @param iRecord
     * @param args
     * @returns
     */
    public static DamageFilter(iRecord: string | number, ...args: EBATTLE_DAMAGE_FLAGS[]) {
        let iFlag = this.GetDamageFlag(iRecord);
        let r = GameFunc.IncludeArgs(iFlag, ...args);
        while (r.length > 0) {
            if (r.shift()) {
                return true
            }
        }
        return false
    }

    /**
     * 只要有参数中的任何一个EBATTLE_ATTACK_STATE就返回true
     * @param iRecord
     * @param args
     * @returns
     */
    public static AttackFilter(iRecord: string | number, ...args: EBATTLE_ATTACK_STATE[]) {
        let info = this.GetAttackFlag('' + iRecord);
        if (info && info.attack_flags) {
            let r = GameFunc.IncludeArgs(info.attack_flags, ...args);
            while (r.length > 0) {
                if (r.shift()) {
                    return true
                }
            }
        }
        return false
    }

    /**
     * 获取下次record
     * @returns
     */
    public static GetNextRecord() {
        if (this.RECORD_SYSTEM_DUMMY.iLastRecord == null) {
            this.RECORD_SYSTEM_DUMMY.iLastRecord = 0
        }
        if (this.RECORD_SYSTEM_DUMMY.iLastRecord && this.RECORD_SYSTEM_DUMMY.iLastRecord >= 255) {
            this.RECORD_SYSTEM_DUMMY.iLastRecord = this.RECORD_SYSTEM_DUMMY.iLastRecord - 256
        }
        return this.RECORD_SYSTEM_DUMMY.iLastRecord + 1;
    }
    public static RemoveRecord(iRecord: string | number) {
        if (this.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM != null) {
            delete this.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM['' + iRecord];
        }
    }
    public static AddDamageFlag(iState?: EBATTLE_DAMAGE_FLAGS) {
        iState = iState || EBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_NONE
        let iNextRecord = this.GetNextRecord();
        if (this.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM == undefined) this.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM = {};
        this.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM[iNextRecord] = iState;
    }

    public static GetDamageFlag(iRecord: string | number) {
        let iFlag = EBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_NONE
        if (this.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM != null) {
            return this.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM['' + iRecord] || iFlag
        }
        return iFlag
    }
    public static GetAttackFlag(iRecord: string | number) {
        if (this.RECORD_SYSTEM_DUMMY.ATTACK_SYSTEM != null) {
            return this.RECORD_SYSTEM_DUMMY.ATTACK_SYSTEM['' + iRecord]
        }
    }



    /**
     * 在普攻暴击效果里插入
     * @param iRecord
     */
    public static _DamageStateAttackCrit(iRecord: string | number) {
        iRecord = '' + iRecord;
        let attinfo = this.GetAttackFlag(iRecord);
        if (attinfo && !this.AttackFilter(iRecord, EBATTLE_ATTACK_STATE.ATTACK_STATE_NO_CRIT)) {
            attinfo.isCrit = true
        }
    }

    /**
     * 在技能暴击效果里插入
     * @param iRecord 
     */
    public static _DamageStateSpellCrit(iRecord: string | number) {
        iRecord = '' + iRecord;
        if (this.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM == undefined) this.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM = {};
        if (this.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM[iRecord] == undefined) this.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM[iRecord] = 0;

        if ((this.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM[iRecord] & EBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_SPELL_CRIT) != EBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_SPELL_CRIT) {
            this.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM[iRecord] = this.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM[iRecord] + EBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_SPELL_CRIT;
        }
    }


}

declare global {
    /**
     * @ServerOnly
     */
    var GBattleSystem: typeof BattleSystemComponent;
    type IGEBATTLE_DAMAGE_FLAGS = EBATTLE_DAMAGE_FLAGS;
    type IGEBATTLE_ATTACK_STATE = EBATTLE_ATTACK_STATE;
    var GEBATTLE_DAMAGE_FLAGS: typeof EBATTLE_DAMAGE_FLAGS;
    var GEBATTLE_ATTACK_STATE: typeof EBATTLE_ATTACK_STATE;
}
if (_G.GBattleSystem == undefined) {
    _G.GBattleSystem = BattleSystemComponent;
    _G.GEBATTLE_DAMAGE_FLAGS = EBATTLE_DAMAGE_FLAGS;
    _G.GEBATTLE_ATTACK_STATE = EBATTLE_ATTACK_STATE;
}