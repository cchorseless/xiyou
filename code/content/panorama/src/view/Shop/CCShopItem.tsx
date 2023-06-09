
import React from "react";
import { JsonConfigHelper } from "../../../../scripts/tscripts/shared/Gen/JsonConfigHelper";
import { CSSHelper } from "../../helper/CSSHelper";
import { PathHelper } from "../../helper/PathHelper";
import { CCImage } from "../AllUIElement/CCImage/CCImage";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCShopItem.less";

interface ICCShopItem extends IItemInfo {
    isUnAvailable?: boolean;
    itemname?: string;
    itemicon?: string;
}

export class CCShopItem extends CCPanel<ICCShopItem> {
    defaultClass() {
        return CSSHelper.ClassMaker("CCShopItem", { UnAvailable: this.props.isUnAvailable })
    }

    render() {
        let config = JsonConfigHelper.GetRecordItemConfig(this.props.itemid) || {} as any;
        const num = this.props.count;
        const picurl = PathHelper.getCustomShopItemImageUrl((this.props.itemicon || config!.ItemIcon));
        const itemname = $.Localize("#" + (this.props.itemname || config!.ItemName));
        const itemdes = $.Localize("#" + config!.ItemDes);

        return (
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