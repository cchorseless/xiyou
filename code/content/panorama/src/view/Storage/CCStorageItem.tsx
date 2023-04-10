
import React from "react";
import { TItem } from "../../../../scripts/tscripts/shared/service/bag/TItem";
import { CSSHelper } from "../../helper/CSSHelper";
import { PathHelper } from "../../helper/PathHelper";
import { CCImage } from "../AllUIElement/CCImage/CCImage";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCStorageItem.less";

interface ICCStorageItem {
    entity: TItem;
    onclick?: () => void;
}

export class CCStorageItem extends CCPanel<ICCStorageItem> {

    render() {
        const item = this.props.entity;
        let config = item.Config;
        const num = item.ItemCount;
        const picurl = PathHelper.getCustomShopItemImageUrl((config!.ItemIcon));
        const itemname = $.Localize("#" + (config!.ItemName));
        const itemdes = $.Localize("#" + config!.ItemDes);
        const rarity = "Rarity_" + GEEnum.ERarity[item.ItemQuality || 1];
        return (
            this.__root___isValid &&
            <Panel className={CSSHelper.ClassMaker("CCStorageItem", rarity)}
                ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCImage id="StorageItemImg" backgroundImage={picurl} titleTooltip={{ title: itemname, tip: itemdes }}
                    onactivate={() => {
                        this.props.onclick && this.props.onclick()
                    }}
                />
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