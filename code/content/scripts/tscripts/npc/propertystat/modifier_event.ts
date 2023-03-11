/*
 * @Author: Jaxh
 * @Date: 2021-05-11 14:49:01
 * @LastEditors: your name
 * @LastEditTime: 2021-05-19 14:36:43
 * @Description:统一事件监听
 */
import { GameFunc } from "../../GameFunc";
import { BattleHelper } from "../../helper/BattleHelper";
import { BaseModifier_Plus } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";

/**
 * 事件数据类型
 */
export enum EventDataType {
    /**攻击者是自己 */
    attackerIsSelf = 1,
    /**unit是自己 */
    unitIsSelf = 2,
    /**强制调用其他人监听的事件 */
    OtherCanBeAnyOne = 4,
}

export interface IBuffEventData {
    /**主动 */
    attacker?: IBaseNpc_Plus;
    unit?: IBaseNpc_Plus;
    /**目标对象 */
    target?: IBaseNpc_Plus;
    /**那种类型的事件 */
    eventType?: EventDataType;
    [k: string]: any;
}

@registerModifier()
export class modifier_event extends BaseModifier_Plus {
    /**
     * 触发所有事件
     * @Both
     * @param event
     * @param k
     * @returns
     */
    static FireEvent(event: IBuffEventData, ...k: Array<Enum_MODIFIER_EVENT>) {
        let a, b, c;
        if (event) {
            if (event.eventType == null) {
                event.eventType = EventDataType.attackerIsSelf;
            }
            [a, b, c] = GameFunc.IncludeArgs(event.eventType, EventDataType.attackerIsSelf, EventDataType.unitIsSelf, EventDataType.OtherCanBeAnyOne);
        }
        for (let p of k) {
            let _k = "" + p;
            let allM = GGameCache.allBuffRegisterEvent[_k];
            if (allM == null || allM.size == 0) return;
            for (let m of allM) {
                if (m == null || m.IsNull() || m.UUID == null) {
                    continue;
                }
                let parent = m.GetParent();
                if (parent == null) {
                    continue;
                }
                let _Event = m.__AllRegisterEvent;
                if (_Event && _Event[_k]) {
                    // 自己事件
                    if (event == null || (a && event.attacker == parent) || (b && event.unit == parent)) {
                        _Event[_k][0].forEach((func) => {
                            if ((m as any)[func] == null || type((m as any)[func]) != 'function') { return }
                            event == null ? (m as any)[func]() : (m as any)[func](event);
                        });
                    }
                    // 他人事件
                    if (event) {
                        if ((a && event.target == parent) || (a && event.unit == parent) || (b && event.attacker == parent) || c) {
                            _Event[_k][1].forEach((func) => {
                                if ((m as any)[func] == null || type((m as any)[func]) != 'function') { return }
                                event == null ? (m as any)[func]() : (m as any)[func](event);
                            });
                        }
                    }
                }
            }
        }
    }
    /**
     * 触发单位事件
     * @Both
     * @param unit 
     * @param k 
     */
    static FireUnitEvent(unit: IBaseNpc_Plus, ...k: Array<Enum_MODIFIER_EVENT>) {
        let event: IBuffEventData = {};
        event.unit = unit;
        event.eventType = EventDataType.unitIsSelf;
        this.FireEvent(event, ...k)
    }


