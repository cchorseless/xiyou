import React from "react";
import { LogHelper } from "../../helper/LogHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCAvatar } from "../AllUIElement/CCAvatar/CCAvatar";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCIcon } from "../AllUIElement/CCIcons/CCIcon";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCProgressBar } from "../AllUIElement/CCProgressBar/CCProgressBar";
import { CCUserName } from "../AllUIElement/CCUserName/CCUserName";
import { CCPlayerInfoDialog } from "./CCPlayerInfoDialog";
import "./CCPlayerCard.less";

interface ICCPlayerCard extends NodePropsData {
    iPlayerID: PlayerID;
}

export class CCPlayerCard extends CCPanel<ICCPlayerCard> {



    // render() {
    //     return

    // }

}