import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCHandBookCourier.less";


interface ICCHandBookCourier {
}

export class CCHandBookCourier extends CCPanel<ICCHandBookCourier> {

    render() {
        return <Panel className={CSSHelper.ClassMaker("CCHandBookCourier")}
            hittest={false}
            ref={this.__root__}  {...this.initRootAttrs()}>
        </Panel>
    }
}