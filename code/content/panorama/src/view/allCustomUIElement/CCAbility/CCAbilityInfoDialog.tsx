
import React, { useState } from "react";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import { AbilityHelper, ItemHelper, UnitHelper } from "../../../helper/DotaEntityHelper";
import { FuncHelper } from "../../../helper/FuncHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { CCPanelBG } from "../CCPanel/CCPanelPart";
import { PlayerScene } from "../../../game/components/Player/PlayerScene";
import { CCUnitSmallIcon } from "../CCUnit/CCUnitSmallIcon";
import "./CCAbilityInfoDialog.less";
import { BuildingConfig } from "../../../../../../game/scripts/tscripts/shared/BuildingConfig";
import { ShareConfig } from "../../../../../../game/scripts/tscripts/shared/ShareConfig";

interface ICCAbilityInfoDialog extends NodePropsData {
    abilityname: string,
    castentityindex?: EntityIndex,
    level?: number,
    // mode?: "description_only" | "show_scepter_only" | "normal",
    // showextradescription?: boolean,
    // onlynowlevelvalue?: boolean
}

export class CCAbilityInfoDialog extends CCPanel<ICCAbilityInfoDialog> {

    getConfigData(key: string) {
        const abilityname = this.props.abilityname!;
        const tData = KVHelper.KVAbilitys()[abilityname] || {};
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

    parseAbilityDescription() {
        const sAbilityName = this.props.abilityname;
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
        const sAbilityName = this.props.abilityname;
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
        const abilityname = this.props.abilityname;
        const castentityindex = this.props.castentityindex!;
        const tData = KVHelper.KVAbilitys()[abilityname] || {};
        const iLevel = this.props.level || -1;
        const combinationLabel = tData.CombinationLabel! as string;
        const entity = PlayerScene.Local.CombinationManager.getCombinationByCombinationName(combinationLabel)
        const uniqueConfigList = entity?.uniqueConfigList || [];
        const herolist: string[] = [];
        for (let k in KVHelper.KVData().building_combination_ability) {
            let data = KVHelper.KVData().building_combination_ability[k];
            if (data.relation == combinationLabel && data.heroid && !herolist.includes(data.heroid)) {
                herolist.push(data.heroid);
            }
        }
        herolist.sort((a, b) => {
            const r_a = ShareConfig.ToRarityNumber(KVHelper.KVData().building_unit_tower[a].Rarity as any);
            const r_b = ShareConfig.ToRarityNumber(KVHelper.KVData().building_unit_tower[b].Rarity as any);
            return r_a - r_b
        });
        // const mode = this.props.mode;
        // const showextradescription = this.props.showextradescription!;
        // const onlynowlevelvalue = this.props.onlynowlevelvalue!;
        dialogVariables['level'] = iLevel.toString();
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

        let iDamageType = iAbilityIndex != -1 ? Abilities.GetAbilityDamageType(iAbilityIndex) : AbilityHelper.SDamageType2IDamageType(tData.AbilityUnitDamageType as string || "");
        let sDamageType = AbilityHelper.getDamageType(iDamageType);
        dialogVariables['damagetype'] = $.Localize("#" + sDamageType);

        let sSpellImmunity = AbilityHelper.getSpellImmunity(tData.SpellImmunityType as string || "");
        dialogVariables['spellimmunity'] = $.Localize("#" + sSpellImmunity);

        let sSpellDispellableType = tData.SpellDispellableType as string || "";
        let sDispelType = AbilityHelper.getDispelType(sSpellDispellableType);
        dialogVariables['dispeltype'] = $.Localize("#" + sDispelType);
        let ScepterUpgradable = (tData.HasScepterUpgrade ? tData.HasScepterUpgrade == "1" : false) && Entities.HasScepter(castentityindex);
        if (ScepterUpgradable) {
            let sScepterUpgradeDescription = $.Localize("#DOTA_Tooltip_ability_" + abilityname + "_aghanim_description");
            if (sScepterUpgradeDescription != "#DOTA_Tooltip_ability_" + abilityname + "_aghanim_description") {
                sScepterUpgradeDescription = sScepterUpgradeDescription.replace(/%%/g, "%");
                sScepterUpgradeDescription = AbilityHelper.ReplaceAbilityValuesDes({ sStr: sScepterUpgradeDescription, sAbilityName: abilityname, iLevel: iLevel, iEntityIndex: castentityindex });
                dialogVariables['scepter_upgrade_description'] = sScepterUpgradeDescription;
            } else {
                ScepterUpgradable = false;
            }
        }
        // 属性
        let aValueNames = AbilityHelper.GetSpecialNames(abilityname, castentityindex);
        let sAttributes = "";
        let sExtraAttributes = "";
        for (let i = 0; i < aValueNames.length; i++) {
            const sValueName = aValueNames[i];
            let bRequiresScepter = (Number(AbilityHelper.GetSpecialValueWithTag(abilityname, sValueName, AbilityHelper.AbilitySpecialValueTag.RequiresScepter, castentityindex)) || 0) == 1;
            if (bRequiresScepter && castentityindex != -1 && !Entities.HasScepter(castentityindex!)) {
                continue;
            }
            let sValueDescription = "#DOTA_Tooltip_ability_" + abilityname + "_" + sValueName;
            switch (sValueName) {
                case "abilitydamage":
                    let aValues = AbilityHelper.StringToValues(tData.AbilityDamage as string || "");
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
        sAttributes = AbilityHelper.ReplaceAbilityValuesDes({
            sStr: sAttributes, sAbilityName: abilityname, iLevel: iLevel, iEntityIndex: castentityindex
        });
        dialogVariables['attributes'] = sAttributes;
        sExtraAttributes = AbilityHelper.ReplaceAbilityValuesDes({ sStr: sExtraAttributes, sAbilityName: abilityname, iLevel: iLevel, iEntityIndex: castentityindex });
        dialogVariables['extra_attributes'] = sExtraAttributes;

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
        sExtraDescription = AbilityHelper.ReplaceAbilityValuesDes({ sStr: sExtraDescription, sAbilityName: abilityname, iLevel: iLevel, iEntityIndex: castentityindex });
        dialogVariables['extradescription'] = sExtraDescription;
        // 冷却时间
        let aCooldowns = AbilityHelper.StringToValues(tData.AbilityCooldown || "");
        for (let i = 0; i < Math.max(aCooldowns.length, iMaxLevel); i++) {
            aCooldowns[i] = iAbilityIndex != -1 ? AbilityHelper.GetLevelCooldown(iAbilityIndex, i) : (aCooldowns[i] || 0);
        }
        aCooldowns = AbilityHelper.SimplifyValuesArray(aCooldowns);
        let fCurrentCooldown = iAbilityIndex != -1 ? AbilityHelper.GetLevelCooldown(iAbilityIndex) : 0;
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
        let fCurrentManaCost = iAbilityIndex != -1 ? AbilityHelper.GetLevelManaCost(iAbilityIndex) : 0;
        let aManaCosts = AbilityHelper.StringToValues(tData.AbilityManaCost || "");
        for (let i = 0; i < Math.max(aManaCosts.length, iMaxLevel); i++) {
            aManaCosts[i] = iAbilityIndex != -1 ? AbilityHelper.GetLevelManaCost(iAbilityIndex, i) : (aManaCosts[i] || 0);
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
        return (this.__root___isValid &&
            <Panel id="CC_AbilityInfoDialog" ref={this.__root__}  {...this.initRootAttrs()}>
                <CCPanelBG id="PanelBg" type="ToolTip">
                    <Panel id="HeaderLabels">
                        <Panel id="AbilityHeader">
                            <Label id="AbilityName" className="TitleFont" text={$.Localize("#DOTA_Tooltip_ability_" + abilityname)} html={true} />
                            <Label id="AbilityLevel" className={CSSHelper.ClassMaker({ 'Hidden': iMaxLevel <= 0 })} localizedText="#DOTA_AbilityTooltip_Level" html={true} dialogVariables={dialogVariables} />
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
                        <Panel id="CCAbilityDescriptionContainer" >
                            {this.parseAbilityDescription()}
                            {this.parseAbilitySpecial()}
                        </Panel>
                        <Panel id="AbilityScepterDescriptionContainer">
                            <Panel id="ScepterUpgradeHeader">
                                <Panel className="ScepterSpecialAbilityDataIcon" />
                                <Label className="ScepterUpgradeHeaderLabel" localizedText="#DOTA_AbilityTooltip_ScepterUpgrade_Header" />
                            </Panel>
                            <Label className="ScepterUpgradeBodyLabel" localizedText="{s:scepter_upgrade_description}" html={true} dialogVariables={dialogVariables} />
                        </Panel>
                        <Panel id="AbilityDraftDescriptionContainer">
                            <Panel className="AbilityDraftUpgradeHeader">
                                <Panel className="AbilityDraftIcon" />
                                <Label className="AbilityDraftHeaderLabel" localizedText="#DOTA_AbilityTooltip_AbilityDraftNote_Header" />
                            </Panel>
                            <Label className="ScepterUpgradeBodyLabel" localizedText="{s:ability_draft_note}" html={true} dialogVariables={dialogVariables} />
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
                    </Panel>
                    <CCPanel id="AbilityCombination" flowChildren="right-wrap">
                        {herolist.length > 0 && herolist.map(
                            (name, index) => {
                                return <CCUnitSmallIcon key={index + ""} width="35px" height="35px" itemname={name} rarity={KVHelper.KVData().building_unit_tower[name].Rarity as Rarity} brightness={uniqueConfigList.includes(name) ? "1" : "0.1"} />
                            })}
                    </CCPanel>
                    {this.props.children}
                    {this.__root___childs}
                </CCPanelBG>
            </Panel>)
    }
}