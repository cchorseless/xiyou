import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCToggleButton.less";

interface ICCToggleButton {
    str?: string,
    selected?: boolean,
    localtext?: string,

}
export class CCToggleButton extends CCPanel<ICCToggleButton, ToggleButton>{
    static defaultProps = {
        str: "",
        selected: false,
    };
    defaultClass() {
        return "CC_ToggleButton"
    }
    defaultStyle() {
        return { localizedText: this.props.localtext, selected: this.props.selected, }
    }
    render() {
        return (
            this.__root___isValid &&
            <ToggleButton ref={this.__root__}  {...this.initRootAttrs()} />
        );
    }
}