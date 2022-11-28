
import React, { createRef, PureComponent } from "react";
import { LogHelper } from "../../helper/LogHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCMenuNavigation } from "../allCustomUIElement/CCNavigation/CCMenuNavigation";
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
            <Panel ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog fullcontent={true} verticalAlign="top" marginTop="120px" type="Tui3"
                    onClose={
                        () => {
                            this.close();
                            CCMenuNavigation.GetInstance()?.NoSelectAny();
                        }} />
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}