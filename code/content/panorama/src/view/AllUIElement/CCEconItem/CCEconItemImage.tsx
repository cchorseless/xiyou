import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCIconButton } from "../CCButton/CCIconButton";
import { CCLabel } from "../CCLabel/CCLabel";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCEconItemImage.less";


interface ICCEconItemImage extends NodePropsData {
    itemdef: number | string;
    showName?: boolean;
}
export class CCEconItemImage extends CCPanel<ICCEconItemImage> {

    render() {
        const config = GJSONConfig.WearableConfig.get(this.props.itemdef + "");
        const itemname = config?.itemName;
        const rarity = config?.itemRarity as IRarity;
        return (<Panel className="CCEconItemImage" ref={this.__root__}    {...this.initRootAttrs()}>
            <CCIconButton id="EconIconButton">
                <EconItemImage itemdef={GToNumber(this.props.itemdef)} className="EconItem" />
            </CCIconButton>
            {this.props.showName && <CCLabel type="UnitName" localizedText={itemname} color={CSSHelper.GetRarityColor(rarity)} />}
            {this.props.children}
            {this.__root___childs}
        </Panel>)
    }

}
