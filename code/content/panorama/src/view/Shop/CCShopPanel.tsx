
import React, { createRef, PureComponent } from "react";
import { LogHelper } from "../../helper/LogHelper";
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
            <Panel ref={this.__root__} className="CC_root" hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog title="#sssss" verticalAlign="top" marginTop="120px" type="Tui3"
                    onClose={
                        () => {
                            LogHelper.print(11111111);
                        }} />
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}