import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
/** dota原技能数据 */
export const Data_obsidian_destroyer_equilibrium = { "ID": "5684", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "HasShardUpgrade": "1", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_5", "AbilityCastPoint": "0.75", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "proc_chance": "30" }, "02": { "var_type": "FIELD_INTEGER", "mana_restore": "20 30 40 50" }, "03": { "var_type": "FIELD_FLOAT", "mana_capacity_steal": "5" }, "04": { "var_type": "FIELD_FLOAT", "mana_capacity_duration": "30 40 50 60" } } };

@registerAbility()
export class ability3_obsidian_destroyer_equilibrium extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "obsidian_destroyer_equilibrium";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_obsidian_destroyer_equilibrium = Data_obsidian_destroyer_equilibrium;
    Init() {
        this.SetDefaultSpecialValue("pre_energy_mana_limit", [240, 350, 470, 600, 750]);
        this.SetDefaultSpecialValue("chance", 25);
        this.SetDefaultSpecialValue("max_mana_ragen_percent", [10, 20, 30, 40, 50]);
        this.SetDefaultSpecialValue("movement_slow_percent", [11, 22, 33, 44, 55]);
        this.SetDefaultSpecialValue("slow_duration", 1.75);
        this.SetDefaultSpecialValue("active_duration", 6);
        this.SetDefaultSpecialValue("duration", 10);

    }

    Init_old() {
        this.SetDefaultSpecialValue("pre_energy_mana_limit", [20, 30, 40, 50, 60]);
        this.SetDefaultSpecialValue("chance", 25);
        this.SetDefaultSpecialValue("max_mana_ragen_percent", [10, 20, 30, 40, 50]);
        this.SetDefaultSpecialValue("movement_slow_percent", [11, 22, 33, 44, 55]);
        this.SetDefaultSpecialValue("slow_duration", 1.75);
        this.SetDefaultSpecialValue("active_duration", 6);
        this.SetDefaultSpecialValue("duration", 60);

    }




    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let active_duration = this.GetSpecialValueFor("active_duration")
        modifier_obsidian_destroyer_3_active.apply(hCaster, hCaster, this, { duration: active_duration })
    }

    GetIntrinsicModifierName() {
        return "modifier_obsidian_destroyer_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_obsidian_destroyer_3 extends BaseModifier_Plus {
    chance: number;
    max_mana_ragen_percent: number;
    duration: number;
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
        let hParent = this.GetParentPlus()
        this.chance = this.GetSpecialValueFor("chance")
        this.max_mana_ragen_percent = this.GetSpecialValueFor("max_mana_ragen_percent")
        this.duration = this.GetSpecialValueFor("duration")
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    OnRefresh(params: IModifierTable) {
        super.OnRefresh(params);
        let hParent = this.GetParentPlus()
        this.chance = this.GetSpecialValueFor("chance")
        this.max_mana_ragen_percent = this.GetSpecialValueFor("max_mana_ragen_percent")
        this.duration = this.GetSpecialValueFor("duration")
    }


    OnStackCountChanged(iOldStackCount: number) {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            let iNewStackCount = this.GetStackCount()
            if (hParent.HasTalent("special_bonus_unique_obsidian_destroyer_custom_6") && modifier_obsidian_destroyer_3_active.exist(hParent)) {
                iNewStackCount = iNewStackCount * hParent.GetTalentValue("special_bonus_unique_obsidian_destroyer_custom_6")
            }
            modifier_obsidian_destroyer_3_buff.apply(hParent, hParent, hAbility, { duration: this.duration, stackCount: iNewStackCount })
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    OnAbilityExecuted(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (params.ability == null || params.ability.IsItem() || !params.ability.ProcsMagicStick() || params.unit != hParent) {
            return
        }
        if (GameFunc.mathUtil.PRD(this.chance, hParent, "obsidian_destroyer_4")) {
            // 吸蓝特效
            let iMaxMana = hParent.GetMaxMana()
            let iGiveMana = iMaxMana * this.max_mana_ragen_percent * 0.01
            hParent.GiveMana(iGiveMana)
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

            let range = caster.Script_GetAttackRange()
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_obsidian_destroyer_3_buff extends BaseModifier_Plus {
    pre_energy_mana_limit: number;
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
    Init(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        this.pre_energy_mana_limit = this.GetSpecialValueFor("pre_energy_mana_limit") + hParent.GetTalentValue("special_bonus_unique_obsidian_destroyer_custom_7")
        if (IsServer()) {
            let iStackCount = (params.stackCount || 0)
            this.changeStackCount(iStackCount)
            this.addTimer(params.duration, () => {
                this.changeStackCount(-iStackCount)
            })
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    EOM_GetModifierManaBonus(params: IModifierTable) {
        return this.GetStackCount() * this.pre_energy_mana_limit
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    tooltip() {
        return this.GetStackCount() * this.pre_energy_mana_limit
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_obsidian_destroyer_3_active extends BaseModifier_Plus {
    slow_duration: number;
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
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        this.slow_duration = this.GetSpecialValueFor("slow_duration")
        if (IsClient() && params.IsOnCreated) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_matter_buff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, true)
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    OnTakeDamage(params: IModifierTable) {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (GameFunc.IsValid(params.inflictor) && params.attacker == hParent && !params.attacker.IsIllusion() && GameFunc.IsValid(params.unit) && params.unit.IsAlive()) {
                modifier_obsidian_destroyer_3_debuff.apply(params.unit, hParent, hAbility, { duration: this.slow_duration })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_obsidian_destroyer_3_debuff extends BaseModifier_Plus {
    movement_slow_percent: number;
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
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        this.movement_slow_percent = this.GetSpecialValueFor("movement_slow_percent")
        if (IsClient() && params.IsOnCreated) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_obsidian_matter_debuff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, true, 10, false, true)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        return -this.movement_slow_percent
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_obsidian_destroyer_3_particle_manasteal extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        if (IsClient()) {
            let sParticleName = modifier_obsidian_destroyer_3_active.exist(hCaster) && "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_essence_effect.vpcf" || "particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_matter_manasteal.vpcf"
            let particleID = ResHelper.CreateParticle({
                resPath: sParticleName,
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }

}
