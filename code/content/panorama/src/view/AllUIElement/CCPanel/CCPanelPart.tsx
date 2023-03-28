import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "./CCPanel";
import "./CCPanelPart.less";


interface ICCPanelBG {
    type?: "Default" | "ToolTip" | "Tui3" | "None";
}

export class CCPanelBG extends CCPanel<ICCPanelBG> {
    defaultClass() {
        return CSSHelper.ClassMaker("CC_PanelBG", this.props.type);;
    };

    static defaultProps = {
        type: "Tui3"
    }
    render() {
        return (this.__root___isValid &&
            <Panel ref={this.__root__}      {...this.initRootAttrs()}>
                {this.__root___childs}
                {this.props.children}
            </Panel>)
    }
}




interface ICCPanelHeader {
}
export class CCPanelHeader extends CCPanel<ICCPanelHeader> {
    defaultClass = () => { return "CC_PanelHeader"; };
    render() {
        return (this.__root___isValid &&
            <Panel ref={this.__root__}      {...this.initRootAttrs()}>
                {this.__root___childs}
                {this.props.children}
            </Panel>)
    }
}

