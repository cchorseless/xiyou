import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { GameEnum } from "../../../libs/GameEnum";
import { CCIntervalTips } from "../CCIntervalTips/CCIntervalTips";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCPausePanel.less";

interface ICCPausePanel {
    tipQueue?: string[];
}

export class CCPausePanel extends CCPanel<ICCPausePanel> {
    defaultClass = () => {
        return CSSHelper.ClassMaker("CC_PausePanel");;
    };

    onInitUI() {
        this.addGameEvent(GameEnum.GameEvent.dota_pause_event, (e: DotaPauseEventEvent) => {
            this.__root__.current!.SetHasClass("Paused", e.value == 1);
        })
    }

    render() {
        const tips = this.props.tipQueue;
        return (this.__root___isValid &&
            <Panel id="CC_Pause" ref={this.__root__}      {...this.initRootAttrs()}>
                <Label id="CC_PausePausing" localizedText="#CustomPausing" hittest={false} />
                {
                    tips && tips.length > 0 && <CCIntervalTips id="CC_PauseIntervalTip" tick={5} tipQueue={tips} />
                }
                {this.__root___childs}
                {this.props.children}
            </Panel>)
    }
}