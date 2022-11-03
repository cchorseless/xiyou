
import React, { useState } from "react";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { PanelAttributes } from "@demon673/react-panorama";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import { AbilityHelper } from "../../../helper/AbilityHelper";

interface ICCAbilityDetailDialog extends NodePropsData {
    abilityname: string,
    sheetConfig: any,
    isItem: boolean,
    entityindex?: EntityIndex,
    inventoryslot?: number,
    level?: number,
    mode?: "description_only" | "show_scepter_only" | "normal",
    showextradescription?: boolean,
    onlynowlevelvalue?: boolean
}

export class CCAbilityDetailDialog extends CCPanel<ICCAbilityDetailDialog> {
    defaultStyle = () => {
        return { width: "600px", height: "400px" }
    }
    defaultClass = () => {
        return CSSHelper.ClassMaker("AbilityDetails", this.toggleClass)
    }

    static defaultProps = {
        entityindex: -1,
        inventoryslot: -1,
        level: -1,
        mode: "normal",
        showextradescription: false,
        onlynowlevelvalue: false,
    }

    toggleClass: { [k: string]: boolean } = {}

    render() {
        const abilityname = this.props.abilityname;
        const sheetConfig = this.props.sheetConfig;
        const entityindex = this.props.entityindex || -1 as EntityIndex;
        const inventoryslot = this.props.inventoryslot || -1;
        const level = this.props.level || -1;
        const mode = this.props.mode;
        const showextradescription = this.props.showextradescription!;
        const onlynowlevelvalue = this.props.onlynowlevelvalue!;
        const tData = sheetConfig[abilityname] || {};
        const bIsItem = this.props.isItem;
        const toggleClass = this.toggleClass;
        const dialogVariables: { [x: string]: any; } = {};

        toggleClass['DescriptionOnly'] = mode == "description_only";
        toggleClass['ShowScepterOnly'] = mode == "show_scepter_only";
        toggleClass['NoAbilityData'] = abilityname == "" || tData == undefined || tData == null;

        // 铸造相关
        // let castingInfo = CustomNetTables.GetTableValue("common", "casting_info") || {};
        // let castingName = "";
        // for (const itemName in castingInfo) {
        // 	for (const _key in castingInfo[itemName]) {
        // 		if (castingInfo[itemName][_key] == abilityname) {
        // 			castingName = itemName;
        // 			break;
        // 		}
        // 	}
        // }
        let bIsEnemy = Entities.IsEnemy(entityindex);
        let iAbilityIndex: ItemEntityIndex = -1 as ItemEntityIndex;
        if (entityindex != -1 && inventoryslot != -1) {
            iAbilityIndex = Entities.GetItemInSlot(entityindex, inventoryslot);
        } else if (entityindex != -1) {
            iAbilityIndex = Entities.GetAbilityByName(entityindex, abilityname) as ItemEntityIndex;
        }
        let iLevel = iAbilityIndex != -1 && (!bIsEnemy || bIsItem) ? Abilities.GetLevel(iAbilityIndex) : level;
        let iMaxLevel = iAbilityIndex != -1 ? Abilities.GetMaxLevel(iAbilityIndex) : -1;
        let iUpgradeLevel = iAbilityIndex != -1 && (!bIsEnemy || bIsItem) ? Abilities.GetHeroLevelRequiredToUpgrade(iAbilityIndex) : -1;
        let iAbilityLearnResult = iAbilityIndex != -1 && (!bIsEnemy || bIsItem) ? Abilities.CanAbilityBeUpgraded(iAbilityIndex) : -1;
        if (bIsItem) {
            iLevel = iAbilityIndex == -1 ? tData.ItemBaseLevel || 1 : iLevel;
            iMaxLevel = iAbilityIndex == -1 ? tData.MaxUpgradeLevel || 0 : iMaxLevel;
            let bIsConsumable = tData.ItemQuality == "consumable";
            toggleClass['Consumable'] = bIsConsumable;
            let iItemCost = iAbilityIndex != -1 ? Items.GetCost(iAbilityIndex) : GetItemCost(abilityname);
            let bIsSellable = iAbilityIndex != -1 ? Items.IsSellable(iAbilityIndex) : false;
            toggleClass['ShowItemCost'] = iAbilityIndex == -1 && iItemCost != 0;
            toggleClass['ShowSellPrice'] = iAbilityIndex != -1 && iItemCost != 0 && bIsSellable;
            if (toggleClass['ShowItemCost']) {
                dialogVariables['buy_cost'] = iItemCost;
                let iGold = Players.GetGold(Players.GetLocalPlayer());
                toggleClass['NotEnoughGold'] = entityindex != -1 && iGold < iItemCost;
                if (toggleClass['NotEnoughGold']) {
                    toggleClass['NotEnoughGold'] = iGold < iItemCost;
                    dialogVariables['buy_cost_deficit'] = iItemCost - iGold;
                }
            }
            if (toggleClass['ShowSellPrice']) {
                let fPurchaseTime = Items.GetPurchaseTime(iAbilityIndex);
                let bOriginalPrice = Game.GetGameTime() <= fPurchaseTime + 10;
                dialogVariables['sell_price'] = bOriginalPrice ? iItemCost : iItemCost / 2;
                toggleClass['ShowSellPriceTime'] = bOriginalPrice;
                toggleClass['ShowSellPrice'] = !bOriginalPrice;
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
        }

        dialogVariables['level'] = !bIsEnemy || bIsItem ? iLevel.toString() : "?";
        let iBehavior = iAbilityIndex != -1 ? Abilities.GetBehavior(iAbilityIndex) : AbilityHelper.SBehavior2IBehavior(tData.AbilityBehavior || "");
        let sCastType = AbilityHelper.getCastType(iBehavior);
        dialogVariables['casttype'] = $.Localize("#" + sCastType);

        let iTeam = iAbilityIndex != -1 ? Abilities.GetAbilityTargetTeam(iAbilityIndex) : AbilityHelper.STeam2ITeam(tData.AbilityUnitTargetTeam || "");
        let iType = iAbilityIndex != -1 ? Abilities.GetAbilityTargetType(iAbilityIndex) : AbilityHelper.SType2IType(tData.AbilityUnitTargetType || "");
        let sTargetType = AbilityHelper.getTargetType(iTeam, iType);
        dialogVariables['targettype'] = $.Localize("#" + sTargetType);

        let iDamageType = iAbilityIndex != -1 ? Abilities.GetAbilityDamageType(iAbilityIndex) : AbilityHelper.SDamageType2IDamageType(tData.AbilityUnitDamageType || "");
        let sDamageType = AbilityHelper.getDamageType(iDamageType);
        dialogVariables['damagetype'] = $.Localize("#" + sDamageType);

        let sSpellImmunity = AbilityHelper.getSpellImmunity(tData.SpellImmunityType || "");
        dialogVariables['spellimmunity'] = $.Localize("#" + sSpellImmunity);

        let sSpellDispellableType = tData.SpellDispellableType || "";
        let sDispelType = AbilityHelper.getDispelType(sSpellDispellableType);
        dialogVariables['dispeltype'] = $.Localize("#" + sDispelType);

        let bIsActive = AbilityHelper.isActive(iBehavior);
        let iActiveDescriptionLine = tData.ActiveDescriptionLine || 1;
        let sLore = "#DOTA_Tooltip_ability_" + abilityname + "_Lore";
        dialogVariables['lore'] = $.Localize(sLore);

        toggleClass['ScepterUpgradable'] = !bIsItem && (tData.HasScepterUpgrade ? tData.HasScepterUpgrade == 1 : false) && Entities.HasScepter(entityindex);
        if (toggleClass['ScepterUpgradable']) {
            let sScepterUpgradeDescription = $.Localize("#DOTA_Tooltip_ability_" + abilityname + "_aghanim_description");
            if (sScepterUpgradeDescription != "#DOTA_Tooltip_ability_" + abilityname + "_aghanim_description") {
                sScepterUpgradeDescription = sScepterUpgradeDescription.replace(/%%/g, "%");
                sScepterUpgradeDescription = AbilityHelper.ReplaceAbilityValues({ sStr: sScepterUpgradeDescription, sheetConfig: sheetConfig, bShowExtra: showextradescription, sAbilityName: abilityname, iLevel: iLevel, iEntityIndex: entityindex, bOnlyNowLevelValue: onlynowlevelvalue });
                dialogVariables['scepter_upgrade_description'] = sScepterUpgradeDescription;
            } else {
                toggleClass['ScepterUpgradable'] = false;
            }
        }

        let sExtraDescription = "";
        let iMaxNote = 13;
        for (let i = 0; i < iMaxNote; i++) {
            let sNote = "#DOTA_Tooltip_ability_" + abilityname + "_note" + i;
            if ($.Localize(sNote) != sNote) {
                if (sExtraDescription != "") sExtraDescription = sExtraDescription + "<br>";
                sExtraDescription = sExtraDescription + $.Localize(sNote);
            }
        }
        if (bIsItem) {
            let sItemDispelType = AbilityHelper.getItemDispelType(sSpellDispellableType);
            if (sItemDispelType != "") {
                if (sExtraDescription != "") sExtraDescription = sExtraDescription + "<br>";
                sExtraDescription = sExtraDescription + $.Localize("#" + sItemDispelType);
            }
        }
        sExtraDescription = AbilityHelper.ReplaceAbilityValues({ sStr: sExtraDescription, sheetConfig: sheetConfig, bShowExtra: showextradescription, sAbilityName: abilityname, iLevel: iLevel, iEntityIndex: entityindex, bOnlyNowLevelValue: onlynowlevelvalue });
        dialogVariables['extradescription'] = sExtraDescription;

        // 属性
        let aValueNames = AbilityHelper.GetSpecialNames(sheetConfig, abilityname, entityindex);
        let sAttributes = "";
        let sExtraAttributes = "";
        for (let i = 0; i < aValueNames.length; i++) {
            const sValueName = aValueNames[i];
            let bRequiresScepter = (Number(AbilityHelper.GetSpecialValueProperty(sheetConfig, abilityname, sValueName, "RequiresScepter", entityindex)) || 0) == 1;
            if (bRequiresScepter && entityindex != -1 && !Entities.HasScepter(entityindex)) {
                continue;
            }
            let sValueDescription = "#DOTA_Tooltip_ability_" + abilityname + "_" + sValueName;
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
                            let sVariable = block.substr(1);
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
        sAttributes = replaceValues({ sStr: sAttributes, bShowExtra: showextradescription, sAbilityName: abilityname, iLevel: bIsItem ? iLevel : (iLevel != -1 ? iLevel : 0), iEntityIndex: entityindex, bOnlyNowLevelValue: onlynowlevelvalue });
        dialogVariables['attributes'] = sAttributes;
        sExtraAttributes = replaceValues({ sStr: sExtraAttributes, bShowExtra: showextradescription, sAbilityName: abilityname, iLevel: bIsItem ? iLevel : (iLevel != -1 ? iLevel : 0), iEntityIndex: entityindex, bOnlyNowLevelValue: onlynowlevelvalue });
        dialogVariables['extra_attributes'] = sExtraAttributes;
        let fCurrentCooldown = iAbilityIndex != -1 && (!bIsEnemy || bIsItem) ? Abilities.GetLevelCooldown(iAbilityIndex) : 0;
        fCurrentCooldown = CalcSpecialValueUpgrade(entityindex, abilityname, "cooldown", fCurrentCooldown);
        let fCurrentManaCost = iAbilityIndex != -1 && (!bIsEnemy || bIsItem) ? Abilities.GetLevelManaCost(iAbilityIndex) : 0;
        fCurrentManaCost = CalcSpecialValueUpgrade(entityindex, abilityname, "mana_cost", fCurrentManaCost);
        let aCooldowns = StringToValues(tData.AbilityCooldown || "");
        for (let i = 0; i < Math.max(aCooldowns.length, iMaxLevel); i++) {
            let v = iAbilityIndex != -1 ? Abilities.GetLevelCooldown(iAbilityIndex, i) : (aCooldowns[i] || 0);
            aCooldowns[i] = CalcSpecialValueUpgrade(entityindex, abilityname, "cooldown", v);
        }
        aCooldowns = SimplifyValuesArray(aCooldowns);
        let aManaCosts = StringToValues(tData.AbilityManaCost || "");
        for (let i = 0; i < Math.max(aManaCosts.length, iMaxLevel); i++) {
            let v = iAbilityIndex != -1 ? Abilities.GetLevelManaCost(iAbilityIndex, i) : (aManaCosts[i] || 0);
            aManaCosts[i] = CalcSpecialValueUpgrade(entityindex, abilityname, "mana_cost", v);
        }
        aManaCosts = SimplifyValuesArray(aManaCosts);

        if (iAbilityIndex == -1 && bIsItem) {
            fCurrentCooldown = aCooldowns[iLevel - 1] || 0;
            fCurrentManaCost = aManaCosts[iLevel - 1] || 0;
        }

        let fCooldownReduction = entityindex != -1 ? Entities.GetCooldownReduction(entityindex) : 0;
        fCurrentCooldown = Float(fCurrentCooldown * (1 - fCooldownReduction * 0.01));

        // 冷却时间
        let sCooldownDescription = "";
        if (!(aCooldowns.length == 0 || (aCooldowns.length == 1 && aCooldowns[0] == 0))) {
            for (let level = 0; level < aCooldowns.length; level++) {
                const value = Float(aCooldowns[level] * (1 - fCooldownReduction * 0.01));
                if (sCooldownDescription != "") {
                    sCooldownDescription = sCooldownDescription + " / ";
                }
                let sValue = Round(Math.abs(value), 2) + "";
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
        let sManaCostDescription = "";
        if (!(aManaCosts.length == 0 || (aManaCosts.length == 1 && aManaCosts[0] == 0))) {
            for (let level = 0; level < aManaCosts.length; level++) {
                const value = aManaCosts[level];
                if (sManaCostDescription != "") {
                    sManaCostDescription = sManaCostDescription + " / ";
                }
                let sValue = Round(Math.abs(value)) + "";
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

        toggleClass['UsesAbilityCharges'] = false;

        // 物品等级，用中立物品的样式来显示
        let iNeutralTier = GetItemRarity(abilityname);
        if (bIsItem && iNeutralTier != -1) {
            toggleClass['IsNeutralItem'] = iNeutralTier >= 0;
            toggleClass['NeutralTier' + (iNeutralTier + 1)] = true;
            dialogVariables['neutral_item_tier_number'] = iNeutralTier + 1;
        }

        if (bIsItem && iAbilityIndex != -1) {
            if (sCastType == "DOTA_ToolTip_Ability_Toggle") {
                toggleClass['ShowItemSubtitle'] = true;
                if (Abilities.GetToggleState(iAbilityIndex)) {
                    dialogVariables['item_subtitle'] = $.Localize("#DOTA_Aura_Inactive");
                } else {
                    dialogVariables['item_subtitle'] = $.Localize("#DOTA_Aura_Active");
                }
            } else {
                let iCurrentCharges = Items.GetCurrentCharges(iAbilityIndex);
                if (Items.IsPermanent(iAbilityIndex)) {
                    if (Items.AlwaysDisplayCharges(iAbilityIndex)) {
                        toggleClass['ShowItemSubtitle'] = true;
                        dialogVariables['item_subtitle'] = ($.Localize("#DOTA_Charges")).replace(/%s1/g, String(iCurrentCharges));
                    }
                } else if (iCurrentCharges > 0) {
                    if (!Items.ForceHideCharges(iAbilityIndex)) {
                        toggleClass['ShowItemSubtitle'] = true;
                        dialogVariables['item_subtitle'] = ($.Localize("#DOTA_StackCount")).replace(/%s1/g, String(iCurrentCharges));
                    }
                }
            }
        }

        toggleClass['IsAbility'] = !bIsItem;
        toggleClass['Item'] = bIsItem;
        toggleClass['IsItem'] = bIsItem;
        toggleClass['HasCooldown'] = bIsItem && fCurrentCooldown != 0;
        toggleClass['HasManaCost'] = bIsItem && fCurrentManaCost != 0;
        dialogVariables['itemscepterdescription'] = "";
        dialogVariables['current_manacost'] = fCurrentManaCost.toFixed(0);
        dialogVariables['current_cooldown'] = Number(fCurrentCooldown.toFixed(2)).toString();
        dialogVariables['upgradelevel'] = iUpgradeLevel;


        // let update = () => {
        //     let pSelf = refSelf.current;
        //     if (pSelf) {
        //         let iAbilityIndex: ItemEntityIndex = -1 as ItemEntityIndex;
        //         if (entityindex != -1 && inventoryslot != -1) {
        //             iAbilityIndex = Entities.GetItemInSlot(entityindex, inventoryslot);
        //         } else if (entityindex != -1) {
        //             iAbilityIndex = Entities.GetAbilityByName(entityindex, abilityname) as ItemEntityIndex;
        //         }
        //         if (pSelf.BHasClass("ShowSellPriceTime")) {
        //             let iItemCost = iAbilityIndex != -1 ? Items.GetCost(iAbilityIndex) : GetItemCost(abilityname);

        //             let fPurchaseTime = Items.GetPurchaseTime(iAbilityIndex);
        //             let bOriginalPrice = Game.GetGameTime() <= fPurchaseTime + 10;
        //             pSelf.SetDialogVariableInt("sell_price", bOriginalPrice ? iItemCost : iItemCost / 2);
        //             pSelf.SetHasClass("ShowSellPriceTime", bOriginalPrice);
        //             pSelf.SetHasClass("ShowSellPrice", !bOriginalPrice);
        //             let fTime = (Game.GetGameTime() - fPurchaseTime);
        //             let sStr = "";
        //             if (fTime <= 10) {
        //                 fTime = parseInt((10 - fTime).toFixed(0));
        //                 let sMinute = (Math.floor(fTime / 60)).toString();
        //                 let sSecond = (fTime % 60).toString();
        //                 if (sSecond.length == 1) sSecond = "0" + sSecond;
        //                 sStr = sMinute + ":" + sSecond;
        //             }
        //             pSelf.SetDialogVariable("sell_time", sStr);
        //         }
        //         if (pSelf.BHasClass("ShowItemCost")) {
        //             let iItemCost = iAbilityIndex != -1 ? Items.GetCost(iAbilityIndex) : GetItemCost(abilityname);
        //             pSelf.SetDialogVariableInt('buy_cost', iItemCost);
        //             let iGold = Players.GetGold(Players.GetLocalPlayer());
        //             pSelf.SetHasClass("NotEnoughGold", entityindex != -1 && iGold < iItemCost);
        //             if (pSelf.BHasClass("NotEnoughGold")) {
        //                 pSelf.SetDialogVariableInt('buy_cost_deficit', iItemCost - iGold);
        //             }
        //         }
        //     }
        // };

        // useEffect(() => {
        //     let pSelf = refSelf.current;
        //     if (pSelf && pSelf.IsValid()) {
        //         pSelf.SetHasClass("ShowSellPrice", toggleClass["ShowSellPrice"] || false);
        //         pSelf.SetHasClass("ShowSellPriceTime", toggleClass["ShowSellPriceTime"] || false);
        //         pSelf.SetHasClass("NotEnoughGold", toggleClass["NotEnoughGold"] || false);
        //     }

        //     let iScheduleHandle: ScheduleID;
        //     let think = () => {
        //         iScheduleHandle = $.Schedule(Game.GetGameFrameTime(), think);
        //         update();
        //     };
        //     think();

        //     return () => {
        //         $.CancelScheduled(iScheduleHandle);
        //     };
        // });




        return (
            this.__root___isValid &&
            <Panel id="CC_AbilityDetailDialog" ref={this.__root__} dialogVariables={dialogVariables} {...this.initRootAttrs()}>
                <Panel id="Header">
                    <DOTAItemImage id="ItemImage" itemname={abilityname} />
                    <Panel id="HeaderLabels">
                        <Panel id="AbilityHeader">
                            <Label id="AbilityName" className="TitleFont" text={$.Localize("#DOTA_Tooltip_ability_" + abilityname)} html={true} />
                            <Label id="AbilityLevel" className={CSSHelper.ClassMaker({ 'Hidden': iMaxLevel <= 0 })} localizedText="#DOTA_AbilityTooltip_Level" html={true} />
                        </Panel>
                        <Panel id="AbilitySubHeader">
                            <Label id="ItemSubtitle" localizedText="{s:item_subtitle}" />
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
                                <Label id="NeutralItemTier" html={true} localizedText="#DOTA_NeutralItemTier" />
                                <Panel className="LeftRightFlow">
                                    <Panel id="ItemCost">
                                        <Panel id="ItemCostIcon" />
                                        <Label id="BuyCostLabel" localizedText="{d:r:buy_cost}" />
                                        <Label id="BuyCostDeficit" localizedText="(-{d:r:buy_cost_deficit})" />
                                    </Panel>
                                    <Panel id="StockContainer">
                                        <Label id="RestockTime" localizedText="#DOTA_HUD_Shop_Restock" />
                                        <Label id="StockAmount" localizedText="#DOTA_HUD_Shop_StockAmount" />
                                    </Panel>
                                </Panel>
                            </Panel>
                        </Panel>
                        {/* <Panel id="AbilityCastingHeader" className={classNames({ 'Hidden': castingName == "" })}>
						<Label id="AbilityCasting" localizedText="DOTA_AbilityTooltip_Casting" dialogVariables={{ itemname: $.Localize("#DOTA_Tooltip_ability_" + castingName) }} html={true} />
					</Panel> */}
                        <Label id="CostToComplete" localizedText="#DOTA_HUD_Shop_Item_Complete" />
                    </Panel>
                </Panel>

                <Panel id="AbilityTarget">
                    <Panel id="AbilityTopRowContainer">
                        <Label id="AbilityCastType" className={CSSHelper.ClassMaker({ 'Hidden': sCastType == "" })} localizedText="#DOTA_AbilityTooltip_CastType" html={true} />
                        <Panel id="CurrentAbilityCosts" className={CSSHelper.ClassMaker({ 'Hidden': bIsItem || (fCurrentCooldown == 0 && fCurrentManaCost == 0) })}>
                            <Label id="CurrentAbilityManaCost" className={CSSHelper.ClassMaker("ManaCost", { 'Hidden': bIsItem || fCurrentManaCost == 0 })} localizedText="{s:current_manacost}" html={true} />
                            <Label id="CurrentAbilityCooldown" className={CSSHelper.ClassMaker("Cooldown", { 'Hidden': bIsItem || fCurrentCooldown == 0 })} localizedText="{s:current_cooldown}" html={true} />
                        </Panel>
                    </Panel>
                    <Label id="AbilityTargetType" className={CSSHelper.ClassMaker({ 'Hidden': sTargetType == "" })} localizedText="#DOTA_AbilityTooltip_TargetType" html={true} />
                    <Label id="AbilityDamageType" className={CSSHelper.ClassMaker({ 'Hidden': sDamageType == "" })} localizedText="#DOTA_AbilityTooltip_DamageType" html={true} />
                    <Label id="AbilitySpellImmunityType" className={CSSHelper.ClassMaker({ 'Hidden': sSpellImmunity == "" })} localizedText="#DOTA_AbilityTooltip_SpellImmunityType" html={true} />
                    <Label id="AbilityDispelType" className={CSSHelper.ClassMaker({ 'Hidden': sDispelType == "" })} localizedText="#DOTA_AbilityTooltip_DispelType" html={true} />
                </Panel>

                <Panel id="AbilityCoreDetails">
                    <Label id="AbilityAttributes" className={CSSHelper.ClassMaker({ 'Hidden': sAttributes == "" })} localizedText="#DOTA_AbilityTooltip_Attributes" html={true} />
                    <Panel id="AbilityDescriptionOuterContainer">
                        <Panel id="CurrentItemCosts" className={CSSHelper.ClassMaker({ 'Hidden': !bIsItem })}>
                            <Label className="Cooldown" localizedText="{s:current_cooldown}" html={true} />
                            <Label className="ManaCost" localizedText="{s:current_manacost}" html={true} />
                        </Panel>
                        <Panel id="AbilityDescriptionContainer" >
                            {(() => {
                                let sAbilityName = abilityname;
                                let bIsBook = false;

                                if (bIsItem) {
                                    let sType = GetCustomItemType(abilityname);
                                    if (sType == "CUSTOM_ITEM_TYPE_ABILITY_BOOK") {
                                        let sLinkAbility = GetItemValue<string>(abilityname, "LinkAbility");
                                        if (typeof sLinkAbility == "string") {
                                            sAbilityName = sLinkAbility;
                                            bIsBook = true;
                                        }
                                    }
                                }

                                let sAllDescription = "#DOTA_Tooltip_ability_" + sAbilityName + "_Description";
                                let list: JSX.Element[] = [];
                                let sAllDescriptionLocalize = $.Localize(sAllDescription);
                                if (sAllDescriptionLocalize != sAllDescription) {
                                    if (bIsBook) {
                                        sAllDescriptionLocalize = sAllDescriptionLocalize + "\n" + $.Localize("#dota_tooltip_item_book_alt");
                                    }
                                    let aDescriptions = sAllDescriptionLocalize.split("\n");
                                    let iOriginalDescriptions = aDescriptions.length;

                                    if (entityindex != -1) {
                                        let aAbilityUpgradesList = GetAbilityUpgradesList(entityindex);
                                        for (let index = 0; index < aAbilityUpgradesList.length; index++) {
                                            let tData = aAbilityUpgradesList[index];
                                            if (tData.type == AbilityUpgradeType.ABILITY_UPGRADES_TYPE_ABILITY_MECHANICS && tData.ability_name == sAbilityName) {
                                                aDescriptions.push($.Localize("#dota_tooltip_ability_mechanics_" + tData.ability_name + "_" + tData.description));
                                            }
                                        }
                                    }

                                    refSelf.current?.RemoveClass("DevouredFirstLine");
                                    let iLine = 0;
                                    for (let i = 0; i < aDescriptions.length; i++) {
                                        const sUnprocessedDescription = aDescriptions[i];
                                        let sDescription = sUnprocessedDescription;

                                        if (sDescription == "") continue;

                                        let regexp = new RegExp("<h1>.+?</h1>", "");
                                        let aHeaders = sDescription.match(regexp);
                                        if (aHeaders) {
                                            for (let sHeader of aHeaders) {
                                                ++iLine;
                                                if (sHeader == "<h1>$devoured</h1>") {
                                                    if (iLine == 1) {
                                                        refSelf.current?.AddClass("DevouredFirstLine");
                                                    }
                                                    sHeader = sHeader.replace("\$devoured", $.Localize("#dota_ability_devoured_title"));
                                                } else if (sHeader == "<h1>$devoured_2</h1>") {
                                                    if (iLine == 1) {
                                                        refSelf.current?.AddClass("DevouredFirstLine");
                                                    }
                                                    sHeader = sHeader.replace("\$devoured_2", $.Localize("#dota_ability_devoured_2_title"));
                                                }
                                                list.push(
                                                    <Label key={list.length} className={classNames('Header', { 'Active': bIsActive && iLine == iActiveDescriptionLine })} text={sHeader} html={true} />
                                                );
                                            }
                                        }
                                        sDescription = sDescription.replace(regexp, "");
                                        sDescription = sDescription.replace(/%%/g, "%");

                                        sDescription = replaceValues({ sStr: sDescription, bShowExtra: showextradescription, sAbilityName: sAbilityName, iLevel: iLevel, iEntityIndex: entityindex, bOnlyNowLevelValue: onlynowlevelvalue });

                                        list.push(
                                            <Label key={list.length} className={classNames({ 'Active': bIsActive && iLine == iActiveDescriptionLine, 'AbilityMechanics': i >= iOriginalDescriptions })} text={sDescription} html={true} />
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
                                                    <Label key={list.length} className={classNames('Header')} text={_sCondition} html={true} />
                                                );
                                            }
                                        }
                                        sExtraEffect = sExtraEffect.replace(regexp, "");
                                        sExtraEffect = sExtraEffect.replace(/%%/g, "%");

                                        sExtraEffect = replaceValues({ sStr: sExtraEffect, bShowExtra: showextradescription, sAbilityName: sAbilityName, iLevel: iLevel, iEntityIndex: entityindex, bOnlyNowLevelValue: onlynowlevelvalue });

                                        list.push(
                                            <Label key={list.length} className={classNames({ 'ExtraEffect': true })} text={sExtraEffect} html={true} />
                                        );
                                    }
                                }
                                return list;
                            })()}
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
                    <Label id="AbilityExtraDescription" className={CSSHelper.ClassMaker({ 'Hidden': sExtraDescription == "" })} localizedText="#DOTA_AbilityTooltip_ExtraDescription" html={true} />
                    <Label id="ItemScepterDescription" className={CSSHelper.ClassMaker({ 'Hidden': true })} localizedText="{s:itemscepterdescription}" html={true} />
                    <Label id="AbilityCharges" localizedText="#DOTA_AbilityTooltip_AbilityCharges" html={true} />
                    <Label id="AbilityExtraAttributes" className={CSSHelper.ClassMaker({ 'Hidden': sExtraAttributes == "" })} localizedText="{s:extra_attributes}" html={true} />
                    <Panel id="AbilityCosts">
                        <Label id="AbilityCooldown" className={CSSHelper.ClassMaker("Cooldown", { 'Hidden': sCooldownDescription == "" })} localizedText="#DOTA_AbilityTooltip_Cooldown" html={true} />
                        <Label id="AbilityManaCost" className={CSSHelper.ClassMaker("ManaCost", { 'Hidden': sManaCostDescription == "" })} localizedText="#DOTA_AbilityTooltip_ManaCost" html={true} />
                    </Panel>
                    <Panel id="AbilityGameplayChanges">
                    </Panel>
                    <Label id="AbilityLore" className={CSSHelper.ClassMaker({ 'Hidden': $.Localize("#" + sLore) == "#" + sLore || $.Localize("#" + sLore) == "" })} localizedText="#DOTA_AbilityTooltip_Lore" html={true} />
                    <Label id="AbilityUpgradeLevel" className={CSSHelper.ClassMaker({ 'Hidden': iAbilityLearnResult != AbilityLearnResult_t.ABILITY_CANNOT_BE_UPGRADED_REQUIRES_LEVEL })} localizedText="#DOTA_AbilityTooltip_UpgradeLevel" html={true} />
                    <Label id="OwnedBy" localizedText="#DOTA_HUD_Item_Owned_By" html={true} />
                    <Label id="SellPriceLabel" localizedText="#DOTA_HUD_Item_Tooltip_Sell_Price" />
                    <Label id="SellPriceTimeLabel" localizedText="#DOTA_HUD_Item_Tooltip_Sell_Price_Time" />
                    <Label id="DisassembleLabel" localizedText="#DOTA_HUD_Item_Tooltip_Disassemble" />
                    <Label id="DisassembleTimeLabel" localizedText="#DOTA_HUD_Item_Tooltip_Disassemble_Time" />
                    <Label id="NotEnoughGoldLabel" localizedText="#DOTA_Shop_Item_Error_Cant_Afford" />
                </Panel>

                <Label id="ConsumableAbilityInfo" localizedText="#DOTA_HUD_Item_Tooltip_Consumable_Info" />
            </Panel>
        )
    };
}