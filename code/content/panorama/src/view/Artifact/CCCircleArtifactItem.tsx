import React from "react";

import { CCCircleAbilityItem } from "../AllUIElement/CCAbility/CCCircleAbilityItem";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
// import "./CCCircleArtifactItem.less";

interface ICCCircleArtifactItem extends NodePropsData {
    iItemIndex: ItemEntityIndex,

}

export class CCCircleArtifactItem extends CCPanel<ICCCircleArtifactItem> {

    render() {
        const iItemIndex = this.props.iItemIndex!;
        return (
            <Panel ref={this.__root__}  {...this.initRootAttrs()}>
                <CCCircleAbilityItem iItemIndex={iItemIndex} />
            </Panel>
        );
    }
}