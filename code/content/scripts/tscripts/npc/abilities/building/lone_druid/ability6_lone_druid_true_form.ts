import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_lone_druid_true_form = { "ID": "5415", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Hero_LoneDruid.TrueForm.Cast", "AbilityCooldown": "100", "AbilityCastAnimation": "ACT_DOTA_OVERRIDE_ABILITY_3", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastPoint": "0 0 0", "AbilityManaCost": "200", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_armor": "8 10 12" }, "02": { "var_type": "FIELD_INTEGER", "bonus_hp": "500 1000 1500", "LinkedSpecialBonus": "special_bonus_unique_lone_druid_7" }, "03": { "var_type": "FIELD_FLOAT", "base_attack_time": "1.7" }, "05": { "var_type": "FIELD_FLOAT", "duration": "40" }, "06": { "var_type": "FIELD_FLOAT", "transformation_time": "1.933" } } };

@registerAbility()
export class ability6_lone_druid_true_form extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lone_druid_true_form";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lone_druid_true_form = Data_lone_druid_true_form;
    Init() {
        this.SetDefaultSpecialValue("attack_range", 700);
        this.SetDefaultSpecialValue("base_attack_interval", 1.3);
        this.SetDefaultSpecialValue("stats_resistance", 50);
        this.SetDefaultSpecialValue("bonus_health_per", [5, 10, 15, 20, 25, 30]);
        this.SetDefaultSpecialValue("duration", [7, 8, 9, 10, 11, 12]);
        this.SetDefaultSpecialValue("transformation_time", 1.933);
        this.SetDefaultSpecialValue("shard_cd", 1);
        this.SetDefaultSpecialValue("shard_range", 900);
        this.SetDefaultSpecialValue("shard_interval", 1.1);

    }



    GetCooldown(iLevel: number) {
        if (this.GetCasterPlus().HasShard()) {
            return this.GetLevelSpecialValueFor("shard_cd", iLevel)
        }
        return super.GetCooldown(iLevel)
    }
    GetBehavior() {
        if (this.GetCasterPlus().HasShard()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE
        }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let transformation_time = this.GetSpecialValueFor("transformation_time")
        modifier_lone_druid_6_transform.apply(hCaster, hCaster, this, { duration: transformation_time })
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_LoneDruid.TrueForm.Cast", hCaster))
    }
    OnToggle() {
        let hCaster = this.GetCasterPlus()
        if (this.GetToggleState()) {
            modifier_lone_druid_6_form.apply(hCaster, hCaster, this, null)
        } else {
            modifier_lone_druid_6_form.remove(hCaster);
        }
        //
    }
    OnShardAdded() {
        let hCaster = this.GetCasterPlus()
        //  如果正在变身
        modifier_lone_druid_6_transform.remove(hCaster);
        //  刚吃了魔晶，删掉有持续时间的buff
        modifier_lone_druid_6_form.remove(hCaster);
        this.EndCooldown()
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_lone_druid_6"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_lone_druid_6 extends BaseModifier_Plus {
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
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (ability == null || ability.IsNull()) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let caster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }
            if (caster.HasShard()) {
                return
            }
            if (caster.IsTempestDouble() || caster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }
            if (modifier_lone_druid_6_form.exist(caster) || modifier_lone_druid_6_transform.exist(caster)) {
                return
            }
            let range = caster.Script_GetAttackRange()

            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets.length > 0) {
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
@registerModifier()
export class modifier_lone_druid_6_transform extends BaseModifier_Plus {
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
        this.duration = this.GetSpecialValueFor("duration")
        let hParent = this.GetParentPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lone_druid/lone_druid_true_form.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 3, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (GameFunc.IsValid(hParent) && hParent.IsAlive()) {
                if (!hParent.HasShard()) {
                    modifier_lone_druid_6_form.apply(hParent, hParent, this.GetAbilityPlus(), { duration: this.duration })
                }
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_RATE)
    Get_OverrideAnimationRate() {
        return 1.5 / this.GetDuration()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_lone_druid_6_form extends BaseModifier_Plus {
    attack_range: number;
    base_attack_interval: number;
    bonus_health_per: number;
    shard_range: number;
    stats_resistance: number;
    shard_interval: number;
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
        return true
    }
    Init(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        this.attack_range = this.GetSpecialValueFor("attack_range")
        this.base_attack_interval = this.GetSpecialValueFor("base_attack_interval") + hParent.GetTalentValue("special_bonus_unique_lone_druid_custom_6")
        this.bonus_health_per = this.GetSpecialValueFor("bonus_health_per")
        this.stats_resistance = this.GetSpecialValueFor("stats_resistance")
        this.shard_range = this.GetSpecialValueFor("shard_range")
        this.shard_interval = this.GetSpecialValueFor("shard_interval")
        if (IsServer()) {
            hParent.SetAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_MELEE_ATTACK)
            // if (!hParent.HasAbility("lone_druid_bear_entangle_custom")) {
            //     let hEntangle = hParent.AddAbility("lone_druid_bear_entangle_custom")
            //     if (hParent.GetStar() != hEntangle.GetLevel()) {
            //         hEntangle.SetLevel(hParent.GetStar())
            //     }
            // }
            // if (!hParent.HasAbility("lone_druid_bear_demolish_custom")) {
            //     let hDemolish = hParent.AddAbility("lone_druid_bear_demolish_custom")
            //     if (hParent.GetStar() != hDemolish.GetLevel()) {
            //         hDemolish.SetLevel(hParent.GetStar())
            //     }
            // }
        }
    }

    OnDestroy() {
        super.OnDestroy();
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            hParent.SetAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK)
            hParent.RemoveAbility("lone_druid_bear_entangle_custom")
            hParent.RemoveAbility("lone_druid_bear_demolish_custom")
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    GetBaseAttackTimeConstant(params: IModifierTable) {
        if (this.GetParentPlus().HasShard()) {
            return this.shard_interval
        }
        return this.base_attack_interval
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BASE_OVERRIDE)
    GetAttackRangeOverride(params: IModifierTable) {
        if (this.GetParentPlus().HasShard()) {
            return this.shard_range
        }
        return this.attack_range
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    GetModelChange(params: IModifierTable) {
        return ResHelper.GetModelReplacement("models/heroes/lone_druid/true_form.vmdl", this.GetParentPlus())
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    EOM_GetModifierStatusResistanceStacking(params: IModifierTable) {
        return this.stats_resistance
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_PERCENTAGE)
    EOM_GetModifierHealthPercentage(params: IModifierTable) {
        return this.bonus_health_per
    }
}