    DeclareFunctions() {
        // LogHelper.print('DeclareFunctions', modifier_event.DeclareEvent.length);
        // return modifier_event.DeclareEvent;
        return [
            modifierfunction.MODIFIER_EVENT_ON_SPELL_TARGET_READY,
            /**
             * Method Name: `OnAttackRecord`
             */
            modifierfunction.MODIFIER_EVENT_ON_ATTACK_RECORD,
            /**
             * Method Name: `OnAttackStart`
             */
            modifierfunction.MODIFIER_EVENT_ON_ATTACK_START,
            /**
             * Method Name: `OnAttack`
             */
            modifierfunction.MODIFIER_EVENT_ON_ATTACK,
            /**
             * Method Name: `OnAttackLanded`
             */
            modifierfunction.MODIFIER_EVENT_ON_ATTACK_LANDED,
            /**
             * Method Name: `OnAttackFail`
             */
            modifierfunction.MODIFIER_EVENT_ON_ATTACK_FAIL,
            /**
             * Happens even if attack can't be issued.
             *
             *
             *
             * Method Name: `OnAttackAllied`.
             */
            modifierfunction.MODIFIER_EVENT_ON_ATTACK_ALLIED,
            /**
             * Method Name: `OnProjectileDodge`
             */
            modifierfunction.MODIFIER_EVENT_ON_PROJECTILE_DODGE,
            /**
             * Method Name: `OnOrder`
             */
            modifierfunction.MODIFIER_EVENT_ON_ORDER,
            /**
             * Method Name: `OnUnitMoved`
             */
            modifierfunction.MODIFIER_EVENT_ON_UNIT_MOVED,
            /**
             * Method Name: `OnAbilityStart`
             */
            modifierfunction.MODIFIER_EVENT_ON_ABILITY_START,
            /**
             * Method Name: `OnAbilityExecuted`
             */
            modifierfunction.MODIFIER_EVENT_ON_ABILITY_EXECUTED,
            /**
             * Method Name: `OnAbilityFullyCast`
             */
            modifierfunction.MODIFIER_EVENT_ON_ABILITY_FULLY_CAST,
            /**
             * Method Name: `OnBreakInvisibility`
             */
            modifierfunction.MODIFIER_EVENT_ON_BREAK_INVISIBILITY,
            /**
             * Method Name: `OnAbilityEndChannel`
             */
            modifierfunction.MODIFIER_EVENT_ON_ABILITY_END_CHANNEL,
            modifierfunction.MODIFIER_EVENT_ON_PROCESS_UPGRADE,
            modifierfunction.MODIFIER_EVENT_ON_REFRESH,
            /**
             * Method Name: `OnTakeDamage`
             */
            modifierfunction.MODIFIER_EVENT_ON_TAKEDAMAGE,
            /**
             * Method Name: `OnDamagePrevented`
             */
            modifierfunction.MODIFIER_EVENT_ON_DEATH_PREVENTED,
            /**
             * Method Name: `OnStateChanged`
             */
            modifierfunction.MODIFIER_EVENT_ON_STATE_CHANGED,
            modifierfunction.MODIFIER_EVENT_ON_ORB_EFFECT,
            /**
             * Method Name: `OnProcessCleave`
             */
            modifierfunction.MODIFIER_EVENT_ON_PROCESS_CLEAVE,
            /**
             * Method Name: `OnDamageCalculated`
             */
            modifierfunction.MODIFIER_EVENT_ON_DAMAGE_CALCULATED,
            /**
             * Method Name: `OnAttacked`
             */
            modifierfunction.MODIFIER_EVENT_ON_ATTACKED,
            /**
             * Method Name: `OnDeath`
             */
            modifierfunction.MODIFIER_EVENT_ON_DEATH,
            /**
             * Method Name: `OnRespawn`
             */
            modifierfunction.MODIFIER_EVENT_ON_RESPAWN,
            /**
             * Method Name: `OnSpentMana`
             */
            modifierfunction.MODIFIER_EVENT_ON_SPENT_MANA,
            /**
             * Method Name: `OnTeleporting`
             */
            modifierfunction.MODIFIER_EVENT_ON_TELEPORTING,
            /**
             * Method Name: `OnTeleported`
             */
            modifierfunction.MODIFIER_EVENT_ON_TELEPORTED,
            /**
             * Method Name: `OnSetLocation`
             */
            modifierfunction.MODIFIER_EVENT_ON_SET_LOCATION,
            /**
             * Method Name: `OnHealthGained`
             */
            modifierfunction.MODIFIER_EVENT_ON_HEALTH_GAINED,
            /**
             * Method Name: `OnManaGained`
             */
            modifierfunction.MODIFIER_EVENT_ON_MANA_GAINED,
            /**
             * Method Name: `OnTakeDamageKillCredit`
             */
            modifierfunction.MODIFIER_EVENT_ON_TAKEDAMAGE_KILLCREDIT,
            /**
             * Method Name: `OnHeroKilled`
             */
            modifierfunction.MODIFIER_EVENT_ON_HERO_KILLED,
            /**
             * Method Name: `OnHealReceived`
             */
            modifierfunction.MODIFIER_EVENT_ON_HEAL_RECEIVED,
            /**
             * Method Name: `OnBuildingKilled`
             */
            modifierfunction.MODIFIER_EVENT_ON_BUILDING_KILLED,
            /**
             * Method Name: `OnModelChanged`
             */
            modifierfunction.MODIFIER_EVENT_ON_MODEL_CHANGED,
            /**
             * Method Name: `OnModifierAdded`
             */
            modifierfunction.MODIFIER_EVENT_ON_MODIFIER_ADDED,
            modifierfunction.MODIFIER_EVENT_ON_DOMINATED,
            modifierfunction.MODIFIER_EVENT_ON_ATTACK_FINISHED,
            modifierfunction.MODIFIER_EVENT_ON_ATTACK_RECORD_DESTROY,
            modifierfunction.MODIFIER_EVENT_ON_PROJECTILE_OBSTRUCTION_HIT,
            modifierfunction.MODIFIER_EVENT_ON_ATTACK_CANCELLED,
        ];
    }

