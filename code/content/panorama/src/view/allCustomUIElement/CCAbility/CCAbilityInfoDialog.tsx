
import React, { useState } from "react";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import { AbilityHelper, ItemHelper, UnitHelper } from "../../../helper/DotaEntityHelper";
import { FuncHelper } from "../../../helper/FuncHelper";
import { KVHelper } from "../../../helper/KVHelper";

import "./CCAbilityInfoDialog.less";
import { LogHelper } from "../../../helper/LogHelper";

interface ICCAbilityInfoDialog extends NodePropsData {
    abilityname: string,
    castentityindex?: EntityIndex,
    level?: number,
    mode?: "description_only" | "show_scepter_only" | "normal",
    showextradescription?: boolean,
    onlynowlevelvalue?: boolean
}

export class CCAbilityInfoDialog extends CCPanel<ICCAbilityInfoDialog> {
    defaultStyle() {
        return { width: "600px", height: "400px" }
    }
    defaultClass() {
        return CSSHelper.ClassMaker("AbilityDetails", this.toggleClass)
    }

    getConfigData(key: string) {
        const abilityname = this.props.abilityname;
        const [isitem, tData] = KVHelper.GetAbilityOrItemData(abilityname) || {};
        return tData[key]
    }

    getConfigDataAsInt(key: string) {
        return Number(this.getConfigData(key)) || 0
    }

    static defaultProps = {
        castentityindex: -1,
        level: -1,
        mode: "normal",
        showextradescription: false,
        onlynowlevelvalue: false,
    }

    toggleClass: { [k: string]: boolean } = {}


