import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_poison } from "../../../modifier/effect/modifier_poison";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_dragon_knight_elder_dragon_form = { "ID": "5229", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES_ENEMIES_NO", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "2", "AbilitySound": "Hero_DragonKnight.ElderDragonForm", "HasScepterUpgrade": "1", "AbilityDraftUltShardAbility": "dragon_knight_fireball", "AbilityCastAnimation": "ACT_INVALID", "AbilityCooldown": "115", "AbilityManaCost": "50 50 50", "AbilityModifierSupportValue": "0.35", "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "frost_bonus_attack_speed": "-40 -40 -40 -60", "LinkedSpecialBonus": "special_bonus_unique_dragon_knight_5" }, "11": { "var_type": "FIELD_FLOAT", "frost_duration": "3.0 3.0 3.0" }, "12": { "var_type": "FIELD_FLOAT", "frost_aoe": "300" }, "13": { "var_type": "FIELD_INTEGER", "magic_resistance": "0 0 0 40" }, "14": { "var_type": "FIELD_INTEGER", "model_scale": "0 0 0 30" }, "01": { "var_type": "FIELD_FLOAT", "duration": "60" }, "02": { "var_type": "FIELD_INTEGER", "bonus_movement_speed": "25" }, "03": { "var_type": "FIELD_INTEGER", "bonus_attack_range": "350 350 350 350" }, "04": { "var_type": "FIELD_INTEGER", "bonus_attack_damage": "0" }, "05": { "var_type": "FIELD_INTEGER", "corrosive_breath_damage": "20 20 20 30" }, "06": { "var_type": "FIELD_FLOAT", "corrosive_breath_duration": "5.0 5.0 5.0" }, "07": { "var_type": "FIELD_INTEGER", "splash_radius": "350" }, "08": { "var_type": "FIELD_INTEGER", "splash_damage_percent": "75 75 75 115", "LinkedSpecialBonus": "special_bonus_unique_dragon_knight_6" }, "09": { "var_type": "FIELD_INTEGER", "frost_bonus_movement_speed": "-40 -40 -40 -60", "LinkedSpecialBonus": "special_bonus_unique_dragon_knight_5" } } };

