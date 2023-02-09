import React from "react";
import { GameEnum } from "../../../../../scripts/tscripts/shared/GameEnum";
import { CSSHelper } from "../../../helper/CSSHelper";
import { DotaUIHelper } from "../../../helper/DotaUIHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCPausePanel.less";

interface ICCPausePanel {
    tipQueue?: string[];
}

export class CCPausePanel extends CCPanel<ICCPausePanel> {

    onInitUI() {
        let oldpanel = DotaUIHelper.GetWindowRoot()?.FindChildTraverse("PausedInfo");
        if (oldpanel) {
            oldpanel!.style.opacity = "0";
        }
        this.addGameEvent(GameEnum.GameEvent.DotaPauseEventEvent, (e: DotaPauseEventEvent) => {
            this.__root__.current!.SetHasClass("Paused", e.message == 34);
        })
    }

    render() {
        const tips = this.props.tipQueue;
        return (this.__root___isValid &&
            <Panel id="CC_PausePanel" className={CSSHelper.ClassMaker({ "Paused": Game.IsGamePaused() })} ref={this.__root__} hittest={false}   {...this.initRootAttrs()}>
                <Label id="CC_PausePausing" localizedText="#lang_CustomPausing" hittest={false} />
                {
                    // tips && tips.length > 0 && <CCIntervalTips id="CC_PauseIntervalTip" tick={5} tipQueue={tips} />
                }
                {this.__root___childs}
                {this.props.children}
            </Panel>)
    }
}