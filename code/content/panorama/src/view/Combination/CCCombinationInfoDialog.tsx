import React from "react";
import { Dota } from "../../../../scripts/tscripts/shared/Gen/Types";
import { ECombination } from "../../game/components/Combination/ECombination";
import { CSSHelper } from "../../helper/CSSHelper";
import { BaseEntityRoot } from "../../libs/BaseEntityRoot";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelBG, CCPanelHeader } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCProgressBar } from "../AllUIElement/CCProgressBar/CCProgressBar";
import { CCCombinationIcon } from "./CCCombinationIcon";

import "./CCCombinationInfoDialog.less";
import { CCCombinationUnitIconGroup } from "./CCCombinationUnitIconGroup";

interface ICCCombinationInfoDialog {
    sectName: string,
    playerid?: PlayerID,
    castentityindex?: AbilityEntityIndex,
    abilityitemname?: string,
}

export class CCCombinationInfoDialog extends CCPanel<ICCCombinationInfoDialog> {

    static defaultProps = {
        castentityindex: -1,
        playerid: -1,
    }



    render() {
        let { sectName, castentityindex, playerid, abilityitemname } = this.props;
        if (abilityitemname == null && castentityindex != -1) {
            abilityitemname = Abilities.GetAbilityName(castentityindex!);
        }
        if (playerid == -1) {
            if (castentityindex != -1) {
                let unitentityindex = Abilities.GetCaster(castentityindex!);
                playerid = BaseEntityRoot.GetEntityBelongPlayerId(unitentityindex);
            }
        }
        let allcombs: ECombination[] = [];
        if (playerid !== -1) {
            allcombs = ECombination.GetCombinationByCombinationName(playerid!, sectName) || [];
        }
        let data = GJSONConfig.CombinationConfig.getDataList();
        let configs: { [k: string]: Dota.CombinationConfigRecord } = {};
        for (let info of data) {
            if (info.relation == sectName && (info.Abilityid == abilityitemname || abilityitemname == null)) {
                if (configs[info.relationid] == null) {
                    configs[info.relationid] = info;
                }
            }
        }
        let configlist = Object.values(configs);
        configlist.sort((a, b) => { return a.activeCount - b.activeCount });
        let SectNameHeader = $.Localize("#lang_" + sectName);
        if (allcombs.length > 0) {
            let lastcomb = allcombs[0]
            SectNameHeader += `(${lastcomb.uniqueConfigList.length}/${lastcomb.activeNeedCount})`
        }
        return (
            <Panel ref={this.__root__} className="CCCombinationInfoDialog"  {...this.initRootAttrs()}>
                <CCPanelBG width="380px" flowChildren="down" type="ToolTip">
                    <CCPanelHeader flowChildren="right">
                        <CCCombinationIcon id="SectIcon" sectName={sectName} />
                        <CCPanel className="SectDes" flowChildren="down" marginLeft="8px" >
                            <Label id="SectNameHeader" html={true} text={SectNameHeader} />
                            <Label html={true} text={$.Localize("#lang_" + sectName + "_Des")} />
                            {/* <Label id="SectNameDescription" html={true} text={replaceValues({
                            sStr: $.Localize("#DOTA_Tooltip_ability_" + sectName + "_description"),
                            sAbilityName: sectName,
                            bShowExtra: false,
                            iLevel: Math.max(0, sectInfo.level) + sectInfo.bonusLevel,
                            // bOnlyNowLevelValue: true
                        })} /> */}
                        </CCPanel>
                    </CCPanelHeader>
                    <CCProgressBar id="RemainProgress" width="100%" max={100} value={50} >
                        <CCLabel align="center center" localizedText={"剩余:{d:value}%"} dialogVariables={{ value: 50 }} />
                    </CCProgressBar>
                    <CCPanel id="ECombContainer" flowChildren="down">
                        {configlist.map((_config, index) => {
                            let isactive = false;
                            allcombs.forEach((entity) => {
                                if (entity.IsActive() && entity.combinationId === _config.relationid) {
                                    isactive = true;
                                }
                            })
                            let commoneffect = _config.acitveCommonEffect;
                            let Specialeffect = _config.acitveSpecialEffect;
                            return (
                                <CCPanel key={"" + index} className={CSSHelper.ClassMaker('InfoContent', { 'Active': isactive })} flowChildren="right">
                                    <Label className={CSSHelper.ClassMaker('InfoHeader', { 'Active': isactive })} text={`(${_config.activeCount})`} html={true} />
                                    <CCPanel key={"" + index} marginLeft="5px" flowChildren="down" minHeight={"30px"}>
                                        {
                                            commoneffect.length > 0 && <Label key={commoneffect} html={true} className={CSSHelper.ClassMaker('InfoDes', { 'Active': isactive })}
                                                text={`[${$.Localize("#DOTA_Tooltip_" + commoneffect)}]: ${$.Localize("#DOTA_Tooltip_" + commoneffect + "_description")}`} />
                                        }
                                        {
                                            abilityitemname && Specialeffect.length > 0 && <Label key={Specialeffect} html={true} className={CSSHelper.ClassMaker('InfoDes', { 'Active': isactive })}
                                                text={`[${$.Localize("#DOTA_Tooltip_" + Specialeffect)}]: ${$.Localize("#DOTA_Tooltip_" + Specialeffect + "_description")}`} />
                                        }
                                    </CCPanel>
                                </CCPanel>)

                        })}
                    </CCPanel>
                    <CCCombinationUnitIconGroup marginTop={"10px"} sectName={sectName} playerid={this.props.playerid} castentityindex={this.props.castentityindex} />
                </CCPanelBG>
            </Panel>
        )
    }
}



