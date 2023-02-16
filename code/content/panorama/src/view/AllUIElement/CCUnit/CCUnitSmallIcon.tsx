/** Create By Editor*/
import React from "react";
import { UnitHelper } from "../../../helper/DotaEntityHelper";
import { PathHelper } from "../../../helper/PathHelper";

import { CCPanel } from "../CCPanel/CCPanel";
import "./CCUnitSmallIcon.less";

interface ICCUnitSmallIcon extends NodePropsData {
    itemname: string;
}
export class CCUnitSmallIcon extends CCPanel<ICCUnitSmallIcon> {

    defaultStyle() {
        return {
            width: "50px",
            height: "50px",
        }
    }

    render() {
        let unit_name = this.props.itemname;
        let rarity = UnitHelper.GetUnitRarety(unit_name);
        unit_name = unit_name.replace("building_hero_", "");
        return (
            this.__root___isValid &&
            <Panel id="CC_UnitSmallIcon" className={rarity} ref={this.__root__}    {...this.initRootAttrs()}>
                <CCPanel id="UnitIcon" backgroundImage={PathHelper.getCustomImageUrl(`hero/hero_icon/${unit_name}.png`)} />
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };

}
