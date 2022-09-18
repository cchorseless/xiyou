import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_building } from "../../../modifier/building/modifier_building";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../modifier/modifier_event";
import { modifier_kill } from "../../../modifier/modifier_kill";
import { ability1_skeleton_king_hellfire_blast } from "./ability1_skeleton_king_hellfire_blast";
import { modifier_skeleton_king_3 } from "./ability3_skeleton_king_mortal_strike";
import { ability6_skeleton_king_reincarnation, modifier_skeleton_king_6_damage } from "./ability6_skeleton_king_reincarnation";

/** dota原技能数据 */
export const Data_skeleton_king_vampiric_aura = { "ID": "5087", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityCastPoint": "0.1", "AbilityCooldown": "50", "AbilityManaCost": "65 70 75 80", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "vampiric_aura": "10 18 26 34", "LinkedSpecialBonus": "special_bonus_unique_wraith_king_2" }, "02": { "var_type": "FIELD_FLOAT", "skeleton_duration": "60" }, "03": { "var_type": "FIELD_INTEGER", "max_skeleton_charges": "2 4 6 8", "LinkedSpecialBonus": "special_bonus_unique_wraith_king_5" }, "04": { "var_type": "FIELD_FLOAT", "spawn_interval": "0.25" }, "05": { "var_type": "FIELD_FLOAT", "reincarnate_time": "3" }, "06": { "var_type": "FIELD_INTEGER", "gold_bounty": "5" }, "07": { "var_type": "FIELD_INTEGER", "xp_bounty": "5" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_skeleton_king_vampiric_aura extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "skeleton_king_vampiric_aura";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_skeleton_king_vampiric_aura = Data_skeleton_king_vampiric_aura;
    Init() {
        this.SetDefaultSpecialValue("crit_chance", [11, 14, 17, 20, 23, 26]);
        this.SetDefaultSpecialValue("crit_mult", 500);
        this.SetDefaultSpecialValue("skeleton_attack", [50, 70, 100]);
        this.SetDefaultSpecialValue("skeleton_duration", 30);
        this.SetDefaultSpecialValue("max_skeleton_charges", 5);
        this.SetDefaultSpecialValue("energy_cost", [1, 15, 30]);
        this.SetDefaultSpecialValue("respawn_time", 2);
        this.SetDefaultSpecialValue("model_scale", 30);
        this.OnInit();
    }

    Init_old() {
        this.SetDefaultSpecialValue("crit_chance", [11, 14, 17, 20, 23, 26]);
        this.SetDefaultSpecialValue("crit_mult", 500);
        this.SetDefaultSpecialValue("skeleton_attack", [50, 70, 100]);
        this.SetDefaultSpecialValue("skeleton_duration", 30);
        this.SetDefaultSpecialValue("max_skeleton_charges", 5);
        this.SetDefaultSpecialValue("energy_cost", [1, 15, 30]);
        this.SetDefaultSpecialValue("respawn_time", 2);
        this.SetDefaultSpecialValue("model_scale", 30);

    }

    iIndex: number;
    tSkeletons: any[];


    Precache(context: any) {
        PrecacheUnitByNameSync("npc_dota_wraith_king_skeleton_warrior_custom", context, -1)
    }

    CastFilterResult() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let sTalentName = "special_bonus_unique_skeleton_king_custom_8"
            let max_skeleton_charges = hCaster.HasTalent(sTalentName) && this.GetSpecialValueFor("max_skeleton_charges") + hCaster.GetTalentValue(sTalentName) || this.GetSpecialValueFor("max_skeleton_charges")
            let hModifier = modifier_skeleton_king_3.findIn(hCaster) as BaseModifier_Plus;
            if (GameFunc.IsValid(hModifier) && hModifier.GetStackCount() >= this.GetLevelSpecialValueFor("energy_cost", 0) && this.tSkeletons.length < max_skeleton_charges) {
                return UnitFilterResult.UF_SUCCESS
            } else {
                this.errorStr = "dota_hud_error_ability_inactive"
                return UnitFilterResult.UF_FAIL_CUSTOM
            }
        }
        return UnitFilterResult.UF_SUCCESS
    }

    OnInit() {
        this.tSkeletons = []
        this.iIndex = 0
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_skeleton_king_custom_8"
        let max_skeleton_charges = this.GetSpecialValueFor("max_skeleton_charges") + hCaster.GetTalentValue(sTalentName)
        let skeleton_attack = this.GetLevelSpecialValueFor("skeleton_attack", 1)
        let energy_cost = this.GetLevelSpecialValueFor("energy_cost", 1)
        let iLevel = 0
        let ability = ability1_skeleton_king_hellfire_blast.findIn(hCaster)
        if (ability.UseEnergy(this.GetLevelSpecialValueFor("energy_cost", 2)) == 1) {
            iLevel = 3
        } else if (ability.UseEnergy(this.GetLevelSpecialValueFor("energy_cost", 1)) == 1) {
            iLevel = 2
        } else if (ability.UseEnergy(this.GetLevelSpecialValueFor("energy_cost", 0)) == 1) {
            iLevel = 1
        }
        sTalentName = "special_bonus_unique_skeleton_king_custom_6"
        skeleton_attack = this.GetLevelSpecialValueFor("skeleton_attack", iLevel) * hCaster.GetAverageTrueAttackDamage(hCaster) * 0.01
        let skeleton_duration = this.GetSpecialValueFor("skeleton_duration") + hCaster.GetTalentValue(sTalentName)
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
        let location = hCaster.GetAbsOrigin()
        let summon_loc = location + GameFunc.VectorFunctions.Rotation2D(Vector(100, 0, 0), math.rad(360 / max_skeleton_charges * this.iIndex))
        let hUnit = CreateUnitByName("npc_dota_wraith_king_skeleton_warrior_custom", summon_loc as Vector, false, hHero, hHero, hCaster.GetTeamNumber())
        hUnit.SetBaseDamageMin(skeleton_attack)
        hUnit.SetBaseDamageMax(skeleton_attack)
        hUnit.SetForwardVector(hCaster.GetForwardVector())
        hUnit.SetControllableByPlayer(hCaster.GetPlayerOwnerID(), true)
        modifier_skeleton_king_2_summon.apply(hUnit, hCaster, this, { duration: skeleton_duration, iLevel: iLevel })
        modifier_skeleton_king_2.apply(hUnit, hCaster, this, null)
        // hUnit.FireSummonned(hCaster)
        table.insert(this.tSkeletons, hUnit)
        this.iIndex = this.iIndex + 1
    }
    GetIntrinsicModifierName() {
        return "modifier_skeleton_king_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_skeleton_king_2 extends BaseModifier_Plus {
    crit_chance: number;
    kill_charges: number;
    crit_mult: number;
    max_skeleton_charges: number;
    records: any[];
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
            this.records = []
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    Init(params: ModifierTable) {
        this.crit_chance = this.GetSpecialValueFor("crit_chance")
        this.crit_mult = this.GetSpecialValueFor("crit_mult")
        this.kill_charges = this.GetSpecialValueFor("kill_charges")
        this.max_skeleton_charges = this.GetSpecialValueFor("max_skeleton_charges")
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    On_AttackRecordDestroy(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            GameFunc.ArrayFunc.ArrayRemove(this.records, params.record)
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.CRITICALSTRIKE)
    EOM_GetModifierCriticalStrike(params: ModifierTable) {
        if (params.attacker == this.GetParentPlus() && !params.attacker.PassivesDisabled() && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            if (GameFunc.mathUtil.PRD(this.crit_chance, params.attacker, "skeleton_king_2")) {
                if (!params.attacker.IsIllusion()) {
                    table.insert(this.records, params.record)
                }
                if (params.attacker == this.GetCasterPlus() && params.attacker.HasScepter()) {
                    let hBuff = modifier_skeleton_king_3.findIn(this.GetCasterPlus()) as BaseModifier_Plus;
                    if (GameFunc.IsValid(hBuff)) {
                        hBuff.IncrementStackCount()
                    }
                }
                return this.crit_mult
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

            if (!ability.GetAutoCastState() || !ability.IsActivated()) {
                return
            }

            if (caster.IsTempestDouble() || caster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            if (ability.CastFilterResult() != UnitFilterResult.UF_SUCCESS) {
                return
            }

            let range = caster.Script_GetAttackRange()
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
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
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_skeleton_king_2_summon extends BaseModifier_Plus {
    iLevel: any;
    bCanRespawn: boolean;
    respawn_time: number;
    model_scale: number;
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
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.respawn_time = this.GetSpecialValueFor("respawn_time")
        this.model_scale = this.GetSpecialValueFor("model_scale")
        if (IsServer()) {
            modifier_kill.apply(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), { duration: this.GetDuration() })
            modifier_building.apply(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), null)
            this.iLevel = params.iLevel
            this.SetStackCount(this.iLevel)
            this.bCanRespawn = this.iLevel > 1 && true || false
            if (this.bCanRespawn) {
                this.SetDuration(this.GetDuration() * 2 + this.respawn_time, true)
            }
        }

    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus() as ability2_skeleton_king_vampiric_aura
            if (GameFunc.IsValid(hAbility)) {
                GameFunc.ArrayFunc.ArrayRemove(hAbility.tSkeletons, this.GetParentPlus())
                this.GetParentPlus().ForceKill(false)
                this.IncreaseAttack()
            }
        }

    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
        }
    }

    IncreaseAttack() {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hCaster)) {
            let hAbility = ability6_skeleton_king_reincarnation.findIn(hCaster)
            let duration = hAbility.GetSpecialValueFor("duration")
            if (hAbility.GetLevel() > 0) {
                modifier_skeleton_king_6_damage.apply(hCaster, hCaster, hAbility, { duration: duration })
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    GetBaseAttackTimeConstant(params: ModifierTable) {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            return this.GetCasterPlus().GetBaseAttackTime()
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: ModifierTable) {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            return this.GetCasterPlus().GetIncreasedAttackSpeed() * 100
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MODEL_CHANGE)
    GetModelChange(params: ModifierTable) {
        return ResHelper.GetModelReplacement("models/creeps/neutral_creeps/n_creep_troll_skeleton/n_creep_skeleton_melee.vmdl", this.GetCasterPlus())
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MODEL_SCALE)
    GetModelScale(params: ModifierTable) {
        return (this.GetStackCount() - 1) * this.model_scale
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    OnDeath(params: ModifierTable) {
        if (IsServer() && params.unit == this.GetParentPlus()) {
            let hParent = this.GetParentPlus()
            if (this.bCanRespawn == true) {
                this.bCanRespawn = false
                this.StartIntervalThink(this.respawn_time)

                this.IncreaseAttack()
            } else {
                this.Destroy()
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            if (GameFunc.IsValid(this.GetParentPlus())) {
                this.GetParentPlus().RespawnUnit()
                modifier_kill.apply(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), { duration: this.GetRemainingTime() })
                modifier_building.apply(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), null)
                this.StartIntervalThink(-1)
            }
        }
    }
}
