import React from "react";
import { CCItemCombinesPanel } from "../AllUIElement/CCItem/CCItemCombinesPanel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCMainPanel } from "../MainPanel/CCMainPanel";
import "./CCContextMenuDialog.less";

type IContextMenuButton = "Sell" | "Disassemble" | "ShowCombine" | "ToBackPack" | "ToPublicBag" | "ToInventory" | "UnLock" | "Lock" | "Destroy" | "Cancel";

interface ICCContextMenuDialog {
    entityIndex?: ItemEntityIndex;
    buttonList?: IContextMenuButton[];
}
/**右键菜单 */
export class CCContextMenuDialog extends CCPanel<ICCContextMenuDialog> {

    render() {
        const entityIndex = this.props.entityIndex!;
        const buttonList = this.props.buttonList || [];
        const sMsg = this.GetState<string>("sMsg");
        const sMsgDes = this.GetState<string>("sMsgDes") || "";
        return (<Panel className="CCContextMenuDialog" ref={this.__root__}  {...this.initRootAttrs()}>
            <CCPanel id="MenuContentItems" hittest={true} hittestchildren={true} >
                {
                    buttonList.map((btnType, index) => {
                        return <CCContextMenuButton key={index + ""} entityIndex={entityIndex} btnType={btnType} onclose={() => this.close()} />
                    })
                }
            </CCPanel>
            {this.props.children}
            {this.__root___childs}
        </Panel>)
    }
}
interface ICCContextMenuButton {
    entityIndex: ItemEntityIndex;
    btnType?: IContextMenuButton;
    onclose?: () => void;

}
/**
 * 右键菜单按钮
 */
export class CCContextMenuButton extends CCPanel<ICCContextMenuButton, Button> {
    static defaultProps = {
        btnType: "Sell",
    }

    onClick() {
        const entityIndex = this.props.entityIndex;
        switch (this.props.btnType) {
            case "Sell":
                break;
            case "Disassemble":
                Items.DisassembleItem(entityIndex);
                break;
            case "Lock":
                Items.SetCombineLocked(entityIndex, true);
                break;
            case "UnLock":
                Items.SetCombineLocked(entityIndex, false);
                break;
            // 显示装备合成详情
            case "ShowCombine":
                CCItemCombinesPanel.GetInstance()?.close();
                CCMainPanel.GetInstance()!.addOnlyPanel(CCItemCombinesPanel, {
                    itemname: Abilities.GetAbilityName(entityIndex),
                })
                break;
        }
        if (this.props.onclose) {
            this.props.onclose();
        }
    }
    render() {
        const btnType = this.props.btnType;
        const entityIndex = this.props.entityIndex;
        return (
            <Button className="CCContextMenuButton" ref={this.__root__} onactivate={() => this.onClick()} hittest={true} {...this.initRootAttrs()}>
                <Label id="lbldes" text={$.Localize("#lang_" + btnType)} />
                {this.props.children}
                {this.__root___childs}
            </Button>
        )
    }
}