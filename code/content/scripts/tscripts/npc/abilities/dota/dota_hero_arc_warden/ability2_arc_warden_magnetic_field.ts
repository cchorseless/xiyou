import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_arc_warden_magnetic_field = { "ID": "5678", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_ArcWarden.MagneticField.Cast", "HasShardUpgrade": "1", "AbilityCastAnimation": "ACT_DOTA_AW_MAGNETIC_FIELD", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastPoint": "0.3", "AbilityCooldown": "20", "AbilityManaCost": "50 70 90 110", "AbilityCastRange": "900", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "300" }, "02": { "var_type": "FIELD_FLOAT", "duration": "3.5 4.5 5.5 6.5" }, "03": { "var_type": "FIELD_INTEGER", "attack_speed_bonus": "50 60 70 80" }, "04": { "var_type": "FIELD_INTEGER", "evasion_chance": "100" } } };

@registerAbility()
export class ability2_arc_warden_magnetic_field extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "arc_warden_magnetic_field";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_arc_warden_magnetic_field = Data_arc_warden_magnetic_field;
    Init() {
        this.SetDefaultSpecialValue("attack_speed_bonus", [40, 45, 50, 55, 60, 65]);
        this.SetDefaultSpecialValue("shock_bonus_all", [1.0, 1.2, 1.4, 1.6, 1.8, 2.0]);
        this.SetDefaultSpecialValue("radius", 300);
        this.SetDefaultSpecialValue("duration", 4);
        this.SetDefaultSpecialValue("scepter_damage_bonus", 30);

    }


    GetAOERadius() {
        return this.GetSpecialValueFor("radius") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_arc_warden_custom_2")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPos = this.GetCursorPosition()
        let iRadius = this.GetSpecialValueFor("radius") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_arc_warden_custom_2")
        modifier_arc_warden_2_aura.applyThinker(vPos, hCaster, this, {
            iRadius: iRadius,
            duration: 5
        }, hCaster.GetTeam(), false)
    }

    GetIntrinsicModifierName() {
        return "modifier_arc_warden_2"
    }
}
//  Modifiers
@registerModifier()
export class modifier_arc_warden_2 extends BaseModifier_Plus {
    private _vLastPosition: any;
    IsHidden() {
        return true
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    On_Order(params: IModifierTable) {
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus()
            if (params.issuer_player_index != -1 && params.ability == hAbility) {
                if (params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION) {
                    this._vLastPosition = params.new_pos
                } else if (params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO) {
                    let bState = hAbility.GetAutoCastState()
                    if (bState) { //  此函数在切换前被调用的
                        this._vLastPosition = null
                    }
                }
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GameFunc.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let hCaster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }
            if (this._vLastPosition) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: this._vLastPosition
                })
                return
            }
            let range = ability.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()
            let vPos = AoiHelper.GetAOEMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeam(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0)
            if (vPos && vPos != vec3_invalid) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: vPos
                })
            }
        }
    }
}
//  Modifiers
// // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_arc_warden_2_buff extends BaseModifier_Plus {
    IsHidden() {
        if (!this.GetCasterPlus()) {
            return true
        }
        if (this.GetCasterPlus().HasScepter() || this.GetCasterPlus().GetTalentValue("special_bonus_unique_arc_warden_custom_5") > 0) {
            return false
        }
        return true
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_SHOCK_COUNT_PERCENTAGE)
    G_OUTGOING_SHOCK_COUNT_PERCENTAGE() {
        return this.GetCasterPlus().GetTalentValue("special_bonus_unique_arc_warden_custom_5")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    EOM_GetModifierOutgoingDamagePercentage() {
        if (string.find(this.GetParentPlus().GetUnitName(), "npc_dota_hero_arc_warden") && this.GetParentPlus().HasScepter()) {
            return this.GetSpecialValueFor("scepter_damage_bonus")
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.GetCasterPlus().GetTalentValue("special_bonus_unique_arc_warden_custom_5")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    On_Tooltip2() {
        return this.EOM_GetModifierOutgoingDamagePercentage()
    }
}
//  Modifiers
// // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_arc_warden_2_buff_extra extends BaseModifier_Plus {
    tAuraInfo: any;
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            if (!this.tAuraInfo) {
                this.tAuraInfo = []
            }
            let iSourceIndex = params.iSourceIndex
            let iRadius = params.iRadius
            table.insert(this.tAuraInfo, {
                iSourceIndex: iSourceIndex,
                iRadius: iRadius
            })
            this.IncrementStackCount()
            this.StartIntervalThink(0.1)
        }
    }
    OnRefresh(params: IModifierTable) {
        super.OnRefresh(params);
        if (IsServer()) {
            let iSourceIndex = params.iSourceIndex
            let iRadius = params.iRadius
            for (let i = 1; i <= this.tAuraInfo.length; i++) {
                if (this.tAuraInfo[i].iSourceIndex == iSourceIndex) {
                    return
                }
            }
            table.insert(this.tAuraInfo, {
                iSourceIndex: iSourceIndex,
                iRadius: iRadius
            })
            this.IncrementStackCount()
        }
    }
    OnIntervalThink() {
        if (!IsServer()) { return }
        for (let i = this.tAuraInfo.length - 1; i >= 0; i--) {
            let hOwner = EntIndexToHScript(this.tAuraInfo[i].iSourceIndex)
            let fDistance = CalcDistanceBetweenEntityOBB(hOwner, this.GetParentPlus())
            if (!GameFunc.IsValid(hOwner) || fDistance > this.tAuraInfo[i].iRadius) {
                table.remove(this.tAuraInfo, i)
                this.DecrementStackCount()
            }
        }
        if (this.GetStackCount() <= 0) {
            this.Destroy()
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant() {
        return this.GetSpecialValueFor("attack_speed_bonus") * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.GetAttackSpeedBonus_Constant()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    On_Tooltip2() {
        return this.GetAttackSpeedBonus_Constant()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    G_MAX_ATTACKSPEED_BONUS() {
        return this.GetAttackSpeedBonus_Constant()
    }
}
//  Modifiers
// // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_arc_warden_2_aura extends BaseModifier_Plus {
    iRadius: any;
    fTickTime: number;
    IsAura() {
        return true
    }
    GetAura() {
        return "modifier_arc_warden_2_buff"
    }
    GetAuraRadius() {
        return this.iRadius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraDuration() {
        return 0.5
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.iRadius = params.iRadius || 300
            this.fTickTime = 0
            this.StartIntervalThink(0)
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_arc_warden/arc_warden_magnetic.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.iRadius, 0, 0))
            this.AddParticle(iParticleID, false, false, 0, false, false)
            EmitSoundOn("Hero_ArcWarden.MagneticField", this.GetParentPlus())
        }
    }
    OnIntervalThink() {
        if (!IsServer()) { return }
        let fGameTime = GameRules.GetGameTime()
        if (fGameTime - this.fTickTime >= 1) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            if (!GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }
            let tUnits = AoiHelper.FindEntityInRadius(hCaster.GetTeam(), hParent.GetOrigin(), this.iRadius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC)
            let iShockCount = this.GetSpecialValueFor("shock_bonus_all") * hCaster.GetAllStats()
            for (let hUnit of (tUnits)) {
                if (hUnit.GetTeam() != hCaster.GetTeam()) {
                    modifier_shock.Shock(hUnit, hCaster, this.GetAbilityPlus(), iShockCount)
                } else {
                    modifier_arc_warden_2_buff_extra.apply(hUnit, hCaster, this.GetAbilityPlus(), {
                        iRadius: this.iRadius,
                        iSourceIndex: hParent.entindex()
                    })
                }
            }
            this.fTickTime = fGameTime
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.StartIntervalThink(-1)
            UTIL_Remove(this.GetParentPlus())
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_FLYING]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
        }
    }
}
