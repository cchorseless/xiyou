import React, { } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { CSSHelper } from "../../helper/CSSHelper";
import { KVHelper } from "../../helper/KVHelper";
import { ET } from "../../libs/Entity";
import { GameEnum } from "../../libs/GameEnum";
import { CCImage } from "../allCustomUIElement/CCImage/CCImage";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";

import "./CCCombinationInfoDialog.less";

interface ICCCombinationInfoDialog {
}

export class CCCombinationInfoDialog extends CCPanel<ICCCombinationInfoDialog> {

    render() {
        if (!this.__root___isValid) { return <></> }
        return (
            <Panel ref={this.__root__} id="CC_CombinationBottomPanel"  {...this.initRootAttrs()}>


            </Panel>
        )
    }
}