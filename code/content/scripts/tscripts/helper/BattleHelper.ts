/*
 * @Author: Jaxh
 * @Date: 2021-05-19 19:19:55
 * @LastEditors: your name
 * @LastEditTime: 2021-05-19 19:49:08
 * @Description: file content
 */

import { GameFunc } from "../GameFunc";

export module BattleHelper {

    export interface DamageOptions extends ApplyDamageOptions {
        eom_flags?: enum_EOM_DAMAGE_FLAGS;
    }

    export interface AttackOptions {
        /**攻击标签 */
        attack_flags?: enum_ATTACK_STATE,
        /**是否暴击 */
        isCrit?: boolean;
    }

    /**
     *自定义伤害flag
     */
    export enum enum_EOM_DAMAGE_FLAGS {
        EOM_DAMAGE_FLAG_NONE = 0,
        /**无视大多数伤害加成效果(主要包含物理、魔法、纯粹、全伤害四种泛类型加成，ps=例如毒伤害拥有此flag，但是还是能收到毒伤害加成效果) */
        EOM_DAMAGE_FLAG_NO_DAMAGE_AMPLIFY = 1,
        /**技能暴击(√) */
        EOM_DAMAGE_FLAG_SPELL_CRIT = EOM_DAMAGE_FLAG_NO_DAMAGE_AMPLIFY * 2,
        /**毒伤害(√) */
        EOM_DAMAGE_FLAG_POISON = EOM_DAMAGE_FLAG_SPELL_CRIT * 2,
        /**持续伤害(√) */
        EOM_DAMAGE_FLAG_DOT = EOM_DAMAGE_FLAG_POISON * 2,
        /** 分裂伤害(√) */
        EOM_DAMAGE_FLAG_CLEAVE = EOM_DAMAGE_FLAG_DOT * 2,
        /**不会触发技能暴击(√) */
        EOM_DAMAGE_FLAG_NO_SPELL_CRIT = EOM_DAMAGE_FLAG_CLEAVE * 2,
        /**不能被两个链接棒子转换伤害类型（物理、魔法转换）(√) */
        EOM_DAMAGE_FLAG_NO_DAMAGE_TRANSFORM = EOM_DAMAGE_FLAG_NO_SPELL_CRIT * 2,
        /**标记被转化前的伤害(√) */
        EOM_DAMAGE_FLAG_BEFORE_TRANSFORMED_DAMAGE = EOM_DAMAGE_FLAG_NO_DAMAGE_TRANSFORM * 2,
        /**标记被转化后的伤害(√) */
        EOM_DAMAGE_FLAG_AFTER_TRANSFORMED_DAMAGE = EOM_DAMAGE_FLAG_BEFORE_TRANSFORMED_DAMAGE * 2,
        /** 流血伤害(√) */
        EOM_DAMAGE_FLAG_BLEEDING = EOM_DAMAGE_FLAG_AFTER_TRANSFORMED_DAMAGE * 2,
        /** 显示数字(√) */
        EOM_DAMAGE_FLAG_SHOW_DAMAGE_NUMBER = EOM_DAMAGE_FLAG_BLEEDING * 2,
        /**触电伤害 */
        EOM_DAMAGE_FLAG_SHOCK = EOM_DAMAGE_FLAG_SHOW_DAMAGE_NUMBER * 2

    }


    /**
     * 普通攻击状态枚举
     */
    export enum enum_ATTACK_STATE {
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
        ATTACK_STATE_CRIT = 2048, //
    }

    /**
     * 进行一次普通攻击
     * @param hCaster 攻击者
     * @param hTarget 收集者
     * @param iAttackState 攻击特效参数
      */
    export function Attack(hCaster: IBaseNpc_Plus, hTarget: IBaseNpc_Plus, iAttackState: enum_ATTACK_STATE = 0) {
        if (GGameCache.RECORD_SYSTEM_DUMMY.ATTACK_SYSTEM == null) {
            GGameCache.RECORD_SYSTEM_DUMMY.ATTACK_SYSTEM = {}
        }
        let iNextRecord = GetNextRecord()
        GGameCache.RECORD_SYSTEM_DUMMY.ATTACK_SYSTEM['' + iNextRecord] = {
            attack_flags: iAttackState
        };
        let [a, b, c, d, e, f, g] = GameFunc.IncludeArgs(iAttackState,
            enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB,
            enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS,
            enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN,
            enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS,
            enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE,
            enum_ATTACK_STATE.ATTACK_STATE_FAKEATTACK,
            enum_ATTACK_STATE.ATTACK_STATE_NEVERMISS,
        )
        hCaster.PerformAttack(hTarget, a, b, c, d, e, f, g)
    }




