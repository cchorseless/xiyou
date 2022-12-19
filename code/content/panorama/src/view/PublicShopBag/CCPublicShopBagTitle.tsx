
import React, { createRef, PureComponent } from "react";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCPublicShopBagTitle.less";

export class CCPublicShopBagTitle extends CCPanel<{ title: string }> {
    render() {
        const title = this.props.title || "";
        return (
            <Panel id="CC_PublicBagTitle" ref={this.__root__} hittest={false}>
                <Label text={title} />
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    }
}
