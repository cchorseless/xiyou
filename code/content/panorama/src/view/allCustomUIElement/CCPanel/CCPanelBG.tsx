import React, { createRef, PureComponent } from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "./CCPanel";
import "./CCPanelBG.less";

interface ICCPanelBG {
    defaultClass?: "Default";
}

export class CCPanelBG extends CCPanel<ICCPanelBG> {
    defaultClass = () => {
        return CSSHelper.ClassMaker("CC_PanelBG", this.props.defaultClass);;
    };

    render() {
        return (this.__root___isValid &&
            <Panel ref={this.__root__}      {...this.initRootAttrs()}>
                {this.__root___childs}
                {this.props.children}
            </Panel>)
    }
}