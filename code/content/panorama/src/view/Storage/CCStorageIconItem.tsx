
import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCShopItemIcon } from "../Shop/CCShopItemIcon";
import "./CCStorageIconItem.less";

interface ICCStorageIconItem extends IItemInfo {
}

export class CCStorageIconItem extends CCPanel<ICCStorageIconItem> {
    render() {
        const itemid = this.props.itemid;
        const count = this.props.count;
        const config = GJSONConfig.ItemConfig.get(GToNumber(itemid))!;
        const rarity = "Rarity_" + GEEnum.ERarity[config.ItemQuality || 1];
        return (<Panel className={CSSHelper.ClassMaker("CCStorageIconItem", rarity)}
            ref={this.__root__} hittest={false}  {...this.initRootAttrs()}>
            <CCShopItemIcon id="StorageItemImg" itemid={itemid + ""} />
            {(count != undefined && Number(count) > 1) &&
                <Panel id="StorageItemNumBG" >
                    <Label id="StorageItemNum" text={`X${count}`} />
                </Panel>}
            {this.props.children}
            {this.__root___childs}
        </Panel>
        )
    }
}