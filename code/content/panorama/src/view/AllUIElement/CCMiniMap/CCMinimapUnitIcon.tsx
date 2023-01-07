import React from "react";

import { CCPanel } from "../CCPanel/CCPanel";
import "./CCMinimapUnitIcon.less";

interface ICCMinimapUnitIcon extends NodePropsData {
}

export class CCMinimapUnitIcon extends CCPanel<ICCMinimapUnitIcon> {


    render() {
        return (
            this.__root___isValid &&
            <Panel id="CC_MinimapUnitIcon" ref={this.__root__}   {...this.initRootAttrs()}>
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}