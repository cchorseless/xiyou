
import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { ability1_vengefulspirit_magic_missile } from "./ability1_vengefulspirit_magic_missile";
import { ability2_vengefulspirit_wave_of_terror } from "./ability2_vengefulspirit_wave_of_terror";

/** dota原技能数据 */
export const Data_vengefulspirit_command_aura = { "ID": "5123", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE | DOTA_ABILITY_BEHAVIOR_AURA", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES", "AbilityCastRange": "1200", "HasScepterUpgrade": "1", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_base_damage": "11 18 25 32", "LinkedSpecialBonus": "special_bonus_unique_vengeful_spirit_2" }, "02": { "var_type": "FIELD_INTEGER", "aura_radius": "1200" }, "03": { "var_type": "FIELD_INTEGER", "illusion_damage_out_pct": "100" }, "04": { "var_type": "FIELD_INTEGER", "illusion_damage_in_pct": "100" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_vengefulspirit_command_aura extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "vengefulspirit_command_aura";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_vengefulspirit_command_aura = Data_vengefulspirit_command_aura;
    Init() {
        this.SetDefaultSpecialValue("aura_radius", 600);
        this.SetDefaultSpecialValue("bonus_attack_range", [50, 80, 120, 160, 200]);
        this.SetDefaultSpecialValue("bonus_cast_range", [50, 80, 120, 160, 200]);
        this.SetDefaultSpecialValue("primary_attributes", [5, 10, 15, 20, 25]);
        this.SetDefaultSpecialValue("max_count", [1, 1, 2, 2, 3]);
        this.SetDefaultSpecialValue("duration", 30);
        this.SetDefaultSpecialValue("illusion_damage", 0);

    }

    Init_old() {
        this.SetDefaultSpecialValue("aura_radius", 600);
        this.SetDefaultSpecialValue("bonus_attack_range", [50, 80, 120, 160, 200]);
        this.SetDefaultSpecialValue("bonus_cost_range", [50, 80, 120, 160, 200]);
        this.SetDefaultSpecialValue("primary_attributes", [5, 10, 15, 20, 25]);
        this.SetDefaultSpecialValue("max_count", [1, 1, 2, 2, 3]);
        this.SetDefaultSpecialValue("duration", 30);
        this.SetDefaultSpecialValue("illusion_damage", 0);

    }

    CastFilterResultLocation() {
        if (IsServer()) {
            let caster = this.GetCasterPlus()
            if (caster.IsIllusion() || caster.IsClone()) {
                this.errorStr = "dota_hud_error_no_illusion"
                return UnitFilterResult.UF_FAIL_CUSTOM
            }
        }
    }
    GetCustomCastErrorLocation() {
        return this.errorStr
    }
    GetAOERadius() {
        return this.GetSpecialValueFor("aura_radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
        let vTarget = this.GetCursorPosition()
        // let hIllusion = this.CreateVengefulspirit(vTarget, false, hHero, hHero, hCaster.GetTeamNumber(), -1)
    }
    //     CreateVengefulspirit(vLocation, bFindClearSpace, hNPCOwner, hUnitOwner, iTeamNumber, fDuration) {
    //         let hCaster = this.GetCasterPlus()
    //         let max_count = this.GetSpecialValueFor("max_count")
    //         let vengefulspirit_4_table = Load(hCaster, "vengefulspirit_4_table") || {}
    //         if (vengefulspirit_4_table.length >= max_count) {
    //             for (let i = 0; i <= vengefulspirit_4_table.length - max_count; i++) {
    //                 let hClone = vengefulspirit_4_table[0]
    //                 hClone.ForceKill(false)
    //                 table.remove(vengefulspirit_4_table, 1)
    //             }
    //         }
    //         Save(hCaster, "vengefulspirit_4_table", vengefulspirit_4_table)
    //         let hIllusion = CreateUnitByName(hCaster.GetUnitName(), vLocation, bFindClearSpace, hNPCOwner, hUnitOwner, iTeamNumber)

    //         Attributes.Register(hIllusion)

    //         Items.SetUnitQualificationLevel(hIllusion, Items.GetUnitQualificationLevel(hCaster))

    //         hIllusion.SetForwardVector(hCaster.GetForwardVector())
    //         hIllusion.SetControllableByPlayer(hCaster.GetPlayerOwnerID(), true)

    //         let iLevel = hCaster.GetLevel()
    //         for i = hIllusion.GetLevel(), iLevel - 1 do
    //             if (hIllusion.LevelUp != null) {
    //                 hIllusion.LevelUp(false)
    //             }
    // 	}

    //     if(hCaster.IsBuilding() ) {
    //     hIllusion.IsBuilding = () => {
    //         return true
    //     }
    // }

    // let tModifiers = hCaster.FindAllModifiers()
    // for (let i of Object.keys(tModifiers)) {
    //     let hModifier = tModifiers[i]

    //     if (hModifier.AllowIllusionDuplicate && hModifier.AllowIllusionDuplicate()) {
    //         let hIllusionModifier  =  hModifier.GetName().apply(  hIllusion , hModifier.GetCasterPlus(), hModifier.GetAbilityPlus(), null)
    //     }
    // }

    // for (let i = 0; i <= hCaster.GetAbilityCount() - 1; i++) {
    //     let hAbility = hCaster.GetAbilityByIndex(i)
    //     if (hAbility != null) {
    //         print("hAbility.GetAbilityName():", hAbility.GetAbilityName())
    //         let hIllusionAbility  = hAbility.GetAbilityName(.findIn(  hIllusion )
    //         if (hIllusionAbility == null) {
    //             hIllusionAbility = hIllusion.AddAbility(hAbility.GetAbilityName())
    //         }
    //         if (hIllusionAbility != null) {
    //             if (hIllusionAbility.GetLevel() < hAbility.GetLevel()) {
    //                 while (hIllusionAbility.GetLevel() < hAbility.GetLevel()) {
    //                     hIllusionAbility.UpgradeAbility(true)
    //                 }
    //             } else if (hIllusionAbility.GetLevel() >= hAbility.GetLevel()) {
    //                 hIllusionAbility.SetLevel(hAbility.GetLevel())
    //                 if (hIllusionAbility.GetLevel() == 0) {
    //                      hIllusionAbility.GetIntrinsicModifierName(.remove( hIllusion ) || "";
    //                 }
    //             }
    //             if (hAbility.GetAutoCastState() != hIllusionAbility.GetAutoCastState()) {
    //                 hIllusionAbility.ToggleAutoCast()
    //             }
    //             if (hAbility.GetToggleState() != hIllusionAbility.GetToggleState()) {
    //                 hIllusionAbility.ToggleAbility()
    //             }
    //         }
    //     }
    // }

    // for (let i = DOTA_ITEM_SLOT_1; i <= DOTA_ITEM_SLOT_9; i++) {
    //     let hItem = hIllusion.GetItemInSlot(i)
    //     if (hItem != null) {
    //         UTIL_Remove(hItem)
    //     }
    // }

    // hIllusion.SetHealth(hCaster.GetHealth())
    // hIllusion.SetMana(hCaster.GetMana())

    //  modifier_vengefulspirit_3_illusion.apply( hIllusion , hCaster, this, { duration = fDuration })

    // hIllusion.FireIllusionSummonned(hCaster)

    // table.insert(vengefulspirit_4_table, hIllusion)
    // Save(hCaster, "vengefulspirit_4_table", vengefulspirit_4_table)
    // return hIllusion
    // }
    // GetIntrinsicModifierName() {
    //     return "modifier_vengefulspirit_3"
    // }
    // IsHiddenWhenStolen() {
    //     return false
    // }
    // ProcsMagicStick() {
    //     return false
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_vengefulspirit_3 extends BaseModifier_Plus {
    duration: number;
    aura_radius: number;
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
    IsAura() {
        return !this.GetParentPlus().PassivesDisabled()
    }
    GetAuraEntityReject(hEntity: BaseNpc_Plus) {
        if (hEntity.GetUnitLabel() != "HERO") {
            return true
        }
        return false
    }
    GetAura() {
        return "modifier_vengefulspirit_3_aura"
    }
    GetAuraRadius() {
        return this.aura_radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES
    }
    Init(params: ModifierTable) {
        this.duration = this.GetSpecialValueFor("duration")
        this.aura_radius = this.GetSpecialValueFor("aura_radius")
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    OnTakeDamage(params: ModifierTable) {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            if (hParent.PassivesDisabled() || hParent.IsIllusion()) {
                return
            }
            let hAbility = params.inflictor
            if (GameFunc.IsValid(hAbility) && hAbility.IsItem != null && GameFunc.IsValid(params.unit) && hAbility != this.GetAbilityPlus() && !hAbility.IsItem() && !hAbility.IsToggle() && hAbility.ProcsMagicStick()) {
                // let vengefulspirit_4_table = Load(hParent, "vengefulspirit_4_table") || {}
                let vengefulspirit_4_table = [] as any[]
                // 给主身范围内的友方单位添加主属性
                let tFirstTargets = FindUnitsInRadius(hParent.GetTeamNumber(), hParent.GetAbsOrigin(), null, this.aura_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false)
                for (let hTarget of (tFirstTargets)) {
                    if (modifier_vengefulspirit_3_aura.exist(hTarget)) {
                        ;
                        modifier_vengefulspirit_3_attributes.apply(hTarget, hParent, this.GetAbilityPlus(), { duration: this.duration })
                    }
                }
                for (let i = vengefulspirit_4_table.length - 1; i >= 0; i--) {
                    let hClone = vengefulspirit_4_table[i]
                    if (GameFunc.IsValid(hClone)) {
                        // 给分身范围内的友方单位添加主属性
                        let tTargets = FindUnitsInRadius(hParent.GetTeamNumber(), hClone.GetAbsOrigin(), null, this.aura_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false)
                        for (let hTarget of (tTargets)) {
                            if (modifier_vengefulspirit_3_aura.exist(hTarget) && tFirstTargets.indexOf(hTarget) == -1) {
                                ;
                                modifier_vengefulspirit_3_attributes.apply(hTarget, hParent, this.GetAbilityPlus(), { duration: this.duration })
                            }
                        }
                    } else {
                        table.remove(vengefulspirit_4_table, i)
                    }
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_vengefulspirit_3_aura extends BaseModifier_Plus {
    bonus_attack_range: number;
    bonus_cast_range: number;
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
        this.bonus_attack_range = this.GetSpecialValueFor("bonus_attack_range")
        this.bonus_cast_range = this.GetSpecialValueFor("bonus_cast_range")
    }

    OnDestroy() {
        super.OnDestroy()
        if (IsServer()) {
            modifier_vengefulspirit_3_attributes.remove(this.GetParentPlus());
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    GetAttackRangeBonus(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hCaster)) {
            return this.bonus_attack_range + hCaster.GetTalentValue("special_bonus_unique_vengefulspirit_custom_4")
        }
        return this.bonus_attack_range
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING)
    GetCastRangeBonusStacking(params: ModifierAbilityEvent) {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(params.ability)) {
            let arrinfo = GameFunc.IncludeArgs(params.ability.GetBehaviorInt(),
                DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ATTACK,
                DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET,
                DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT,
                DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET,
                DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_POINT,
                DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_RUNE_TARGET,
                DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_VECTOR_TARGETING,
            )
            if (arrinfo[0]) {
                if (GameFunc.IsValid(hCaster)) {
                    return this.bonus_attack_range + hCaster.GetTalentValue("special_bonus_unique_vengefulspirit_custom_4")
                }
                return this.bonus_attack_range
            }
            else if (arrinfo[1] || arrinfo[2] || arrinfo[3] || arrinfo[4] || arrinfo[5] || arrinfo[6]) {
                if (GameFunc.IsValid(hCaster)) {
                    return this.bonus_cast_range + hCaster.GetTalentValue("special_bonus_unique_vengefulspirit_custom_4")
                }
                return this.bonus_cast_range
            }
        }
        else if (!GameFunc.IsValid(params.ability)) {
            if (GameFunc.IsValid(hCaster)) {
                return this.bonus_cast_range + hCaster.GetTalentValue("special_bonus_unique_vengefulspirit_custom_4")
            }
            return this.bonus_cast_range
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_vengefulspirit_3_attributes extends BaseModifier_Plus {
    primary_attributes: number;
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
    GetTexture() {
        return "vengefulspirit_command_aura"
    }

    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.primary_attributes = this.GetSpecialValueFor("primary_attributes") + (GameFunc.IsValid(hCaster) && hCaster.GetTalentValue("special_bonus_unique_vengefulspirit_custom_7") || 0)
        if (IsServer()) {
            this.IncrementStackCount()
            this.addTimer(params.duration, () => {
                this.DecrementStackCount()
            })
        }
    }



    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    Tooltip() {
        return this.GetStackCount() * this.primary_attributes
    }
    // @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATS_PRIMARY_BONUS)
    EOM_GetModifierBonusStats_Primary() {
        return this.GetStackCount() * this.primary_attributes
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_vengefulspirit_3_illusion extends BaseModifier_Plus {
    illusion_damage: number;
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
        super.OnCreated(params)
        if (IsServer()) {
            this.StartIntervalThink(0.1)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_illusion.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, true, 10000, false, false)
        }
    }
    Init(params: ModifierTable) {
        this.illusion_damage = this.GetSpecialValueFor("illusion_damage")
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()

            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                this.Destroy()
                return
            }

            let iLevel = hCaster.GetLevel()
            while (hParent.GetLevel() < iLevel) {
                // hParent.LevelUp(false)
            }
            for (let i = 0; i <= hParent.GetAbilityCount() - 1, 1; i++) {
                let hAbility = hParent.GetAbilityByIndex(i)
                if (GameFunc.IsValid(hAbility)) {
                    let _hAbility = hCaster.FindAbilityByName(hAbility.GetName())
                    if (GameFunc.IsValid(_hAbility)) {
                        if (hAbility.GetLevel() != _hAbility.GetLevel()) {
                            hAbility.SetLevel(_hAbility.GetLevel())
                        }
                        if (hAbility.GetAutoCastState() != _hAbility.GetAutoCastState()) {
                            hAbility.ToggleAutoCast()
                        }
                        if (hAbility.GetToggleState() != _hAbility.GetToggleState()) {
                            hAbility.ToggleAbility()
                        }
                        hAbility.SetHidden(_hAbility.IsHidden())
                        hAbility.SetActivated(_hAbility.IsActivated())
                    }
                }
            }
        }
    }
    OnDestroy() {
        super.OnDestroy()
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            hParent.ForceKill(false)
            hParent.AddNoDraw()
        }
    }

    // @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE_SPECIAL)
    EOM_GetModifierOutgoingDamagePercentageSpecial(params: ModifierTable) {
        return this.illusion_damage - 100
    }
}