    render() {
        const dialogVariables: { [x: string]: any; } = {};
        const toggleClass = this.toggleClass;
        const abilityname = this.props.abilityname;
        const castentityindex = this.props.castentityindex;
        const tData = KVHelper.KVAbilitys()[abilityname] || {};
        const level = this.props.level || -1;
        const mode = this.props.mode;
        const showextradescription = this.props.showextradescription!;
        const onlynowlevelvalue = this.props.onlynowlevelvalue!;
        let iAbilityIndex = -1 as AbilityEntityIndex;
        if (castentityindex && castentityindex != -1) {
            iAbilityIndex = Entities.GetAbilityByName(castentityindex, abilityname)
        }
        let iMaxLevel = iAbilityIndex != -1 ? Abilities.GetMaxLevel(iAbilityIndex) : -1;
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

        // 属性
        let aValueNames = AbilityHelper.GetSpecialNames(abilityname, castentityindex);
        let sAttributes = "";
        let sExtraAttributes = "";
        for (let i = 0; i < aValueNames.length; i++) {
            const sValueName = aValueNames[i];
            let bRequiresScepter = (Number(AbilityHelper.GetSpecialValueProperty(abilityname, sValueName, "RequiresScepter", castentityindex)) || 0) == 1;
            if (bRequiresScepter && castentityindex != -1 && !Entities.HasScepter(castentityindex)) {
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
        sAttributes = AbilityHelper.ReplaceAbilityValues({ sStr: sAttributes, bShowExtra: showextradescription, sAbilityName: abilityname, iLevel: bIsItem ? iLevel : (iLevel != -1 ? iLevel : 0), iEntityIndex: entityindex, bOnlyNowLevelValue: onlynowlevelvalue });
        dialogVariables['attributes'] = sAttributes;




        let bIsActive = AbilityHelper.isActive(iBehavior);
        let iActiveDescriptionLine = tData.ActiveDescriptionLine || 1;
        let sLore = "#DOTA_Tooltip_ability_" + abilityname + "_Lore";
        dialogVariables['lore'] = $.Localize(sLore);

        let sExtraDescription = "";
        const iMaxNote = 13;
        for (let i = 0; i < iMaxNote; i++) {
            let sNote = "#DOTA_Tooltip_ability_" + abilityname + "_note" + i;
            if ($.Localize(sNote) != sNote) {
                if (sExtraDescription != "") sExtraDescription = sExtraDescription + "<br>";
                sExtraDescription = sExtraDescription + $.Localize(sNote);
            }
        }

        // sExtraDescription = AbilityHelper.ReplaceAbilityValues({ sStr: sExtraDescription, bShowExtra: showextradescription, sAbilityName: abilityname, iLevel: iLevel, iEntityIndex: entityindex, bOnlyNowLevelValue: onlynowlevelvalue });
        dialogVariables['extradescription'] = sExtraDescription;

        LogHelper.print(dialogVariables)

        return (this.__root___isValid &&
            <Panel id="CC_AbilityInfoDialog" ref={this.__root__}  {...this.initRootAttrs()}>
                <Panel id="Header">
                    <Panel id="HeaderLabels">
                        <Panel id="AbilityHeader">
                            <Label id="AbilityName" className="TitleFont" text={$.Localize("#DOTA_Tooltip_ability_" + abilityname)} html={true} />
                            <Label id="AbilityLevel" className={CSSHelper.ClassMaker({ 'Hidden': iMaxLevel <= 0 })} localizedText="#DOTA_AbilityTooltip_Level" html={true} />
                        </Panel>
                    </Panel>
                </Panel>
                <Panel id="AbilityTarget">
                    <Label id="AbilityCastType" className={CSSHelper.ClassMaker({ 'Hidden': sCastType == "" })} localizedText="#DOTA_AbilityTooltip_CastType" html={true} dialogVariables={dialogVariables} />
                    <Label id="AbilityTargetType" className={CSSHelper.ClassMaker({ 'Hidden': sTargetType == "" })} localizedText="#DOTA_AbilityTooltip_TargetType" html={true} dialogVariables={dialogVariables} />
                    <Label id="AbilityDamageType" className={CSSHelper.ClassMaker({ 'Hidden': sDamageType == "" })} localizedText="#DOTA_AbilityTooltip_DamageType" html={true} dialogVariables={dialogVariables} />
                    <Label id="AbilitySpellImmunityType" className={CSSHelper.ClassMaker({ 'Hidden': sSpellImmunity == "" })} localizedText="#DOTA_AbilityTooltip_SpellImmunityType" html={true} dialogVariables={dialogVariables} />
                    <Label id="AbilityDispelType" className={CSSHelper.ClassMaker({ 'Hidden': sDispelType == "" })} localizedText="#DOTA_AbilityTooltip_DispelType" html={true} dialogVariables={dialogVariables} />
                </Panel>
                <Panel id="AbilityCoreDetails">
                    <Label id="AbilityAttributes" className={CSSHelper.ClassMaker({ 'Hidden': sAttributes == "" })} localizedText="#DOTA_AbilityTooltip_Attributes" html={true} />
                    <Panel id="AbilityDescriptionOuterContainer">
                        <Panel id="CurrentItemCosts" >
                            <Label className="Cooldown" localizedText="{s:current_cooldown}" html={true} />
                            <Label className="ManaCost" localizedText="{s:current_manacost}" html={true} />
                        </Panel>
                        <Panel id="AbilityDescriptionContainer" >
                            {(() => {
                                let sAbilityName = abilityname;
                                let bIsBook = false;
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
                                        // let aAbilityUpgradesList = GetAbilityUpgradesList(entityindex);
                                        // for (let index = 0; index < aAbilityUpgradesList.length; index++) {
                                        //     let tData = aAbilityUpgradesList[index];
                                        //     if (tData.type == AbilityHelper.AbilityUpgradeType.ABILITY_UPGRADES_TYPE_ABILITY_MECHANICS && tData.ability_name == sAbilityName) {
                                        //         aDescriptions.push($.Localize("#dota_tooltip_ability_mechanics_" + tData.ability_name + "_" + tData.description));
                                        //     }
                                        // }
                                    }

                                    this.__root__.current?.RemoveClass("DevouredFirstLine");
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
                                                        this.__root__.current?.AddClass("DevouredFirstLine");
                                                    }
                                                    sHeader = sHeader.replace("\$devoured", $.Localize("#dota_ability_devoured_title"));
                                                } else if (sHeader == "<h1>$devoured_2</h1>") {
                                                    if (iLine == 1) {
                                                        this.__root__.current?.AddClass("DevouredFirstLine");
                                                    }
                                                    sHeader = sHeader.replace("\$devoured_2", $.Localize("#dota_ability_devoured_2_title"));
                                                }
                                                list.push(
                                                    <Label key={list.length} className={CSSHelper.ClassMaker('Header', { 'Active': bIsActive && iLine == iActiveDescriptionLine })} text={sHeader} html={true} />
                                                );
                                            }
                                        }
                                        sDescription = sDescription.replace(regexp, "");
                                        sDescription = sDescription.replace(/%%/g, "%");

                                        sDescription = AbilityHelper.ReplaceAbilityValues({ sStr: sDescription, bShowExtra: showextradescription, sAbilityName: sAbilityName, iLevel: iLevel, iEntityIndex: entityindex, bOnlyNowLevelValue: onlynowlevelvalue });

                                        list.push(
                                            <Label key={list.length} className={CSSHelper.ClassMaker({ 'Active': bIsActive && iLine == iActiveDescriptionLine, 'AbilityMechanics': i >= iOriginalDescriptions })} text={sDescription} html={true} />
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

                                        sExtraEffect = AbilityHelper.ReplaceAbilityValues({ sStr: sExtraEffect, bShowExtra: showextradescription, sAbilityName: sAbilityName, iLevel: iLevel, iEntityIndex: entityindex, bOnlyNowLevelValue: onlynowlevelvalue });

                                        list.push(
                                            <Label key={list.length} className={CSSHelper.ClassMaker({ 'ExtraEffect': true })} text={sExtraEffect} html={true} />
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

            </Panel>)
    }
}