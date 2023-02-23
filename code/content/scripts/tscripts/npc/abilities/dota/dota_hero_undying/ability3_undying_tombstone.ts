
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_undying_6_buff } from "./ability6_undying_flesh_golem";

/** dota原技能数据 */
export const Data_undying_tombstone = { "ID": "5444", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "FightRecapLevel": "1", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilitySound": "Hero_Undying.Tombstone", "AbilityCastAnimation": "ACT_DOTA_UNDYING_TOMBSTONE", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastRange": "600", "AbilityCastPoint": "0.45 0.45 0.45 0.45", "AbilityCooldown": "85 80 75 70", "AbilityManaCost": "120 130 140 150", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "tombstone_health": "8 10 12 14" }, "02": { "var_type": "FIELD_INTEGER", "hits_to_destroy_tooltip": "4 5 6 7", "LinkedSpecialBonus": "special_bonus_unique_undying_5" }, "03": { "var_type": "FIELD_FLOAT", "duration": "30.0" }, "04": { "var_type": "FIELD_INTEGER", "radius": "1200" }, "05": { "var_type": "FIELD_INTEGER", "health_threshold_pct_tooltip": "40" }, "06": { "var_type": "FIELD_FLOAT", "zombie_interval": "4.0 3.5 3.0 2.5" } } };

