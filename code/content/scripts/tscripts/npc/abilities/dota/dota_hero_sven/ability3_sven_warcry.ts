
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_sven_warcry = { "ID": "5096", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES", "AbilitySound": "Hero_Sven.WarCry", "AbilityCastAnimation": "ACT_DOTA_OVERRIDE_ABILITY_3", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "32 28 24 20", "AbilityManaCost": "30 40 50 60", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "movespeed": "8 12 16 20", "LinkedSpecialBonus": "special_bonus_unique_sven_6" }, "02": { "var_type": "FIELD_INTEGER", "bonus_armor": "6 9 12 15", "LinkedSpecialBonus": "special_bonus_unique_sven_7" }, "03": { "var_type": "FIELD_INTEGER", "radius": "700" }, "05": { "var_type": "FIELD_INTEGER", "duration": "8", "LinkedSpecialBonus": "special_bonus_unique_sven_5" } } };

@registerAbility()
export class ability3_sven_warcry extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "sven_warcry";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_sven_warcry = Data_sven_warcry;
    Init() {
        this.SetDefaultSpecialValue("bonus_damage", [300, 600, 900, 1200, 2000]);
        this.SetDefaultSpecialValue("attack_speed", [5, 8, 12, 20, 25]);
        this.SetDefaultSpecialValue("duration", 10);
        this.SetDefaultSpecialValue("radius", 700);

    }

    Init_old() {
        this.SetDefaultSpecialValue("bonus_damage", [300, 600, 900, 1200, 2000]);
        this.SetDefaultSpecialValue("attack_speed", [5, 8, 12, 20, 25]);
        this.SetDefaultSpecialValue("duration", 10);
        this.SetDefaultSpecialValue("radius", 700);

    }

    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let duration = this.GetSpecialValueFor("duration")
        let tTarget = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
        let unitCount = 0
        for (let unit of (tTarget)) {
            if (GameFunc.IsValid(unit) && unit.IsAlive() && unit != caster && !unit.IsIllusion() && !unit.IsSummoned()) {
                modifier_sven_3_buff.apply(unit, caster, this, { duration: duration })
                unitCount = unitCount + 1
            }
        }
        modifier_sven_3_buff_attack_speed.apply(caster, caster, this, { duration: duration, unitCount: unitCount })
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_sven/sven_spell_warcry.vpcf",
            resNpc: null,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
            owner: caster
        });

        ParticleManager.SetParticleControlEnt(iParticleID, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_head", caster.GetAbsOrigin(), true)
        ParticleManager.ReleaseParticleIndex(iParticleID)

        caster.EmitSound("Hero_Sven.WarCry")
    }

    GetIntrinsicModifierName() {
        return "modifier_sven_3"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_sven_3 extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    max_attackspeed = -100;
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

            if (modifier_sven_3_buff.exist(caster)) {
                return
            }

            let range = caster.Script_GetAttackRange()
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_sven_3_buff extends BaseModifier_Plus {
    bonus_damage: number;
    IsHidden() {
        return false
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
        super.OnCreated(params)
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_sven/sven_warcry_buff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.GetParentPlus().GetModelRadius(), 1, 1))
            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_sven/sven_warcry_buff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, true)
        }
    }
    Init(params: IModifierTable) {
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: any) {
        return this.bonus_damage
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_sven_3_buff_attack_speed extends BaseModifier_Plus {
    attack_speed: number;
    IsHidden() {
        return false
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
        super.OnCreated(params)
        let hParent = this.GetParentPlus()
        this.attack_speed = this.GetSpecialValueFor("attack_speed")
        if (!IsServer()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_sven/sven_warcry_buff_sven.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        this.attack_speed = this.GetSpecialValueFor("attack_speed")
        if (IsServer()) {
            let unitCount = params.unitCount || 0
            this.SetStackCount(unitCount)
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: IModifierTable) {
        return this.attack_speed * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    G_MAX_ATTACKSPEED_BONUS(params: any) {
        return this.attack_speed * this.GetStackCount()
    }
}