    /**
     *
     *
     */
    OnAbilityEndChannel(event: ModifierAbilityEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ABILITY_END_CHANNEL);
    }
    /**
     *
     *
     */
    OnAbilityExecuted(event: ModifierAbilityEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED);
    }
    /**
     * 技能|道具使用完成
     * start=>Executed=>FullyCas
     */
    OnAbilityFullyCast(event: ModifierAbilityEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST);
        if (event.ability.IsItem()) {
            modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ITEM_USE_FINISH);
        }
    }
    /**
     *
     *
     */
    OnAbilityStart(event: ModifierAbilityEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ABILITY_START);
    }
    /**
     *
     *
     */
    OnAttack(event: ModifierAttackEvent): void {
        (event as IBuffEventData).eventType = EventDataType.attackerIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ATTACK);
    }
    /**
     * Happens even if attack can't be issued.
     *
     *
     *
     */
    OnAttackAllied(event: ModifierAttackEvent): void {
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ATTACK_ALLIED);
    }
    /**
     *
     *
     */
    OnAttackCancelled(event: ModifierAttackEvent): void {
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ATTACK_CANCELLED);
    }
    /**
     *
     *
     */
    OnAttacked(event: ModifierAttackEvent): void {
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ATTACKED);
    }
    /**
     *
     *
     */
    OnAttackFail(event: ModifierAttackEvent): void {
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ATTACK_FAIL);
    }
    /**
     *
     *
     */
    OnAttackFinished(event: ModifierAttackEvent): void {
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ATTACK_FINISHED);
    }
    /**
     *
     *
     */
    OnAttackLanded(event: ModifierAttackEvent): void {
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ATTACK_LANDED);
    }
    /**
     *
     *
     */
    OnAttackRecord(event: ModifierAttackEvent): void {
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ATTACK_RECORD);
    }
    /**
     *
     *
     */
    OnAttackRecordDestroy(event: ModifierAttackEvent): void {
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY);
    }
    /**
     *
     *攻击开始
     */
    OnAttackStart(event: ModifierAttackEvent): void {
        event.record = BattleHelper.GetNextRecord();
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ATTACK_START);
    }
    /**
     *
     *
     */
    OnBreakInvisibility(): void {
        modifier_event.FireEvent(null, Enum_MODIFIER_EVENT.ON_BREAK_INVISIBILITY);
    }
    /**
     *
     *
     */
    OnBuildingKilled(event: ModifierInstanceEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_BUILDING_KILLED);
    }
    /**
     *
     *
     */
    OnDamageCalculated(event: ModifierAttackEvent): void {
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_DAMAGE_CALCULATED);
    }
    /**
     *
     *
     */
    OnDamagePrevented(): void {
        modifier_event.FireEvent(null, Enum_MODIFIER_EVENT.ON_DEATH_PREVENTED);
    }
    /**
     * 怪物死亡
     */
    OnDeath(event: ModifierInstanceEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_DEATH);
    }
    /**
     *
     *
     */
    OnDominated(event: ModifierUnitEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_DOMINATED);
    }
    /**
     *
     *
     */
    OnHealReceived(event: ModifierUnitEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_HEAL_RECEIVED)
    }
    /**
     *
     *
     */
    OnHealthGained(event: ModifierUnitEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_HEALTH_GAINED);
    }
    /**
     *
     *
     */
    OnHeroKilled(event: ModifierAttackEvent): void {
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_HERO_KILLED);
    }
    /**
     *
     *
     */
    OnManaGained(event: ModifierUnitEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_MANA_GAINED);
    }
    /**
     *
     *
     */
    OnModelChanged(event: ModifierUnitEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_MODEL_CHANGED);
    }
    /**
     *
     *
     */
    OnModifierAdded(event: ModifierAddedEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_MODIFIER_ADDED);
    }
    /**
     *
     *
     */
    OnOrder(event: ModifierUnitEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_ORDER);
    }
    /**
     *
     *
     */
    OnProcessCleave(): void {
        modifier_event.FireEvent(null, Enum_MODIFIER_EVENT.ON_PROCESS_CLEAVE);
    }
    /**
     *
     *
     */
    OnProjectileDodge(event: ModifierAttackEvent): void {
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_PROJECTILE_DODGE);
    }
    /**
     *
     *
     */
    OnProjectileObstructionHit(): void {
        modifier_event.FireEvent(null, Enum_MODIFIER_EVENT.ON_PROJECTILE_OBSTRUCTION_HIT);
    }
    /**
     *
     *
     */
    OnRespawn(event: ModifierUnitEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_RESPAWN);
    }
    /**
     *
     *
     */
    OnSetLocation(event: ModifierUnitEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_SET_LOCATION);
    }
    /**
     *
     *
     */
    OnSpellTargetReady(): void {
        modifier_event.FireEvent(null, Enum_MODIFIER_EVENT.ON_SPELL_TARGET_READY);
    }
    /**
     *
     *
     */
    OnSpentMana(event: ModifierAbilityEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;

        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_SPENT_MANA);
    }
    /**
     *
     *
     */
    OnStateChanged(event: ModifierUnitEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_STATE_CHANGED);
    }
    /**
     *造成伤害
     *
     */
    OnTakeDamage(event: ModifierInstanceEvent): void {
        (event as IBuffEventData).eventType = EventDataType.attackerIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_TAKEDAMAGE);
    }
    /**
     *
     *
     */
    OnTakeDamageKillCredit(event: ModifierAttackEvent): void {
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_TAKEDAMAGE_KILLCREDIT);
    }
    /**
     *
     *
     */
    OnTeleported(event: ModifierUnitEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;

        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_TELEPORTED);
    }
    /**
     *
     *
     */
    OnTeleporting(event: ModifierUnitEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_TELEPORTING);
    }

    /**
     * 单位移动
     */
    OnUnitMoved(event: ModifierUnitEvent): void {
        (event as IBuffEventData).eventType = EventDataType.unitIsSelf;
        modifier_event.FireEvent(event, Enum_MODIFIER_EVENT.ON_UNIT_MOVED);
    }
}
/**
 * 装饰器 注册事件统计标签 todo
 * @param params
 * @param onSelf 是否监听自己,自己主动
 * @param onOther 是否监听别人，自己被动
 * @returns
 */
