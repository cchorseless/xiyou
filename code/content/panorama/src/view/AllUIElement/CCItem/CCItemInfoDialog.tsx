
import React from "react";

import { CSSHelper } from "../../../helper/CSSHelper";
import { AbilityHelper, ItemHelper, UnitHelper } from "../../../helper/DotaEntityHelper";
import { FuncHelper } from "../../../helper/FuncHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { CCPanel } from "../CCPanel/CCPanel";

import { CCPanelBG } from "../CCPanel/CCPanelPart";
import "./CCItemInfoDialog.less";

interface ICCItemInfoDialog extends NodePropsData {
    itemname: string,
    castentityindex?: EntityIndex,
    inventoryslot?: number,
    level?: number,
}

export class CCItemInfoDialog extends CCPanel<ICCItemInfoDialog> {
    // defaultStyle() {
    //     return { width: "600px", height: "400px" }
    // }
    // defaultClass() {
    //     return CSSHelper.ClassMaker("AbilityDetails", this.toggleClass)
    // }

    getConfigData(key: string) {
        const itemname = this.props.itemname;
        const [isitem, tData] = KVHelper.GetAbilityOrItemData(itemname) || {};
        return tData[key]
    }

    getConfigDataAsInt(key: string) {
        return Number(this.getConfigData(key)) || 0
    }

    static defaultProps = {
        castentityindex: -1,
        inventoryslot: -1,
        level: -1,
        // mode: "normal",
        // showextradescription: false,
        // onlynowlevelvalue: false,
    }


    parseAbilityDescription() {
        const sAbilityName = this.props.itemname;
        const castentityindex = this.props.castentityindex;
        const level = this.props.level!;
        let sAllDescription = "#DOTA_Tooltip_ability_" + sAbilityName + "_Description";
        let list: JSX.Element[] = [];
        let sAllDescriptionLocalize = $.Localize(sAllDescription);
        if (sAllDescriptionLocalize != sAllDescription) {
            let aDescriptions = sAllDescriptionLocalize.split("\n");
            for (let i = 0, len = aDescriptions.length; i < len; i++) {
                let sDescription = aDescriptions[i];
                if (sDescription == "") continue;
                let regexp = new RegExp("<h1>.+?</h1>", "");
                let aHeaders = sDescription.match(regexp);
                if (aHeaders) {
                    for (let sHeader of aHeaders) {
                        list.push(<Label key={list.length} className={CSSHelper.ClassMaker('Header', { 'Active': true })} text={sHeader} html={true} />);
                    }
                }
                sDescription = sDescription.replace(regexp, "");
                sDescription = sDescription.replace(/%%/g, "%");
                sDescription = AbilityHelper.ReplaceAbilityValuesDes({ sStr: sDescription, sAbilityName: sAbilityName, iLevel: level, iEntityIndex: castentityindex });
                list.push(
                    <Label key={list.length} className={CSSHelper.ClassMaker('AbilityMechanics', { 'Active': true, })} text={sDescription} html={true} />
                );
            }
            let sExtraEffect = $.Localize("#DOTA_Tooltip_ability_" + sAbilityName + "_extra_effect");
            if (sExtraEffect != "#DOTA_Tooltip_ability_" + sAbilityName + "_extra_effect") {
                let regexp = new RegExp("<h1>.+?</h1>", "");
                let aHeaders = sExtraEffect.match(regexp);
                if (aHeaders) {
                    for (const sHeader of aHeaders) {
                        let _sCondition = $.Localize("#dota_ability_extra_effect_condition");
                        let aCondition = sHeader.match(/%.+?%/g);
                        if (aCondition) {
                            for (const sCondition of aCondition) {
                                _sCondition += $.Localize("#dota_ability_variable_" + sCondition.replace(/%/g, ""));
                            }
                        }
                        list.push(
                            <Label key={list.length} className={CSSHelper.ClassMaker('Header')} text={_sCondition} html={true} />
                        );
                    }
                }
                sExtraEffect = sExtraEffect.replace(regexp, "");
                sExtraEffect = sExtraEffect.replace(/%%/g, "%");
                sExtraEffect = AbilityHelper.ReplaceAbilityValuesDes({ sStr: sExtraEffect, sAbilityName: sAbilityName, iLevel: level, iEntityIndex: castentityindex });
                list.push(
                    <Label key={list.length} className={CSSHelper.ClassMaker('ExtraEffect', { 'Active': true, })} text={sExtraEffect} html={true} />
                );
            }
        }
        return list;
    }

