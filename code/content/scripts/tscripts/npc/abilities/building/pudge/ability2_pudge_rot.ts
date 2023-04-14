
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_pudge_6_buff } from "./ability6_pudge_dismember";

/** dota原技能数据 */
export const Data_pudge_rot = { "ID": "5076", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_TOGGLE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "HasScepterUpgrade": "1", "AbilityCastPoint": "0 0 0 0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "rot_radius": "250" }, "02": { "var_type": "FIELD_FLOAT", "rot_tick": "0.2" }, "03": { "var_type": "FIELD_INTEGER", "rot_slow": "-14 -20 -26 -32", "LinkedSpecialBonus": "special_bonus_unique_pudge_4" }, "04": { "var_type": "FIELD_INTEGER", "rot_damage": "30 60 90 120", "LinkedSpecialBonus": "special_bonus_unique_pudge_2" }, "05": { "var_type": "FIELD_INTEGER", "scepter_rot_damage_bonus": "100" }, "06": { "var_type": "FIELD_INTEGER", "scepter_rot_radius_bonus": "225" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_pudge_rot extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "pudge_rot";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_pudge_rot = Data_pudge_rot;
    Init() {
        this.SetDefaultSpecialValue("radius", [500, 600, 700, 800, 900, 1000]);
        this.SetDefaultSpecialValue("per_damage", [100, 200, 400, 700, 1100, 1600]);
        this.SetDefaultSpecialValue("per_damage_health_factor", 0.3);
        this.SetDefaultSpecialValue("per_damage_self_pct", 4);
        this.SetDefaultSpecialValue("reduce_move_speed_pct", [10, 15, 20, 25, 30, 35]);
        this.SetDefaultSpecialValue("health_limit_pct", 10);
        this.SetDefaultSpecialValue("rot_tick", 0.2);

    }


    OnToggle() {
        let hCaster = this.GetCasterPlus()
        if (this.GetToggleState()) {
            modifier_pudge_2_buff.apply(hCaster, hCaster, this, null)
            if (!hCaster.IsChanneling()) {
                hCaster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_ROT)
            }
        } else {
            let hRotBuff = modifier_pudge_2_buff.findIn(hCaster)
            if (hRotBuff != null) {
                hRotBuff.Destroy()
            }
        }
    }
    ProcsMagicStick() {
        return false
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_pudge_2_buff extends BaseModifier_Plus {
    radius: number;
    per_damage_health_factor: number;
    per_damage_self_pct: number;
    reduce_move_speed_pct: number;
    health_limit_pct: number;
    rot_tick: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
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
    IsAura() {
        if (this.GetCasterPlus() == this.GetParentPlus()) {
            return true
        }
        return false
    }
    GetAura() {
        return "modifier_pudge_2_buff"
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraRadius() {
        return this.GetSpecialValueFor("radius")
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        this.rot_tick = this.GetSpecialValueFor("rot_tick")
        this.radius = this.GetSpecialValueFor("radius")
        this.per_damage_health_factor = this.GetSpecialValueFor("per_damage_health_factor") + hCaster.GetTalentValue("special_bonus_unique_pudge_custom_1")
        this.per_damage_self_pct = this.GetSpecialValueFor("per_damage_self_pct")
        this.reduce_move_speed_pct = this.GetSpecialValueFor("reduce_move_speed_pct")
        this.health_limit_pct = this.GetSpecialValueFor("health_limit_pct")
        if (IsServer()) {
            this.StartIntervalThink(this.rot_tick)
            if (hParent == hCaster) {
                // 音效
                hCaster.EmitSound("Hero_Pudge.Rot")
            }
        } else {
            if (hParent == hCaster) {
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_pudge/pudge_rot.vpcf",
                    resNpc: null,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: hParent
                });

                ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.radius, 1, this.radius))
                this.AddParticle(iParticleID, false, false, -1, false, false)
            } else {
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_pudge/pudge_rot_recipient.vpcf",
                    resNpc: null,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: hParent
                });

                this.AddParticle(iParticleID, false, false, -1, false, false)
            }
        }
    }

    BeDestroy() {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (hParent == hCaster) {
                hCaster.StopSound("Hero_Pudge.Rot")
            }
        }
    }
    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            if (!IsValid(hAbility) || !IsValid(hCaster)) {
                this.Destroy()
                return
            }
            if (hCaster.IsAlive() && modifier_pudge_2_buff.exist(hCaster)) {
                let per_damage = this.GetSpecialValueFor("per_damage")
                if (hParent != hCaster) {
                    per_damage = per_damage + hCaster.GetHealth() * this.per_damage_health_factor
                    if (modifier_pudge_6_buff.exist(hParent)) {
                        per_damage = per_damage * (1 + hCaster.GetTalentValue("special_bonus_unique_pudge_custom_5") * 0.01)
                    }
                    let damage_table = {
                        ability: hAbility,
                        victim: hParent,
                        attacker: hCaster,
                        damage: per_damage * this.rot_tick,
                        damage_type: hAbility.GetAbilityDamageType(),
                        damage_flags: hParent == hCaster && DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL || 0,
                    }
                    BattleHelper.GoApplyDamage(damage_table)
                }
                else {
                    per_damage = hCaster.GetMaxHealth() * this.per_damage_self_pct * 0.01
                    hCaster.ModifyHealth(hParent.GetHealth() - per_damage * this.rot_tick, hAbility, false, 0)
                }
                if (hCaster.GetHealthPercent() <= this.health_limit_pct) {
                    hAbility.ToggleAbility()
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        if (this.GetParentPlus() == this.GetCasterPlus()) {
            return 0
        }
        return -this.reduce_move_speed_pct
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_PERCENTAGE)
    CC_GetModifierMagicalArmorPercentage() {
        if (IsValid(this.GetCasterPlus())) {
            return -this.GetCasterPlus().GetTalentValue("special_bonus_unique_pudge_custom_7")
        }
    }
}
