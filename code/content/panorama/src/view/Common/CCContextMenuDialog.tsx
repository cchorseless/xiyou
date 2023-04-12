import React from "react";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCContextMenuDialog.less";

type IContextMenuButton = "Sell" | "ToBackPack" | "ToPublicBag" | "ToInventory" | "UnEquip" | "Drop" | "Destroy" | "Cancel";

interface ICCContextMenuDialog {
    buttonList?: IContextMenuButton[];
}

export class CCContextMenuDialog extends CCPanel<ICCContextMenuDialog> {


    render() {
        const waitMsg = this.props.waitMsg;
        const sMsg = this.GetState<string>("sMsg");
        const sMsgDes = this.GetState<string>("sMsgDes") || "";
        return (
            <Panel className="CCContextMenuDialog" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPanel id="MenuContentItems" onClose={() => this.close()}>

                </CCPanel>
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    }
}
interface ICCContextMenuButton {
    btnType?: IContextMenuButton;

}
/**
 * 右键菜单按钮
 */
export class CCContextMenuButton extends CCPanel<ICCContextMenuButton, Button> {
    static defaultProps = {
        btnType: "Sell",
    }

    onClick() {
        switch (this.props.btnType) {
            case "Sell":

                return;
        }
    }
    render() {
        const btnType = this.props.btnType;
        return (
            <Button className="CCContextMenuButton" ref={this.__root__}
                onactivate={() => {
                    this.onClick();
                }} hittest={false} {...this.initRootAttrs()}>
                <Label id="lbldes" text={$.Localize("#lang_" + btnType)} />
                {this.props.children}
                {this.__root___childs}
            </Button>
        )
    }
}