export function registerEvent(params: Enum_MODIFIER_EVENT, onSelf = true, onOther = false) {
    // 动态添加监听事件
    // if (Modifier_Event.DeclareEvent.indexOf(params as any) == -1) {
    //     LogHelper.print('DeclareEventChange', params);
    //     modifier_event.DeclareEvent.push(params as any)
    // }
    // 首次加载时不需要
    // if (GameRules.State_Get() < DOTA_GameState.DOTA_GAMERULES_STATE_TEAM_SHOWCASE) { return }
    return (target: BaseModifier_Plus, methodName: string, desc: any) => {
        const params_key = params + "";
        if (target.__AllRegisterEvent == null) {
            target.__AllRegisterEvent = {};
        }
        if (target.__AllRegisterEvent[params_key] == null) {
            target.__AllRegisterEvent[params_key] = [new Set(), new Set()];
        }
        if (onSelf) {
            // 针对自己的监听，自己是施法者
            target.__AllRegisterEvent[params_key][0].add(methodName);
        }
        if (onOther) {
            // 针对其他人的监听，其他人是施法者
            target.__AllRegisterEvent[params_key][1].add(methodName);
        }
        // LogHelper.print(target.constructor.name, methodName);
    };
}

/**BUFF事件枚举 */
export enum Enum_MODIFIER_EVENT {
    /**
     * Method Name: `OnSpellTargetReady`
     */
    ON_SPELL_TARGET_READY = modifierfunction.MODIFIER_EVENT_ON_SPELL_TARGET_READY,
    /**
     * Method Name: `OnAttackRecord`
     */
    ON_ATTACK_RECORD = modifierfunction.MODIFIER_EVENT_ON_ATTACK_RECORD,
    /**
     * Method Name: `OnAttackStart`
     */
    ON_ATTACK_START = modifierfunction.MODIFIER_EVENT_ON_ATTACK_START,
    /**
     * Method Name: `OnAttack`
     */
    ON_ATTACK = modifierfunction.MODIFIER_EVENT_ON_ATTACK,
    /**
     * Method Name: `OnAttackLanded`
     */
    ON_ATTACK_LANDED = modifierfunction.MODIFIER_EVENT_ON_ATTACK_LANDED,
    /**
     * Method Name: `OnAttackFail`
     */
    ON_ATTACK_FAIL = modifierfunction.MODIFIER_EVENT_ON_ATTACK_FAIL,
    /**
     * Happens even if attack can't be issued.
     *
     *
     *
     * Method Name: `OnAttackAllied`.
     */
    ON_ATTACK_ALLIED = modifierfunction.MODIFIER_EVENT_ON_ATTACK_ALLIED,
    /**
     * Method Name: `OnProjectileDodge`
     */
    ON_PROJECTILE_DODGE = modifierfunction.MODIFIER_EVENT_ON_PROJECTILE_DODGE,
    /**
     * Method Name: `OnOrder`
     */
    ON_ORDER = modifierfunction.MODIFIER_EVENT_ON_ORDER,
    /**
     * Method Name: `OnUnitMoved`
     */
    ON_UNIT_MOVED = modifierfunction.MODIFIER_EVENT_ON_UNIT_MOVED,
    /**
     * Method Name: `OnAbilityStart` 指向技能开始施法
     * ModifierAbilityEvent
     */
    ON_ABILITY_START = modifierfunction.MODIFIER_EVENT_ON_ABILITY_START,
    /**
     * Method Name: `OnAbilityExecuted` 施法进行，非指向技能的开始施法
     * ModifierAbilityEvent
     */
    ON_ABILITY_EXECUTED = modifierfunction.MODIFIER_EVENT_ON_ABILITY_EXECUTED,
    /**
     * Method Name: `OnAbilityFullyCast` 技能施法完成
     * ModifierAbilityEvent
     */
    ON_ABILITY_FULLY_CAST = modifierfunction.MODIFIER_EVENT_ON_ABILITY_FULLY_CAST,
    /**
     * Method Name: `OnBreakInvisibility`
     */
    ON_BREAK_INVISIBILITY = modifierfunction.MODIFIER_EVENT_ON_BREAK_INVISIBILITY,
    /**
     * Method Name: `OnAbilityEndChannel` 技能结束持续施法
     * ModifierAbilityEvent
     */
    ON_ABILITY_END_CHANNEL = modifierfunction.MODIFIER_EVENT_ON_ABILITY_END_CHANNEL,
    ON_PROCESS_UPGRADE = modifierfunction.MODIFIER_EVENT_ON_PROCESS_UPGRADE,
    ON_REFRESH = modifierfunction.MODIFIER_EVENT_ON_REFRESH,
    /**
     * Method Name: `OnTakeDamage` 造成伤害|受到伤害
     * ModifierInstanceEvent
     */
    ON_TAKEDAMAGE = modifierfunction.MODIFIER_EVENT_ON_TAKEDAMAGE,
    /**
     * Method Name: `OnDamagePrevented`
     */
    ON_DEATH_PREVENTED = modifierfunction.MODIFIER_EVENT_ON_DEATH_PREVENTED,
    /**
     * Method Name: `OnStateChanged`
     */
    ON_STATE_CHANGED = modifierfunction.MODIFIER_EVENT_ON_STATE_CHANGED,
    ON_ORB_EFFECT = modifierfunction.MODIFIER_EVENT_ON_ORB_EFFECT,
    /**
     * Method Name: `OnProcessCleave`
     */
    ON_PROCESS_CLEAVE = modifierfunction.MODIFIER_EVENT_ON_PROCESS_CLEAVE,
    /**
     * Method Name: `OnDamageCalculated`
     */
    ON_DAMAGE_CALCULATED = modifierfunction.MODIFIER_EVENT_ON_DAMAGE_CALCULATED,
    /**
     * Method Name: `OnAttacked`
     */
    ON_ATTACKED = modifierfunction.MODIFIER_EVENT_ON_ATTACKED,
    /**
     * Method Name: `OnDeath` ModifierInstanceEvent
     */
    ON_DEATH = modifierfunction.MODIFIER_EVENT_ON_DEATH,
    /**
     * Method Name: `OnRespawn`
     */
    ON_RESPAWN = modifierfunction.MODIFIER_EVENT_ON_RESPAWN,
    /**
     * Method Name: `OnSpentMana`
     */
    ON_SPENT_MANA = modifierfunction.MODIFIER_EVENT_ON_SPENT_MANA,
    /**
     * Method Name: `OnTeleporting`
     */
    ON_TELEPORTING = modifierfunction.MODIFIER_EVENT_ON_TELEPORTING,
    /**
     * Method Name: `OnTeleported`
     */
    ON_TELEPORTED = modifierfunction.MODIFIER_EVENT_ON_TELEPORTED,
    /**
     * Method Name: `OnSetLocation`
     */
    ON_SET_LOCATION = modifierfunction.MODIFIER_EVENT_ON_SET_LOCATION,
    /**
     * Method Name: `OnHealthGained`
     */
    ON_HEALTH_GAINED = modifierfunction.MODIFIER_EVENT_ON_HEALTH_GAINED,
    /**
     * Method Name: `OnManaGained`
     */
    ON_MANA_GAINED = modifierfunction.MODIFIER_EVENT_ON_MANA_GAINED,
    /**
     * Method Name: `OnTakeDamageKillCredit`
     */
    ON_TAKEDAMAGE_KILLCREDIT = modifierfunction.MODIFIER_EVENT_ON_TAKEDAMAGE_KILLCREDIT,
    /**
     * Method Name: `OnHeroKilled`
     */
    ON_HERO_KILLED = modifierfunction.MODIFIER_EVENT_ON_HERO_KILLED,
    /**
     * Method Name: `OnHealReceived`
     */
    ON_HEAL_RECEIVED = modifierfunction.MODIFIER_EVENT_ON_HEAL_RECEIVED,
    /**
     * Method Name: `OnBuildingKilled`
     */
    ON_BUILDING_KILLED = modifierfunction.MODIFIER_EVENT_ON_BUILDING_KILLED,
    /**
     * Method Name: `OnModelChanged`
     */
    ON_MODEL_CHANGED = modifierfunction.MODIFIER_EVENT_ON_MODEL_CHANGED,
    /**
     * Method Name: `OnModifierAdded`
     */
    ON_MODIFIER_ADDED = modifierfunction.MODIFIER_EVENT_ON_MODIFIER_ADDED,
    /**
     * Method Name: `OnDominated`
     */
    ON_DOMINATED = modifierfunction.MODIFIER_EVENT_ON_DOMINATED,
    /**
     * Method Name: `OnAttackFinished`
     */
    ON_ATTACK_FINISHED = modifierfunction.MODIFIER_EVENT_ON_ATTACK_FINISHED,
    /**
     * Method Name: `OnAttackRecordDestroy`
     */
    ON_ATTACK_RECORD_DESTROY = modifierfunction.MODIFIER_EVENT_ON_ATTACK_RECORD_DESTROY,
    /**
     * Method Name: `OnProjectileObstructionHit`
     */
    ON_PROJECTILE_OBSTRUCTION_HIT = modifierfunction.MODIFIER_EVENT_ON_PROJECTILE_OBSTRUCTION_HIT,
    /**
     * Method Name: `OnAttackCancelled`
     */
    ON_ATTACK_CANCELLED = modifierfunction.MODIFIER_EVENT_ON_ATTACK_CANCELLED,

