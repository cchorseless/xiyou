import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_spectre_dispersion = { "ID": "5336", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "HasShardUpgrade": "1", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage_reflection_pct": "8 12 16 20", "LinkedSpecialBonus": "special_bonus_unique_spectre_5" }, "02": { "var_type": "FIELD_INTEGER", "min_radius": "300 300 300 300" }, "03": { "var_type": "FIELD_INTEGER", "max_radius": "700" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_spectre_dispersion extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "spectre_dispersion";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_spectre_dispersion = Data_spectre_dispersion;
    Init() {
        this.SetDefaultSpecialValue("damage_percent", [100, 200, 300, 400, 500]);
        this.SetDefaultSpecialValue("radius", 225);
        this.SetDefaultSpecialValue("damage_change_percent", [3, 5, 7, 9, 11]);
        this.SetDefaultSpecialValue("str_factor", 50);
        this.SetDefaultSpecialValue("illusion_damage_outgoing", [60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("illusion_duration", 6);
        this.SetDefaultSpecialValue("illusion_health", [60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("attack_range", 150);
        this.SetDefaultSpecialValue("movespeed", 800);
        this.SetDefaultSpecialValue("duration", 30);
        this.SetDefaultSpecialValue("illusion_interval", [10, 9, 8, 7, 6]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("duration", 30);
        this.SetDefaultSpecialValue("illusion_interval", [10, 9, 8, 7, 6]);
        this.SetDefaultSpecialValue("damage_percent", [100, 200, 300, 400, 500]);
        this.SetDefaultSpecialValue("radius", 225);
        this.SetDefaultSpecialValue("damage_change_percent", [3, 5, 7, 9, 11]);
        this.SetDefaultSpecialValue("str_factor", 50);
        this.SetDefaultSpecialValue("illusion_damage_outgoing", [50, 60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("illusion_duration", 6);
        this.SetDefaultSpecialValue("illusion_health", [50, 60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("attack_range", 150);
        this.SetDefaultSpecialValue("movespeed", 800);

    }



    CreateGhost(hTarget: BaseNpc_Plus, fDelay: number = 0) {
        let hCaster = this.GetCasterPlus()
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID()) as unknown as BaseNpc_Plus
        let illusion_damage_outgoing = this.GetSpecialValueFor("illusion_damage_outgoing") + hCaster.GetTalentValue("special_bonus_unique_spectre_custom_5")
        let illusion_duration = this.GetSpecialValueFor("illusion_duration")
        let illusion_health = this.GetSpecialValueFor("illusion_health")
        if (fDelay == null || fDelay <= 0) {
            let fMaxHealth = hCaster.GetMaxHealth() * illusion_health * 0.01
            let hIllusion = hCaster.CreateIllusion((hCaster.GetAbsOrigin() + RandomVector(1) * RandomFloat(0, 100) as Vector), false, hHero, hHero, hCaster.GetTeamNumber(), illusion_duration, illusion_damage_outgoing - 100, 0)
            // hIllusion.FireIllusionSummonned(hCaster)
            hIllusion.SetControllableByPlayer(-1, true)
            // hIllusion.ModifyMaxHealth(fMaxHealth - hIllusion.GetMaxHealth())
            hIllusion.SetForceAttackTarget(null)
            modifier_spectre_3_ghost.apply(hIllusion, hCaster, this, { duration: illusion_duration, hTargetIndex: GameFunc.IsValid(hTarget) && hTarget.GetEntityIndex() || null })
            // modifier_building.remove(hIllusion);
        } else {
            this.addTimer(fDelay, () => {
                let fMaxHealth = hCaster.GetMaxHealth() * illusion_health * 0.01
                let hIllusion = hCaster.CreateIllusion((hCaster.GetAbsOrigin() + RandomVector(1) * RandomFloat(0, 100) as Vector), false, hHero, hHero, hCaster.GetTeamNumber(), illusion_duration, illusion_damage_outgoing - 100, 0)
                // hIllusion.FireIllusionSummonned(hCaster)
                hIllusion.SetControllableByPlayer(-1, true)
                // hIllusion.ModifyMaxHealth(fMaxHealth - hIllusion.GetMaxHealth())
                hIllusion.SetForceAttackTarget(null)
                modifier_spectre_3_ghost.apply(hIllusion, hCaster, this, { duration: illusion_duration, hTargetIndex: GameFunc.IsValid(hTarget) && hTarget.GetEntityIndex() || null })
                // modifier_building.remove(hIllusion);
            })
        }
    }
    GetIntrinsicModifierName() {
        return "modifier_spectre_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_spectre_3 extends BaseModifier_Plus {
    damage_change_percent: number;
    str_factor: number;
    duration: number;
    illusion_interval: number;
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
            this.StartIntervalThink(this.illusion_interval)
            //  皮肤特效替换
            let hParent = this.GetParentPlus()
            let hModel = hParent.FirstMoveChild() as BaseNpc_Plus
            while (hModel != null) {
                if (hModel.GetModelName() == ResHelper.GetModelReplacement("models/heroes/spectre/spectre_hat.vmdl", hParent)) {
                    let iParticleID = ResHelper.CreateParticle({
                        resPath: "particles/units/heroes/hero_spectre/head_ambient_null.vpcf",
                        resNpc: null,
                        iAttachment: ParticleAttachment_t.PATTACH_POINT,
                        owner: hModel
                    });

                    //  直接在单位身上找不到attach_head
                    ParticleManager.SetParticleControlEnt(iParticleID, 0, hModel, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_head", hModel.GetAbsOrigin(), true)
                    this.AddParticle(iParticleID, false, false, -1, false, false)
                }
                hModel = hModel.NextMovePeer() as BaseNpc_Plus
            }
        }
    }
    Init(params: ModifierTable) {
        this.damage_change_percent = this.GetSpecialValueFor("damage_change_percent")
        this.str_factor = this.GetSpecialValueFor("str_factor")
        this.illusion_interval = this.GetSpecialValueFor("illusion_interval")
        this.duration = this.GetSpecialValueFor("duration")
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus() as ability3_spectre_dispersion
            let hTarget = hCaster.GetAttackTarget() as BaseNpc_Plus
            let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, hCaster.Script_GetAttackRange(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
            if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
                hTarget = tTarget[0] as BaseNpc_Plus
            }
            if (GameFunc.IsValid(hAbility)) {
                hAbility.CreateGhost(hTarget)
                modifier_spectre_3_particle_illusion_created.apply(hCaster, hCaster, hAbility, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    GetTotalDamageOutgoing_Percentage(params: ModifierTable) {
        let hParent = this.GetParentPlus()
        if (!GameFunc.IsValid(params.target)) { return }
        if (params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == hParent && !params.attacker.IsIllusion()) {
            // * hParent.GetLifestealAmplifyFactor()
            let bonus_health = params.original_damage * this.damage_change_percent * 0.01

            if (hParent.GetStrength == null) {
                return
            }
            let hModifier = modifier_spectre_3_buff.findIn(hParent) as modifier_spectre_3_buff;
            if (GameFunc.IsValid(hModifier)) {
                let iStackCount = hModifier.GetStackCount()
                if (iStackCount >= hParent.GetStrength() * this.str_factor) {
                    return
                }
            }
            bonus_health = math.min(hParent.GetStrength() * this.str_factor, bonus_health)
            modifier_spectre_3_buff.apply(hParent, hParent, this.GetAbilityPlus(), { duration: this.duration, bonus_health: bonus_health, target_index: params.target.entindex() })
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_spectre_3_buff extends BaseModifier_Plus {
    str_factor: number;
    hTarget: BaseNpc_Plus;
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
        let hParent = this.GetParentPlus()
        this.str_factor = this.GetSpecialValueFor("str_factor")
        if (IsServer()) {
            let bonus_health = params.bonus_health || 0
            this.changeStackCount(bonus_health)
            this.hTarget = EntIndexToHScript(params.target_index) as BaseNpc_Plus
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.EOM_GetModifierHealthBonus()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.HEALTH_BONUS)
    EOM_GetModifierHealthBonus() {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_spectre_3_ghost extends BaseModifier_Plus {
    attack_range: any;
    movespeed: any;
    radius: number;
    damage_percent: number;
    hTarget: BaseNpc_Plus;
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
            this.StartIntervalThink(0.1)
        }
    }
    Init(params: ModifierTable) {
        this.attack_range = this.GetSpecialValueFor("attack_range")
        this.movespeed = this.GetSpecialValueFor("movespeed")
        this.radius = this.GetSpecialValueFor("radius")
        this.damage_percent = this.GetSpecialValueFor("damage_percent")
        if (IsServer()) {
            this.hTarget = (params.hTargetIndex != null && EntIndexToHScript(params.hTargetIndex) || null) as BaseNpc_Plus
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
                return
            }
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), this.radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, 0)
            let damage = hParent.GetMaxHealth() * this.damage_percent * 0.01
            for (let hTarget of (tTargets)) {

                if (hTarget != null) {
                    let damage_table = {
                        ability: hAbility,
                        attacker: hCaster,
                        victim: hTarget,
                        damage: damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE
                    }
                    BattleHelper.GoApplyDamage(damage_table)
                }
            }
            modifier_spectre_3_ghost_particle.apply(hCaster, hParent, hAbility, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
                this.StartIntervalThink(-1)
                return
            }
            if (!GameFunc.IsValid(this.hTarget) || !this.hTarget.IsAlive()) {
                // let iPlayerID = hCaster.GetPlayerOwnerID()
                // let tTargets = ShuffledList(Spawner.GetMissing(iPlayerID))
                // let hTarget = tTargets[0]
                // if (GameFunc.IsValid(hTarget)) {
                //     hParent.SetForceAttackTarget(null)
                //     this.hTarget = hTarget
                //     if (((hTarget.GetAbsOrigin() - hParent.GetAbsOrigin()) as Vector).Length2D() > 1000) {
                //         hParent.SetAbsOrigin(hTarget.GetAbsOrigin() + RandomVector(1) * RandomFloat(0, 125))
                //     }
                // } else {
                //     hParent.ForceKill(false)
                // }
            } else {
                if (hParent.GetForceAttackTarget() == null) {
                    hParent.MoveToTargetToAttack(this.hTarget)
                    hParent.SetForceAttackTarget(this.hTarget)
                }
            }
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACK_RANGE_BASE_OVERRIDE)
    GetAttackRangeOverride(params: ModifierTable) {
        return this.attack_range
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_ABSOLUTE)
    GetMoveSpeed_Absolute(params: ModifierTable) {
        return this.movespeed
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_spectre_3_particle_illusion_created extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/illusion_created.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_spectre_3_ghost_particle extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_spectre/spectre_3_illusion_death.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hCaster.GetAbsOrigin())
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
