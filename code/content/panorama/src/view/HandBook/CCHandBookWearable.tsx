import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCHandBookWearable.less";


interface ICCHandBookWearable {
}

export class CCHandBookWearable extends CCPanel<ICCHandBookWearable> {

    render() {
        return <Panel className={CSSHelper.ClassMaker("CCHandBookWearable")}
            ref={this.__root__} hittest={false}   {...this.initRootAttrs()}>
        </Panel>
    }
}