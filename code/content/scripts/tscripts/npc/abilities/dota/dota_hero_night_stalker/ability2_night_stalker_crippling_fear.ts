import { GameFunc } from "../../../../GameFunc";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_night_stalker_crippling_fear = { "ID": "5276", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "FightRecapLevel": "1", "AbilitySound": "Hero_Nightstalker.Trickling_Fear", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilityCastRange": "375", "AbilityCastPoint": "0.2", "AbilityCooldown": "30 25 20 15", "AbilityManaCost": "50", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2", "AbilityCastGestureSlot": "DEFAULT", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration_day": "3.0 3.0 3.0 3.0" }, "02": { "var_type": "FIELD_FLOAT", "duration_night": "4.0 5.0 6.0 7.0" }, "03": { "var_type": "FIELD_INTEGER", "radius": "375" } } };

@registerAbility()
export class ability2_night_stalker_crippling_fear extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "night_stalker_crippling_fear";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_night_stalker_crippling_fear = Data_night_stalker_crippling_fear;
    Init() {
        this.SetDefaultSpecialValue("bonus_attack_speed_night", [25, 50, 80, 120, 160, 200]);
        this.SetDefaultSpecialValue("bonus_spell_amp_night", [8, 12, 16, 20, 25, 30]);
        this.SetDefaultSpecialValue("extra_damage_pct_night", 0);
        this.SetDefaultSpecialValue("kill_attack_damage", 20);
        this.SetDefaultSpecialValue("kill_void_damage", 40);
        this.SetDefaultSpecialValue("kill_fear_dps", 10);

    }

    Init_old() {
        this.SetDefaultSpecialValue("bonus_attack_speed_night", [25, 50, 80, 120, 160, 200]);
        this.SetDefaultSpecialValue("bonus_spell_amp_night", [8, 12, 16, 20, 25, 30]);
        this.SetDefaultSpecialValue("extra_damage_pct_night", 0);
        this.SetDefaultSpecialValue("kill_attack_damage", 2);
        this.SetDefaultSpecialValue("kill_void_damage", 10);
        this.SetDefaultSpecialValue("kill_fear_dps", 5);

    }




    CheckNightTime() {
        let hCaster = this.GetCasterPlus()
        let hModifier = modifier_night_stalker_2.findIn(hCaster);
        if (GameFunc.IsValid(hModifier) && hModifier.CheckNightTime != null) {
            hModifier.CheckNightTime()
        }
    }
    GetIntrinsicModifierName() {
        return "modifier_night_stalker_2"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_night_stalker_2 extends BaseModifier_Plus {
    kill_attack_damage: number;
    kill_void_damage: number;
    kill_fear_dps: number;
    private _tooltip: number;
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

        // Save(this.GetParentPlus(), "modifier_night_stalker_2", this)
        if (IsServer()) {
            this.StartIntervalThink(0)
        }
    }
    Init(params: IModifierTable) {
        this.kill_attack_damage = this.GetSpecialValueFor("kill_attack_damage")
        this.kill_void_damage = this.GetSpecialValueFor("kill_void_damage")
        this.kill_fear_dps = this.GetSpecialValueFor("kill_fear_dps")
        if (IsServer()) {
            this.CheckNightTime()
        }
    }
    BeDestroy() {

        // Save(this.GetParentPlus(), "modifier_night_stalker_2", null)
        if (IsServer()) {
            modifier_night_stalker_2_form.remove(this.GetParentPlus());
        }
    }
    CheckNightTime() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            // if ( modifier_night_stalker_3_night.exist( Environment.IsNighttime() || Environment.IsBloodmoon() || hParent )) {
            //      modifier_night_stalker_2_form.apply( hParent , hCaster, hAbility, null)
            // } else {
            //      modifier_night_stalker_2_form.remove( hParent );
            // }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            this.CheckNightTime()
        }
    }
    GetCripplingFearDPS() {
        return this.kill_fear_dps * this.GetStackCount()
    }
    GetVoidDamage() {
        return this.kill_void_damage * this.GetStackCount()
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        return this.kill_attack_damage * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        this._tooltip = (this._tooltip || 0) % 2 + 1
        if (this._tooltip == 1) {
            return this.GetVoidDamage()
        } else if (this._tooltip == 2) {
            return this.GetCripplingFearDPS()
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    OnDeath(params: IModifierTable) {
        let hAttacker = params.attacker
        if (!GameFunc.IsValid(hAttacker)) {
            return
        }
        if (hAttacker.GetTeamNumber() == params.unit.GetTeamNumber()) {
            return
        }
        if (hAttacker != null && hAttacker.GetUnitLabel() != "builder") {
            hAttacker = hAttacker.GetSource()
            if (hAttacker == this.GetParentPlus() /**&& !Spawner.IsEndless()*/ && !hAttacker.IsIllusion()) {
                if (modifier_night_stalker_2_form.exist(hAttacker)) {
                    let factor = params.unit.IsConsideredHero() && 5 || 1
                    this.SetStackCount(this.GetStackCount() + factor)
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_night_stalker_2_form extends BaseModifier_Plus {
    tWearables: any[];
    bonus_spell_amp_night: number;
    extra_damage_pct_night: number;
    bonus_attack_speed_night: number;
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

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.bonus_attack_speed_night = this.GetSpecialValueFor("bonus_attack_speed_night")
        this.bonus_spell_amp_night = this.GetSpecialValueFor("bonus_spell_amp_night")
        this.extra_damage_pct_night = this.GetSpecialValueFor("extra_damage_pct_night") + hCaster.GetTalentValue("special_bonus_unique_night_stalker_custom_7")
        if (IsServer()) {
            this.tWearables = []
            hParent.SetOriginalModel("models/heroes/nightstalker/nightstalker_night.vmdl")
            let hModel = hParent.FirstMoveChild() as IBaseNpc_Plus
            while (hModel != null) {
                if (hModel.GetClassname() != "" && hModel.GetClassname() == "dota_item_wearable" && hModel.GetModelName() != "") {
                    if (hModel.GetModelName() == ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_legarmor.vmdl", hParent)) {
                        hModel.SetModel(ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_legarmor_night.vmdl", hParent))
                    }
                    if (hModel.GetModelName() == ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_wings.vmdl", hParent)) {
                        hModel.SetModel(ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_wings_night.vmdl", hParent))
                    }
                    if (hModel.GetModelName() == ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_arms.vmdl", hParent)) {
                        hModel.SetModel(ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_arms_night.vmdl", hParent))
                    }
                    if (hModel.GetModelName() == ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_tail.vmdl", hParent)) {
                        hModel.SetModel(ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_tail_night.vmdl", hParent))
                    }
                    if (hModel.GetModelName() == ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_head.vmdl", hParent)) {
                        hModel.SetModel(ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_head_night.vmdl", hParent))
                    }
                    table.insert(this.tWearables, hModel)
                }
                hModel = hModel.NextMovePeer() as IBaseNpc_Plus
            }
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_night_stalker/nightstalker_change.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)

            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_night_stalker/nightstalker_night_buff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(1, 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    BeRefresh(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.bonus_attack_speed_night = this.GetSpecialValueFor("bonus_attack_speed_night")
        this.bonus_spell_amp_night = this.GetSpecialValueFor("bonus_spell_amp_night")
        this.extra_damage_pct_night = this.GetSpecialValueFor("extra_damage_pct_night") + hCaster.GetTalentValue("special_bonus_unique_night_stalker_custom_7")
    }
    BeDestroy() {

        let hParent = this.GetParentPlus()
        if (IsServer()) {
            hParent.SetOriginalModel("models/heroes/nightstalker/nightstalker.vmdl")
            if (this.tWearables) {
                for (let hModel of (this.tWearables)) {


                    if (hModel != null) {
                        if (GameFunc.IsValid(hModel) && hModel.GetModelName != null) {
                            if (hModel.GetModelName() == ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_legarmor_night.vmdl", hParent)) {
                                hModel.SetModel(ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_legarmor.vmdl", hParent))
                            }
                            if (hModel.GetModelName() == ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_wings_night.vmdl", hParent)) {
                                hModel.SetModel(ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_wings.vmdl", hParent))
                            }
                            if (hModel.GetModelName() == ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_arms_night.vmdl", hParent)) {
                                hModel.SetModel(ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_arms.vmdl", hParent))
                            }
                            if (hModel.GetModelName() == ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_tail_night.vmdl", hParent)) {
                                hModel.SetModel(ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_tail.vmdl", hParent))
                            }
                            if (hModel.GetModelName() == ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_head_night.vmdl", hParent)) {
                                hModel.SetModel(ResHelper.GetModelReplacement("models/heroes/nightstalker/nightstalker_head.vmdl", hParent))
                            }
                        }
                    }
                }
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    CC_OUTGOING_DAMAGE_PERCENTAGE() {
        return ((GameFunc.IsValid(this.GetCasterPlus()) && !this.GetCasterPlus().PassivesDisabled()) && this.extra_damage_pct_night || 0)
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    CC_MAX_ATTACKSPEED_BONUS() {
        return ((GameFunc.IsValid(this.GetCasterPlus()) && !this.GetCasterPlus().PassivesDisabled()) && this.bonus_attack_speed_night || 0)
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS)
    CC_SPELL_AMPLIFY_BONUS() {
        return ((GameFunc.IsValid(this.GetCasterPlus()) && !this.GetCasterPlus().PassivesDisabled()) && this.bonus_spell_amp_night || 0)
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: IModifierTable) {
        if (!GameFunc.IsValid(this.GetCasterPlus()) || this.GetCasterPlus().PassivesDisabled()) {
            return 0
        }
        return this.bonus_attack_speed_night
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.bonus_spell_amp_night
    }

}
