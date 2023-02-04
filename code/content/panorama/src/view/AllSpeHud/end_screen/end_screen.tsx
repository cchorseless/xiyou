import { render } from "@demon673/react-panorama";
import React from "react";
import { AllShared } from "../../../../../scripts/tscripts/shared/AllShared";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { CCPanel } from "../../AllUIElement/CCPanel/CCPanel";
export class CCEnd_Screen extends CCPanel<NodePropsData> {
    onDestroy() {
        TimerHelper.Stop();
        LogHelper.print("----------------CCEnd_Screen close----------------")
    }
}

AllShared.Init();
TimerHelper.Init();
render(<CCEnd_Screen />, $.GetContextPanel());
