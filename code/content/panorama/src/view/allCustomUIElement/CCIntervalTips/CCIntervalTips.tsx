import React, { useEffect } from "react";
import { FuncHelper } from "../../../helper/FuncHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCIntervalTips.less";

interface ICCIntervalTips {
    tick?: number;
    tipQueue: string[];
}

export class CCIntervalTips extends CCPanel<ICCIntervalTips> {
    defaultClass = () => { return ("CC_IntervalTips"); };
    static defaultProps = { tick: 5 };
    onInitUI(isnext = true) {
        if (this.timeTaskWork) {
            this.timeTaskWork.Clear();
            this.timeTaskWork = null;
        }
        let curIndex = this.GetState<number>("curIndex") || 0;
        if (isnext) {
            curIndex++;
            if (curIndex >= this.props.tipQueue.length) {
                curIndex = 0
            }
        }
        else {
            curIndex--;
            if (curIndex < 0) {
                curIndex = this.props.tipQueue.length - 1;
            }
        }
        this.UpdateState({ curIndex: curIndex });
        let tick = this.props.tick || 5;
        this.timeTaskWork = TimerHelper.AddTimer(tick, FuncHelper.Handler.create(this, () => {
            this.onInitUI();
        }), true)
    }
    timeTaskWork: TimerHelper.TimerTask | null;
    render() {
        const curIndex = this.GetState<number>("curIndex") || 0;
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__}  {...this.initRootAttrs()}>
                <Button id="PrevTip" onactivate={() => this.onInitUI(false)} />
                <Label id="TipLabel" key={curIndex} localizedText={"#Custom_Tip_" + this.props.tipQueue[curIndex]} />
                <Button id="NextTip" onactivate={() => this.onInitUI()} />
            </Panel>

        );
    }
}



