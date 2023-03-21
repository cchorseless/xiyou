
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerModifier()
export class modifier_generic_orb_effect extends BaseModifier_Plus {
    public ability: IBaseOrbAbility_Plus;
    public cast: boolean;
    public records: { [k: string]: boolean };
    public target: IBaseNpc_Plus;
    public bPrimed: boolean;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        this.ability = this.GetAbilityPlus();
        this.cast = false;
        this.records = {}
        this.target = undefined;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_RECORD,
            2: Enum_MODIFIER_EVENT.ON_ATTACK,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_FAIL,
            4: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_FEEDBACK,
            5: Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY,
            6: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            7: Enum_MODIFIER_EVENT.ON_ORDER,
            8: GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    CC_OnAttackRecord(params: ModifierAttackEvent): void {
        if (params.attacker != this.GetParentPlus()) {
            return;
        }
        if ((this.ability.GetAutoCastState() && this.ability.IsFullyCastable() && !this.GetParentPlus().IsSilenced()) || this.cast) {
            if (UnitFilter(params.target, this.ability.GetAbilityTargetTeam(), this.ability.GetAbilityTargetType(), this.ability.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                this.bPrimed = true;
                this.cast = true;
            } else {
                this.bPrimed = false;
                this.cast = false;
            }
        } else {
            this.bPrimed = false;
        }
        if (this.cast && this.ability.IsFullyCastable() && !this.GetParentPlus().IsSilenced()) {
            if (this.ability.OnOrbRecord) {
                this.ability.OnOrbRecord(params);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(params: ModifierAttackEvent): void {
        if (params.attacker != this.GetParentPlus()) {
            return;
        }
        if ((this.cast && this.ability.IsFullyCastable() && !this.GetParentPlus().IsSilenced() && UnitFilter(params.target, this.ability.GetAbilityTargetTeam(), this.ability.GetAbilityTargetType(), this.ability.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) || this.bPrimed) {
            this.ability.UseResources(true, false, true);
            this.records[params.record + ""] = true;
            if (this.ability.OnOrbFire) {
                this.ability.OnOrbFire(params);
            }
        }
        this.cast = false;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_FEEDBACK)
    CC_GetModifierProcAttack_Feedback(params: ModifierAttackEvent): number {
        if (this.records[params.record + ""]) {
            if (this.ability.OnOrbImpact) {
                return this.ability.OnOrbImpact(params);
            }
        }
        return 0;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FAIL)
    CC_OnAttackFail(params: ModifierAttackEvent): void {
        if (this.records[params.record + ""]) {
            if (this.ability.OnOrbFail) {
                this.ability.OnOrbFail(params);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    CC_OnAttackRecordDestroy(params: ModifierAttackEvent): void {
        delete this.records[params.record + ""];
        if (this.ability.OnOrbRecordDestroy) {
            this.ability.OnOrbRecordDestroy(params);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (!IsServer()) {
            return 0;
        }
        if (this.GetAbilityPlus().GetAutoCastState() && this.GetParentPlus().GetAggroTarget()
            && UnitFilter(this.GetParentPlus().GetAggroTarget(), this.ability.GetAbilityTargetTeam(), this.ability.GetAbilityTargetType(), this.ability.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            return this.GetSpecialValueFor("attack_range_bonus");
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(params: ModifierAbilityEvent): void {
        if (params.unit != this.GetParentPlus()) {
            return;
        }
        if (params.ability) {
            if (params.ability == this.GetAbilityPlus() && ((!this.FlagExist(params.order_type, dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO) && params.target && UnitFilter(params.target, this.ability.GetAbilityTargetTeam(), this.ability.GetAbilityTargetType(), this.ability.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) || (this.FlagExist(params.order_type, dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO) && !this.GetAbilityPlus().GetAutoCastState()))) {
                this.cast = true;
                return;
            }
            let pass = false;
            let behavior = params.ability.GetBehaviorInt();
            if (this.FlagExist(behavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_CANCEL_CHANNEL) || this.FlagExist(behavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_CANCEL_MOVEMENT) || this.FlagExist(behavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL)) {
                let pass = true;
            }
            if (this.cast && (!pass)) {
                this.cast = false;
            }
        } else {
            if (this.cast) {
                if (this.FlagExist(params.order_type, dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION) || this.FlagExist(params.order_type, dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET) || this.FlagExist(params.order_type, dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE) || this.FlagExist(params.order_type, dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET) || this.FlagExist(params.order_type, dotaunitorder_t.DOTA_UNIT_ORDER_STOP) || this.FlagExist(params.order_type, dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION)) {
                    this.cast = false;
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    CC_GetModifierProjectileName( /** params */): string {
        if (this.ability.GetProjectileName) {
            if (this.cast || (this.ability.GetAutoCastState() && this.ability.IsFullyCastable() && !this.GetParentPlus().IsSilenced())) {
                this.target = this.GetParentPlus().GetAttackTarget();
                if (this.target && UnitFilter(this.target, this.ability.GetAbilityTargetTeam(), this.ability.GetAbilityTargetType(), this.ability.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                    return this.ability.GetProjectileName();
                }
            }
        }
        return ""
    }
    FlagExist(a: number, b: number) {
        a = tonumber(tostring(a));
        b = tonumber(tostring(b));
        let [p, c, d] = [1, 0, b];
        while (a > 0 && b > 0) {
            let [ra, rb] = [a % 2, b % 2];
            if (ra + rb > 1) {
                c = c + p;
            }
            [a, b, p] = [(a - ra) / 2, (b - rb) / 2, p * 2];
        }
        return c == d;
    }
}
