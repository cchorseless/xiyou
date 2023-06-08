import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCIconButton } from "../CCButton/CCIconButton";
import { CCLabel } from "../CCLabel/CCLabel";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCEconItemImage.less";


interface ICCEconItemImage extends NodePropsData {
    itemdef: number | string;
    showName?: boolean;
    block?: boolean;
}
export class CCEconItemImage extends CCPanel<ICCEconItemImage> {

    render() {
        const config = GJSONConfig.WearableConfig.get(this.props.itemdef + "");
        const itemname = config?.itemName;
        const block = this.props.block || false;
        const rarity = config?.Rarity || "A" as IRarity;
        return (<Panel className={CSSHelper.ClassMaker("CCEconItemImage")} ref={this.__root__}    {...this.initRootAttrs()}>
            <Panel id="EconIconButtonBg" className={"Rarity_" + rarity}>
                <CCIconButton id="EconIconButton" enabled={!block} >
                    <EconItemImage key={Math.random() * 1000 + ""} itemdef={GToNumber(this.props.itemdef)} className="EconItem" />
                </CCIconButton>
            </Panel>

            {this.props.showName && <CCLabel type="UnitName" fontSize="18px" horizontalAlign="center" localizedText={itemname} color={CSSHelper.GetRarityColor(rarity)} />}
            {this.props.children}
            {this.__root___childs}
        </Panel>)
    }

}
