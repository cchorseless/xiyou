
import React from "react";
import { CCButton } from "../CCButton/CCButton";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCMenuDashBoardBackAndSetting.less";

interface ICCMenuDashBoardBackAndSetting extends NodePropsData {

}

export class CCMenuDashBoardBackAndSetting extends CCPanel<ICCMenuDashBoardBackAndSetting> {
    render() {
        return (
            <Panel className="CC_MenuDashBoardBackAndSetting" ref={this.__root__}  {...this.initRootAttrs()}>
                <CCButton id="CustomDashBoardButton" onactivate={() => $.DispatchEvent("DOTAHUDShowDashboard")} />
                <CCButton id="CustomSettingButton" onactivate={() => $.DispatchEvent("DOTAShowSettingsPopup")} />
            </Panel>)
    }
}