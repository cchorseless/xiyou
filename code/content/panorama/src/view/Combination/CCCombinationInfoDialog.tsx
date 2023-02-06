import React from "react";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelBG, CCPanelHeader } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCCombinationIcon } from "./CCCombinationIcon";

import "./CCCombinationInfoDialog.less";
import { CCCombinationUnitIconGroup } from "./CCCombinationUnitIconGroup";

interface ICCCombinationInfoDialog {
    sectName: string,
    playerid: PlayerID
}

export class CCCombinationInfoDialog extends CCPanel<ICCCombinationInfoDialog> {
    render() {
        const sectName = this.props.sectName;
        return (
            <Panel ref={this.__root__} id="CC_CombinationInfoDialog"  {...this.initRootAttrs()}>
                <CCPanelBG width="380px" flowChildren="down" type="ToolTip">
                    <CCPanelHeader flowChildren="right">
                        <CCCombinationIcon id="SectIcon" sectName={sectName} />
                        <CCPanel className="SectDes" flowChildren="down" marginLeft="8px" >
                            <Label id="SectNameHeader" html={true} text={$.Localize("#lang_" + sectName)} />
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
                    {/* <CCProgressBar id="RemainProgress" max={100} value={50} >
                        <CCLabel align="center center" localizedText={"剩余:{d:value}%"} dialogVariables={{ value: 50 }} />
                    </CCProgressBar> */}
                    <CCPanel id="LoreContainer">
                    </CCPanel>
                    <CCCombinationUnitIconGroup sectName={sectName} playerid={this.props.playerid} />
                </CCPanelBG>
            </Panel>
        )
    }
}