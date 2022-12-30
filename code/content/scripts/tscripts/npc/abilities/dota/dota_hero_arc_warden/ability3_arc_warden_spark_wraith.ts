import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_arc_warden_spark_wraith = { "ID": "5679", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_ArcWarden.SparkWraith.Activate", "AbilityCastRange": "2000", "AbilityCastPoint": "0.3", "HasScepterUpgrade": "1", "AbilityCooldown": "4.0 4.0 4.0 4.0", "AbilityManaCost": "80", "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "move_speed_slow_pct": "100" }, "11": { "var_type": "FIELD_FLOAT", "scepter_bonus_duration": "0.0" }, "12": { "var_type": "FIELD_FLOAT", "scepter_activation_delay": "3.0" }, "01": { "var_type": "FIELD_INTEGER", "radius": "375" }, "02": { "var_type": "FIELD_FLOAT", "activation_delay": "2.0" }, "03": { "var_type": "FIELD_FLOAT", "duration": "45" }, "04": { "var_type": "FIELD_INTEGER", "wraith_speed": "400" }, "05": { "var_type": "FIELD_INTEGER", "spark_damage": "100 170 240 310", "LinkedSpecialBonus": "special_bonus_unique_arc_warden" }, "06": { "var_type": "FIELD_FLOAT", "think_interval": "0.2" }, "07": { "var_type": "FIELD_INTEGER", "wraith_vision_radius": "300" }, "08": { "var_type": "FIELD_FLOAT", "wraith_vision_duration": "3.34" }, "09": { "var_type": "FIELD_FLOAT", "ministun_duration": "0.4 0.5 0.6 0.7" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_arc_warden_spark_wraith extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "arc_warden_spark_wraith";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_arc_warden_spark_wraith = Data_arc_warden_spark_wraith;
    Init() {
        this.SetDefaultSpecialValue("damage_pct", [60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("max_count", 1);

    }



    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        // let arc_warden_4_table = Load(hCaster, "arc_warden_4_table") || {}
        // let max_count = this.GetSpecialValueFor("max_count") + hCaster.GetTalentValue("special_bonus_unique_arc_warden_custom_8")
        // for (let i = 1; i <= max_count; i++) {
        //     let hClone = arc_warden_4_table[i]
        //     if (GameFunc.IsValid(hClone)) {
        //         this.LinkCloneProperties(hCaster, hClone)
        //          modifier_arc_warden_3_buff.apply( hClone , hCaster, this, null)
        //         hClone.SetOrigin(hCaster.GetOrigin() + RandomVector(100))
        //         hClone.SetForwardVector(hCaster.GetForwardVector())
        //     } else {
        //         hClone = this.SpawnTempestClone()
        //         this.LinkCloneProperties(hCaster, hClone)
        //          modifier_arc_warden_3_buff.apply( hClone , hCaster, this, null)
        //         table.insert(arc_warden_4_table, hClone)
        //     }
        // }
        // Save(hCaster, "arc_warden_4_table", arc_warden_4_table)
    }
    LinkCloneProperties(hCaster: IBaseNpc_Plus, hClone: IBaseNpc_Plus) {
        // Attributes.Register(hClone)
        //         let iLevel = hCaster.GetLevel()
        //         for i = hClone.GetLevel(), iLevel - 1 do
        //             if (hClone.LevelUp != null) {
        //                 hClone.LevelUp(false)
        //             }
        // 	}

        //     if(hCaster.IsBuilding() ) {
        //     hClone.IsBuilding = (this) => {
        //         return true
        //     }
        // }
        // Items.SetUnitQualificationLevel(hClone, Items.GetUnitQualificationLevel(hCaster))

        //  可复制光环
        let tModifiers = hCaster.FindAllModifiers() as IBaseModifier_Plus[];
        for (let hModifier of (tModifiers)) {
            if (hModifier.AllowIllusionDuplicate && hModifier.AllowIllusionDuplicate()) {
                let hIllusionModifier = modifier_arc_warden_3.apply(hClone, hModifier.GetCasterPlus(), hModifier.GetAbilityPlus(), null)
            }
        }
        //  技能适配
        // for (let i = 0; i <= hCaster.GetAbilityCount() - 1; i++) {
        //     let hAbility = hCaster.GetAbilityByIndex(i)
        //     if (hAbility != null) {
        //         let hIllusionAbility  = hAbility.GetAbilityName(.findIn(  hClone )
        //         if (hIllusionAbility != null) {
        //             if (TableFindKey(DEGENERATE_BLACK_LIST, hIllusionAbility.GetAbilityName())) {
        //                 hClone.RemoveAbility(hIllusionAbility.GetAbilityName())
        //             }
        //             else {
        //                 if (hIllusionAbility.GetLevel() < hAbility.GetLevel()) {
        //                     while (hIllusionAbility.GetLevel() < hAbility.GetLevel()) {
        //                         hIllusionAbility.UpgradeAbility(true)
        //                     }
        //                 } else if (hIllusionAbility.GetLevel() >= hAbility.GetLevel()) {
        //                     hIllusionAbility.SetLevel(hAbility.GetLevel())
        //                     if (hIllusionAbility.GetLevel() == 0) {
        //                          hIllusionAbility.GetIntrinsicModifierName(.remove( hClone ) || "";
        //                     }
        //                 }
        //                 if (hAbility.GetAutoCastState() != hIllusionAbility.GetAutoCastState()) {
        //                     hIllusionAbility.ToggleAutoCast()
        //                 }
        //                 if (hAbility.GetToggleState() != hIllusionAbility.GetToggleState()) {
        //                     hIllusionAbility.ToggleAbility()
        //                 }
        //                 if (hIllusionAbility.OnStolen) {
        //                     hIllusionAbility.OnStolen(hAbility)
        //                 }
        //                 hIllusionAbility.EndCooldown()
        //             }
        //         }
        //     }
        // }
        // AbilityEvents.UpdateAbilities(hClone.entindex())
        // //  物品适配
        // for (let i = DOTA_ITEM_SLOT_1; i <= DOTA_ITEM_SLOT_9; i++) {
        //     let hItem = hClone.GetItemInSlot(i)
        //     if (hItem != null) {
        //         UTIL_Remove(hItem)
        //         //  hItem.RemoveSelf()
        //     }
        // }
        // for (let i = DOTA_ITEM_SLOT_1; i <= DOTA_ITEM_SLOT_9; i++) {
        //     let hItem = hCaster.GetItemInSlot(i)
        //     if (hItem != null && TableFindKey(CLONE_ITEM_BLACK_LIST, hItem.GetName()) == null) {
        //         let hIllusionItem = CreateItem(hItem.GetName(), hClone, hClone)
        //         hClone.AddItem(hIllusionItem)
        //         for (let j = DOTA_ITEM_SLOT_1; j <= DOTA_ITEM_SLOT_9; j++) {
        //             let _hItem = hClone.GetItemInSlot(j)
        //             if (_hItem == hIllusionItem) {
        //                 if (i != j) {
        //                     hClone.SwapItems(i, j)
        //                 }
        //                 break
        //             }
        //         }
        //         hIllusionItem.EndCooldown()
        //         hIllusionItem.SetPurchaser(null)
        //         hIllusionItem.SetShareability(ITEM_FULLY_SHAREABLE)
        //         hIllusionItem.SetPurchaseTime(hItem.GetPurchaseTime())
        //         hIllusionItem.SetCurrentCharges(hItem.GetCurrentCharges())
        //         hIllusionItem.SetItemState(hItem.GetItemState())
        //         if (hIllusionItem.GetToggleState() != hItem.GetToggleState()) {
        //             hIllusionItem.ToggleAbility()
        //         }
        //         if (hIllusionItem.GetAutoCastState() != hItem.GetAutoCastState()) {
        //             hIllusionItem.ToggleAutoCast()
        //         }
        //     }
        // }
        // hClone.SetHealth(hCaster.GetHealth())
        // hClone.SetMana(hCaster.GetMana())
        // hClone.FireClone(hCaster)
        //  天赋极限宝典
        // let buff  = modifier_item_tome_of_stats.findIn(  hCaster ) as IBaseModifier_Plus;
        // if (GameFunc.IsValid(buff)) {
        //      modifier_item_tome_of_stats.remove( hClone );
        //     let iTomeCount = 100 + hCaster.GetTalentValue("special_bonus_unique_arc_warden_custom_7")
        //    modifier_item_tome_of_stats.apply(hClone, buff.GetCasterPlus(), buff.GetAbilityPlus(), {
        //         count: buff.GetStackCount() * (iTomeCount * 0.01)
        //     })
        // }
        //  魔晶继承
        if (hCaster.HasShard()) {
            // modifier_item_aghanims_shard_custom.apply(hClone, hCaster, this, null)
        }
        //  侍从技
        let sAbilityName = ""
        for (let i = 0; i <= hCaster.GetAbilityCount() - 1; i++) {
            let hAbility = hCaster.GetAbilityByIndex(i)
            if (hAbility != null && string.find(hAbility.GetName(), "qualification_build")) {
                sAbilityName = hAbility.GetName()
            }
        }
        if (sAbilityName != "" && sAbilityName != "qualification_build_t09") {
            let sCloneAbilityName = ""
            for (let i = 0; i <= hClone.GetAbilityCount() - 1; i++) {
                let hAbility = hClone.GetAbilityByIndex(i)
                if (hAbility != null && (string.find(hAbility.GetName(), "hidden_qualification") || string.find(hAbility.GetName(), "qualification_build"))) {
                    sCloneAbilityName = hAbility.GetName()
                }
            }
            if (sCloneAbilityName != "" && sCloneAbilityName != sAbilityName) {
                hClone.AddAbility(sAbilityName)
                hClone.SwapAbilities(sAbilityName, sCloneAbilityName, true, false)
                hClone.RemoveAbility(sCloneAbilityName)
            }
        }
    }
    SpawnTempestClone() {
        let hCaster = this.GetCasterPlus()
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
        let hClone = CreateUnitByName(hCaster.GetUnitName(), (hCaster.GetAbsOrigin() + RandomVector(1) * 100) as Vector, false, hHero, hHero, hCaster.GetTeamNumber())
        hClone.SetForwardVector(hCaster.GetForwardVector())
        hClone.SetControllableByPlayer(hCaster.GetPlayerOwnerID(), true)
        let iLevel = hCaster.GetLevel()
        //         for i = hClone.GetLevel(), iLevel - 1 do
        //             if (hClone.LevelUp != null) {
        //                 hClone.LevelUp(false)
        //             }
        // 	}
        //     if(hCaster.IsBuilding()) {
        //     hClone.IsBuilding = (this) => {
        //         return true
        //     }
        // }
        //  皮肤技能
        // if (KeyValues.NpcHeroesTowerSkinKv[hCaster.GetUnitName()] != null) {
        //     for (let i = 1; i <= 24; i++) {
        //         if (KeyValues.NpcHeroesTowerSkinKv[hCaster.GetUnitName()]["EOMAbility" + i] != null) {
        //             let hAbility = hClone.AddAbility(KeyValues.NpcHeroesTowerSkinKv[hCaster.GetUnitName()]["EOMAbility" + i])
        //             hClone.SwapAbilities("ability_events", KeyValues.NpcHeroesTowerSkinKv[hCaster.GetUnitName()]["EOMAbility" + i], false, !hAbility.IsHidden())
        //         }
        //     }
        // }
        return hClone
    }

    GetIntrinsicModifierName() {
        return "modifier_arc_warden_3"
    }
}
//  Modifiers
@registerModifier()
export class modifier_arc_warden_3 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus()
            if (!GameFunc.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }
            let hCaster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }
            if (!ability.IsAbilityReady()) {
                return
            }
            let range = hCaster.Script_GetAttackRange()
            if (AoiHelper.FindEntityInRadius(hCaster.GetTeam(), hCaster.GetAbsOrigin(), range, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC).length >= 1) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
}
@registerModifier()
export class modifier_arc_warden_3_buff extends BaseModifier_Plus {
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
        if (IsServer()) {
            this.StartIntervalThink(0.1)
        }
        if (IsClient()) {
            EmitSoundOn("Hero_ArcWarden.TempestDouble", this.GetParentPlus())
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_arc_warden/arc_warden_tempest_cast.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_arc_warden_tempest.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, true, 100, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_arc_warden/arc_warden_tempest_buff.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        if (IsClient()) {
            EmitSoundOn("Hero_ArcWarden.TempestDouble", this.GetParentPlus())
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_arc_warden/arc_warden_tempest_cast.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            hParent.ForceKill(false)
            hParent.AddNoDraw()
        }
    }
    OnIntervalThink() {
        if (!IsServer()) {
            return
        }
        if (!GameFunc.IsValid(this.GetCasterPlus())) {
            this.Destroy()
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    GetTotalDamageOutgoing_Percentage(params: ModifierTable) {
        return this.GetSpecialValueFor("damage_pct") - 100
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TEMPEST_DOUBLE)
    GetTempestDouble() {
        return 1
    }
}
