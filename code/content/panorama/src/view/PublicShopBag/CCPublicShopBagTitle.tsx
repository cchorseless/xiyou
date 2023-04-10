
import React from "react";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCPublicShopBagTitle.less";

export class CCPublicShopBagTitle extends CCPanel<{ title: string }> {
    render() {
        const title = this.props.title || "";
        return (
            <Panel className="CC_PublicBagTitle" ref={this.__root__} hittest={false}>
                <Label text={title} />
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    }
}
