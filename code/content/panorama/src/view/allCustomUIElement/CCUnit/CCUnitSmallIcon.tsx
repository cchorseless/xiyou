/** Create By Editor*/
import React, { createRef, useState } from "react";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCUnitSmallIcon.less";

interface ICCUnitSmallIcon extends NodePropsData {
    itemname: string;
    rarity?: Rarity
}
export class CCUnitSmallIcon extends CCPanel<ICCUnitSmallIcon> {

    defaultStyle() {
        return {
            width: "50px",
            height: "50px",
        }
    }
    defaultClass() {
        if (this.props.rarity) {
            return this.props.rarity as string;
        }
        return "";
    }
    render() {
        return (
            this.__root___isValid &&
            <Panel id="CC_UnitSmallIcon" ref={this.__root__}    {...this.initRootAttrs()}>
                <CCPanel id="UnitIcon" backgroundImage={`url(\"file://{images}/card/card_icon/${this.props.itemname}.png\")`} />
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };

}
