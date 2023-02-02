import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
/** dota原技能数据 */
export const Data_riki_smoke_screen = { "ID": "5142", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Hero_Riki.Smoke_Screen", "AbilityCastRange": "550", "AbilityCastPoint": "0.2", "AbilityCooldown": "20 17 14 11", "AbilityDuration": "6", "AbilityManaCost": "75", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "300 325 350 375", "LinkedSpecialBonus": "special_bonus_unique_riki_7" }, "02": { "var_type": "FIELD_INTEGER", "duration": "6" }, "03": { "var_type": "FIELD_INTEGER", "miss_rate": "20 35 50 65" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_riki_smoke_screen extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "riki_smoke_screen";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_riki_smoke_screen = Data_riki_smoke_screen;
    Init() {
        this.SetDefaultSpecialValue("radius", [300, 325, 350, 375, 400, 425]);
        this.SetDefaultSpecialValue("duration", 6);
        this.SetDefaultSpecialValue("move_speed_pct", [15, 25, 35, 45, 55, 65]);
        this.SetDefaultSpecialValue("bonus_attack_count", 1);
        this.SetDefaultSpecialValue("shard_duration", 3);
        this.SetDefaultSpecialValue("shard_increase_physical_damage", 45);
        this.SetDefaultSpecialValue("shard_interval", 7);

    }


    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let radius = this.GetSpecialValueFor("radius")
        let duration = this.GetSpecialValueFor("duration")
        modifier_riki_1_thinker.applyThinker(vPosition, hCaster, this, { duration: duration }, hCaster.GetTeamNumber(), false)
    }

    GetIntrinsicModifierName() {
        return "modifier_riki_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_riki_1 extends BaseModifier_Plus {
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
            let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)
            //  施法命令
            if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position
                })
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    OnDeath(params: IModifierTable) {
        let hAttacker = params.attacker
        if (GameFunc.IsValid(hAttacker) && hAttacker.GetUnitLabel() != "builder" && hAttacker.GetTeamNumber() != params.unit.GetTeamNumber()) {
            hAttacker = hAttacker.GetSource()
            if (GameFunc.IsValid(hAttacker) && hAttacker == this.GetParentPlus() && !hAttacker.IsIllusion() && !hAttacker.PassivesDisabled()) {
                // && !Spawner.IsEndless()
                if (this.GetParentPlus().HasTalent("special_bonus_unique_riki_custom_2") && modifier_riki_1_debuff.exist(params.unit)) {
                    modifier_riki_1_attack_damage.apply(params.attacker, params.attacker, this.GetAbilityPlus(), null)
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_riki_1_thinker extends BaseModifier_Plus {
    radius: number;
    shard_interval: number;
    shard_duration: number;
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
        return !this.GetParentPlus().IsIllusion()
    }
    GetAura() {
        return "modifier_riki_1_debuff"
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        this.radius = this.GetSpecialValueFor("radius")
        this.shard_interval = this.GetSpecialValueFor("shard_interval")
        this.shard_duration = this.GetSpecialValueFor("shard_duration")
        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_riki/riki_smokebomb.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: this.GetCasterPlus()
            });

            ParticleManager.SetParticleControl(iParticleID, 0, this.GetParentPlus().GetOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.radius, this.radius, this.radius))
            this.AddParticle(iParticleID, false, false, -1, false, false)
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Riki.Smoke_Screen", hCaster))
            this.StartIntervalThink(0)
        }
    }
    OnRefresh(params: IModifierTable) {
        super.OnRefresh(params);
        this.radius = this.GetSpecialValueFor("radius")
        this.shard_interval = this.GetSpecialValueFor("shard_interval")
        this.shard_duration = this.GetSpecialValueFor("shard_duration")
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            UTIL_Remove(this.GetParentPlus())
        }
    }
    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                this.Destroy()
                return
            }
            // 魔晶
            if (hCaster.HasShard()) {
                let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), null, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
                for (let hTarget of (tTarget)) {

                    if (!modifier_riki_1_shard_interval.exist(hTarget)) {
                        // 间隔
                        modifier_riki_1_shard_interval.apply(hTarget, hCaster, this.GetAbilityPlus(), { duration: this.shard_interval })
                        // 睡眠，物理伤害加深
                        modifier_riki_1_shard_debuff.apply(hTarget, hCaster, this.GetAbilityPlus(), { duration: this.shard_duration })
                    }
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_riki_1_debuff extends BaseModifier_Plus {
    move_speed_pct: number;
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
    GetEffectName() {
        return "particles/generic_gameplay/generic_silenced.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW
    }
    Init(params: IModifierTable) {
        this.move_speed_pct = this.GetSpecialValueFor("move_speed_pct")
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return -this.move_speed_pct
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_riki_1_shard_interval extends BaseModifier_Plus {
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
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_riki_1_shard_debuff extends BaseModifier_Plus {
    shard_increase_physical_damage: number;
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
        this.shard_increase_physical_damage = this.GetSpecialValueFor("shard_increase_physical_damage")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingPhysicalDamagePercentage() {
        return this.shard_increase_physical_damage
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.shard_increase_physical_damage
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_riki_1_attack_damage extends BaseModifier_Plus {
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.IncrementStackCount()
        }
    }
    OnRefresh(params: IModifierTable) {
        super.OnRefresh(params);
        if (IsServer()) {
            this.IncrementStackCount()
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage() {
        return this.GetStackCount() * this.GetCasterPlus().GetTalentValue("special_bonus_unique_riki_custom_2")
    }
}
