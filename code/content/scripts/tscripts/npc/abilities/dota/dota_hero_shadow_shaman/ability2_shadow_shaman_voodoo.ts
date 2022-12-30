
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_kill } from "../../../modifier/modifier_kill";
import { modifier_truesight } from "../../../modifier/modifier_truesight";
import { ability3_shadow_shaman_shackles, modifier_shadow_shaman_3_hex } from "./ability3_shadow_shaman_shackles";

/** dota原技能数据 */
export const Data_shadow_shaman_voodoo = { "ID": "5079", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Hero_ShadowShaman.Hex.Target", "AbilityCastRange": "500", "AbilityCastPoint": "0 0 0 0", "AbilityCooldown": "13", "AbilityManaCost": "70 110 150 190", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "movespeed": "100" }, "02": { "var_type": "FIELD_FLOAT", "duration": "1.25 2.0 2.75 3.5", "LinkedSpecialBonus": "special_bonus_unique_shadow_shaman_7" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_shadow_shaman_voodoo extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "shadow_shaman_voodoo";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_shadow_shaman_voodoo = Data_shadow_shaman_voodoo;
    Init() {
        this.SetDefaultSpecialValue("totem_duration", 8);
        this.SetDefaultSpecialValue("radius", 600);
        this.SetDefaultSpecialValue("damage_per_sec", [200, 400, 600, 800, 1000, 1200]);
        this.SetDefaultSpecialValue("interval", 3);
        this.SetDefaultSpecialValue("tick_interval", 1);
        this.SetDefaultSpecialValue("channel_time", [2, 2, 3, 3, 4, 4]);
        this.SetDefaultSpecialValue("amlify_damage_pct", 12);
        this.SetDefaultSpecialValue("resistance", -20);
        this.SetDefaultSpecialValue("armor", 20);

    }

    Init_old() {
        this.SetDefaultSpecialValue("totem_duration", 8);
        this.SetDefaultSpecialValue("radius", 600);
        this.SetDefaultSpecialValue("damage_per_sec", [200, 400, 600, 800, 1000, 1200]);
        this.SetDefaultSpecialValue("interval", 4);
        this.SetDefaultSpecialValue("tick_interval", 1);
        this.SetDefaultSpecialValue("channel_time", [2, 2, 3, 3, 4, 4]);
        this.SetDefaultSpecialValue("amlify_damage_pct", 7);
        this.SetDefaultSpecialValue("resistance", 20);
        this.SetDefaultSpecialValue("armor", 20);

    }

    vLastPosition: Vector;

    Precache(context: any) {
        PrecacheUnitByNameSync("npc_dota_shadow_shaman_totem_shackles", context, -1)
    }

    GetAOERadius() {
        return this.GetSpecialValueFor("radius") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_shadow_shaman_custom_1")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vLocation = this.GetCursorPosition()
        let totem_duration = this.GetSpecialValueFor("totem_duration")
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
        //  图腾
        let hTotem = CreateUnitByName("npc_dota_shadow_shaman_totem_shackles", vLocation, false, hHero, hHero, hCaster.GetTeamNumber())
        // hTotem.FireSummonned(hCaster)
        modifier_shadow_shaman_2_totem.apply(hTotem, hCaster, this, { duration: totem_duration - 1 / 30 })
        modifier_kill.apply(hTotem, hCaster, this, { duration: totem_duration - 1 / 30 })

        let hAbility = ability3_shadow_shaman_shackles.findIn(hCaster) as ability3_shadow_shaman_shackles;
        if (GameFunc.IsValid(hAbility) && hAbility.FireTotem != null) {
            hAbility.FireTotem(hTotem)
        }
        //  记录上一次释放的位置
        this.vLastPosition = vLocation
    }

    GetIntrinsicModifierName() {
        return "modifier_shadow_shaman_2"
    }

    OnStolen(hSourceAbility: ability2_shadow_shaman_voodoo) {
        this.vLastPosition = hSourceAbility.vLastPosition
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_shadow_shaman_2 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus() as ability2_shadow_shaman_voodoo
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
            let teamFilter = ability.GetAbilityTargetTeam()
            let typeFilter = ability.GetAbilityTargetType()
            let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS;
            let order = FindOrder.FIND_CLOSEST
            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()
            if (ability.vLastPosition != null && caster.IsPositionInRange(ability.vLastPosition, range)) {
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), ability.vLastPosition, radius, null, teamFilter, typeFilter, flagFilter, order)
                //  施法命令
                if (targets.length > 0) {
                    ExecuteOrderFromTable({
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        Position: ability.vLastPosition,
                        AbilityIndex: ability.entindex(),
                    })
                }
            } else {
                let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(),
                    range,
                    caster.GetTeamNumber(),
                    radius,
                    null,
                    teamFilter,
                    typeFilter,
                    flagFilter,
                    order)

                //  施法命令
                if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                    ExecuteOrderFromTable({
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        AbilityIndex: ability.entindex(),
                        Position: position,
                    })
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_shadow_shaman_2_totem extends BaseModifier_Plus {
    interval: number;
    radius: number;
    channel_time: number;
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
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.interval = this.GetSpecialValueFor("interval")
        this.radius = this.GetSpecialValueFor("radius") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_shadow_shaman_custom_1")
        this.channel_time = this.GetSpecialValueFor("channel_time")
        if (IsServer()) {
            this.StartIntervalThink(this.interval)
            this.OnIntervalThink()
        }
    }

    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            if (GameFunc.IsValid(this.GetCasterPlus())) {
                let hAbility = ability3_shadow_shaman_shackles.findIn(this.GetCasterPlus()) as ability3_shadow_shaman_shackles;
                if (GameFunc.IsValid(hAbility) && hAbility.RemoveTotem) {
                    hAbility.RemoveTotem(this.GetParentPlus())
                }
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            if (!GameFunc.IsValid(hCaster)) {
                hParent.ForceKill(false)
                this.Destroy()
                this.StartIntervalThink(-1)
                return
            }
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), this.radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)
            for (let hUnit of (tTargets)) {
                let duration = math.max(this.channel_time * hUnit.GetStatusResistanceFactor(hCaster), FrameTime())
                modifier_shadow_shaman_2_debuff.apply(hUnit, hParent, this.GetAbilityPlus(), { duration: duration })
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_shadow_shaman_2_debuff extends BaseModifier_Plus {
    amlify_damage_pct: number;
    damage_per_sec: number;
    tick_interval: number;
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
        return true
    }
    AllowIllusionDuplicate() {
        return false
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let extra_amlify_damage_pct = this.GetCasterPlus().GetTalentValue("special_bonus_unique_shadow_shaman_custom_8")
        this.amlify_damage_pct = this.GetSpecialValueFor("amlify_damage_pct") + extra_amlify_damage_pct
        this.damage_per_sec = this.GetSpecialValueFor("damage_per_sec")
        this.tick_interval = this.GetSpecialValueFor("tick_interval")
        if (params.IsOnCreated && IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            this.StartIntervalThink(this.tick_interval * hParent.GetStatusResistanceFactor(hCaster))
            this.OnIntervalThink()
            this.modifier_truesight = modifier_truesight.apply(hParent, hCaster, this.GetAbilityPlus(), null) as IBaseModifier_Plus
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_shadowshaman/shadowshaman_shackle.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(particleID, 5, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(particleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(particleID, 6, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }

    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            if (GameFunc.IsValid(this.modifier_truesight)) {
                this.modifier_truesight.Destroy()
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive() || !GameFunc.IsValid(hAbility)) {
                this.Destroy()
                return
            }
            let damage_table = {
                ability: hAbility,
                attacker: hCaster,
                victim: hParent,
                damage: this.damage_per_sec,
                damage_type: hAbility.GetAbilityDamageType(),
                eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_DOT,
            }
            if (modifier_shadow_shaman_3_hex.exist(damage_table.victim) && hCaster.HasShard()) {
                damage_table.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE
            }
            BattleHelper.GoApplyDamage(damage_table)
            this.IncrementStackCount()
            // if (GameFunc.IsValid(this.GetCasterPlus().GetSummoner()) && this.GetCasterPlus().GetSummoner().HasScepter()) {
            //     undefined
            // }

            // if (GameFunc.IsValid(this.GetCasterPlus().GetSummoner()) && this.GetCasterPlus().GetSummoner().HasScepter()) {
            //     undefined
            //          modifier_shadow_shaman_2_resistance.apply( this.GetParentPlus() , this.GetCasterPlus().GetSummoner(), this.GetAbilityPlus(), { duration = this.GetRemainingTime() })
            //     }
            //     undefined
            //          modifier_shadow_shaman_2_armor.apply( this.GetParentPlus() , this.GetCasterPlus().GetSummoner(), this.GetAbilityPlus(), { duration = this.GetRemainingTime() })
            //     }
            // }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_DISABLED
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingDamagePercentage() {
        return this.GetStackCount() * this.amlify_damage_pct
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_shadow_shaman_2_resistance extends BaseModifier_Plus {
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    resistance: number;
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
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: ModifierTable) {
        this.resistance = this.GetSpecialValueFor("resistance")
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_shadow_shaman_2_armor extends BaseModifier_Plus {
    armor: number;
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
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.armor = this.GetSpecialValueFor("armor")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE_PERCENTAGE)
    G_PHYSICAL_ARMOR_BASE_PERCENTAGE() {
        return -this.armor
    }
}
