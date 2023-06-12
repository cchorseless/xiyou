import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCLabel } from "../CCLabel/CCLabel";
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
    localizedStr?: string;
    type?: "Tui3" | "Tui7";
}
export class CCPanelHeader extends CCPanel<ICCPanelHeader> {
    defaultClass = () => {
        const type = this.props.type || "Tui3";
        return CSSHelper.ClassMaker("CCPanelHeader", type);
    };
    render() {
        const localizedStr = this.props.localizedStr;
        return (<Panel ref={this.__root__}      {...this.initRootAttrs()}>
            {localizedStr && localizedStr.length > 0 && <CCLabel id="HeadTitle" type="Title" key={Math.random() + ""} localizedText={localizedStr} />}
            {this.__root___childs}
            {this.props.children}
        </Panel>)
    }
}

