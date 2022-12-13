import React, { createRef, useState } from "react";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCCircleAbilityItem } from "../allCustomUIElement/CCAbility/CCCircleAbilityItem";
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