@registerAbility()
export class ability3_undying_tombstone extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "undying_tombstone";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_undying_tombstone = Data_undying_tombstone;
    Init() {
        this.SetDefaultSpecialValue("zombie_duration", 7);
        this.SetDefaultSpecialValue("zombie_radius", 500);
        this.SetDefaultSpecialValue("zombie_base_damage_factor", [1, 2, 3, 5, 7]);
        this.SetDefaultSpecialValue("health_threshold_pct_tooltip", 40);
        this.SetDefaultSpecialValue("increase_attack_damage", [2, 3, 4, 6, 8]);
        this.SetDefaultSpecialValue("duration", 3);
        this.SetDefaultSpecialValue("max_stack", 5);
        this.SetDefaultSpecialValue("tomb_stone_max_distance", 1000);

    }


    Precache(context: any) {
        PrecacheUnitByNameSync("npc_dota_unit_tombstone", context, -1)
        PrecacheUnitByNameSync("npc_dota_unit_undying_zombie_custom", context, -1)
        PrecacheUnitByNameSync("npc_dota_unit_undying_zombie_torso_custom", context, -1)
    }
    GetIntrinsicModifierName() {
        return "modifier_undying_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_undying_3 extends BaseModifier_Plus {
    tomb_stone_max_distance: number;
    hTombStone: any[];
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
    CreateTombStone(index: number) {
        let hParent = this.GetParentPlus()
        let hHero = PlayerResource.GetSelectedHeroEntity(hParent.GetPlayerOwnerID())
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hParent) || !GameFunc.IsValid(hHero) || !GameFunc.IsValid(hAbility)) {
            return
        }
        let playerID = hParent.GetPlayerOwnerID()
        let iTeamNum = hParent.GetTeamNumber()
        let vParentPos = hParent.GetAbsOrigin()
        // 最优先是怪最多的地方
        let position = AoiHelper.GetAOEMostTargetsPosition(vParentPos, this.tomb_stone_max_distance, iTeamNum, this.GetSpecialValueFor("zombie_radius"), null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)
        // 这种情况一般都是还没出怪的时候
        if (position == vec3_invalid) {
            let entiSpanwer = Entities.FindByName(null, "player_" + playerID + "_spawner")
            //  优先放在出怪口
            if (GameFunc.IsValid(entiSpanwer) && ((vParentPos - entiSpanwer.GetAbsOrigin()) as Vector).Length2D() <= this.tomb_stone_max_distance) {
                let radius = this.GetSpecialValueFor("zombie_radius")
                let vectors = [
                    Vector(- radius, 0, 0),
                    Vector(0, radius, 0),
                    Vector(0, -radius, 0),
                    Vector(radius, 0, 0)
                ]
                position = entiSpanwer.GetAbsOrigin() + vectors[playerID + 1] as Vector
            } else {
                //  第一个转弯口
                let corner_1 = Entities.FindByName(null, "corner_" + playerID + "_1")
                if (GameFunc.IsValid(corner_1) && ((vParentPos - corner_1.GetAbsOrigin()) as Vector).Length2D() <= this.tomb_stone_max_distance) {
                    position = corner_1.GetAbsOrigin()
                }
            }
        }

        if (position == vec3_invalid) {
            position = (hParent.GetAbsOrigin() + RandomVector(200) as Vector)
        }
        if (!GameFunc.IsValid(this.hTombStone[index])) {
            this.hTombStone[index] = CreateUnitByName("npc_dota_unit_tombstone", position as Vector, false, hHero, hHero, iTeamNum)
            this.hTombStone[index].SetForwardVector(Vector(0, -1, 0))
            modifier_undying_3_aura.apply(this.hTombStone[index], hParent, hAbility, null)
            undefined
            this.hTombStone[index].AddAbility("undying_3_teleport").SetLevel(1)
            this.hTombStone[index].SetControllableByPlayer(playerID, true)
            this.hTombStone[index].FireSummonned(hParent)
        }
    }
    BeCreated(params: IModifierTable) {

        this.tomb_stone_max_distance = this.GetSpecialValueFor("tomb_stone_max_distance")
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hHero = PlayerResource.GetSelectedHeroEntity(hParent.GetPlayerOwnerID())
            let hAbility = this.GetAbilityPlus()

            if (!GameFunc.IsValid(hParent) || !GameFunc.IsValid(hHero) || !GameFunc.IsValid(hAbility)) {
                this.Destroy()
                return
            }
            this.hTombStone = []
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    BeDestroy() {

        if (IsServer()) {
            if (this.hTombStone != null && GameFunc.IsValid(this.hTombStone[0])) {
                this.hTombStone[0].ForceKill(false)
            }
            if (this.hTombStone != null && GameFunc.IsValid(this.hTombStone[2])) {
                this.hTombStone[2].ForceKill(false)
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
            let caster = ability.GetCasterPlus()
            if (!GameFunc.IsValid(caster)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }
            if (!GameFunc.IsValid(this.hTombStone[0])) {
                this.CreateTombStone(1)
            }
            if (GameFunc.IsValid(this.hTombStone[2])) {
                this.hTombStone[2].ForceKill(false)
            }
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: IModifierTable) {
        if (!GameFunc.IsValid(params.target)) { return }
        if (params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && this.GetParentPlus().HasTalent("special_bonus_unique_undying_custom_2") && !params.attacker.IsRangedAttacker() && !params.attacker.IsIllusion()) {
            if (!BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                let sParticlePath = ResHelper.GetParticleReplacement("particles/items_fx/battlefury_cleave.vpcf", params.attacker)
                let iParticleID = ResHelper.CreateParticle({
                    resPath: sParticlePath,
                    resNpc: null,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: params.attacker
                });

                let n = 0
                let cleave_starting_width = this.GetParentPlus().GetTalentValue("special_bonus_unique_undying_custom_2", "cleave_starting_width")
                let cleave_ending_width = this.GetParentPlus().GetTalentValue("special_bonus_unique_undying_custom_2", "cleave_ending_width")
                let cleave_distance = this.GetParentPlus().GetTalentValue("special_bonus_unique_undying_custom_2", "cleave_distance")
                AoiHelper.DoCleaveAction(params.attacker, params.target, cleave_starting_width, cleave_ending_width, cleave_distance, (hTarget) => {
                    let tDamageTable = {
                        ability: this.GetAbilityPlus(),
                        victim: hTarget,
                        attacker: params.attacker,
                        damage: params.original_damage * this.GetParentPlus().GetTalentValue("special_bonus_unique_undying_custom_2") * 0.01,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_USE_COMBAT_PROFICIENCY,
                        eom_flags: BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_CLEAVE + BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_NO_SPELL_CRIT,
                    }
                    BattleHelper.GoApplyDamage(tDamageTable)
                    n = n + 1
                    ParticleManager.SetParticleControlEnt(iParticleID, n + 1, hTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
                })
                ParticleManager.SetParticleControl(iParticleID, 1, Vector(2, 17, n))
                ParticleManager.ReleaseParticleIndex(iParticleID)

                params.attacker.EmitSound("DOTA_Item.BattleFury")
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// -墓碑光环
@registerModifier()
export class modifier_undying_3_aura extends BaseModifier_Plus {
    zombie_radius: number;
    zombie_duration: number;
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
    AllowIllusionDuplicate() {
        return false
    }
    GetEffectName() {
        return ResHelper.GetParticleReplacement("particles/units/heroes/hero_undying/undying_tombstone_ambient.vpcf", this.GetCasterPlus())
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    IsAura() {
        return true
    }
    GetAuraRadius() {
        return this.zombie_radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraDuration() {
        return this.zombie_duration
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
    }
    GetAura() {
        return "modifier_undying_3_aura_effect"
    }
    Init(params: IModifierTable) {
        this.zombie_radius = this.GetSpecialValueFor("zombie_radius")
        this.zombie_duration = this.GetSpecialValueFor("zombie_duration")
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE)
    GetMoveSpeedBonus_Percentage(tParams: any) {
        return 1
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING)
    GetDisableTurning(params: IModifierTable) {
        return 1
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    GetModelChange(params: IModifierTable) {
        return ResHelper.GetModelReplacement("models/heroes/undying/undying_tower.vmdl", this.GetCasterPlus())
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_undying_3_aura_effect extends BaseModifier_Plus {
    zombie_duration: number;
    zombie_base_damage: number;
    zombie_damag_str_factor: number;
    zombie_damage_pct: number;
    hZombie: CDOTA_BaseNPC;
    IsHidden() {
        return true
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
    AllowIllusionDuplicate() {
        return false
    }
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    BeCreated(params: IModifierTable) {

        this.zombie_duration = this.GetSpecialValueFor("zombie_duration")
        this.zombie_base_damage = this.GetSpecialValueFor("zombie_base_damage")
        this.zombie_damag_str_factor = this.GetSpecialValueFor("zombie_damag_str_factor")
        this.zombie_damage_pct = modifier_undying_6_buff.exist(this.GetCasterPlus()) && this.GetSpecialValueFor("zombie_damage_pct") || 1
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            this.StartIntervalThink(0)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive() || !GameFunc.IsValid(hParent) || !hParent.IsAlive()) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }
            if (!GameFunc.IsValid(this.hZombie) || !this.hZombie.IsAlive()) {
                let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
                if (GameFunc.IsValid(hCaster) && GameFunc.IsValid(hParent) && GameFunc.IsValid(hHero)) {
                    let sZombieName = [
                        "npc_dota_unit_undying_zombie_custom",
                        "npc_dota_unit_undying_zombie_torso_custom"
                    ]
                    this.hZombie = CreateUnitByName(GameFunc.ArrayFunc.RandomArray(sZombieName)[0], hParent.GetAbsOrigin(), false, hHero, hHero, hCaster.GetTeamNumber())
                    this.hZombie.SetForwardVector(hParent.GetForwardVector())
                    this.hZombie.SetForceAttackTarget(hParent)
                    modifier_undying_3_zombie_lifetime.apply(this.hZombie, hCaster, this.GetAbilityPlus(), { duration: this.zombie_duration })
                    this.hZombie.AddAbility("undying_3_deathstrike").SetLevel(1)
                    undefined
                    // this.hZombie.FireSummonned(hCaster)
                } else {
                    this.StartIntervalThink(-1)
                    this.Destroy()
                }
            }
        }
    }
    BeDestroy() {

        if (IsServer()) {
            if (GameFunc.IsValid(this.hZombie)) {
                this.hZombie.ForceKill(false)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_undying_3_zombie_lifetime extends BaseModifier_Plus {
    zombie_base_damage_factor: number;
    duration: number;
    sParentModel: string;
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

        this.sParentModel = (this.GetParentPlus().GetUnitName() == "npc_dota_unit_undying_zombie_custom" &&
            ResHelper.GetModelReplacement("models/heroes/undying/undying_minion.vmdl", this.GetCasterPlus()) ||
            ResHelper.GetModelReplacement("models/heroes/undying/undying_minion_torso.vmdl", this.GetCasterPlus()))
    }
    Init(params: IModifierTable) {
        this.zombie_base_damage_factor = this.GetSpecialValueFor("zombie_base_damage_factor")
        this.duration = this.GetSpecialValueFor("duration")
    }
    BeDestroy() {

        if (IsServer()) {
            this.GetParentPlus().ForceKill(false)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage() {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            return (this.GetCasterPlus() as BaseNpc_Hero_Plus).GetStrength() * this.zombie_base_damage_factor
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: IModifierTable) {
        if (!GameFunc.IsValid(params.target)) { return }
        if (params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            modifier_undying_3_debuff.apply(params.target, this.GetCasterPlus(), this.GetAbilityPlus(), { duration: this.duration })
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    GetModelChange(params: IModifierTable) {
        return this.sParentModel
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_undying_3_debuff extends BaseModifier_Plus {
    max_stack: number;
    increase_attack_damage: number;
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
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.max_stack = this.GetSpecialValueFor("max_stack")
        this.increase_attack_damage = this.GetSpecialValueFor("increase_attack_damage") + (GameFunc.IsValid(hCaster) && hCaster.GetTalentValue("special_bonus_unique_undying_custom_8") || 0)
        if (IsServer()) {
            this.SetStackCount(math.min(this.GetStackCount() + 1, this.max_stack))
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamagePercentage(params: ModifierAttackEvent) {
        if (params != null && params.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK) {
            return this.GetStackCount() * this.increase_attack_damage
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        return this.GetStackCount() * this.increase_attack_damage
    }

}
