import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../modifier/modifier_event";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { modifier_ursa_6_buff } from "./ability6_ursa_enrage";

/** dota原技能数据 */
export const Data_ursa_earthshock = {
    ID: "5357",
    AbilityBehavior: "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING",
    AbilityUnitDamageType: "DAMAGE_TYPE_MAGICAL",
    SpellImmunityType: "SPELL_IMMUNITY_ENEMIES_NO",
    SpellDispellableType: "SPELL_DISPELLABLE_YES",
    FightRecapLevel: "1",
    AbilitySound: "Hero_Ursa.Earthshock",
    AbilityCastRange: "0",
    HasShardUpgrade: "1",
    AbilityCooldown: "11 10 9 8",
    AbilityDuration: "4.0",
    AbilityDamage: "75 125 175 225",
    AbilityManaCost: "85",
    AbilitySpecial: {
        "01": { var_type: "FIELD_INTEGER", shock_radius: "385", LinkedSpecialBonus: "special_bonus_unique_ursa_5" },
        "02": { var_type: "FIELD_INTEGER", movement_slow: "-16 -24 -32 -40" },
        "03": { var_type: "FIELD_INTEGER", hop_distance: "250" },
        "04": { var_type: "FIELD_FLOAT", hop_duration: "0.25" },
        "05": { var_type: "FIELD_INTEGER", hop_height: "83" },
    },
    AbilityCastAnimation: "ACT_DOTA_CAST_ABILITY_1",
    AbilityCastGestureSlot: "DEFAULT",
};

@registerAbility()
export class ability1_ursa_earthshock extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ursa_earthshock";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ursa_earthshock = Data_ursa_earthshock;
    Init() {
        // this.SetDefaultSpecialValue("shock_chance", 17);
        // this.SetDefaultSpecialValue("shock_chance_per_stack", 0.5);
        // this.SetDefaultSpecialValue("shock_radius", 800);
        // this.SetDefaultSpecialValue("shock_damage", [200, 400, 600, 800, 1000, 1200]);
        // this.SetDefaultSpecialValue("shock_attack_percent", [50, 90, 140, 200, 270, 350]);
        // this.SetDefaultSpecialValue("shock_movement_slow", -30);
        // this.SetDefaultSpecialValue("shock_duration", 2);
    }

    Init_old() {
        this.SetDefaultSpecialValue("shock_chance", 17);
        this.SetDefaultSpecialValue("shock_chance_per_stack", 0.5);
        this.SetDefaultSpecialValue("shock_radius", 600);
        this.SetDefaultSpecialValue("shock_damage", [200, 400, 600, 800, 1000, 1200]);
        this.SetDefaultSpecialValue("shock_attack_percent", [50, 90, 140, 200, 270, 350]);
        this.SetDefaultSpecialValue("shock_movement_slow", -30);
        this.SetDefaultSpecialValue("shock_duration", 2);
    }

    GetCastRange(vLocation: Vector, hTarget: BaseNpc_Plus) {
        return this.GetSpecialValueFor("shock_radius");
    }
    GetIntrinsicModifierName() {
        return "modifier_ursa_1";
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_ursa_1 extends BaseModifier_Plus {
    shock_chance: number;
    shock_chance_per_stack: number;
    shock_radius: number;
    shock_damage: number;
    shock_attack_percent: number;
    shock_duration: number;
    IsHidden() {
        return true;
    }
    IsDebuff() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    IsStunDebuff() {
        return false;
    }
    AllowIllusionDuplicate() {
        return false;
    }
    Init(params: ModifierTable) {
        this.shock_chance = this.GetSpecialValueFor("shock_chance");
        this.shock_chance_per_stack = this.GetSpecialValueFor("shock_chance_per_stack");
        this.shock_radius = this.GetSpecialValueFor("shock_radius");
        this.shock_damage = this.GetSpecialValueFor("shock_damage");
        this.shock_attack_percent = this.GetSpecialValueFor("shock_attack_percent");
        this.shock_duration = this.GetSpecialValueFor("shock_duration");
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: ModifierAttackEvent) {
        if (!GameFunc.IsValid(params.target) || params.target.GetClassname() == "dota_item_drop") {
            return;
        }
        if (params.attacker != null && params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion() && !params.attacker.PassivesDisabled()) {
            let hAbility = this.GetAbilityPlus();
            if (!GameFunc.IsValid(hAbility)) {
                return;
            }
            if (
                hAbility.IsCooldownReady() &&
                UnitFilter(
                    params.target,
                    DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                    DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
                    DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES,
                    params.attacker.GetTeamNumber()
                ) == UnitFilterResult.UF_SUCCESS
            ) {
                let chance = this.shock_chance + modifier_ursa_6_buff.GetStackIn(params.attacker) * this.shock_chance_per_stack;
                if (GameFunc.mathUtil.PRD(chance, params.attacker, "ursa_1_earthshock")) {
                    hAbility.UseResources(true, true, true);
                    let fDamage =
                        this.shock_damage +
                        (this.shock_attack_percent + this.GetParentPlus().GetTalentValue("special_bonus_unique_ursa_custom_8")) * 0.01 * params.attacker.GetAverageTrueAttackDamage(params.target);
                    modifier_ursa_1_particle_ursa_earthshock.apply(params.attacker, params.attacker, hAbility, { duration: modifier_ursa_1.LOCAL_PARTICLE_MODIFIER_DURATION });
                    EmitSoundOnLocationWithCaster(params.attacker.GetAbsOrigin(), "Hero_Ursa.Earthshock", params.attacker);
                    let tTargets = AoiHelper.FindEntityInRadius(
                        params.attacker.GetTeamNumber(),
                        params.attacker.GetAbsOrigin(),
                        this.shock_radius,
                        null,
                        DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                        DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
                        DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES,
                        FindOrder.FIND_CLOSEST
                    );
                    for (let hTarget of tTargets) {
                        modifier_ursa_1_debuff.apply(hTarget, params.attacker, hAbility, { duration: this.shock_duration * hTarget.GetStatusResistanceFactor(params.attacker) });
                        let tDamageTable = {
                            ability: hAbility,
                            attacker: params.attacker,
                            victim: hTarget,
                            damage: fDamage,
                            damage_type: hAbility.GetAbilityDamageType(),
                        };
                        BattleHelper.GoApplyDamage(tDamageTable);
                    }
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ursa_1_debuff extends BaseModifier_Plus {
    shock_movement_slow: number;
    IsHidden() {
        return false;
    }
    IsDebuff() {
        return true;
    }
    IsPurgable() {
        return true;
    }
    IsPurgeException() {
        return true;
    }
    IsStunDebuff() {
        return false;
    }
    AllowIllusionDuplicate() {
        return false;
    }
    GetTexture() {
        return "ursa_earthshock";
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ursa/ursa_earthshock_modifier.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus(),
            });

            this.AddParticle(particleID, false, true, -1, false, false);
        }
    }
    Init(params: ModifierTable) {
        this.shock_movement_slow = this.GetSpecialValueFor("shock_movement_slow");
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: ModifierTable) {
        return this.shock_movement_slow;
    }
}
// // // // // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_ursa_1_particle_ursa_earthshock extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus();
        let hParent = this.GetParentPlus();
        let hAbility = this.GetAbilityPlus();
        let shock_radius = this.GetSpecialValueFor("shock_radius");
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ursa/ursa_earthshock.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster,
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(shock_radius, shock_radius / 2, shock_radius / 4));
            ParticleManager.ReleaseParticleIndex(iParticleID);
        }
    }
}
