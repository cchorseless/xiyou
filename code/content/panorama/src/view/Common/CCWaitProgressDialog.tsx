
import React, { createRef, PureComponent } from "react";
import { NetHelper } from "../../helper/NetHelper";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../allCustomUIElement/CCPopUpDialog/CCPopUpDialog";
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
        waitMsg: "DialogBox_PleaseWait",
        successMsg: "DialogBox_Get_Success",
        failMsg: "DialogBox_Get_Fail"
    }

    onInitUI() {
        if (this.props.protocol) {
            NetHelper.SendToCSharp(this.props.protocol, this.props.data, (e) => {
                this.changeState(Boolean(e.state));
            }, this)
        }
    }

    static showProgressDialog(data: ICCWaitProgressDialog) {
        CCMainPanel.GetInstance()!.addOnlyPanel(CCWaitProgressDialog, data)
    }

    changeState(issuccess: boolean) {
        if (issuccess) {
            this.UpdateState({ sMsg: this.props.successMsg });
        }
        else {
            this.UpdateState({ sMsg: this.props.failMsg });
        }
    }

    render() {
        const waitMsg = this.props.waitMsg;
        const sMsg = this.GetState<string>("sMsg");
        return (
            <Panel className="CC_WaitProgressDialog" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog id="PopUpBg" onClose={() => this.close()}>
                    <Panel visible={sMsg == null} className="Pleasewait" hittest={false}>
                        <Label id="waitMsg" key={waitMsg} localizedText={"#" + waitMsg} />
                        <Image id="refresh" />
                    </Panel>
                    <Label visible={sMsg != null} id="Msg" key={sMsg} localizedText={"#" + sMsg} />
                    {this.props.children}
                    {this.__root___childs}
                </CCPopUpDialog>
            </Panel>
        )
    }
}