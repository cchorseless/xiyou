
import React, { createRef, PureComponent } from "react";
import { JsonConfigHelper } from "../../../../../game/scripts/tscripts/shared/Gen/JsonConfigHelper";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCImage } from "../allCustomUIElement/CCImage/CCImage";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import "./CCShopItem.less";

interface ICCShopItem extends IItemInfo {
    isUnAvailable?: boolean;
}

export class CCShopItem extends CCPanel<ICCShopItem> {
    defaultClass() {
        return CSSHelper.ClassMaker("CC_ShopItem", { UnAvailable: this.props.isUnAvailable })
    }

    render() {
        let config = JsonConfigHelper.GetRecordItemConfig(this.props.itemid);
        const num = this.props.count;
        const picurl = CSSHelper.getItemImageUrl(config!.ItemIcon);
        const itemname = $.Localize("#" + config!.ItemName);
        const itemdes = $.Localize("#" + config!.ItemDes);
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <Label id="ShopItemName" text={itemname} />
                <CCImage id="ShopItemImg" backgroundImage={picurl} titleTooltip={{ title: itemname, tip: itemdes }} />
                {(num != undefined && Number(num) > 1) &&
                    <Panel id="ShopItemNumBG" >
                        <Label id="ShopItemNum" text={`X${num}`} />
                    </Panel>}
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    }
}