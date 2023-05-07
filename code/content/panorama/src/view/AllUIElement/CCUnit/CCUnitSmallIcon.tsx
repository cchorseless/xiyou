import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { PathHelper } from "../../../helper/PathHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCUnitSmallIcon.less";

interface ICCUnitSmallIcon extends NodePropsData {
    itemname: string;
}
export class CCUnitSmallIcon extends CCPanel<ICCUnitSmallIcon> {



    render() {
        let SmallIconRes = "";
        let unit_name = this.props.itemname;
        let rarity = Entities.GetUnitRarity(unit_name);
        let unitobj = KVHelper.KVUnits()[unit_name];
        if (unitobj) {
            SmallIconRes = (unitobj.SmallIconRes) as string;
        }
        else {
            GLogHelper.warn("CCUnitSmallIcon", "unitobj is null", unit_name)
        }
        return (
            <Panel className={CSSHelper.ClassMaker("CCUnitSmallIcon", rarity)} ref={this.__root__}    {...this.initRootAttrs()}>
                <CCPanel id="UnitIcon" backgroundImage={PathHelper.getCustomImageUrl(`hero/hero_icon/${SmallIconRes}.png`)} />
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };

}
