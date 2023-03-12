/** Create By Editor*/
import React from "react";
import { UnitHelper } from "../../../helper/DotaEntityHelper";
import { KVHelper } from "../../../helper/KVHelper";
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
        let SmallIconRes = "";
        let unit_name = this.props.itemname;
        let rarity = UnitHelper.GetUnitRarety(unit_name);
        let unitobj = KVHelper.KVUnits()[unit_name];
        if (unitobj) {
            SmallIconRes = (unitobj.SmallIconRes) as string;
        }
        else {
            GLogHelper.warn("CCUnitSmallIcon", "unitobj is null", unit_name)
        }
        return (
            this.__root___isValid &&
            <Panel id="CC_UnitSmallIcon" className={rarity} ref={this.__root__}    {...this.initRootAttrs()}>
                <CCPanel id="UnitIcon" backgroundImage={PathHelper.getCustomImageUrl(`hero/hero_icon/${SmallIconRes}.png`)} />
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };

}
