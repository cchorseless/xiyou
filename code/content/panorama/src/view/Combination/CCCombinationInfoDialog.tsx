import React from "react";
import { BuildingConfig } from "../../../../scripts/tscripts/shared/BuildingConfig";
import { Dota } from "../../../../scripts/tscripts/shared/Gen/Types";
import { HeroEquipComponent } from "../../../../scripts/tscripts/shared/service/equip/HeroEquipComponent";
import { ECombination } from "../../game/components/Combination/ECombination";
import { CSSHelper } from "../../helper/CSSHelper";
import { BaseEntityRoot } from "../../libs/BaseEntityRoot";
import { CCIcon_Scepter } from "../AllUIElement/CCIcons/CCIcon_Scepter";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelHeader } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCCombinationIcon } from "./CCCombinationIcon";

import "./CCCombinationInfoDialog.less";
import { CCCombinationUnitIconGroup } from "./CCCombinationUnitIconGroup";

interface ICCCombinationInfoDialog {
    sectName: string,
    showSectName?: boolean,
    playerid?: PlayerID,
    unitentityindex?: EntityIndex,
    castentityindex?: AbilityEntityIndex,
    abilityitemname?: string,
    showBg?: boolean,
}

export class CCCombinationInfoDialog extends CCPanel<ICCCombinationInfoDialog> {

    static defaultProps = {
        castentityindex: -1,
        unitentityindex: -1,
        playerid: -1,
        showBg: false
    }


    GetSectBuffDescriptionByName(sAbilityName: string) {
        let sStr = $.Localize("#DOTA_Tooltip_" + sAbilityName + "_description");
        let config = GJSONConfig.BuffEffectConfig.get(sAbilityName);
        if (config) {
            config.propinfo.forEach((v, k) => {
                let block = new RegExp("%" + k + "%", "g");
                let blockPS = new RegExp("%" + k + "%%", "g");
                let iResult = sStr.search(block);
                let iResultPS = sStr.search(blockPS);
                if (iResult == -1 && iResultPS == -1) return;
                let aValues = (v + "").split(" ").map((value: string) => { return Number(value); });;
                let [sValues, sValuesPS] = Abilities.AbilityDescriptionCompose(aValues);
                sStr = sStr.replace(blockPS, sValuesPS);
                sStr = sStr.replace(block, sValues);
            })

        }
        return sStr;
    }