    /**
     * 造成伤害
     * @param tDamageTable
     */
    export function GoApplyDamage(tDamageTable: DamageOptions) {
        if (!tDamageTable) { return }
        let iEOMFlag = enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NONE
        if (tDamageTable.eom_flags == null) {
            tDamageTable.eom_flags = iEOMFlag
        }
        else {
            iEOMFlag = tDamageTable.eom_flags
        }
        if (GGameCache.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM == null) {
            GGameCache.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM = {}
        }
        let iNextRecord = GetNextRecord()
        GGameCache.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM['' + iNextRecord] = iEOMFlag
        ApplyDamage(tDamageTable)
    }
    /**
     * 只要有参数中的任何一个EOM_DAMAGE_FLAG就返回true
     * @param iRecord
     * @param args
     * @returns
     */
    export function DamageFilter(iRecord: string | number, ...args: enum_EOM_DAMAGE_FLAGS[]) {
        let bool = false
        if (GGameCache.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM) {
            let iEOMFlag = GetDamageFlag(iRecord);
            let r = GameFunc.IncludeArgs(iEOMFlag, ...args);
            while (r.length > 0) {
                if (r.shift()) {
                    bool = true
                    break
                }
            }
        }
        return bool
    }

    /**
     * 只要有参数中的任何一个enum_ATTACK_STATE就返回true
     * @param iRecord
     * @param args
     * @returns
     */
    export function AttackFilter(iRecord: string | number, ...args: enum_ATTACK_STATE[]) {
        let bool = false
        if (GGameCache.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM) {
            let info = GetAttackOption('' + iRecord);
            if (info && info.attack_flags) {
                let r = GameFunc.IncludeArgs(info.attack_flags, ...args);
                while (r.length > 0) {
                    if (r.shift()) {
                        bool = true
                        break
                    }
                }
            }
        }
        return bool
    }

    /**
     * 获取下次record
     * @returns
     */
    export function GetNextRecord() {
        if (GGameCache.RECORD_SYSTEM_DUMMY.iLastRecord == null) {
            GGameCache.RECORD_SYSTEM_DUMMY.iLastRecord = 0
        }
        if (GGameCache.RECORD_SYSTEM_DUMMY.iLastRecord && GGameCache.RECORD_SYSTEM_DUMMY.iLastRecord >= 255) {
            GGameCache.RECORD_SYSTEM_DUMMY.iLastRecord = GGameCache.RECORD_SYSTEM_DUMMY.iLastRecord - 256
        }
        return (GGameCache.RECORD_SYSTEM_DUMMY.iLastRecord + 1);
    }

    export function GetDamageFlag(iRecord: string | number) {
        let iEOMFlag = enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NONE
        if (GGameCache.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM != null) {
            return GGameCache.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM['' + iRecord] || iEOMFlag
        }
        return iEOMFlag
    }
    export function GetAttackOption(iRecord: string | number) {
        if (GGameCache.RECORD_SYSTEM_DUMMY.ATTACK_SYSTEM != null) {
            return GGameCache.RECORD_SYSTEM_DUMMY.ATTACK_SYSTEM['' + iRecord]
        }
    }



    /**
     * 设置攻击暴击
     * @param iRecord
     */
    export function SetAttackCrit(iRecord: string | number) {
        iRecord = '' + iRecord;
        let attinfo = GetAttackOption(iRecord);
        if (attinfo && !AttackFilter(iRecord, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CRIT)) {
            attinfo.isCrit = true
        }
    }
    //  在转换伤害效果里插入
    export function _BeforeTransformedDamage(iRecord: string | number) {
        iRecord = '' + iRecord;
        if (GGameCache.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM == null) { GGameCache.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM = {} }
        if (GGameCache.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM[iRecord] == null) { GGameCache.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM[iRecord] = enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NONE }
        let isIn = GameFunc.IncludeArgs(GGameCache.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM[iRecord], enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_BEFORE_TRANSFORMED_DAMAGE)[0]
        if (!isIn) {
            GGameCache.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM[iRecord] = GGameCache.RECORD_SYSTEM_DUMMY.DAMAGE_SYSTEM[iRecord] + enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_BEFORE_TRANSFORMED_DAMAGE
        }
    }

}