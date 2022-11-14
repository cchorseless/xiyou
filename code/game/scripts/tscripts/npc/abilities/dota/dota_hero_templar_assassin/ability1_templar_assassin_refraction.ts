import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_templar_assassin_refraction = { "ID": "5194", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Hero_TemplarAssassin.Refraction", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "17.0 17.0 17.0 17.0", "AbilityManaCost": "100", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "instances": "3 4 5 6", "LinkedSpecialBonus": "special_bonus_unique_templar_assassin" }, "02": { "var_type": "FIELD_INTEGER", "bonus_damage": "25 50 75 100" }, "03": { "var_type": "FIELD_INTEGER", "damage_threshold": "5 5 5 5" }, "04": { "var_type": "FIELD_FLOAT", "duration": "17.0 17.0 17.0 17.0" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_templar_assassin_refraction extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "templar_assassin_refraction";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_templar_assassin_refraction = Data_templar_assassin_refraction;
    Init() {
        this.SetDefaultSpecialValue("instances", [5, 7, 9, 11, 13, 15]);
        this.SetDefaultSpecialValue("bonus_damage", [200, 400, 600, 800, 1000, 1200]);
        this.SetDefaultSpecialValue("bonus_damage_per_agi", 1.5);
        this.SetDefaultSpecialValue("scepter_instances", 1);
        this.SetDefaultSpecialValue("scepter_interval", 1);

    }

    Init_old() {
        this.SetDefaultSpecialValue("instances", [5, 7, 9, 11, 13, 15]);
        this.SetDefaultSpecialValue("bonus_damage", [200, 400, 600, 800, 1000, 1200]);
        this.SetDefaultSpecialValue("bonus_damage_per_agi", 1.5);
        this.SetDefaultSpecialValue("scepter_instances", 1);
        this.SetDefaultSpecialValue("scepter_interval", 1);

    }



    GetBehavior() {
        let iBehavior = tonumber(tostring(super.GetBehavior()))
        if (this.GetCasterPlus().HasTalent("special_bonus_unique_templar_assassin_custom_2")) {
            iBehavior = iBehavior + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE
        }
        return iBehavior
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        modifier_templar_assassin_1_bonus_attack.apply(hCaster, hCaster, this, null)
        if (hCaster.HasTalent("special_bonus_unique_templar_assassin_custom_2")) {
            hCaster.Purge(false, true, false, false, false)
            let duration = hCaster.GetTalentValue("special_bonus_unique_templar_assassin_custom_2")
            modifier_templar_assassin_1_magic_immune_talent.apply(hCaster, hCaster, this, { duration: duration })
        }

        hCaster.StartGesture(GameActivity_t.ACT_DOTA_CAST_REFRACTION)
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_TemplarAssassin.Refraction", hCaster))
    }

    GetIntrinsicModifierName() {
        return "modifier_templar_assassin_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_templar_assassin_1 extends BaseModifier_Plus {
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
            modifier_templar_assassin_1_scepter.apply(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), null)
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        if (IsServer()) {
            modifier_templar_assassin_1_scepter.apply(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), null)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            modifier_templar_assassin_1_scepter.remove(this.GetParentPlus());
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

            if (caster.IsTempestDouble() || caster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.GetAutoCastState()) {
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
            let targets = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), null, range, teamFilter, typeFilter, flagFilter, order, false)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_templar_assassin_1_scepter extends BaseModifier_Plus {
    scepter_instances: number;
    scepter_interval: number;
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
    Init(params: ModifierTable) {
        this.scepter_instances = this.GetSpecialValueFor("scepter_instances")
        this.scepter_interval = this.GetSpecialValueFor("scepter_interval")
        if (IsServer()) {
            this.StartIntervalThink(1)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hAbility) && !GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }

            if (hParent.IsTempestDouble() || hParent.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (hCaster.HasScepter()) {
                modifier_templar_assassin_1_bonus_attack.apply(hParent, hCaster, hAbility, { instances: this.scepter_instances })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_templar_assassin_1_bonus_attack extends BaseModifier_Plus {
    instances: number;
    bonus_damage: number;
    bonus_damage_per_agi: number;
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
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.instances = this.GetSpecialValueFor("instances")
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
        let extra_bonus_damage_per_agi = hCaster.GetTalentValue("special_bonus_unique_templar_assassin_custom_7")
        this.bonus_damage_per_agi = this.GetSpecialValueFor("bonus_damage_per_agi") + extra_bonus_damage_per_agi
        if (IsServer()) {
            let instances = params.instances || this.instances
            this.SetStackCount(this.GetStackCount() + instances)
        } else if (params.IsOnCreated && IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_templar_assassin/templar_assassin_refraction.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 5, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }

    OnStackCountChanged(iOldStackCount: number) {
        if (IsServer()) {
            let iNewStackCount = this.GetStackCount()
            if (iNewStackCount <= 0) {
                this.Destroy()
            }
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: ModifierTable) {
        let iAgi = 0
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hCaster) && hCaster.GetAgility != null) {
            iAgi = hCaster.GetAgility()
        }
        return this.bonus_damage + this.bonus_damage_per_agi * iAgi
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        if (!GameFunc.IsValid(params.target) || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus()) {
            this.DecrementStackCount()
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_templar_assassin_1_magic_immune_talent extends BaseModifier_Plus {
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/items_fx/black_king_bar_avatar.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
    }
}
