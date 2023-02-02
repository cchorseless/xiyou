
import { GameFunc } from "../../../../GameFunc";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { ActiveRootAbility } from "../../ActiveRootAbility";

/** dota原技能数据 */
export const Data_ursa_overpower = { "ID": "5358", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_Ursa.Overpower", "AbilityCastAnimation": "ACT_DOTA_OVERRIDE_ABILITY_3", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastRange": "0", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "12 11 10 9", "AbilityDuration": "20", "AbilityManaCost": "30 40 50 60", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "max_attacks": "3 4 5 6", "LinkedSpecialBonus": "special_bonus_unique_ursa_7" }, "02": { "var_type": "FIELD_INTEGER", "attack_speed_bonus_pct": "400 400 400 400" } } };

@registerAbility()
export class ability2_ursa_overpower extends ActiveRootAbility {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ursa_overpower";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ursa_overpower = Data_ursa_overpower;
    Init() {
        this.SetDefaultSpecialValue("chance", 15);
        this.SetDefaultSpecialValue("attack_speed_bonus_pct", 500);
        this.SetDefaultSpecialValue("max_attack_speed", 100);
        this.SetDefaultSpecialValue("duration", [1.5, 2, 2.5, 3, 3.5, 4]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("chance", 15);
        this.SetDefaultSpecialValue("attack_speed_bonus_pct", 500);
        this.SetDefaultSpecialValue("max_attack_speed", 100);
        this.SetDefaultSpecialValue("duration", [1.5, 2, 2.5, 3, 3.5, 4]);

    }


    GetIntrinsicModifierName() {
        return "modifier_ursa_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_ursa_2 extends BaseModifier_Plus {
    duration: number;
    chance: number;
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
        this.duration = this.GetSpecialValueFor("duration")
        this.chance = this.GetSpecialValueFor("chance")
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: ModifierAttackEvent) {
        if (!GameFunc.IsValid(params.target) || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker != null && params.attacker == this.GetParentPlus() && !params.attacker.PassivesDisabled()) {
            if (!modifier_ursa_2_buff.exist(params.attacker) || params.attacker.HasScepter()) {
                let hCaster = this.GetCasterPlus()
                let chance = this.chance + hCaster.GetTalentValue("special_bonus_unique_ursa_custom_1")
                let duration = this.duration
                if (GameFunc.mathUtil.PRD(chance, params.attacker, "ursa_2")) {
                    modifier_ursa_2_buff.apply(params.attacker, params.attacker, this.GetAbilityPlus(), { duration: duration })
                    params.attacker.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_3)
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ursa_2_buff extends BaseModifier_Plus {
    attack_speed_bonus_pct: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    max_attack_speed: number;
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
        let parent = this.GetParentPlus()
        if (IsServer()) {
            parent.EmitSound(ResHelper.GetSoundReplacement("Hero_Ursa.Overpower", parent))
        } else {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ursa/ursa_overpower_buff.vpcf",
                resNpc: parent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: parent
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_head", parent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(particleID, 3, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true)
            this.AddParticle(particleID, false, false, -1, false, false)
            particleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_overpower.vpcf",
                resNpc: parent,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: parent
            });

            this.AddParticle(particleID, false, true, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.attack_speed_bonus_pct = this.GetSpecialValueFor("attack_speed_bonus_pct")
        this.max_attack_speed = this.GetSpecialValueFor("max_attack_speed")
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: any) {
        return this.attack_speed_bonus_pct
    }

}