    parseAbilitySpecial() {
        const sAbilityName = this.props.itemname;
        const castentityindex = this.props.castentityindex;
        const level = this.props.level!;
        let list: JSX.Element[] = [];
        let speclabel: string[] = AbilityHelper.GetAbilitySpecialDes(sAbilityName, level, castentityindex);
        speclabel.forEach(t => {
            list.push(
                <Label key={list.length} className={CSSHelper.ClassMaker('AbilitySpecial', { 'Active': true, })} text={t} html={true} />
            );
        })
        return list;
    }

    render() {
        const dialogVariables: { [x: string]: any; } = {};
        const itemname = this.props.itemname;
        LogHelper.print(itemname)
        const castentityindex = this.props.castentityindex!;
        const tData = KVHelper.KVItems()[itemname] || {};
        const iLevel = this.props.level || -1;
        const inventoryslot = this.props.inventoryslot!;
        // const mode = this.props.mode;
        // const showextradescription = this.props.showextradescription!;
        // const onlynowlevelvalue = this.props.onlynowlevelvalue!;
        let iItemIndex = -1 as ItemEntityIndex;
        if (castentityindex != -1 && inventoryslot != -1) {
            iItemIndex = Entities.GetItemInSlot(castentityindex, inventoryslot)
        }
        let iMaxLevel = iItemIndex == -1 ? Number(tData.MaxUpgradeLevel || 0) || 0 : 1;
        let bIsConsumable = tData.ItemQuality == "consumable";
        let iItemCost = iItemIndex != -1 ? Items.GetCost(iItemIndex) : ItemHelper.GetItemCost(itemname);
        let bIsSellable = iItemIndex != -1 ? Items.IsSellable(iItemIndex) : false;

        let ShowItemCost = iItemIndex == -1 && iItemCost != 0;
        let NotEnoughGold = false
        if (ShowItemCost) {
            dialogVariables['buy_cost'] = iItemCost;
            let iGold = Players.GetGold(Players.GetLocalPlayer());
            NotEnoughGold = castentityindex != -1 && iGold < iItemCost;
            if (NotEnoughGold) {
                NotEnoughGold = iGold < iItemCost;
                dialogVariables['buy_cost_deficit'] = iItemCost - iGold;
            }
        }

        let ShowSellPrice = iItemIndex != -1 && iItemCost != 0 && bIsSellable;
        let ShowSellPriceTime = false
        if (ShowSellPrice) {
            let fPurchaseTime = Items.GetPurchaseTime(iItemIndex);
            let bOriginalPrice = Game.GetGameTime() <= fPurchaseTime + 10;
            dialogVariables['sell_price'] = bOriginalPrice ? iItemCost : iItemCost / 2;
            ShowSellPriceTime = bOriginalPrice;
            ShowSellPrice = !bOriginalPrice;
            let fTime = (Game.GetGameTime() - fPurchaseTime);
            let sStr = "";
            if (fTime <= 10) {
                fTime = parseInt((10 - fTime).toFixed(0));
                let sMinute = (Math.floor(fTime / 60)).toString();
                let sSecond = (fTime % 60).toString();
                if (sSecond.length == 1) sSecond = "0" + sSecond;
                sStr = sMinute + ":" + sSecond;
            }
            dialogVariables['sell_time'] = sStr;
        }

        let iBehavior = iItemIndex != -1 ? Abilities.GetBehavior(iItemIndex) : AbilityHelper.SBehavior2IBehavior(tData.AbilityBehavior || "");
        let sCastType = AbilityHelper.getCastType(iBehavior);
        dialogVariables['casttype'] = $.Localize("#" + sCastType);
        let iTeam = iItemIndex != -1 ? Abilities.GetAbilityTargetTeam(iItemIndex) : AbilityHelper.STeam2ITeam(tData.AbilityUnitTargetTeam || "");
        let iType = iItemIndex != -1 ? Abilities.GetAbilityTargetType(iItemIndex) : AbilityHelper.SType2IType(tData.AbilityUnitTargetType || "");
        let sTargetType = AbilityHelper.getTargetType(iTeam, iType);
        dialogVariables['targettype'] = $.Localize("#" + sTargetType);
        let iDamageType = iItemIndex != -1 ? Abilities.GetAbilityDamageType(iItemIndex) : AbilityHelper.SDamageType2IDamageType(tData.AbilityUnitDamageType || "");
        let sDamageType = AbilityHelper.getDamageType(iDamageType);
        dialogVariables['damagetype'] = $.Localize("#" + sDamageType);
        let sSpellImmunity = AbilityHelper.getSpellImmunity(tData.SpellImmunityType || "");
        dialogVariables['spellimmunity'] = $.Localize("#" + sSpellImmunity);
        let sSpellDispellableType = tData.SpellDispellableType || "";
        let sDispelType = AbilityHelper.getDispelType(sSpellDispellableType);
        dialogVariables['dispeltype'] = $.Localize("#" + sDispelType);

        let ScepterUpgradable = (tData.HasScepterUpgrade ? tData.HasScepterUpgrade == "1" : false) && Entities.HasScepter(castentityindex);
        if (ScepterUpgradable) {
            let sScepterUpgradeDescription = $.Localize("#DOTA_Tooltip_ability_" + itemname + "_aghanim_description");
            if (sScepterUpgradeDescription != "#DOTA_Tooltip_ability_" + itemname + "_aghanim_description") {
                sScepterUpgradeDescription = sScepterUpgradeDescription.replace(/%%/g, "%");
                // sScepterUpgradeDescription = AbilityHelper.ReplaceAbilityValues({ sStr: sScepterUpgradeDescription, bShowExtra: showextradescription, sAbilityName: itemname, iLevel: iLevel, iEntityIndex: castentityindex, bOnlyNowLevelValue: onlynowlevelvalue });
                dialogVariables['scepter_upgrade_description'] = sScepterUpgradeDescription;
            } else {
                ScepterUpgradable = false;
            }
        }

        // 属性
        let aValueNames = AbilityHelper.GetSpecialNames(itemname, castentityindex);
        let sAttributes = "";
        let sExtraAttributes = "";
        for (let i = 0; i < aValueNames.length; i++) {
            const sValueName = aValueNames[i];
            let bRequiresScepter = (Number(AbilityHelper.GetSpecialValueWithTag(itemname, sValueName, AbilityHelper.AbilitySpecialValueTag.RequiresScepter, castentityindex)) || 0) == 1;
            if (bRequiresScepter && castentityindex != -1 && !Entities.HasScepter(castentityindex!)) {
                continue;
            }
            let sValueDescription = "#DOTA_Tooltip_ability_" + itemname + "_" + sValueName;
            switch (sValueName) {
                case "abilitydamage":
                    var aValues = AbilityHelper.StringToValues(tData.AbilityDamage || "");
                    sValueDescription = "AbilityDamage";
                    if (aValues.length == 0 || (aValues.length == 1 && aValues[0] == 0)) sValueDescription = "";
                    break;
            }
            let sValueLocalize = $.Localize(sValueDescription);
            if (sValueLocalize == sValueDescription) {
                let sVariableLocalize = $.Localize("#dota_tooltip_item_variable_" + sValueName);
                if (sVariableLocalize != "#dota_tooltip_item_variable_" + sValueName) {
                    sValueLocalize = sVariableLocalize;
                }
            }
            if (sValueLocalize != sValueDescription) {
                let bHasPercentSign = sValueLocalize.search(/%/g) == 0;
                if (bHasPercentSign) {
                    sValueLocalize = sValueLocalize.substring(1);
                }

                let bHasSign = sValueLocalize.search(/[\+\-]/g) == 0;
                if (bHasSign) {
                    let sSign = sValueLocalize.substring(0, 1);
                    sValueLocalize = sValueLocalize.substring(1);

                    if (sAttributes != "") sAttributes = sAttributes + "<br>";
                    if (bRequiresScepter) sAttributes = sAttributes + "<span class='ScepterUpgrade'>";

                    sAttributes = sAttributes + sSign;
                    sAttributes = sAttributes + " %" + sValueName + "%";
                    if (bHasPercentSign) {
                        sAttributes = sAttributes + "%";
                    }
                    sAttributes = sAttributes + " ";
                    let aVariables = sValueLocalize.match(/\$(.+?)\b/g);
                    if (aVariables) {
                        for (const block of aVariables) {
                            let sVariable = block.substring(1);
                            let sVariableLocalize = $.Localize("#dota_ability_variable_" + sVariable);
                            if (sVariableLocalize != "#dota_ability_variable_" + sVariable) {
                                let bHasPercentSign = sVariableLocalize.search(/%/g) == 0;
                                if (bHasPercentSign) {
                                    sVariableLocalize = sVariableLocalize.substr(1);
                                }
                                sAttributes = sAttributes + sVariableLocalize;
                            }
                        }
                    } else {
                        sAttributes = sAttributes + sValueLocalize;
                    }

                    if (bRequiresScepter) sAttributes = sAttributes + "</span>";
                } else {
                    if (sExtraAttributes != "") sExtraAttributes = sExtraAttributes + "<br>";
                    if (bRequiresScepter) sExtraAttributes = sExtraAttributes + "<span class='ScepterUpgrade'>";

                    sExtraAttributes = sExtraAttributes + sValueLocalize;
                    sExtraAttributes = sExtraAttributes + " %" + sValueName + "%";
                    if (bHasPercentSign) {
                        sExtraAttributes = sExtraAttributes + "%";
                    }

                    if (bRequiresScepter) sExtraAttributes = sExtraAttributes + "</span>";
                }
            }
        }
        sAttributes = AbilityHelper.ReplaceAbilityValuesDes({ sStr: sAttributes, sAbilityName: itemname, iLevel: iLevel, iEntityIndex: castentityindex });
        dialogVariables['attributes'] = sAttributes;

        sExtraAttributes = AbilityHelper.ReplaceAbilityValuesDes({ sStr: sExtraAttributes, sAbilityName: itemname, iLevel: iLevel, iEntityIndex: castentityindex });
        dialogVariables['extra_attributes'] = sExtraAttributes;


        let bIsActive = AbilityHelper.isActive(iBehavior);
        let iActiveDescriptionLine = tData.ActiveDescriptionLine || 1;
        let sLore = "#DOTA_Tooltip_ability_" + itemname + "_Lore";
        dialogVariables['lore'] = $.Localize(sLore);

        let sExtraDescription = "";
        const iMaxNote = 13;
        for (let i = 0; i < iMaxNote; i++) {
            let sNote = "#DOTA_Tooltip_ability_" + itemname + "_note" + i;
            if ($.Localize(sNote) != sNote) {
                if (sExtraDescription != "") sExtraDescription = sExtraDescription + "<br>";
                sExtraDescription = sExtraDescription + $.Localize(sNote);
            }
        }
        sExtraDescription = AbilityHelper.ReplaceAbilityValuesDes({ sStr: sExtraDescription, sAbilityName: itemname, iLevel: iLevel, iEntityIndex: castentityindex });
        dialogVariables['extradescription'] = sExtraDescription;

        // 冷却时间
        let aCooldowns = AbilityHelper.StringToValues(tData.AbilityCooldown || "");
        for (let i = 0; i < Math.max(aCooldowns.length, iMaxLevel); i++) {
            aCooldowns[i] = iItemIndex != -1 ? AbilityHelper.GetLevelCooldown(iItemIndex, i) : (aCooldowns[i] || 0);
        }
        aCooldowns = AbilityHelper.SimplifyValuesArray(aCooldowns);
        let fCurrentCooldown = iItemIndex != -1 ? AbilityHelper.GetLevelCooldown(iItemIndex) : 0;
        let fCooldownReduction = castentityindex != -1 ? UnitHelper.GetCooldownReduction(castentityindex) : 0;
        fCurrentCooldown = FuncHelper.ToFloat(fCurrentCooldown * (1 - fCooldownReduction * 0.01));
        let sCooldownDescription = "";
        if (!(aCooldowns.length == 0 || (aCooldowns.length == 1 && aCooldowns[0] == 0))) {
            for (let level = 0; level < aCooldowns.length; level++) {
                const value = FuncHelper.ToFloat(aCooldowns[level] * (1 - fCooldownReduction * 0.01));
                if (sCooldownDescription != "") {
                    sCooldownDescription = sCooldownDescription + " / ";
                }
                let sValue = FuncHelper.Round(Math.abs(value), 2) + "";
                if (iLevel != -1 && (level + 1 == Math.min(iLevel, aCooldowns.length))) {
                    sValue = "<span class='GameplayVariable'>" + sValue + "</span>";
                }
                sCooldownDescription = sCooldownDescription + sValue;
            }
        }
        if (sCooldownDescription != "") {
            sCooldownDescription = "<span class='GameplayValues'>" + sCooldownDescription + "</span>";
            dialogVariables['cooldown'] = sCooldownDescription;
        }

        // 魔法消耗
        let fCurrentManaCost = iItemIndex != -1 ? AbilityHelper.GetLevelManaCost(iItemIndex) : 0;
        // fCurrentManaCost = AbilityHelper.CalcSpecialValueUpgrade(entityindex, itemname, "mana_cost", fCurrentManaCost);
        let aManaCosts = AbilityHelper.StringToValues(tData.AbilityManaCost || "");
        for (let i = 0; i < Math.max(aManaCosts.length, iMaxLevel); i++) {
            aManaCosts[i] = iItemIndex != -1 ? AbilityHelper.GetLevelManaCost(iItemIndex, i) : (aManaCosts[i] || 0);
        }
        aManaCosts = AbilityHelper.SimplifyValuesArray(aManaCosts);
        let sManaCostDescription = "";
        if (!(aManaCosts.length == 0 || (aManaCosts.length == 1 && aManaCosts[0] == 0))) {
            for (let level = 0; level < aManaCosts.length; level++) {
                const value = aManaCosts[level];
                if (sManaCostDescription != "") {
                    sManaCostDescription = sManaCostDescription + " / ";
                }
                let sValue = FuncHelper.Round(Math.abs(value)) + "";
                if (iLevel != -1 && (level + 1 == Math.min(iLevel, aManaCosts.length))) {
                    sValue = "<span class='GameplayVariable'>" + sValue + "</span>";
                    fCurrentManaCost = value;
                }
                sManaCostDescription = sManaCostDescription + sValue;
            }
        }
        if (sManaCostDescription != "") {
            sManaCostDescription = "<span class='GameplayValues'>" + sManaCostDescription + "</span>";
            dialogVariables['manacost'] = sManaCostDescription;
        }
        dialogVariables['current_manacost'] = fCurrentManaCost.toFixed(0);
        dialogVariables['current_cooldown'] = Number(fCurrentCooldown.toFixed(2)).toString();


        // 物品等级，用中立物品的样式来显示
        let iNeutralTier = ItemHelper.GetItemRarityNumber(itemname);
        let IsNeutralItem = false;
        let siNeutralTiercls = "";
        if (iNeutralTier != 0) {
            IsNeutralItem = iNeutralTier >= 0;
            siNeutralTiercls = 'NeutralTier' + (iNeutralTier + 1);
            dialogVariables['neutral_item_tier_number'] = iNeutralTier + 1;
        }
        let ShowItemSubtitle = false;
        if (iItemIndex != -1) {
            if (sCastType == "DOTA_ToolTip_Ability_Toggle") {
                ShowItemSubtitle = true;
                if (Abilities.GetToggleState(iItemIndex)) {
                    dialogVariables['item_subtitle'] = $.Localize("#DOTA_Aura_Inactive");
                } else {
                    dialogVariables['item_subtitle'] = $.Localize("#DOTA_Aura_Active");
                }
            } else {
                let iCurrentCharges = Items.GetCurrentCharges(iItemIndex);
                if (Items.IsPermanent(iItemIndex)) {
                    if (Items.AlwaysDisplayCharges(iItemIndex)) {
                        ShowItemSubtitle = true;
                        dialogVariables['item_subtitle'] = ($.Localize("#DOTA_Charges")).replace(/%s1/g, String(iCurrentCharges));
                    }
                } else if (iCurrentCharges > 0) {
                    if (!Items.ForceHideCharges(iItemIndex)) {
                        ShowItemSubtitle = true;
                        dialogVariables['item_subtitle'] = ($.Localize("#DOTA_StackCount")).replace(/%s1/g, String(iCurrentCharges));
                    }
                }
            }
        }

        return (this.__root___isValid &&
            <Panel id="CC_ItemInfoDialog" ref={this.__root__}  {...this.initRootAttrs()}>
                <CCPanelBG id="PanelBg" type="ToolTip">
                    <Panel id="ItemHeader">
                        <DOTAItemImage id="ItemImg" itemname={itemname} showtooltip={false} />
                        <Panel id="HeaderLabels">
                            <Panel id="AbilityHeader">
                                <Label id="AbilityName" className="TitleFont" text={$.Localize("#DOTA_Tooltip_ability_" + itemname)} html={true} />
                                <Label id="AbilityLevel" className={CSSHelper.ClassMaker({ 'Hidden': iMaxLevel <= 0 })} localizedText="#DOTA_AbilityTooltip_Level" html={true} dialogVariables={dialogVariables} />
                            </Panel>
                            <Panel id="AbilitySubHeader">
                                <Label id="ItemSubtitle" className={CSSHelper.ClassMaker({ 'Hidden': ShowItemSubtitle })} localizedText="{s:item_subtitle}" dialogVariables={dialogVariables} />
                                <Panel id="ItemAvailibilityMainShop" className="ItemAvailabilityRow">
                                    <Panel className="ItemAvailabilityIcon MainShopIcon" />
                                </Panel>
                                <Panel id="ItemAvailibilitySideShop" className="ItemAvailabilityRow">
                                    <Panel className="ItemAvailabilityIcon SideShopIcon" />
                                </Panel>
                                <Panel id="ItemAvailibilitySecretShop" className="ItemAvailabilityRow">
                                    <Panel className="ItemAvailabilityIcon SecretShopIcon" />
                                </Panel>
                                <Panel className="TopBottomFlow">
                                    <Label id="NeutralItemTier" className={CSSHelper.ClassMaker(siNeutralTiercls, { 'Hidden': IsNeutralItem })} html={true} localizedText="#DOTA_NeutralItemTier" />
                                    <Panel className="LeftRightFlow">
                                        <Panel id="ItemCost" className={CSSHelper.ClassMaker({ 'Hidden': !ShowItemCost })} >
                                            <Panel id="ItemCostIcon" />
                                            <Label id="BuyCostLabel" localizedText="{d:r:buy_cost}" dialogVariables={dialogVariables} />
                                            <Label id="BuyCostDeficit" localizedText="(-{d:r:buy_cost_deficit})" dialogVariables={dialogVariables} />
                                        </Panel>
                                        <Panel id="StockContainer">
                                            <Label id="RestockTime" localizedText="#DOTA_HUD_Shop_Restock" />
                                            <Label id="StockAmount" localizedText="#DOTA_HUD_Shop_StockAmount" />
                                        </Panel>
                                    </Panel>
                                </Panel>
                            </Panel>
                            <Label id="CostToComplete" localizedText="#DOTA_HUD_Shop_Item_Complete" />
                        </Panel>
                    </Panel>

                    <Panel id="AbilityTarget">
                        <Panel id="AbilityTopRowContainer">
                            <Label id="AbilityCastType" className={CSSHelper.ClassMaker({ 'Hidden': sCastType == "" })} localizedText="#DOTA_AbilityTooltip_CastType" html={true} dialogVariables={dialogVariables} />
                            <Panel id="CurrentAbilityCosts" className={CSSHelper.ClassMaker({ 'Hidden': (fCurrentCooldown == 0 && fCurrentManaCost == 0) })}>
                                <Label id="CurrentAbilityManaCost" className={CSSHelper.ClassMaker("ManaCost", { 'Hidden': fCurrentManaCost == 0 })} localizedText="{s:current_manacost}" html={true} dialogVariables={dialogVariables} />
                                <Label id="CurrentAbilityCooldown" className={CSSHelper.ClassMaker("Cooldown", { 'Hidden': fCurrentCooldown == 0 })} localizedText="{s:current_cooldown}" html={true} dialogVariables={dialogVariables} />
                            </Panel>
                        </Panel>
                        <Label id="AbilityTargetType" className={CSSHelper.ClassMaker({ 'Hidden': sTargetType == "" })} localizedText="#DOTA_AbilityTooltip_TargetType" html={true} dialogVariables={dialogVariables} />
                        <Label id="AbilityDamageType" className={CSSHelper.ClassMaker({ 'Hidden': sDamageType == "" })} localizedText="#DOTA_AbilityTooltip_DamageType" html={true} dialogVariables={dialogVariables} />
                        <Label id="AbilitySpellImmunityType" className={CSSHelper.ClassMaker({ 'Hidden': sSpellImmunity == "" })} localizedText="#DOTA_AbilityTooltip_SpellImmunityType" html={true} dialogVariables={dialogVariables} />
                        <Label id="AbilityDispelType" className={CSSHelper.ClassMaker({ 'Hidden': sDispelType == "" })} localizedText="#DOTA_AbilityTooltip_DispelType" html={true} dialogVariables={dialogVariables} />
                    </Panel>
                    <Panel id="AbilityCoreDetails">
                        <Label id="AbilityAttributes" className={CSSHelper.ClassMaker({ 'Hidden': sAttributes == "" })} localizedText="#DOTA_AbilityTooltip_Attributes" html={true} dialogVariables={dialogVariables} />
                        <Panel id="AbilityDescriptionOuterContainer">
                            <Panel id="CurrentItemCosts" >
                                <Label className="Cooldown" localizedText="{s:current_cooldown}" html={true} dialogVariables={dialogVariables} />
                                <Label className="ManaCost" localizedText="{s:current_manacost}" html={true} dialogVariables={dialogVariables} />
                            </Panel>
                            <Panel id="CCAbilityDescriptionContainer" >
                                {this.parseAbilityDescription()}
                            </Panel>
                        </Panel>
                        <Panel id="AbilityScepterDescriptionContainer">
                            <Panel id="ScepterUpgradeHeader">
                                <Panel className="ScepterSpecialAbilityDataIcon" />
                                <Label className="ScepterUpgradeHeaderLabel" localizedText="#DOTA_AbilityTooltip_ScepterUpgrade_Header" />
                            </Panel>
                            <Label className="ScepterUpgradeBodyLabel" localizedText="{s:scepter_upgrade_description}" html={true} />
                        </Panel>
                        <Panel id="AbilityDraftDescriptionContainer">
                            <Panel className="AbilityDraftUpgradeHeader">
                                <Panel className="AbilityDraftIcon" />
                                <Label className="AbilityDraftHeaderLabel" localizedText="#DOTA_AbilityTooltip_AbilityDraftNote_Header" />
                            </Panel>
                            <Label className="ScepterUpgradeBodyLabel" localizedText="{s:ability_draft_note}" html={true} />
                        </Panel>
                        <Label id="AbilityExtraDescription" className={CSSHelper.ClassMaker({ 'Hidden': sExtraDescription == "" })} localizedText="#DOTA_AbilityTooltip_ExtraDescription" html={true} dialogVariables={dialogVariables} />
                        <Label id="ItemScepterDescription" className={CSSHelper.ClassMaker({ 'Hidden': true })} localizedText="{s:itemscepterdescription}" html={true} />
                        <Label id="AbilityCharges" localizedText="#DOTA_AbilityTooltip_AbilityCharges" html={true} />
                        <Label id="AbilityExtraAttributes" className={CSSHelper.ClassMaker({ 'Hidden': sExtraAttributes == "" })} localizedText="{s:extra_attributes}" html={true} dialogVariables={dialogVariables} />
                        <Panel id="AbilityCosts">
                            <Label id="AbilityCooldown" className={CSSHelper.ClassMaker("Cooldown", { 'Hidden': sCooldownDescription == "" })} localizedText="#DOTA_AbilityTooltip_Cooldown" html={true} dialogVariables={dialogVariables} />
                            <Label id="AbilityManaCost" className={CSSHelper.ClassMaker("ManaCost", { 'Hidden': sManaCostDescription == "" })} localizedText="#DOTA_AbilityTooltip_ManaCost" html={true} dialogVariables={dialogVariables} />
                        </Panel>
                        <Panel id="AbilityGameplayChanges">
                        </Panel>
                        <Label id="AbilityLore" className={CSSHelper.ClassMaker({ 'Hidden': $.Localize("#" + sLore) == "#" + sLore || $.Localize("#" + sLore) == "" })} localizedText="#DOTA_AbilityTooltip_Lore" html={true} dialogVariables={dialogVariables} />
                        {/* <Label id="AbilityUpgradeLevel" className={CSSHelper.ClassMaker({ 'Hidden': iAbilityLearnResult != AbilityLearnResult_t.ABILITY_CANNOT_BE_UPGRADED_REQUIRES_LEVEL })} localizedText="#DOTA_AbilityTooltip_UpgradeLevel" html={true} /> */}
                        <Label id="OwnedBy" localizedText="#DOTA_HUD_Item_Owned_By" html={true} />
                        <Label id="SellPriceLabel" localizedText="#DOTA_HUD_Item_Tooltip_Sell_Price" className={CSSHelper.ClassMaker({ 'Hidden': !ShowSellPrice })} />
                        <Label id="SellPriceTimeLabel" localizedText="#DOTA_HUD_Item_Tooltip_Sell_Price_Time" className={CSSHelper.ClassMaker({ 'Hidden': !ShowSellPriceTime })} />
                        <Label id="DisassembleLabel" localizedText="#DOTA_HUD_Item_Tooltip_Disassemble" />
                        <Label id="DisassembleTimeLabel" localizedText="#DOTA_HUD_Item_Tooltip_Disassemble_Time" />
                        <Label id="NotEnoughGoldLabel" localizedText="#DOTA_Shop_Item_Error_Cant_Afford" className={CSSHelper.ClassMaker({ 'Hidden': !NotEnoughGold })} />
                    </Panel>
                    <Label id="ConsumableAbilityInfo" localizedText="#DOTA_HUD_Item_Tooltip_Consumable_Info" />
                </CCPanelBG>
            </Panel >)
    }
}