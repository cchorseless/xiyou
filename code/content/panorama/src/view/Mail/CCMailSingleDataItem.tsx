import React from "react";
import { EMailState, TMail } from "../../../../scripts/tscripts/shared/service/mail/TMail";
import { CSSHelper } from "../../helper/CSSHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { CCIconButton } from "../AllUIElement/CCButton/CCIconButton";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCMailSingleDataItem.less";


interface ICCMailSingleDataItem {
    mail: TMail,
    ItemSelected?: boolean
}

export class CCMailSingleDataItem extends CCPanel<ICCMailSingleDataItem> {
    Init() {
        if (this.props.mail) {
            this.ListenUpdate(this.props.mail)
        }
    }

    render() {
        const Mail = this.props.mail;
        let time = TimerHelper.GetFullTimeDes(GToNumber(Mail.Time));
        if (Mail.ValidTime > 0) {
            time += `(有效期:${(Mail.ValidTime / 24 / 3600).toFixed(0)}天)`;
        }
        let state = "[未读]";
        if (Mail.State && Mail.State.includes(EMailState.Read)) {
            state = "[已读]"
        }
        if (Mail.State && Mail.State.includes(EMailState.UnItemGet)) {
            state = "[物品奖励]"
        }
        if (Mail.State && Mail.State.includes(EMailState.ItemGet)) {
            state = "[奖励已领取]"
        }
        return <Panel className={CSSHelper.ClassMaker("CCMailSingleDataItem", { ItemSelected: this.props.ItemSelected })} ref={this.__root__}  {...this.initRootAttrs()}>
            <CCIconButton width="100%" height="100%" flowChildren="down">
                <CCPanel width="100%" flowChildren="right" height="40px">
                    <CCLabel type="UnitName" text={Mail.Title} hittest={false} marginLeft={"10px"} />
                    <CCLabel type="UnitName" text={time} hittest={false} horizontalAlign="right" marginRight={"10px"} />
                </CCPanel>
                <CCPanel width="100%" flowChildren="right" height="40px">
                    <CCLabel type="UnitName" text={Mail.Content} hittest={false} height="80px" marginLeft={"10px"} />
                    <CCLabel type="UnitName" text={state} hittest={false} height="80px" horizontalAlign="right" marginRight={"10px"} />
                </CCPanel>
            </CCIconButton>

        </Panel>
    }
}