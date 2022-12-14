import React, { } from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCImage } from "../AllUIElement/CCImage/CCImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelBG, CCPanelHeader } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCProgressBar } from "../AllUIElement/CCProgressBar/CCProgressBar";
import { CCCombinationIcon } from "./CCCombinationIcon";

import "./CCCombinationInfoDialog.less";

interface ICCCombinationInfoDialog {
    sectName: string
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
                            <Label id="SectNameHeader" html={true} text={$.Localize("#DOTA_Tooltip_ability_" + sectName)} />
                            {/* <Label id="SectNameDescription" html={true} text={replaceValues({
                                sStr: $.Localize("#DOTA_Tooltip_ability_" + sectName + "_description"),
                                sAbilityName: sectName,
                                bShowExtra: false,
                                iLevel: Math.max(0, sectInfo.level) + sectInfo.bonusLevel,
                                // bOnlyNowLevelValue: true
                            })} /> */}
                        </CCPanel>
                    </CCPanelHeader>
                    <CCProgressBar id="RemainProgress" max={100} value={50} >
                        <CCLabel align="center center" localizedText={"剩余:{d:value}%"} dialogVariables={{ value: 50 }} />
                    </CCProgressBar>
                    <CCPanel id="LoreContainer">
                        <Label html={true} text={$.Localize("#DOTA_Tooltip_ability_" + sectName + "_Lore")} />
                    </CCPanel>
                </CCPanelBG>
            </Panel>
        )
    }
}