@registerAbility()
export class ability6_dragon_knight_elder_dragon_form extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dragon_knight_elder_dragon_form";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dragon_knight_elder_dragon_form = Data_dragon_knight_elder_dragon_form;
    Init() {
        this.SetDefaultSpecialValue("model_scale", [0, 0, 0, 30]);
        this.SetDefaultSpecialValue("scepter_extra_damage_percent", 30);
        this.SetDefaultSpecialValue("poison_str_factor", 1);
        this.SetDefaultSpecialValue("duration", 20);
        this.SetDefaultSpecialValue("extra_damage_percent", 20);
        this.SetDefaultSpecialValue("bonus_attack_range", [400, 400, 400, 400, 400, 400, 600]);
        this.SetDefaultSpecialValue("corrosive_breath_damage", [80, 120, 160, 220, 300, 400, 600]);
        this.SetDefaultSpecialValue("splash_radius", 300);
        this.SetDefaultSpecialValue("splash_damage_percent", [0, 0, 75, 75, 100, 100, 150]);
        this.SetDefaultSpecialValue("frost_bonus_movement_speed", [0, 0, 0, 0, -40, -40, -60]);
        this.SetDefaultSpecialValue("frost_duration", 3);
        this.SetDefaultSpecialValue("frost_aoe", 300);

    }


    Corrosive(hTarget: BaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let iLevel = this.GetLevel()
        if (hCaster.HasScepter()) {
            iLevel = iLevel + 1
        }

        if (UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, hCaster.GetTeamNumber()) != UnitFilterResult.UF_SUCCESS) {
            return
        }

        let corrosive_breath_damage = this.GetLevelSpecialValueFor("corrosive_breath_damage", iLevel - 1)
        let poison_str_factor = this.GetSpecialValueFor("poison_str_factor")
        if (!hCaster.IsIllusion()) {
            modifier_poison.Poison(hTarget, hCaster, this, corrosive_breath_damage + hCaster.GetStrength() * poison_str_factor)
        }
    }
    Frost(hTarget: BaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let iLevel = this.GetLevel()
        if (hCaster.HasScepter()) {
            iLevel = iLevel + 1
        }

        let frost_duration = this.GetLevelSpecialValueFor("frost_duration", iLevel - 1)
        let frost_aoe = this.GetLevelSpecialValueFor("frost_aoe", iLevel - 1)

        let hTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), frost_aoe, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, 1)
        for (let hTarget of (hTargets)) {

            modifier_dragon_knight_6_frost.apply(hTarget, hCaster, this, { duration: frost_duration * hTarget.GetStatusResistanceFactor(hCaster) })
        }
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let iLevel = this.GetLevel()
        if (hCaster.HasScepter()) {
            iLevel = iLevel + 1
        }
        let duration = this.GetLevelSpecialValueFor("duration", iLevel - 1)

        modifier_dragon_knight_6_form.remove(hCaster);
        modifier_dragon_knight_6_form.apply(hCaster, hCaster, this, { duration: duration })

        modifier_dragon_knight_6_green.apply(hCaster, hCaster, this, { duration: duration })

        let iSkin = 0
        if (iLevel > 2) {
            iSkin = 1
            modifier_dragon_knight_6_red.apply(hCaster, hCaster, this, { duration: duration })
        }
        if (iLevel > 4) {
            iSkin = 2
            modifier_dragon_knight_6_blue.apply(hCaster, hCaster, this, { duration: duration })
        }
        if (iLevel > 6) {
            iSkin = 3
        }
        hCaster.SetSkin(iSkin)

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_DragonKnight.ElderDragonForm", hCaster))
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_dragon_knight_6"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_dragon_knight_6 extends BaseModifier_Plus {
    bonus_attack_range: number;
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
        }
    }
    Init(params: ModifierTable) {
        this.bonus_attack_range = this.GetSpecialValueFor("bonus_attack_range")
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

            if (modifier_dragon_knight_6_form.exist(caster)) {
                return
            }

            let range = caster.Script_GetAttackRange() + this.bonus_attack_range
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE
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
@registerModifier()
export class modifier_dragon_knight_6_form extends BaseModifier_Plus {
    iLevel: number;
    extra_damage_percent: any;
    bonus_attack_range: any;
    scepter_extra_damage_percent: any;
    model_scale: any;
    wearables: any[];
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
        return true
    }
    GetPriority() {
        return -1
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hCaster)) {
            this.Destroy()
            return
        }
        this.iLevel = GameFunc.IsValid(this.GetAbilityPlus()) && this.GetAbilityPlus().GetLevel() || 0
        if (this.iLevel > 0 && this.GetCasterPlus().HasScepter()) {
            this.iLevel = this.iLevel + 1
        }
        this.extra_damage_percent = this.GetLevelSpecialValueFor("extra_damage_percent", this.iLevel - 1) + hCaster.GetTalentValue("special_bonus_unique_dragon_knight_custom_7")
        this.bonus_attack_range = this.GetLevelSpecialValueFor("bonus_attack_range", this.iLevel - 1)
        this.scepter_extra_damage_percent = this.GetLevelSpecialValueFor("scepter_extra_damage_percent", this.iLevel - 1)
        this.model_scale = this.GetLevelSpecialValueFor("model_scale", this.iLevel - 1)

        let caster = this.GetCasterPlus()

        if (IsServer()) {
            this.GetParentPlus().SetAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK)
            this.wearables = []
            let model = this.GetParentPlus().FirstMoveChild()
            while (model != null) {
                if (model.GetClassname() != "" && model.GetClassname() == "dota_item_wearable" && model.GetModelName() != "") {
                    model.AddEffects(EntityEffects.EF_NODRAW)
                    table.insert(this.wearables, model)
                }
                model = model.NextMovePeer()
            }

            this.StartIntervalThink(0)
        } else {
            let sParticlePath = "particles/units/heroes/hero_dragon_knight/dragon_knight_transform_green.vpcf"
            if (this.iLevel > 2 && this.iLevel <= 4) {
                sParticlePath = "particles/units/heroes/hero_dragon_knight/dragon_knight_transform_red.vpcf"
            } else if (this.iLevel > 4 && this.iLevel <= 6) {
                sParticlePath = "particles/units/heroes/hero_dragon_knight/dragon_knight_transform_blue.vpcf"
            } else if (this.iLevel > 6) {
                sParticlePath = "particles/units/heroes/hero_dragon_knight/dragon_knight_transform_black.vpcf"
            }

            let iParticleID = ResHelper.CreateParticle({
                resPath: sParticlePath,
                resNpc: this.GetParentPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParentPlus().SetSkin(0)
            this.GetParentPlus().SetAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_MELEE_ATTACK)
            this.GetParentPlus().EmitSound(ResHelper.GetSoundReplacement("Hero_DragonKnight.ElderDragonForm.Revert", this.GetParentPlus()))

            if (this.wearables) {
                for (let model of (this.wearables)) {
                    model.RemoveEffects(EntityEffects.EF_NODRAW)
                }
            }

            this.GetParentPlus().RemoveGesture(GameActivity_t.ACT_DOTA_CONSTANT_LAYER)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_CONSTANT_LAYER)
            this.StartIntervalThink(-1)
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    g_OUTGOING_DAMAGE_PERCENTAGE() {
        return this.GetParentPlus().HasScepter() && this.scepter_extra_damage_percent || this.extra_damage_percent
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    GetAttackRangeBonus(params: ModifierTable) {
        return this.bonus_attack_range
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING)
    GetCastRangeBonusStacking(params: ModifierAbilityEvent) {
        if (GameFunc.IsValid(params.ability) &&
            GameFunc.IncludeArgs(params.ability.GetBehaviorInt(), DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ATTACK)[0]) {
            return this.bonus_attack_range
        }
        return 0
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PROJECTILE_NAME)
    GetProjectileName(params: ModifierTable) {
        let sParticlePath = "particles/units/heroes/hero_dragon_knight/dragon_knight_elder_dragon_corrosive.vpcf"
        if (this.iLevel > 2 && this.iLevel <= 4) {
            sParticlePath = "particles/units/heroes/hero_dragon_knight/dragon_knight_elder_dragon_fire.vpcf"
        } else if (this.iLevel > 4 && this.iLevel <= 6) {
            sParticlePath = "particles/units/heroes/hero_dragon_knight/dragon_knight_elder_dragon_frost.vpcf"
        } else if (this.iLevel > 6) {
            sParticlePath = "particles/units/heroes/hero_dragon_knight/dragon_knight_elder_dragon_attack_black.vpcf"
        }
        return ResHelper.GetParticleReplacement(sParticlePath, this.GetParentPlus())
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MODEL_CHANGE)
    GetModelChange(params: ModifierTable) {
        return ResHelper.GetModelReplacement("models/heroes/dragon_knight/dragon_knight_dragon.vmdl", this.GetParentPlus())
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MODEL_SCALE)
    GetModelScale(params: ModifierTable) {
        return this.model_scale
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    Get_AttackSound() {
        let sSoundName = "Hero_DragonKnight.ElderDragonShoot1.Attack"
        if (this.iLevel > 2 && this.iLevel <= 4) {
            sSoundName = "Hero_DragonKnight.ElderDragonShoot2.Attack"
        } else if (this.iLevel > 4 && this.iLevel <= 6) {
            sSoundName = "Hero_DragonKnight.ElderDragonShoot3.Attack"
        } else if (this.iLevel > 6) {
            sSoundName = "Hero_DragonKnight.ElderDragonShoot3.Attack"
        }
        return ResHelper.GetSoundReplacement(sSoundName, this.GetParentPlus())
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_dragon_knight_6_green extends BaseModifier_Plus {
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
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackland(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
            let ability = this.GetAbilityPlus() as ability6_dragon_knight_elder_dragon_form
            if (GameFunc.IsValid(ability) && ability.Corrosive) {
                ability.Corrosive(params.target)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_dragon_knight_6_red extends BaseModifier_Plus {
    iLevel: number;
    splash_radius: any;
    splash_damage_percent: any;
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
    Init(params: ModifierTable) {
        this.iLevel = GameFunc.IsValid(this.GetAbilityPlus()) && this.GetAbilityPlus().GetLevel() || 0
        if (this.iLevel > 0 && this.GetCasterPlus().HasScepter()) {
            this.iLevel = this.iLevel + 1
        }
        this.splash_radius = this.GetLevelSpecialValueFor("splash_radius", this.iLevel - 1)
        this.splash_damage_percent = this.GetLevelSpecialValueFor("splash_damage_percent", this.iLevel - 1)
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
            let position = params.target.GetAbsOrigin()
            let targets = AoiHelper.FindEntityInRadius(params.attacker.GetTeamNumber(), position, this.splash_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, 1)
            for (let target of (targets)) {
                if (target != params.target) {
                    let _modifier_dragon_knight_6_green = modifier_dragon_knight_6_green.findIn(params.attacker) as modifier_dragon_knight_6_green;
                    if (GameFunc.IsValid(_modifier_dragon_knight_6_green)) {
                        let ability = this.GetAbilityPlus() as ability6_dragon_knight_elder_dragon_form
                        if (GameFunc.IsValid(this.GetAbilityPlus()) && ability.Corrosive != null) {
                            ability.Corrosive(target)
                        }
                    }
                    let damage_table = {
                        ability: this.GetAbilityPlus(),
                        victim: target,
                        attacker: params.attacker,
                        damage: params.original_damage * this.splash_damage_percent * 0.01,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                        eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_SPELL_CRIT,
                    }
                    BattleHelper.GoApplyDamage(damage_table)
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_dragon_knight_6_blue extends BaseModifier_Plus {
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
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
            let ability = this.GetAbilityPlus() as ability6_dragon_knight_elder_dragon_form
            if (GameFunc.IsValid(this.GetAbilityPlus()) && ability.Frost != null) {
                ability.Frost(params.target)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_dragon_knight_6_frost extends BaseModifier_Plus {
    iLevel: number;
    frost_bonus_movement_speed: any;
    isIllusion: boolean;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return true
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
    OnCreated(params: ModifierTable) {

        if (IsClient()) {
            let hParent = this.GetParentPlus()
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/generic_slowed_cold.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            this.AddParticle(particleID, false, false, -1, false, false)
            particleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_frost.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: hParent
            });

            this.AddParticle(particleID, false, true, 10, false, false)
        }
    }
    Init(params: ModifierTable) {
        this.iLevel = GameFunc.IsValid(this.GetAbilityPlus()) && this.GetAbilityPlus().GetLevel() || 0
        if (this.iLevel > 0 && this.GetCasterPlus().HasScepter()) {
            this.iLevel = this.iLevel + 1
        }
        this.frost_bonus_movement_speed = this.GetLevelSpecialValueFor("frost_bonus_movement_speed", this.iLevel - 1)

        this.isIllusion = this.GetCasterPlus().IsIllusion()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: ModifierTable) {
        if (this.isIllusion) {
            return
        }

        return this.frost_bonus_movement_speed
    }

}
