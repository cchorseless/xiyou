
import React from "react";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCStorageIconItem } from "./CCStorageIconItem";
import "./CCStorageItemGetDialog.less";

interface ICCStorageItemGetDialog {
    Items: IFItemInfo[]
}

export class CCStorageItemGetDialog extends CCPanel<ICCStorageItemGetDialog> {
    onInitUI() {

    }

    render() {
        const Items = this.props.Items || [];
        return (<Panel className={"CCStorageItemGetDialog"} ref={this.__root__} hittest={false}  {...this.initRootAttrs()}>
            <CCPopUpDialog id="PopUpBg" title={"恭喜获得"} onClose={() => this.close()} >
                <CCPanel id="PopUpContent" flowChildren="right-wrap" scroll={"y"}>
                    {
                        Items.map((v, index) => {
                            if (v.ItemConfigId && v.ItemCount) {
                                return <CCStorageIconItem key={index + ""} itemid={v.ItemConfigId} count={v.ItemCount} />
                            }
                        })
                    }
                </CCPanel>
                {this.props.children}
                {this.__root___childs}
            </CCPopUpDialog>
        </Panel>
        )
    }
}