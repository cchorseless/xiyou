
import React from "react";
import { TItem } from "../../../../scripts/tscripts/shared/service/bag/TItem";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCShopItemIcon } from "../Shop/CCShopItemIcon";
import "./CCStorageItem.less";

interface ICCStorageItem {
    entity: TItem;
    onclick?: () => void;
}

export class CCStorageItem extends CCPanel<ICCStorageItem> {
    onInitUI() {
        const item = this.props.entity;
        this.ListenUpdate(item);
    }

    render() {
        const item = this.props.entity;
        const num = item.ItemCount;
        const isValid = item.IsValidItem();
        const rarity = "Rarity_" + GEEnum.ERarity[item.ItemQuality || 1];
        return (<Panel className={CSSHelper.ClassMaker("CCStorageItem", rarity)}
            ref={this.__root__} hittest={false} visible={isValid} {...this.initRootAttrs()}>
            <CCShopItemIcon id="StorageItemImg" itemid={item.ConfigId + ""} onclick={this.props.onclick} />
            {(num != undefined && Number(num) > 1) &&
                <Panel id="StorageItemNumBG" >
                    <Label id="StorageItemNum" text={`X${num}`} />
                </Panel>}
            {this.props.children}
            {this.__root___childs}
        </Panel>
        )
    }
}