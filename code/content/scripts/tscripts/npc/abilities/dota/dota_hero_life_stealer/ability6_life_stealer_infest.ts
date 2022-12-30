import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { ability1_life_stealer_rage } from "./ability1_life_stealer_rage";
import { ability2_life_stealer_feast } from "./ability2_life_stealer_feast";

/** dota原技能数据 */
export const Data_life_stealer_infest = { "ID": "5252", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_CUSTOM", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_CUSTOM", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "FightRecapLevel": "1", "AbilitySound": "Hero_LifeStealer.Infest", "AbilityDraftUltShardAbility": "life_stealer_open_wounds", "HasScepterUpgrade": "1", "AbilityCastPoint": "0.2", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_6", "AbilityCooldown": "100 75 50", "AbilityManaCost": "100 150 200", "AbilityCastRange": "150", "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "extra_damage": "0" }, "01": { "var_type": "FIELD_INTEGER", "radius": "700 700 700" }, "02": { "var_type": "FIELD_INTEGER", "damage": "150 275 400" }, "03": { "var_type": "FIELD_INTEGER", "damage_increase_pct": "50" }, "04": { "var_type": "FIELD_INTEGER", "bonus_movement_speed": "15 20 25" }, "05": { "var_type": "FIELD_INTEGER", "bonus_health": "400 800 1200" }, "06": { "var_type": "FIELD_INTEGER", "cooldown_scepter": "20", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_INTEGER", "cast_range_scepter": "500", "RequiresScepter": "1" }, "08": { "var_type": "FIELD_FLOAT", "self_regen": "3 4 5" }, "09": { "var_type": "FIELD_INTEGER", "extra_armor": "0" } } };

@registerAbility()
export class ability6_life_stealer_infest extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "life_stealer_infest";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_life_stealer_infest = Data_life_stealer_infest;
    Init() {
        this.SetDefaultSpecialValue("max_health_pct", [100, 150, 200, 250, 300, 350]);
        this.SetDefaultSpecialValue("inherit_health_pct", 0);
        this.SetDefaultSpecialValue("inherit_attack_pct", 45);
        this.SetDefaultSpecialValue("inherit_ability_pct", 50);
        this.SetDefaultSpecialValue("radius", 600);
        this.SetDefaultSpecialValue("duration", 5);
        this.SetDefaultSpecialValue("scepter_interval", 9);

    }



    CastFilterResultTarget(hTarget: IBaseNpc_Plus) {
        let caster = this.GetCasterPlus()
        if (caster == hTarget) {
            this.errorStr = "dota_hud_error_cant_cast_on_self"
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        if (hTarget.GetTeamNumber() == caster.GetTeamNumber() && hTarget.GetUnitLabel() != "HERO") {
            this.errorStr = "dota_hud_error_only_can_cast_on_hero_building.length"
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        if (hTarget.GetTeamNumber() == caster.GetTeamNumber() && caster.GetPlayerOwnerID() != hTarget.GetPlayerOwnerID()) {
            return UnitFilterResult.UF_FAIL_NOT_PLAYER_CONTROLLED
        }
        if (modifier_life_stealer_6_buff.exist(hTarget)) {
            this.errorStr = "dota_hud_error_already_swallow.length"
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        if (hTarget.IsIllusion() || (hTarget.IsClone && hTarget.IsClone()) || (hTarget.GetUnitLabel && hTarget.GetUnitLabel() == "builder")) {
            this.errorStr = "dota_hud_error_only_can_cast_on_building"
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        return UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, caster.GetTeamNumber())
    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        let radius = this.GetSpecialValueFor("radius")
        let max_health_pct = this.GetSpecialValueFor("max_health_pct") * (1 + hCaster.GetTalentValue("special_bonus_unique_life_stealer_custom_4") * 0.01)
        let duration = this.GetSpecialValueFor("duration")
        let inherit_ability_pct = this.GetSpecialValueFor("inherit_ability_pct")
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        // 音效
        EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_LifeStealer.Infest", hCaster), hCaster)
        if (hTarget.GetTeamNumber() != hCaster.GetTeamNumber()) {
            // 对敌方使用
            // 目标非肉山，宝箱，无尽怪 秒杀
            // if (!hTarget.IsRoshan() && !hTarget.IsPhantomRoshan() && !hTarget.IsGoldWave() && !Spawner.IsEndless() && !hTarget.IsEliteBoss()) {
            //     hTarget.Kill(this, hCaster)
            // }
            // 特效
            modifier_life_stealer_6_particle.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            // AOE伤害
            let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
            let fMaxHealth = hCaster.GetMaxHealth()
            let fDamage = fMaxHealth * max_health_pct * 0.01
            for (let hTarget of (tTarget)) {
                if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
                    let damage_table =
                    {
                        ability: this,
                        attacker: hCaster,
                        victim: hTarget,
                        damage: fDamage,
                        damage_type: this.GetAbilityDamageType()
                    }
                    BattleHelper.GoApplyDamage(damage_table)
                }
            }
        } else {
            // 对友方使用
            if (!hCaster.HasScepter()) {
                // 临时继承一定比例血量，攻击力
                modifier_life_stealer_6_buff.apply(hTarget, hCaster, this, { duration: duration })
                // 施加一次狂暴
                let hLifeStealer1 = ability1_life_stealer_rage.findIn(hCaster)
                if (GameFunc.IsValid(hLifeStealer1) && hLifeStealer1.GetLevel() >= 1 && hLifeStealer1.InheritAbility != null) {
                    hLifeStealer1.InheritAbility(hTarget, inherit_ability_pct, false)
                }
                // 临时吞噬
                modifier_life_stealer_6_swallow.apply(hCaster, hCaster, this, { duration: duration })
            } else {
                // 永久继承一定比例血量，攻击力
                modifier_life_stealer_6_buff.apply(hTarget, hCaster, this, null)
                // 永久获得狂暴效果
                let hLifeStealer1 = ability1_life_stealer_rage.findIn(hCaster)
                if (GameFunc.IsValid(hLifeStealer1) && hLifeStealer1.GetLevel() >= 1 && hLifeStealer1.InheritAbility != null) {
                    hLifeStealer1.InheritAbility(hTarget, inherit_ability_pct, true)
                }
                // 永久获得盛宴效果
                let hLifeStealer4 = ability2_life_stealer_feast.findIn(hCaster)
                if (GameFunc.IsValid(hLifeStealer4) && hLifeStealer4.GetLevel() >= 1 && hLifeStealer4.InheritAbility != null) {
                    hLifeStealer4.InheritAbility(hTarget, inherit_ability_pct)
                }
                // 删除小狗身上的装备
                for (let i = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1; i <= DOTAScriptInventorySlot_t.DOTA_STASH_SLOT_6; i++) {
                    let item = hCaster.GetItemInSlot(i)
                    if (item && item.GetName() != "item_blank") {
                        hCaster.TakeItem(item)
                    }
                }
                // 永久吞噬
                // BuildSystem.RemoveBuilding(hCaster)
            }
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_life_stealer_6"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_life_stealer_6 extends BaseModifier_Plus {
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

            let target = AoiHelper.GetAOEMostTargetsSpellTarget(caster.GetAbsOrigin(),
                range,
                caster.GetTeamNumber(),
                radius,
                null,
                DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
                FindOrder.FIND_CLOSEST)

            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_life_stealer_6_buff extends BaseModifier_Plus {
    inherit_health_pct: number;
    inherit_attack_pct: number;
    fMaxHealth: number;
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
    GetTexture() {
        return "life_stealer_infest"
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        this.inherit_health_pct = this.GetSpecialValueFor("inherit_health_pct") * (1 + hCaster.GetTalentValue("special_bonus_unique_life_stealer_custom_4") * 0.01)
        this.inherit_attack_pct = this.GetSpecialValueFor("inherit_attack_pct") * (1 + hCaster.GetTalentValue("special_bonus_unique_life_stealer_custom_4") * 0.01)
        if (IsServer()) {
            this.fMaxHealth = hCaster.GetMaxHealth()
            this.SetStackCount(hCaster.GetAverageTrueAttackDamage(null))
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_life_stealer/life_stealer_infested_unit.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, true)
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        this.inherit_health_pct = this.GetSpecialValueFor("inherit_health_pct") * (1 + hCaster.GetTalentValue("special_bonus_unique_life_stealer_custom_4") * 0.01)
        this.inherit_attack_pct = this.GetSpecialValueFor("inherit_attack_pct") * (1 + hCaster.GetTalentValue("special_bonus_unique_life_stealer_custom_4") * 0.01)
        if (IsServer()) {
            this.fMaxHealth = hCaster.GetMaxHealth()
            this.SetStackCount(hCaster.GetAverageTrueAttackDamage(null))
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.HEALTH_BONUS)
    G_HEALTH_BONUS() {
        if (IsServer()) {
            return this.fMaxHealth * this.inherit_health_pct * 0.01
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage() {
        return this.GetStackCount() * this.inherit_attack_pct * 0.01
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_life_stealer_6_swallow extends BaseModifier_Plus {
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
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            hParent.AddNoDraw()
        }
    }

    OnDestroy() {
        super.OnDestroy();
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            hParent.StartGesture(GameActivity_t.ACT_DOTA_LIFESTEALER_INFEST_END)
            // 音效
            EmitSoundOnLocationWithCaster(hParent.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_LifeStealer.Consume", hParent), hParent)
            hParent.RemoveNoDraw()
        }
    }
    CheckState() {
        if (IsServer()) {
            return {
                [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
                [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
                [modifierstate.MODIFIER_STATE_DISARMED]: true,
                [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
                [modifierstate.MODIFIER_STATE_MUTED]: true,
                [modifierstate.MODIFIER_STATE_ROOTED]: true,
                [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            }
        }
    }
}

@registerModifier()
export class modifier_life_stealer_6_particle extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_life_stealer/life_stealer_infest_emerge_bloody.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
