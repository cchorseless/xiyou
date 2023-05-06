import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCHandBookArtifact.less";


interface ICCHandBookArtifact {
}

export class CCHandBookArtifact extends CCPanel<ICCHandBookArtifact> {

    render() {
        return <Panel className={CSSHelper.ClassMaker("CCHandBookArtifact")}
            hittest={false}
            ref={this.__root__}  {...this.initRootAttrs()}>
        </Panel>
    }
}