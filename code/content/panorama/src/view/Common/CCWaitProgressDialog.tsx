
import React from "react";
import { NetHelper } from "../../helper/NetHelper";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCMainPanel } from "../MainPanel/CCMainPanel";
import "./CCWaitProgressDialog.less";

interface ICCWaitProgressDialog {
    protocol?: string;
    data?: any;
    waitMsg?: string;
    successMsg?: string;
    failMsg?: string;
}

export class CCWaitProgressDialog extends CCPanel<ICCWaitProgressDialog> {
    static defaultProps = {
        waitMsg: "lang_DialogBox_PleaseWait",
        successMsg: "lang_DialogBox_Get_Success",
        failMsg: "lang_DialogBox_Get_Fail"
    }

    onInitUI() {
        if (this.props.protocol) {
            NetHelper.SendToCSharp(this.props.protocol, this.props.data, GHandler.create(this, (e) => {
                this.changeState(Boolean(e.state), e.data);
            }))
        }
    }

    static showProgressDialog(data: ICCWaitProgressDialog) {
        CCMainPanel.GetInstance()!.addOnlyPanel(CCWaitProgressDialog, data)
    }

    changeState(issuccess: boolean, des: string) {
        if (issuccess) {
            this.UpdateState({ sMsg: this.props.successMsg });
        }
        else {
            this.UpdateState({ sMsg: this.props.failMsg, sMsgDes: des });
        }
    }

    render() {
        const waitMsg = this.props.waitMsg;
        const sMsg = this.GetState<string>("sMsg");
        const sMsgDes = this.GetState<string>("sMsgDes") || "";
        return (
            <Panel className="CC_WaitProgressDialog" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog id="PopUpBg" onClose={() => this.close()}>
                    <Panel visible={sMsg == null} className="Pleasewait" hittest={false}>
                        <Label id="waitMsg" key={waitMsg} localizedText={"#" + waitMsg} />
                        <Image id="refresh" />
                    </Panel>
                    <Label visible={sMsg != null} id="Msg" key={sMsg} text={$.Localize("#" + sMsg) + "\n" + sMsgDes} />
                    {this.props.children}
                    {this.__root___childs}
                </CCPopUpDialog>
            </Panel>
        )
    }
}