    //#region 自定义事件
    /**攻击暴击事件 ModifierAttackEvent */
    ON_ATTACK_CRIT = modifierfunction.MODIFIER_FUNCTION_INVALID + 2000,
    /**技能暴击 ModifierAttackEvent */
    ON_SPELL_CRIT,
    /**攻击或者技能暴击事件 ModifierAttackEvent */
    ON_ANY_CRIT,
    /**召唤物出生 {summon:IBaseNpc_Plus} */
    ON_SPAWN_SUMMONNED,
    /**幻象出生 */
    ON_SPAWN_ILLUSION,
    /**TODO */
    ON_QUALIFICATION_CHANGED,
    /**TODO */
    ON_SHOCK_APPLIED,
    /**todo */
    ON_SHOCK_ACTIVATED,
    /**道具获取  DotaInventoryItemAddedEvent*/
    ON_ITEM_GET,
    /**道具丢失,不在身上 DotaHeroInventoryItemChangeEvent */
    ON_ITEM_LOSE,
    /**道具出售或者销毁 DotaHeroInventoryItemChangeEvent*/
    ON_ITEM_DESTROY,
    /**道具位置改变,包含 获取|丢失|位置更换   {changeSlot:EntityIndex[],state:0|1|2}   */
    ON_ITEM_SLOT_CHANGE,
    /**道具使用完成 ModifierAbilityEvent */
    ON_ITEM_USE_FINISH,

    //#endregion
}
