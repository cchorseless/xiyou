import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCDOTAUIEconSetPreview.less";

interface ICCDOTAUIEconSetPreview {
    // 套装id
    itemdef: number;
    unit: string;
    displaymode?: "loadout_small" | string;
    drawbackground?: boolean;
    renderdeferred?: boolean;
    deferredalpha?: boolean;
}
export class CCDOTAUIEconSetPreview extends CCPanel<ICCDOTAUIEconSetPreview>{

    onInitUI() {
    }

    render() {
        return (
            <Panel className="CCDOTALargeModelPreview" ref={this.__root__}   {...this.initRootAttrs()}>
                <GenericPanel type="DOTAUIEconSetPreview" hittest={false} {... this.props} />
                {this.props.children}
                {this.__root___childs}
            </Panel>
        );
    }
}