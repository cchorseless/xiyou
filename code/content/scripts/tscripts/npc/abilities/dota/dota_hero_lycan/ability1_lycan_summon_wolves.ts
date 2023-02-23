
import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_lycan_6_aura } from "./ability6_lycan_shapeshift";

/** dota原技能数据 */
export const Data_lycan_summon_wolves = { "ID": "5395", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilitySound": "Hero_Lycan.SummonWolves", "HasShardUpgrade": "1", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "30.0 30.0 30.0 30.0", "AbilityManaCost": "125 130 135 140", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "wolf_index": "1 2 3 4" }, "02": { "var_type": "FIELD_FLOAT", "wolf_duration": "50" }, "03": { "var_type": "FIELD_FLOAT", "wolf_bat": "1.2 1.1 1.0 0.9" }, "04": { "var_type": "FIELD_INTEGER", "wolf_damage": "26 34 42 50" }, "05": { "var_type": "FIELD_INTEGER", "wolf_hp": "325 375 425 475", "LinkedSpecialBonus": "special_bonus_unique_lycan_7" }, "06": { "var_type": "FIELD_INTEGER", "bash_chance": "15" }, "07": { "var_type": "FIELD_FLOAT", "bash_duration": "1.0" }, "08": { "var_type": "FIELD_INTEGER", "tooltip_wolf_count": "2 2 2 2", "LinkedSpecialBonus": "special_bonus_unique_lycan_2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_lycan_summon_wolves extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lycan_summon_wolves";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lycan_summon_wolves = Data_lycan_summon_wolves;
    Init() {
        this.SetDefaultSpecialValue("maim_movement_speed", -10);
        this.SetDefaultSpecialValue("maim_damage", [50, 100, 200, 400, 800, 1600]);
        this.SetDefaultSpecialValue("str_damage_factor", 2);
        this.SetDefaultSpecialValue("wolf_bat", [1.2, 1.1, 1.0, 0.9, 0.8, 0.7]);
        this.SetDefaultSpecialValue("wolf_damage", [25, 50, 100, 200, 400, 800]);
        this.SetDefaultSpecialValue("wolf_movespeed", 460);
        this.SetDefaultSpecialValue("wolf_max_range", 1200);
        this.SetDefaultSpecialValue("wolf_charge_crit", [150, 200, 250, 300, 350, 400]);
        this.SetDefaultSpecialValue("wolf_charge_bonus_movespeed", 100);
        this.SetDefaultSpecialValue("wolf_count", 2);
        this.SetDefaultSpecialValue("maim_chance", 20);
        this.SetDefaultSpecialValue("maim_duration", 4);

    }



    Precache(context: any) {
        PrecacheUnitByNameSync("npc_dota_lycan_wolf_custom", context, -1)
    }

    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("wolf_max_range")
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_lycan_1"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_lycan_1 extends BaseModifier_Plus {
    wolf_count: number;
    tWolves: any[];
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
            this.tWolves = []
            this.StartIntervalThink(1)
        }
    }
    Init(params: IModifierTable) {
        this.wolf_count = this.GetSpecialValueFor("wolf_count")
    }
    BeDestroy() {

        if (IsServer()) {
            for (let hWolf of (this.tWolves)) {
                if (GameFunc.IsValid(hWolf)) {
                    hWolf.ForceKill(false)
                }
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            let hHero = PlayerResource.GetSelectedHeroEntity(hParent.GetPlayerOwnerID())
            if (hParent.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }
            if (!GameFunc.IsValid(hHero)) {
                return
            }

            //  let extra_wolf_count = EntityHelper.HasTalent(hCaster, "special_bonus_unique_lycan_custom_6") && hCaster.GetTalentValue("special_bonus_unique_lycan_custom_6") || 0
            //  let wolf_count = this.wolf_count + extra_wolf_count
            let wolf_count = this.wolf_count

            // let _modifier_lycan_3_form = modifier_lycan_3_form.findIn(hParent)
            // if (GameFunc.IsValid(modifier_lycan_3_form as IBaseModifier_Plus)) {
            // wolf_count = wolf_count + (modifier_lycan_3_form.wolf_count || 0)
            // }

            let bNewSummon = false
            for (let i = math.max(this.tWolves.length, wolf_count) - 1; i >= 0; i--) {
                let hWolf = this.tWolves[i]
                if (i > wolf_count) {
                    if (GameFunc.IsValid(hWolf)) {
                        hWolf.ForceKill(false)
                        table.remove(this.tWolves, i)
                    }
                } else {
                    if (!GameFunc.IsValid(hWolf) || !hWolf.IsAlive()) {
                        let hWolf = CreateUnitByName("npc_dota_lycan_wolf_custom", (hParent.GetAbsOrigin() + RandomVector(50)) as Vector, false, hHero, hHero, hParent.GetTeamNumber())
                        hWolf.SetForwardVector(hParent.GetForwardVector())
                        modifier_lycan_1_particle_spawn.apply(hParent, hWolf, hAbility, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
                        this.tWolves[i] = hWolf
                        bNewSummon = true
                        // hWolf.FireSummonned(hParent)
                    }
                }
            }

            if (bNewSummon) {
                modifier_lycan_1_particle_cast.apply(hParent, hParent, hAbility, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
                hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_Lycan.SummonWolves", hParent))
            }

            for (let hWolf of (this.tWolves)) {
                if (GameFunc.IsValid(hWolf)) {
                    modifier_lycan_1_summon.apply(hWolf, hParent, hAbility, null)
                    let lycan_wolf_1 = ability1_lycan_summon_wolves.findIn(hWolf)
                    if (GameFunc.IsValid(lycan_wolf_1)) {
                        lycan_wolf_1.SetLevel(hAbility.GetLevel())
                    }
                    hWolf.FireSummonned(hParent, true)
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.PassivesDisabled()) {
            let hAbility = this.GetAbilityPlus()
            if (hAbility.IsCooldownReady()) {
                hAbility.UseResources(false, false, true)
                for (let hWolf of (this.tWolves)) {
                    if (GameFunc.IsValid(hWolf) && hWolf.IsAlive()) {
                        modifier_lycan_1_summon_charge.apply(hWolf, params.attacker, hAbility, { duration: 5, target_entindex: params.target.entindex() })
                    }
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lycan_1_summon extends BaseModifier_Plus {
    str_damage_factor: number;
    wolf_movespeed: any;
    wolf_bat: any;
    hAttackTarget: CDOTA_BaseNPC;
    wolf_max_range: number;
    wolf_damage: number;

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

        let hParent = this.GetParentPlus()
        this.wolf_bat = this.GetSpecialValueFor("wolf_bat")
        this.wolf_damage = this.GetSpecialValueFor("wolf_damage")
        this.wolf_movespeed = this.GetSpecialValueFor("wolf_movespeed")
        this.wolf_max_range = this.GetSpecialValueFor("wolf_max_range")
        this.str_damage_factor = this.GetSpecialValueFor("str_damage_factor")
        if (IsServer()) {
            this.hAttackTarget = null
            this.StartIntervalThink(0.1)
            let fBaseDamageMin = hParent.GetBaseDamageMin()
            let fBaseDamageMax = hParent.GetBaseDamageMax()
            let fDamageChanged = this.wolf_damage - (fBaseDamageMin + fBaseDamageMax) / 2
            hParent.SetBaseDamageMin(fBaseDamageMin + fDamageChanged)
            hParent.SetBaseDamageMax(fBaseDamageMax + fDamageChanged)
        }
    }
    BeRefresh(params: IModifierTable) {

        let hParent = this.GetParentPlus()
        this.wolf_bat = this.GetSpecialValueFor("wolf_bat")
        this.wolf_damage = this.GetSpecialValueFor("wolf_damage")
        this.wolf_movespeed = this.GetSpecialValueFor("wolf_movespeed")
        this.wolf_max_range = this.GetSpecialValueFor("wolf_max_range")
        this.str_damage_factor = this.GetSpecialValueFor("str_damage_factor")
        if (IsServer()) {
            let fBaseDamageMin = hParent.GetBaseDamageMin()
            let fBaseDamageMax = hParent.GetBaseDamageMax()
            let fDamageChanged = this.wolf_damage - (fBaseDamageMin + fBaseDamageMax) / 2
            hParent.SetBaseDamageMin(fBaseDamageMin + fDamageChanged)
            hParent.SetBaseDamageMax(fBaseDamageMax + fDamageChanged)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            if (!GameFunc.IsValid(hCaster)) {
                return
            }
            if (hParent.GetForceAttackTarget() != null) {
                this.hAttackTarget = hParent.GetForceAttackTarget()
                return
            }
            if (!GameFunc.IsValid(this.hAttackTarget) || UnitFilter(this.hAttackTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, hCaster.GetTeamNumber()) != UnitFilterResult.UF_SUCCESS) {
                let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), hParent.GetAcquisitionRange(), null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)
                for (let i = tTargets.length - 1; i >= 0; i--) {
                    if (CalcDistanceBetweenEntityOBB(tTargets[i], this.hAttackTarget) > this.wolf_max_range) {
                        table.remove(tTargets, i)
                    }
                }
                this.hAttackTarget = tTargets[0]
            }
            if (!GameFunc.IsValid(this.hAttackTarget) || CalcDistanceBetweenEntityOBB(hCaster, this.hAttackTarget) > this.wolf_max_range) {
                this.hAttackTarget = null
                if (CalcDistanceBetweenEntityOBB(hCaster, hParent) > 100) {
                    ExecuteOrderFromTable(
                        {
                            UnitIndex: hParent.entindex(),
                            OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION,
                            Position: (hCaster.GetAbsOrigin() + RandomVector(50)) as Vector,
                        }
                    )
                }
                return
            }
            hParent.MoveToTargetToAttack(this.hAttackTarget)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    GetBaseAttackTimeConstant(params: IModifierTable) {
        return this.wolf_bat
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BASE_OVERRIDE)
    GetMoveSpeedOverride(params: IModifierTable) {
        if (!(this.GetParentPlus().FindModifierByName("modifier_lycan_6_aura") as modifier_lycan_6_aura)) {
            return this.wolf_movespeed
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    GetModelChange(params: IModifierTable) {
        return ResHelper.GetModelReplacement("models/heroes/lycan/summon_wolves.vmdl", this.GetCasterPlus())
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_AUTOATTACK)
    Get_DisableAutoAttack() {
        return 1
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage() {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            return this.str_damage_factor * this.GetCasterPlus().GetStrength()
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lycan_1_summon_charge extends BaseModifier_Plus {
    wolf_charge_bonus_movespeed: number;
    wolf_charge_crit: number;
    hTarget: IBaseNpc_Plus;
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
    BeCreated(params: IModifierTable) {

        let hParent = this.GetParentPlus()
        this.wolf_charge_bonus_movespeed = this.GetSpecialValueFor("wolf_charge_bonus_movespeed")
        this.wolf_charge_crit = this.GetSpecialValueFor("wolf_charge_crit")
        if (IsServer()) {
            this.hTarget = EntIndexToHScript(params.target_entindex || -1) as IBaseNpc_Plus
            if (!GameFunc.IsValid(this.hTarget) || !this.hTarget.IsAlive()) {
                this.Destroy()
                return
            }
            hParent.SetForceAttackTarget(null)
            ExecuteOrderFromTable(
                {
                    UnitIndex: hParent.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                    TargetIndex: this.hTarget.entindex()
                }
            )
            hParent.SetForceAttackTarget(this.hTarget)
        }
    }
    BeRefresh(params: IModifierTable) {

        let hParent = this.GetParentPlus()
        this.wolf_charge_bonus_movespeed = this.GetSpecialValueFor("wolf_charge_bonus_movespeed")
        this.wolf_charge_crit = this.GetSpecialValueFor("wolf_charge_crit")
        if (IsServer()) {
            this.hTarget = EntIndexToHScript(params.target_entindex || -1) as IBaseNpc_Plus
            if (!GameFunc.IsValid(this.hTarget) || !this.hTarget.IsAlive()) {
                this.Destroy()
                return
            }
            hParent.SetForceAttackTarget(null)
            ExecuteOrderFromTable(
                {
                    UnitIndex: hParent.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                    TargetIndex: this.hTarget.entindex()
                }
            )
            hParent.SetForceAttackTarget(this.hTarget)
        }
    }
    BeDestroy() {

        let hParent = this.GetParentPlus()
        if (IsServer()) {
            hParent.SetForceAttackTarget(null)
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    OnDeath(params: IModifierTable) {
        if (params.unit == this.hTarget) {
            this.Destroy()
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        if (params.attacker == this.GetParentPlus() && params.target == this.hTarget) {
            this.Destroy()
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE)
    CC_GetModifierCriticalStrike(params: IModifierTable) {
        if (params.target == this.hTarget) {
            return this.wolf_charge_crit
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT)
    GetIgnoreMovespeedLimit(params: IModifierTable) {
        return 1
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        return this.wolf_charge_bonus_movespeed
    }
}

// 特效
@registerModifier()
export class modifier_lycan_1_particle_spawn extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            let hWolf = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lycan/lycan_summon_wolves_spawn.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hWolf
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}

// 特效
@registerModifier()
export class modifier_lycan_1_particle_cast extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            let hParent = this.GetParentPlus()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lycan/lycan_summon_wolves_cast.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mouth", hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
