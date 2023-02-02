import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_sniper_shrapnel = { "ID": "5154", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Sniper.ShrapnelShatter", "AbilityCastRange": "1800", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "0", "AbilityCharges": "3", "AbilityChargeRestoreTime": "35", "AbilityManaCost": "50", "AbilityModifierSupportValue": "0.25", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "slow_movement_speed": "-12 -18 -24 -30", "LinkedSpecialBonus": "special_bonus_unique_sniper_5" }, "02": { "var_type": "FIELD_INTEGER", "radius": "450" }, "03": { "var_type": "FIELD_INTEGER", "shrapnel_damage": "20 35 50 65", "LinkedSpecialBonus": "special_bonus_unique_sniper_1" }, "04": { "var_type": "FIELD_FLOAT", "duration": "10.0" }, "05": { "var_type": "FIELD_FLOAT", "damage_delay": "1.2" }, "06": { "var_type": "FIELD_FLOAT", "slow_duration": "2.0 2.0 2.0 2.0" }, "07": { "var_type": "FIELD_INTEGER", "AbilityCharges": "", "LinkedSpecialBonus": "special_bonus_unique_sniper_2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_sniper_shrapnel extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "sniper_shrapnel";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_sniper_shrapnel = Data_sniper_shrapnel;
    Init() {
        this.SetDefaultSpecialValue("slow_movement_speed", [-20, -26, -32, -38, -34, -40]);
        this.SetDefaultSpecialValue("radius", 450);
        this.SetDefaultSpecialValue("shrapnel_damage", [300, 700, 1200, 1800, 2400, 3200]);
        this.SetDefaultSpecialValue("shrapnel_damage_per_agi", 3);
        this.SetDefaultSpecialValue("duration", 6);
        this.SetDefaultSpecialValue("damage_delay", 1.2);

    }

    Init_old() {
        this.SetDefaultSpecialValue("slow_movement_speed", -190);
        this.SetDefaultSpecialValue("radius", 450);
        this.SetDefaultSpecialValue("shrapnel_damage", [300, 700, 1200, 1800, 2400, 3200]);
        this.SetDefaultSpecialValue("shrapnel_damage_per_agi", 3);
        this.SetDefaultSpecialValue("duration", 6);
        this.SetDefaultSpecialValue("damage_delay", 1.2);

    }



    GetAOERadius() {
        let hCaster = this.GetCasterPlus()
        return this.GetSpecialValueFor("radius") + hCaster.GetTalentValue("special_bonus_unique_sniper_custom")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()

        let damage_delay = this.GetSpecialValueFor("damage_delay")
        let duration = this.GetSpecialValueFor("duration") + hCaster.GetTalentValue("special_bonus_unique_sniper_custom_3")

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Sniper.ShrapnelShoot", hCaster))

        modifier_sniper_1_thinker.applyThinker(vPosition, hCaster, this, { duration: duration + damage_delay }, hCaster.GetTeamNumber(), false)
    }
    GetIntrinsicModifierName() {
        return "modifier_sniper_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_sniper_1 extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
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


    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GameFunc.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let caster = ability.GetCasterPlus()
            if (!ability.GetAutoCastState()) {
                return
            }
            if (caster.IsTempestDouble() || caster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }
            if (!ability.IsAbilityReady()) {
                return
            }
            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()
            let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)
            //  施法命令
            if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_sniper_1_thinker extends BaseModifier_Plus {
    sSoundName: string;
    vDirection: Vector;
    damage_delay: number;
    radius: number;
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
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
        return this.GetStackCount() == 1 && GameFunc.IsValid(this.GetCasterPlus()) && GameFunc.IsValid(this.GetAbilityPlus())
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
    }
    GetAuraRadius() {
        return this.radius
    }
    GetAura() {
        return "modifier_sniper_1_debuff"
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        this.radius = this.GetSpecialValueFor("radius") + hCaster.GetTalentValue("special_bonus_unique_sniper_custom")
        this.damage_delay = this.GetSpecialValueFor("damage_delay")
        if (IsServer()) {
            this.sSoundName = ResHelper.GetSoundReplacement("Hero_Sniper.ShrapnelShatter", hCaster)
            hParent.EmitSound(this.sSoundName)
            this.vDirection = (hParent.GetAbsOrigin() - hCaster.GetAbsOrigin()) as Vector
            this.vDirection.z = 0
            this.vDirection = this.vDirection.Normalized()
            this.StartIntervalThink(this.damage_delay)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_sniper/sniper_shrapnel_launch.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 1, GameFunc.VectorFunctions.VectorLerp(0.5, hCaster.GetAbsOrigin(), ((hParent.GetAbsOrigin()) + Vector(0, 0, 1000)) as Vector))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            hParent.StopSound(this.sSoundName)
            UTIL_Remove(hParent)
        }
    }
    OnIntervalThink() {
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            if (!GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }
            this.StartIntervalThink(-1)

            this.SetStackCount(1)

            hParent.SetDayTimeVisionRange(this.radius)
            hParent.SetNightTimeVisionRange(this.radius)

            modifier_sniper_1_particle_sniper_shrapnel.apply(hParent, hCaster, this.GetAbilityPlus(), null)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_sniper_1_debuff extends BaseModifier_Plus {
    slow_movement_speed: number;
    shrapnel_damage_per_agi: number;
    shrapnel_damage: number;
    damage_type: DAMAGE_TYPES;
    // IsHidden() {
    //     let hParent = this.GetParentPlus()
    //     let modifier_sniper_1_debuff_table = Load(hParent, "modifier_sniper_1_debuff_table") || {}
    //     return modifier_sniper_1_debuff_table[0] != this
    // }
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hParent = this.GetParentPlus()
        // let modifier_sniper_1_debuff_table = Load(hParent, "modifier_sniper_1_debuff_table") || {}
        // table.insert(modifier_sniper_1_debuff_table, this)
        // Save(hParent, "modifier_sniper_1_debuff_table", modifier_sniper_1_debuff_table)
        if (IsServer()) {
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
            this.OnIntervalThink()
            this.StartIntervalThink(1)
        }
    }
    Init(params: IModifierTable) {
        this.slow_movement_speed = this.GetSpecialValueFor("slow_movement_speed")
        this.shrapnel_damage = this.GetSpecialValueFor("shrapnel_damage")
        this.shrapnel_damage_per_agi = this.GetSpecialValueFor("shrapnel_damage_per_agi")
    }
    OnDestroy() {
        super.OnDestroy();
        let hParent = this.GetParentPlus()
        // let modifier_sniper_1_debuff_table = Load(hParent, "modifier_sniper_1_debuff_table") || {}
        // ArrayRemove(modifier_sniper_1_debuff_table, this)
        // Save(hParent, "modifier_sniper_1_debuff_table", modifier_sniper_1_debuff_table)
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
                this.Destroy()
                return
            }
            let iAgi = 0
            if (hCaster.GetAgility != null) {
                iAgi = hCaster.GetAgility()
            }
            let tDamageTable = {
                ability: hAbility,
                attacker: hCaster,
                victim: hParent,
                damage: this.shrapnel_damage + this.shrapnel_damage_per_agi * iAgi,
                damage_type: this.damage_type
            }
            BattleHelper.GoApplyDamage(tDamageTable)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        if (!GameFunc.IsValid(this.GetCasterPlus()) || !GameFunc.IsValid(this.GetAbilityPlus())) {
            return
        }
        let hParent = this.GetParentPlus()
        // let modifier_sniper_1_debuff_table = Load(hParent, "modifier_sniper_1_debuff_table") || {}
        // if (modifier_sniper_1_debuff_table[0] == this) {
        //     return this.slow_movement_speed * hParent.GetStatusResistanceFactor(this.GetCasterPlus())
        // }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_sniper_1_particle_sniper_shrapnel extends modifier_particle {
    vDirection: Vector;
    radius: number;
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let extra_radius = hCaster.HasTalent("special_bonus_unique_sniper_custom") && hCaster.GetTalentValue("special_bonus_unique_sniper_custom") || 0
        this.radius = this.GetSpecialValueFor("radius") + extra_radius
        this.vDirection = (hParent.GetAbsOrigin() - hCaster.GetAbsOrigin()) as Vector
        this.vDirection.z = 0
        this.vDirection = this.vDirection.Normalized()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_sniper/sniper_shrapnel.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.radius, 0, 0))
            ParticleManager.SetParticleControlForward(iParticleID, 2, this.vDirection)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
}
