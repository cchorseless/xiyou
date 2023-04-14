import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_rooted } from "../../../modifier/modifier_rooted";
import { modifier_truesight } from "../../../modifier/modifier_truesight";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_ember_spirit_1, modifier_ember_spirit_1_particle_ember_spirit_searing_chains_cast, modifier_ember_spirit_1_particle_ember_spirit_searing_chains_start } from "./ability1_ember_spirit_searing_chains";
import { modifier_ember_spirit_2_disarmed, modifier_ember_spirit_2_invulnerability, modifier_ember_spirit_2_marker, modifier_ember_spirit_2_particle_ember_spirit_sleight_of_fist_cast, modifier_ember_spirit_2_particle_ember_spirit_sleightoffist_tgt, modifier_ember_spirit_2_particle_ember_spirit_sleightoffist_trail } from "./ability2_ember_spirit_sleight_of_fist";

/** dota原技能数据 */
export const Data_ember_spirit_fire_remnant = { "ID": "5606", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilitySound": "Hero_EmberSpirit.FireRemnant.Cast", "AbilityDraftPreAbility": "ember_spirit_activate_fire_remnant", "HasShardUpgrade": "1", "HasScepterUpgrade": "1", "AbilityCastRange": "1400", "AbilityCastPoint": "0.0", "AbilityCastAnimation": "ACT_INVALID", "AbilityCooldown": "0.0", "AbilityCharges": "3", "AbilityChargeRestoreTime": "38.0", "AbilityManaCost": "0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "speed_multiplier": "250" }, "02": { "var_type": "FIELD_FLOAT", "AbilityChargeRestoreTime": "", "LinkedSpecialBonus": "special_bonus_unique_ember_spirit_5", "LinkedSpecialBonusOperation": "SPECIAL_BONUS_SUBTRACT" }, "03": { "var_type": "FIELD_INTEGER", "damage": "100 200 300" }, "04": { "var_type": "FIELD_INTEGER", "radius": "450" }, "05": { "var_type": "FIELD_FLOAT", "duration": "45.0" }, "06": { "var_type": "FIELD_FLOAT", "scepter_range_multiplier": "2.5", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_FLOAT", "scepter_speed_multiplier": "2", "RequiresScepter": "1" }, "08": { "var_type": "FIELD_INTEGER", "scepter_max_charges": "5", "RequiresScepter": "1" }, "09": { "var_type": "FIELD_INTEGER", "scepter_mana_cost": "75", "RequiresScepter": "1" } } };

@registerAbility()
export class ability6_ember_spirit_fire_remnant extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ember_spirit_fire_remnant";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ember_spirit_fire_remnant = Data_ember_spirit_fire_remnant;
    Init() {
        this.SetDefaultSpecialValue("attack_percent", [60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("attribute_percent", [60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("speed_multiplier", 250);
        this.SetDefaultSpecialValue("radius", 450);
        this.SetDefaultSpecialValue("scepter_damage_percent", 35);
        this.SetDefaultSpecialValue("shard_bouns_count", 1);

    }


    tRemnant: any[];

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vStartPosition = hCaster.GetAbsOrigin()
        let vPosition = this.GetCursorPosition()
        let vDirection = (vPosition - vStartPosition) as Vector
        vDirection.z = 0
        if (vDirection.Length2D() == 0) { vDirection = Vector(1, 0, 0) }
        let hRemnant = this.GetRemnant()
        hRemnant.SetAbsOrigin(hCaster.GetAbsOrigin())
        modifier_ember_spirit_6.apply(hRemnant, hCaster, this, { vPosition: vPosition })
        for (let i = 0; i <= hRemnant.GetAbilityCount() - 1, 1; i++) {
            let hAbility = hRemnant.GetAbilityByIndex(i)
            if (IsValid(hAbility)) {
                hRemnant.RemoveAbility(hAbility.GetAbilityName())
            }
        }
        // 继承攻击力
        hRemnant.SetBaseDamageMax(0)
        hRemnant.SetBaseDamageMin(0)
        hRemnant.FireSummonned(hCaster)
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_EmberSpirit.FireRemnant.Cast", hCaster))
    }
    GetRemnant() {
        let hRemnant = null
        let shard_bouns_count = this.GetSpecialValueFor("shard_bouns_count")
        if (this.tRemnant == null) {
            this.tRemnant = []
        }
        for (let i = this.tRemnant.length - 1; i >= 0; i--) {
            let Remnant = this.tRemnant[i]
            if (IsValid(Remnant)) {
                if (Remnant.bIsUse == false) {
                    if (hRemnant == null) {
                        Remnant.bIsUse = true
                        Remnant.RemoveNoDraw()
                        hRemnant = Remnant
                    }
                }
                else {
                    shard_bouns_count = shard_bouns_count - 1
                    if (shard_bouns_count < 0 || !this.GetCasterPlus().HasShard()) {
                        if (modifier_ember_spirit_6.exist(Remnant)) {
                            modifier_ember_spirit_6.remove(Remnant);
                            Remnant.bIsUse = false
                            if (modifier_ember_spirit_6_buff_ember_spirit_4.exist(Remnant)) {
                                modifier_ember_spirit_6_buff_ember_spirit_4.remove(Remnant);
                            }
                            if (modifier_ember_spirit_6_enemy_arua_ember_spirit_4.exist(Remnant)) {
                                modifier_ember_spirit_6_enemy_arua_ember_spirit_4.remove(Remnant);
                            }
                            GameFunc.ArrayFunc.ArrayRemove(this.tRemnant, Remnant)
                        }
                    }
                }
            }
        }
        if (hRemnant == null) {
            hRemnant = this.CreateRemnant()
        }
        return hRemnant
    }
    CreateRemnant() {
        let hCaster = this.GetCasterPlus()
        let vStartPosition = hCaster.GetAbsOrigin()
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
        let hRemnant = BaseNpc_Plus.CreateUnitByName(hCaster.GetUnitName(), vStartPosition, hCaster, false)
        // hRemnant.bIsUse = true
        // Attributes.Register(hRemnant)
        modifier_ember_spirit_6_remnant.apply(hRemnant, hCaster, this, null)
        table.insert(this.tRemnant, hRemnant)
        return hRemnant
    }
    OnOwnerDied() {
        if (this.tRemnant != null) {
            for (let i = this.tRemnant.length - 1; i >= 0; i--) {
                let hRemnant = this.tRemnant[i]
                if (IsValid(hRemnant)) {
                    UTIL_Remove(hRemnant)
                }
                table.remove(this.tRemnant, i)
            }
            this.tRemnant = null
        }
    }
    Ability1(sourcehAbility: IBaseAbility_Plus, hRemnant: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        if (IsValid(hRemnant)) {
            let radius = sourcehAbility.GetSpecialValueFor("radius")
            let unit_count = sourcehAbility.GetSpecialValueFor("unit_count")
            let duration = sourcehAbility.GetSpecialValueFor("duration")
            modifier_ember_spirit_1_particle_ember_spirit_searing_chains_cast.apply(hRemnant, hCaster, sourcehAbility, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_EmberSpirit.SearingChains.Cast", hCaster))

            let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hRemnant.GetAbsOrigin(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER)
            let n = 0
            for (let target of (targets)) {
                modifier_ember_spirit_1_debuff_ember_spirit_4.apply(target, hCaster, sourcehAbility, { duration: duration * target.GetStatusResistanceFactor(hCaster), ability_4_entindex: this.entindex() })
                modifier_ember_spirit_1_particle_ember_spirit_searing_chains_start.apply(target, hRemnant, sourcehAbility, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
                EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_EmberSpirit.SearingChains.Target", hCaster), hRemnant)
                n = n + 1
                if (n >= unit_count) {
                    break
                }
            }
        }
    }
    Ability2(sourcehAbility: IBaseAbility_Plus, hRemnant: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        if (IsValid(hRemnant)) {
            let position = this.GetCursorPosition()
            let radius = this.GetSpecialValueFor("radius")
            modifier_ember_spirit_2_particle_ember_spirit_sleight_of_fist_cast.applyThinker(position, hCaster, sourcehAbility,
                { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, hCaster.GetTeamNumber(), false)
            hRemnant.InterruptMotionControllers(true)
            // 残焰无影拳伤害延迟一点
            GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
                modifier_ember_spirit_2_buff_ember_spirit_4.apply(hCaster, hRemnant, sourcehAbility, { target_position: position, ability_4_entindex: this.entindex() })
                hRemnant.EmitSound(ResHelper.GetSoundReplacement("Hero_EmberSpirit.SleightOfFist.Cast", hCaster))
            }))
        }
    }
    Ability3(sourceAbility: IBaseAbility_Plus, hRemnant: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        if (IsValid(hRemnant)) {
            let duration = sourceAbility.GetSpecialValueFor("duration")
            modifier_ember_spirit_6_buff_ember_spirit_4.apply(hRemnant, hCaster, sourceAbility, { duration: duration, ability_4_entindex: this.entindex() })
            hRemnant.EmitSound(ResHelper.GetSoundReplacement("Hero_EmberSpirit.FlameGuard.Cast", hCaster))
        }
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_ember_spirit_6 extends BaseModifier_Plus {
    move_speed: number;
    fAttackTimeRecord: number;
    iPhase: string;
    vTargetPosition: Vector;
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
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let speed_multiplier = this.GetSpecialValueFor("speed_multiplier")
        this.move_speed = hCaster.GetMoveSpeedModifier(hCaster.GetBaseMoveSpeed(), false) * speed_multiplier * 0.01
        if (IsServer()) {
            this.vTargetPosition = GFuncVector.StringToVector(params.vPosition)
            this.StartIntervalThink(((this.vTargetPosition - hParent.GetAbsOrigin()) as Vector).Length() / this.move_speed)
            this.fAttackTimeRecord = GameRules.GetGameTime()
            this.iPhase = "moving"
            GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
                hParent.MoveToPosition(this.vTargetPosition)
            }))
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/ember_spirit_4_fire_remnant.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ember_spirit/ember_spirit_4.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }

    BeDestroy() {

        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            this.GetParentPlus().AddNoDraw()
            if (IsValid(hCaster)) {
                this.GetParentPlus().SetAbsOrigin(hCaster.GetAbsOrigin())
            }
            if (modifier_rooted.exist(this.GetParentPlus())) {
                modifier_rooted.remove(this.GetParentPlus());
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            if (!IsValid(hCaster)) {
                this.Destroy()
                return
            }
            if (this.iPhase == "moving") {
                this.iPhase = "stand"
                modifier_rooted.apply(hParent, hCaster, null, null)
                FindClearSpaceForUnit(hParent, this.vTargetPosition, false)
            }
            if (this.iPhase == "stand") {
                let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), hParent.Script_GetAttackRange() + hParent.GetHullRadius(), null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)
                let target = targets[0]
                if (IsValid(target)) {
                    if (GameRules.GetGameTime() > this.fAttackTimeRecord) {
                        ExecuteOrderFromTable(
                            {
                                UnitIndex: hParent.entindex(),
                                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                                TargetIndex: target.entindex()
                            }
                        )
                    } else {
                        if (!hParent.IsIdle()) {
                            hParent.Stop()
                        }
                    }
                } else {
                    if (!hParent.IsIdle()) {
                        hParent.Stop()
                    }
                }
            }
            this.StartIntervalThink(0.1)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: IModifierTable) {
        if (IsValid(this.GetCasterPlus())) {
            return this.GetCasterPlus().GetIncreasedAttackSpeed() * 100
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE)
    GetMoveSpeed_Absolute(params: IModifierTable) {
        return this.move_speed
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_AUTOATTACK)
    Get_DisableAutoAttack() {
        return 1
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_START)
    On_AbilityStart(params: ModifierAbilityEvent) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus() as ability6_ember_spirit_fire_remnant
        if (!IsValid(hCaster)) {
            this.Destroy()
            return
        }
        // if (hCaster.GetBuilding != null) {
        //     let hbuilding = hCaster.GetBuilding()
        //     let ability = params.ability as IBaseAbility_Plus
        //     if (params.unit != null && params.unit == hCaster && hCaster.GetUnitLabel() != "builder") {
        //         if (params.ability == null || params.ability == hAbility || params.ability.IsItem() || !params.ability.ProcsMagicStick() || !params.unit.IsAlive()) {
        //             return
        //         }
        //         if (params.ability.GetAbilityName() == "ember_spirit_1" && hbuilding.GetStar() >= 2) {
        //             if (hAbility.Ability1) {
        //                 hAbility.Ability1(ability, this.GetParentPlus())
        //             }
        //         }
        //         if (params.ability.GetAbilityName() == "ember_spirit_2" && hbuilding.GetStar() >= 3) {
        //             if (hAbility.Ability2) {
        //                 hAbility.Ability2(ability, this.GetParentPlus())
        //             }
        //         }
        //         if (params.ability.GetAbilityName() == "ember_spirit_6" && hbuilding.GetStar() >= 4) {
        //             if (hAbility.Ability3) {
        //                 hAbility.Ability3(ability, this.GetParentPlus())
        //             }
        //         }
        //     }
        // }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        if (params.attacker == this.GetParentPlus()) {
            this.fAttackTimeRecord = GameRules.GetGameTime() + params.attacker.TimeUntilNextAttack()
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.attacker == this.GetParentPlus()) {
            let ability = this.GetAbilityPlus()
            if (!IsValid(ability)) {
                return
            }

            let hCaster = this.GetCasterPlus()

            let vPosition = hCaster.GetAbsOrigin()

            hCaster.SetAbsOrigin(this.GetParentPlus().GetAbsOrigin())
            if (hCaster.HasScepter()) {
                modifier_scepter_amplify_damage.apply(hCaster, hCaster, this.GetAbilityPlus(), null)
            }
            BattleHelper.Attack(hCaster, params.target, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE)
            modifier_scepter_amplify_damage.remove(hCaster);

            hCaster.SetAbsOrigin(vPosition)

        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ember_spirit_6_remnant extends BaseModifier_Plus {
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
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.StartIntervalThink(0)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_SELECT]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_MOVE_TO]: true,
            [modifierstate.MODIFIER_STATE_UNTARGETABLE]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            if (!modifier_ember_spirit_6.exist(hParent)) {
                // 藏起来的那个别A 不能用缴械状态，会有提示无法攻击
                hParent.Stop()
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ember_spirit_1_debuff_ember_spirit_4 extends BaseModifier_Plus {
    damage: number;
    agility: number;
    tick_interval: number;
    armor_reduction: number;
    duration: number;
    damage_type: DAMAGE_TYPES;
    attribute_percent: any;
    ability_4: IBaseAbility_Plus;
    modifier_truesight: IBaseModifier_Plus;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        if (!IsValid(hCaster)) {
            this.Destroy()
            return
        }
        this.damage = this.GetSpecialValueFor("damage")
        this.agility = this.GetSpecialValueFor("agility")
        this.tick_interval = this.GetSpecialValueFor("tick_interval")
        if (IsServer()) {
            let bStar_5 = false
            // 客户端没有GetBuilding
            // if (hCaster.GetBuilding != null) {
            //     let hbuilding = hCaster.GetBuilding()
            //     if (hbuilding != null && hbuilding.GetStar() >= 5) {
            //         bStar_5 = true
            //     }
            // }
            this.duration = (hCaster.HasTalent("special_bonus_unique_ember_spirit_custom_8") && bStar_5) && hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_8") + this.GetSpecialValueFor("duration") || this.GetSpecialValueFor("duration")
            this.armor_reduction = (hCaster.HasTalent("special_bonus_unique_ember_spirit_custom") && bStar_5) && hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom") || 0
            this.SetStackCount(this.armor_reduction)
            this.ability_4 = EntIndexToHScript(params.ability_4_entindex) as IBaseAbility_Plus
            this.attribute_percent = this.ability_4.GetSpecialValueFor("attribute_percent")
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
            this.StartIntervalThink(this.tick_interval)

            this.modifier_truesight = modifier_truesight.apply(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), { duration: this.GetDuration() }) as IBaseModifier_Plus
        } else {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ember_spirit/ember_spirit_searing_chains_debuff.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
    BeRefresh(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        if (!IsValid(hCaster)) {
            this.Destroy()
            return
        }
        this.damage = this.GetSpecialValueFor("damage")
        this.agility = this.GetSpecialValueFor("agility")
        this.tick_interval = this.GetSpecialValueFor("tick_interval")
        if (IsServer()) {
            let bStar_5 = false
            // if (hCaster.GetBuilding != null) {
            //     let hbuilding = hCaster.GetBuilding()
            //     if (hbuilding != null && hbuilding.GetStar() >= 5) {
            //         bStar_5 = true
            //     }
            // }
            this.duration = (hCaster.HasTalent("special_bonus_unique_ember_spirit_custom_8") && bStar_5) && hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_8") + this.GetSpecialValueFor("duration") || this.GetSpecialValueFor("duration")
            this.armor_reduction = (hCaster.HasTalent("special_bonus_unique_ember_spirit_custom") && bStar_5) && hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom") || 0
            this.SetStackCount(this.armor_reduction)
            this.ability_4 = EntIndexToHScript(params.ability_4_entindex) as IBaseAbility_Plus
            this.attribute_percent = this.ability_4.GetSpecialValueFor("attribute_percent")
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
        }
    }
    BeDestroy() {

        if (IsServer()) {
            if (IsValid(this.modifier_truesight)) {
                this.modifier_truesight.Destroy()
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            if (!IsValid(hCaster) || !hCaster.IsAlive()) {
                this.Destroy()
                return
            }
            let iDamage = this.damage * this.tick_interval + this.agility * hCaster.GetAgility() * this.attribute_percent * 0.01
            if (hCaster.HasScepter()) {
                iDamage = iDamage * (1 + this.ability_4.GetSpecialValueFor("scepter_damage_percent") * 0.01)
            }
            let damage_table = {
                ability: this.GetAbilityPlus(),
                victim: this.GetParentPlus(),
                attacker: hCaster,
                damage: iDamage,
                damage_type: this.damage_type,
                extra_flags: BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_DOT,
            }
            BattleHelper.GoApplyDamage(damage_table)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    G_PHYSICAL_ARMOR_BONUS() {
        return -this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ember_spirit_2_buff_ember_spirit_4 extends BaseModifier_Plus {
    bStar_5: boolean;
    radius: number;
    bonus_damage: number;
    attack_interval: number;
    vStartPosition: Vector;
    targets: IBaseNpc_Plus[];
    ability_4: IBaseAbility_Plus;
    particleID: ParticleID;
    isHero: boolean;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetParentPlus()
        if (!IsValid(hCaster)) {
            this.Destroy()
            return
        }
        this.bStar_5 = false
        // if (hCaster.GetBuilding != null) {
        //     let hbuilding = hCaster.GetBuilding()
        //     if (hbuilding != null && hbuilding.GetStar() >= 5) {
        //         this.bStar_5 = true
        //     }
        // }
        let extra_bonus_damage = (hCaster.HasTalent("special_bonus_unique_ember_spirit_custom_3") && this.bStar_5) && hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_3") || 0
        this.radius = this.GetSpecialValueFor("radius")
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage") + extra_bonus_damage
        this.attack_interval = this.GetSpecialValueFor("attack_interval")
        if (IsServer()) {
            let target_position = GFuncVector.StringToVector(params.target_position)
            this.ability_4 = EntIndexToHScript(params.ability_4_entindex) as IBaseAbility_Plus
            let RemnantCaster = this.GetCasterPlus()

            this.vStartPosition = RemnantCaster.GetAbsOrigin()
            this.targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), target_position, this.radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, 0)

            if (this.targets.length > 0) {
                modifier_ember_spirit_2_invulnerability.apply(RemnantCaster, RemnantCaster, this.GetAbilityPlus(), null)
                modifier_ember_spirit_2_disarmed.apply(RemnantCaster, RemnantCaster, this.GetAbilityPlus(), null)

                this.particleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_ember_spirit/ember_spirit_sleight_of_fist_caster.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: null
                });

                ParticleManager.SetParticleControl(this.particleID, 0, this.vStartPosition)
                ParticleManager.SetParticleControlEnt(this.particleID, 1, hCaster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, this.vStartPosition, true)
                ParticleManager.SetParticleControlForward(this.particleID, 1, RemnantCaster.GetForwardVector())
                this.AddParticle(this.particleID, false, false, -1, false, false)

                for (let target of (this.targets)) {

                    modifier_ember_spirit_2_marker.apply(target, hCaster, this.GetAbilityPlus(), null)
                }

                this.OnIntervalThink()
                this.StartIntervalThink(this.attack_interval)
            } else {
                this.Destroy()
            }
        }
    }
    BeRefresh(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        if (!IsValid(hCaster)) {
            this.Destroy()
            return
        }
        this.bStar_5 = false
        // if (hCaster.GetBuilding != null) {
        //     let hbuilding = hCaster.GetBuilding()
        //     if (hbuilding != null && hbuilding.GetStar() >= 5) {
        //         this.bStar_5 = true
        //     }
        // }
        if (IsServer()) {
            let extra_bonus_damage = (hCaster.HasTalent("special_bonus_unique_ember_spirit_custom_3") && this.bStar_5) && hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_3") || 0
            this.ability_4 = EntIndexToHScript(params.ability_4_entindex) as IBaseAbility_Plus
            this.radius = this.GetSpecialValueFor("radius")
            this.bonus_damage = this.GetSpecialValueFor("bonus_damage") + extra_bonus_damage
            this.attack_interval = this.GetSpecialValueFor("attack_interval")
        }
    }
    BeDestroy() {

        if (IsServer()) {
            let hCaster = this.GetParentPlus()
            let RemnantCaster = this.GetCasterPlus()

            modifier_ember_spirit_2_particle_ember_spirit_sleightoffist_trail.applyThinker(this.vStartPosition, RemnantCaster, this.GetAbilityPlus(),
                { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, hCaster.GetTeamNumber(), false)

            RemnantCaster.SetAbsOrigin(this.vStartPosition)

            modifier_ember_spirit_2_invulnerability.remove(RemnantCaster);
            modifier_ember_spirit_2_disarmed.remove(RemnantCaster);

            for (let i = this.targets.length - 1; i >= 0; i--) {
                let _target = this.targets[i]
                if (IsValid(_target)) {
                    modifier_ember_spirit_2_marker.remove(_target);
                }
                table.remove(this.targets, i)
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetParentPlus()
            let RemnantCaster = this.GetCasterPlus()
            let vCasterPosition = RemnantCaster.GetAbsOrigin()

            let target

            for (let i = this.targets.length - 1; i >= 0; i--) {
                let _target = this.targets[i]
                table.remove(this.targets, i)
                if (IsValid(_target)) {
                    modifier_ember_spirit_2_marker.remove(_target);
                    if (UnitFilter(_target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, hCaster.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                        target = _target
                        break
                    }
                }
            }

            if (target == null) {
                this.Destroy()
                return
            }

            let vTargetPosition = target.GetAbsOrigin()
            let vDirection = (vTargetPosition - this.vStartPosition) as Vector
            vDirection.z = 0

            let vPosition = (vTargetPosition - vDirection.Normalized() * 50) as Vector

            RemnantCaster.SetAbsOrigin(vPosition)
            modifier_ember_spirit_2_particle_ember_spirit_sleightoffist_trail.applyThinker(vPosition, RemnantCaster, this.GetAbilityPlus(),
                { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, hCaster.GetTeamNumber(), false)

            modifier_ember_spirit_2_particle_ember_spirit_sleightoffist_tgt.apply(target, RemnantCaster, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

            modifier_ember_spirit_2_disarmed.remove(RemnantCaster);
            if (!hCaster.IsDisarmed()) {
                this.isHero = target.IsConsideredHero()

                if (this.bStar_5) {
                    for (let i = 1; i <= hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_5") - 1; i++) {
                        BattleHelper.Attack(RemnantCaster, target, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE)
                    }
                }
                BattleHelper.Attack(RemnantCaster, target, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE)

                this.isHero = false
            }
            modifier_ember_spirit_2_disarmed.apply(RemnantCaster, RemnantCaster, this.GetAbilityPlus(), null)

            EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_EmberSpirit.SleightOfFist.Damage", hCaster), RemnantCaster)

            let modifier = modifier_ember_spirit_1.findIn(hCaster) as modifier_ember_spirit_1;
            if (modifier) {
                modifier.OnIntervalThink()
            }
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_TELEPORTED)
    OnTeleported(params: IModifierTable) {
        if (IsServer() && params.unit == this.GetParentPlus()) {
            this.vStartPosition = params.new_pos
            ParticleManager.SetParticleControl(this.particleID, 0, this.vStartPosition)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        if (IsServer()) {
            return this.bonus_damage * (1 + this.ability_4.GetSpecialValueFor("scepter_damage_percent") * 0.01)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ember_spirit_6_buff_ember_spirit_4 extends BaseModifier_Plus {
    bonus_attack_damage_per_agi: any;
    radius: any;
    damage_per_second: any;
    tick_interval: any;
    is_aura: any;
    aura_radius: any;
    bStar_5: boolean;
    ability_4: IBaseAbility_Plus;
    attribute_percent: number;
    damage_type: DAMAGE_TYPES;
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
    IsAura() {
        return this.is_aura
    }
    GetAuraRadius() {
        return this.aura_radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
    }
    GetAura() {
        return "modifier_ember_spirit_6_friend_ember_spirit_4"
    }
    GetAuraEntityReject(hTarget: IBaseNpc_Plus) {
        return hTarget == this.GetParentPlus()
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let ReManatCaster = this.GetParentPlus()
        if (!IsValid(hCaster)) {
            this.Destroy()
            return
        }
        this.bStar_5 = false
        // if (hCaster.GetBuilding != null) {
        //     let hbuilding = hCaster.GetBuilding()
        //     if (hbuilding != null && hbuilding.GetStar() >= 5) {
        //         this.bStar_5 = true
        //     }
        // }
        this.radius = this.GetSpecialValueFor("radius")
        this.is_aura = (hCaster.HasTalent("special_bonus_unique_ember_spirit_custom_4") && this.bStar_5)
        this.aura_radius = this.is_aura && this.radius || 0
        let extra_bonus_attack_damage_per_agi = (hCaster.HasTalent("special_bonus_unique_ember_spirit_custom_2") && this.bStar_5) && hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_2") || 0
        this.bonus_attack_damage_per_agi = this.GetSpecialValueFor("bonus_attack_damage_per_agi") + extra_bonus_attack_damage_per_agi
        this.tick_interval = this.GetSpecialValueFor("tick_interval")
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second")
        if (IsServer()) {
            this.ability_4 = EntIndexToHScript(params.ability_4_entindex) as IBaseAbility_Plus
            this.attribute_percent = this.ability_4.GetSpecialValueFor("attribute_percent")
            if (hCaster.HasTalent("special_bonus_unique_ember_spirit_custom_6") && this.bStar_5) {
                modifier_ember_spirit_6_enemy_arua_ember_spirit_4.apply(ReManatCaster, hCaster, this.GetAbilityPlus(), { duration: this.GetDuration() })
            }
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
            ReManatCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_EmberSpirit.FlameGuard.Loop", hCaster))

            this.StartIntervalThink(this.tick_interval)
            this.bonus_attack_damage_per_agi = this.bonus_attack_damage_per_agi * hCaster.GetAgility() * this.attribute_percent * 0.01
            this.SetStackCount(this.bonus_attack_damage_per_agi)
        } else {
            this.bonus_attack_damage_per_agi = this.GetStackCount()
            this.SetStackCount(0)
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ember_spirit/ember_spirit_flameguard.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: ReManatCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, ReManatCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(this.radius, this.radius, this.radius))
            ParticleManager.SetParticleControl(iParticleID, 3, Vector(ReManatCaster.GetModelRadius(), 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    BeRefresh(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let ReManatCaster = this.GetParentPlus()
        if (!IsValid(hCaster)) {
            this.Destroy()
            return
        }
        this.bStar_5 = false
        // if (hCaster.GetBuilding != null) {
        //     let hbuilding = hCaster.GetBuilding()
        //     if (hbuilding != null && hbuilding.GetStar() >= 5) {
        //         this.bStar_5 = true
        //     }
        // }
        this.radius = this.GetSpecialValueFor("radius")
        this.is_aura = (hCaster.HasTalent("special_bonus_unique_ember_spirit_custom_4") && this.bStar_5)
        this.aura_radius = this.is_aura && this.radius || 0
        let extra_bonus_attack_damage_per_agi = (hCaster.HasTalent("special_bonus_unique_ember_spirit_custom_2") && this.bStar_5) && hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_2") || 0
        this.bonus_attack_damage_per_agi = this.GetSpecialValueFor("bonus_attack_damage_per_agi") + extra_bonus_attack_damage_per_agi
        this.tick_interval = this.GetSpecialValueFor("tick_interval")
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second")
        if (IsServer()) {
            this.ability_4 = EntIndexToHScript(params.ability_4_entindex) as IBaseAbility_Plus
            this.attribute_percent = this.ability_4.GetSpecialValueFor("attribute_percent")
            if (hCaster.HasTalent("special_bonus_unique_ember_spirit_custom_6") && this.bStar_5) {
                modifier_ember_spirit_6_enemy_arua_ember_spirit_4.apply(ReManatCaster, hCaster, this.GetAbilityPlus(), { duration: this.GetDuration() })
            }
            this.bonus_attack_damage_per_agi = this.bonus_attack_damage_per_agi * hCaster.GetAgility() * this.attribute_percent * 0.01
            this.SetStackCount(this.bonus_attack_damage_per_agi)
        } else {
            this.bonus_attack_damage_per_agi = this.GetStackCount()
            this.SetStackCount(0)
        }
    }
    BeDestroy() {

        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let ReManatCaster = this.GetParentPlus()
            if (IsValid(hCaster)) {
                ReManatCaster.StopSound(ResHelper.GetSoundReplacement("Hero_EmberSpirit.FlameGuard.Loop", hCaster))
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let ReManatCaster = this.GetParentPlus()
            if (IsValid(hCaster)) {
                let hAbility = this.GetAbilityPlus()
                let radius = this.radius
                let iDamage = this.damage_per_second * this.tick_interval + hCaster.GetAgility() * this.GetSpecialValueFor("ageility") * this.attribute_percent * 0.01
                if (this.GetCasterPlus().HasScepter()) {
                    iDamage = iDamage * (1 + this.ability_4.GetSpecialValueFor("scepter_damage_percent") * 0.01)
                }
                let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), ReManatCaster.GetAbsOrigin(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0)
                for (let hTarget of (tTargets)) {

                    let tDamageTable = {
                        ability: hAbility,
                        victim: hTarget,
                        attacker: hCaster,
                        damage: iDamage,
                        damage_type: this.damage_type,
                        extra_flags: BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_DOT,
                    }
                    BattleHelper.GoApplyDamage(tDamageTable)
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        return this.bonus_attack_damage_per_agi
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ember_spirit_6_friend_ember_spirit_4 extends BaseModifier_Plus {
    bouns_attack_damage: any;
    bStar_5: boolean;
    bonus_attack_damage_per_agi: number;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    Init(params: IModifierTable) {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus().GetSource()
            if (!IsValid(hCaster)) {
                this.Destroy()
                return
            }
            this.bStar_5 = false
            // if (hCaster.GetBuilding != null) {
            //     let hbuilding = hCaster.GetBuilding()
            //     if (hbuilding != null && hbuilding.GetStar() >= 5) {
            //         this.bStar_5 = true
            //     }
            // }
            let extra_bonus_attack_damage_per_agi = (hCaster.HasTalent("special_bonus_unique_ember_spirit_custom_2") && this.bStar_5) && hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_2") || 0
            this.bonus_attack_damage_per_agi = this.GetSpecialValueFor("bonus_attack_damage_per_agi") + extra_bonus_attack_damage_per_agi
            let attribute_percent = this.GetSpecialValueFor("attribute_percent")
            this.bouns_attack_damage = this.bonus_attack_damage_per_agi * hCaster.GetAgility() * hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_4") * 0.01 * attribute_percent * 0.01
            this.SetStackCount(this.bouns_attack_damage)
        } else {
            this.bouns_attack_damage = this.GetStackCount()
            this.SetStackCount(0)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        return this.bouns_attack_damage
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_ember_spirit_6_enemy_arua_ember_spirit_4 extends BaseModifier_Plus {
    radius: any;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    IsAura() {
        return true
    }
    GetAura() {
        return "modifier_ember_spirit_6_enemy_arua_debuff_ember_spirit_4"
    }
    GetAuraRadius() {
        return this.radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
    }
    Init(params: IModifierTable) {
        this.radius = this.GetSpecialValueFor("radius")
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_ember_spirit_6_enemy_arua_debuff_ember_spirit_4 extends BaseModifier_Plus {
    bonus_magic_resistance: any;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetAuraOwner() as IBaseNpc_Plus
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (IsValid(hCaster) && IsValid(hCaster.GetSource())) {
                this.bonus_magic_resistance = hCaster.GetSource().GetTalentValue("special_bonus_unique_ember_spirit_custom_6")
                this.SetStackCount(this.bonus_magic_resistance)
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    CC_MAGICAL_ARMOR_BONUS() {
        return this.GetStackCount()
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_scepter_amplify_damage extends BaseModifier_Plus {
    scepter_damage_percent: number;
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
    Init(params: IModifierTable) {
        this.scepter_damage_percent = this.GetSpecialValueFor("scepter_damage_percent")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    CC_OUTGOING_DAMAGE_PERCENTAGE() {
        return this.scepter_damage_percent
    }
}
