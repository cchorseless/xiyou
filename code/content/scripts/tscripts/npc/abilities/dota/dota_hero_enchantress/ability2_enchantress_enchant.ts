import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_enchantress_enchant = { "ID": "5268", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilitySound": "Hero_Enchantress.EnchantCreep", "AbilityCastRange": "700", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "28 24 20 16", "AbilityDuration": "3.75 4.5 5.25 6", "AbilityManaCost": "40 50 60 70", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "dominate_duration": "30 60 90 120" }, "02": { "var_type": "FIELD_INTEGER", "enchant_health": "200 300 400 500" }, "03": { "var_type": "FIELD_INTEGER", "enchant_armor": "2 4 6 8" }, "04": { "var_type": "FIELD_INTEGER", "enchant_damage": "10 30 50 70" }, "05": { "var_type": "FIELD_INTEGER", "slow_movement_speed": "-55" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_enchantress_enchant extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "enchantress_enchant";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_enchantress_enchant = Data_enchantress_enchant;
    Init() {
        this.SetDefaultSpecialValue("cd", 240);
        this.SetDefaultSpecialValue("bonus_all_attr", [100, 200, 300, 400, 500]);
        this.SetDefaultSpecialValue("cd_reduce", 25);

    }

    private _LastTarget: any;

    CastFilterResultTarget(hTarget: IBaseNpc_Plus) {
        if (IsServer()) {
            if (hTarget.GetPlayerOwnerID() != this.GetCasterPlus().GetPlayerOwnerID()) {
                this.errorStr = "dota_hud_error_only_self_controllable"
                return UnitFilterResult.UF_FAIL_CUSTOM
            }
            if (modifier_enchantress_2_buff.exist(hTarget)) {
                this.errorStr = "dota_hud_error_already_enchantress_4"
                return UnitFilterResult.UF_FAIL_CUSTOM
            }
            if (hTarget == this.GetCasterPlus()) {
                this.errorStr = "dota_hud_error_cant_cast_on_self"
                return UnitFilterResult.UF_FAIL_CUSTOM
            }
            let hBuilding
            // if (type(hTarget.GetBuilding) == "function") {
            //     hBuilding = hTarget.GetBuilding()
            // }
            if (hBuilding != null) {
                // let sCardName = hBuilding.sName
                // let sRarity, bIsSummon = DotaTD.GetCardRarity(sCardName)
                // if (bIsSummon && sCardName != "npc_void_element_custom") {
                //     return UnitFilterResult.UF_FAIL_OTHER
                // } else {
                //     if (sRarity == "r") {
                //         return UnitFilter(hTarget, this.GetAbilityTargetTeam(), DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, this.GetCasterPlus().GetTeamNumber())
                //     } else {
                //         this.errorStr = "dota_hud_error_only_r"
                //         return UnitFilterResult.UF_FAIL_CUSTOM
                //     }
                // }
            }
            return UnitFilterResult.UF_FAIL_OTHER
        }
    }

    OnSpellStart() {
        let hTarget = this.GetCursorTarget()
        let hCaster = this.GetCasterPlus()
        let cd = this.GetSpecialValueFor("cd")

        // if (this.CastFilterResultTarget(hTarget) != UnitFilterResult.UF_SUCCESS) {
        //     return
        // }
        if (IsValid(this._LastTarget)) {
            this._LastTarget.RemoveModifierByNameAndCaster("modifier_enchantress_2_buff", hCaster)
        }
        //  单位名字转侍从技
        let sTargetName = hTarget.GetUnitName()
        let sAbilityName
        // for (let _sAbilityName of Object.keys(KeyValues.QualificationAbilitiesKv)) {
        //     let v = KeyValues.QualificationAbilitiesKv[_sAbilityName]

        //     if (v.UnitName == sTargetName) {
        //         sAbilityName = _sAbilityName
        //     }
        // }
        if (sAbilityName == null) {
            return
        }
        // //  获取building
        // if (type(hTarget.GetBuilding) != "function") {
        //     return
        // }
        // if (type(hCaster.GetBuilding) != "function") {
        //     return
        // }
        // let hBuilding = hCaster.GetBuilding()
        // if (hBuilding.ForceSetQualificationAbility(sAbilityName)) {
        //     if (!IsInToolsMode()) {
        //         this.StartCooldown(cd)
        //     }
        //     EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Enchantress.EnchantCreep", hCaster), hCaster)
        //     this._LastTarget = hTarget
        // }
        //  成功时给新单位加buff，失败时把前面被移除的buff加回来
        modifier_enchantress_2_buff.apply(this._LastTarget, hCaster, this, null)
    }
    OnUpgrade() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            if (IsValid(this._LastTarget)) {
                modifier_enchantress_2_buff.apply(this._LastTarget, hCaster, this, null)
            } else {
                // if (type(hCaster.GetBuilding) != "function") {
                //     return
                // }
                // let hCasterBuilding = hCaster.GetBuilding()
                // if (hCasterBuilding != null) {
                //     BuildSystem.EachBuilding(hCaster.GetPlayerOwnerID(), (hBuilding) => {
                //         if (hBuilding.sName == hCasterBuilding.QualificationUnitName) {
                //             this._LastTarget = hBuilding.hUnit
                //              modifier_enchantress_2_buff.apply( hBuilding.hUnit , hCaster, this, null)
                //         }
                //     })
                // }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_enchantress_2_buff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_enchantress_2_buff extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BONUS)
    bonus_all_attr: number;
    cd_reduce: number;
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
        return true
    }
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hParent = this.GetParentPlus()
            let hCaster = this.GetCasterPlus()
            //  召唤瞬间特效
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_enchantress/enchantress_enchant.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_POINT_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
            //  链接特效
            let iParticleID2 = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_enchantress/enchantress_4_link.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID2, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID2, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID2, false, false, -1, false, false)
        } else {
            this.StartIntervalThink(0)
        }
    }
    Init(params: IModifierTable) {
        this.bonus_all_attr = this.GetSpecialValueFor("bonus_all_attr")
        this.cd_reduce = this.GetSpecialValueFor("cd_reduce")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_GetModifierPercentageCooldown() {
        if (IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard()) {
            return this.cd_reduce
        }
        return 0
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        this._tooltip = (this._tooltip || 0) % 2 + 1
        if (this._tooltip == 1) {
            return this.bonus_all_attr
        } else if (this._tooltip == 2) {
            return this.CC_GetModifierPercentageCooldown()
        }

    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            if (!IsValid(hCaster) || !IsValid(hAbility)) {
                this.Destroy()
                return
            }
        }
    }
}
