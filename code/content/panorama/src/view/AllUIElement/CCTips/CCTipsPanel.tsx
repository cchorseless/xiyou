import { render } from "@demon673/react-panorama";
import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCTipsPanel.less";


interface IProps extends NodePropsData {
    str: string,
    time?: number,
}

export class CCTipsPanel extends CCPanel<IProps> {
    private static _instance_: CCTipsPanel;
    private static errorsound: string;
    static ShowOne(str: string, sound: string, time: number = 1) {
        if (CCTipsPanel._instance_) {
            CCTipsPanel.errorsound = sound;
            CCTipsPanel._instance_.showSelf(str, time)
            return;
        }
        render(<CCTipsPanel str={str} time={time} />, $.GetContextPanel().GetChild(0)!)
    }
    onStartUI() {
        CCTipsPanel._instance_ = this;
        this.showSelf(this.props.str, this.props.time);
    }

    timeTask: ITimerTask | null;

    showSelf(str: string, time: number = 1) {
        const des = str[0] == "#" ? str : "#" + str;
        this.UpdateState({ des: $.Localize(des), time: time })
        Game.EmitSound(CCTipsPanel.errorsound);
        if (this.timeTask) {
            this.timeTask.Clear();
            this.timeTask = null;
        }
        else {
            this.__root__.current!.AddClass("ShowTip");
        }
        this.timeTask = GTimerHelper.AddTimer(time || 1, GHandler.create(this, () => {
            this.__root__.current!.RemoveClass("ShowTip");
            this.timeTask = null;
        }))
    }


    render() {
        const des = this.GetState<string>("des");
        return (<Panel className="CC_TipsPanel" ref={this.__root__} {...this.initRootAttrs()}>
            <Label id="TipsDes" text={des} />
        </Panel>)
    }
}