    render() {
        let { sectName, castentityindex, playerid, abilityitemname, unitentityindex } = this.props;
        if (abilityitemname == null && castentityindex != -1) {
            abilityitemname = Abilities.GetAbilityName(castentityindex!);
        }
        let iStar = 0;
        if (playerid == -1) {
            if (unitentityindex != -1) {
                playerid = BaseEntityRoot.GetEntityBelongPlayerId(unitentityindex!);
                iStar = BaseEntityRoot.GetBattleEntity(unitentityindex!)?.iStar || 0;
            }
            else if (castentityindex != -1) {
                unitentityindex = Abilities.GetCaster(castentityindex!);
                playerid = BaseEntityRoot.GetEntityBelongPlayerId(unitentityindex);
                iStar = BaseEntityRoot.GetBattleEntity(unitentityindex!)?.iStar || 0;
            }
        }
        let allcombs: ECombination[] = [];
        if (playerid !== -1) {
            allcombs = ECombination.GetCombinationBySectName(playerid!, sectName) || [];
        }
        let data = GJSONConfig.CombinationConfig.getDataList();
        let configs: { [k: string]: Dota.CombinationConfigRecord } = {};
        let bindEquipid = 0;
        let isConditionActive = 0;
        for (let info of data) {
            if (info.SectName == sectName && (info.Abilityid == abilityitemname || abilityitemname == null)) {
                if (configs[info.SectId] == null) {
                    configs[info.SectId] = info;
                    if (info.Equipid) {
                        bindEquipid = info.Equipid;
                    }
                }
            }
        }
        if (bindEquipid != 0 && playerid !== -1) {
            if (iStar == BuildingConfig.MAX_STAR) {
                isConditionActive = 1;
            }
            if (HeroEquipComponent.CheckPlayerIsScepter(playerid!, bindEquipid)) {
                isConditionActive = 2;
            }
        }
        const sectlock = abilityitemname != null && bindEquipid > 0 && isConditionActive == 0;
        const showScepter = abilityitemname != null && bindEquipid > 0;
        let configlist = Object.values(configs);
        configlist.sort((a, b) => { return a.activeCount - b.activeCount });
        let SectNameHeader = $.Localize("#lang_" + sectName);
        if (sectlock) {
            SectNameHeader += `(${BuildingConfig.MAX_STAR}星或符石激活)`;
        }
        else if (allcombs.length > 0) {
            let lastcomb = allcombs[0]
            SectNameHeader += `(${lastcomb.uniqueConfigList.length}/${lastcomb.activeNeedCount})`
        }

        return (
            <Panel ref={this.__root__} className="CCCombinationInfoDialog"  {...this.initRootAttrs()}>
                <CCPanel width="380px" flowChildren="down" className={CSSHelper.ClassMaker({ CombinationShowPanelBg: this.props.showBg })}>
                    <CCPanelHeader flowChildren="right">
                        <CCCombinationIcon id="SectIcon" sectName={sectName} lock={sectlock} />
                        <CCPanel className={CSSHelper.ClassMaker("SectDes", { Disable: sectlock })} flowChildren="down" width="250px" marginLeft="8px"  >
                            <Label id="SectNameHeader" html={true} text={SectNameHeader} visible={this.props.showSectName || false} />
                            <Label id="SectNameHeaderDes" html={true} text={$.Localize("#lang_" + sectName + "_Des")} />
                            {/* <Label id="SectNameDescription" html={true} text={replaceValues({
                            sStr: $.Localize("#DOTA_Tooltip_ability_" + sectName + "_description"),
                            sAbilityName: sectName,
                            bShowExtra: false,
                            iLevel: Math.max(0, sectInfo.level) + sectInfo.bonusLevel,
                            // bOnlyNowLevelValue: true
                        })} /> */}
                        </CCPanel>
                        {showScepter && <CCIcon_Scepter on={isConditionActive == 2} />}
                    </CCPanelHeader>
                    {/* <CCProgressBar id="RemainProgress" width="100%" max={100} value={50} >
                        <CCLabel align="center center" localizedText={"剩余:{d:value}%"} dialogVariables={{ value: 50 }} />
                    </CCProgressBar> */}
                    <CCPanel id="ECombContainer" flowChildren="down">
                        {configlist.map((_config, index) => {
                            let isactive = false;
                            allcombs.forEach((entity) => {
                                if (entity.IsActive() && entity.SectId === _config.SectId) {
                                    isactive = true;
                                }
                            })
                            let commoneffect = _config.acitveCommonEffect;
                            let Specialeffect = _config.acitveSpecialEffect;
                            let activeNeedCount = _config.activeCount;
                            const len = allcombs.length;
                            if (len > 0) {
                                activeNeedCount = allcombs[len - 1 - index].activeNeedCount;
                            }
                            return (
                                <CCPanel key={"" + index} className={CSSHelper.ClassMaker('InfoContent', { 'Active': isactive })} flowChildren="right">
                                    <Label className={CSSHelper.ClassMaker('InfoHeader', { 'Active': isactive })} text={`(${activeNeedCount})`} html={true} />
                                    <CCPanel key={"" + index} marginLeft="5px" flowChildren="down" minHeight={"30px"}>
                                        {
                                            commoneffect.length > 0 && <Label key={commoneffect} html={true} className={CSSHelper.ClassMaker('InfoDes', { 'Active': isactive })}
                                                text={`[${$.Localize("#DOTA_Tooltip_" + commoneffect)}]: ${this.GetSectBuffDescriptionByName(commoneffect)}`} />
                                        }
                                        {
                                            abilityitemname && Specialeffect.length > 0 && <Label key={Specialeffect} html={true} className={CSSHelper.ClassMaker('InfoDes', { 'Active': isactive })}
                                                text={`[${$.Localize("#DOTA_Tooltip_" + Specialeffect)}]: ${this.GetSectBuffDescriptionByName(Specialeffect)}`} />
                                        }
                                    </CCPanel>
                                </CCPanel>)

                        })}
                    </CCPanel>
                    <CCCombinationUnitIconGroup marginTop={"10px"} sectName={sectName} playerid={playerid} castentityindex={castentityindex} />
                </CCPanel>
            </Panel>
        )
    }
}



