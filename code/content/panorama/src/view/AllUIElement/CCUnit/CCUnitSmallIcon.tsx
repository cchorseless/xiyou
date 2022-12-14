/** Create By Editor*/
import React, { createRef, useState } from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
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
        let unit_name = this.props.itemname;
        unit_name = unit_name.replace("building_hero_", "");
        return (
            this.__root___isValid &&
            <Panel id="CC_UnitSmallIcon" ref={this.__root__}    {...this.initRootAttrs()}>
                <CCPanel id="UnitIcon" backgroundImage={CSSHelper.getCustomImageUrl(`hero/hero_icon/${unit_name}.png`)} />
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };

}
