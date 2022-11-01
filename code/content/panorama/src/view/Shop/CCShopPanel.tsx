
import React, { createRef, PureComponent } from "react";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../allCustomUIElement/CCPopUpDialog/CCPopUpDialog";

interface ICCShopPanel extends NodePropsData {

}

export class CCShopPanel extends CCPanel<ICCShopPanel> {
    onInitUI() {

    }
    render() {
        return (
            this.__root___isValid &&
            <CCPopUpDialog ref={this.__root__}    {...this.initRootAttrs()}>
                {this.props.children}
                {this.__root___childs}
            </CCPopUpDialog>
        )
    };
}