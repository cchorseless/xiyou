
import React from "react";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCMainPanel } from "../MainPanel/CCMainPanel";
import "./CCNotifyDialog.less";

interface ICCNotifyDialog {
    title: string;
    Msg: string;
}

export class CCNotifyDialog extends CCPanel<ICCNotifyDialog> {

    static showNotifyDialog(data: ICCNotifyDialog) {
        CCMainPanel.GetInstance()!.addOnlyPanel(CCNotifyDialog, data)
    }


    render() {
        const title = this.props.title;
        const Msg = this.props.Msg;
        return (
            <Panel className="CCNotifyDialog" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog id="PopUpBg" title={title} onClose={() => this.close()}>
                    <Label id="Msg" text={$.Localize("#" + Msg)} />
                    {this.props.children}
                    {this.__root___childs}
                </CCPopUpDialog>
            </Panel>
        )
    }
}