import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";

export interface ICCDOTAAghsStatusDisplay {

}

export class CCDOTAAghsStatusDisplay extends CCPanel<ICCDOTAAghsStatusDisplay> {

    render() {
        return (
            this.__root___isValid &&
            <Panel id="CC_DOTAAghsStatusDisplay" ref={this.__root__}      {...this.initRootAttrs()}>
                <GenericPanel type="DOTAAghsStatusDisplay" id="AghsStatusContainer" />
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}