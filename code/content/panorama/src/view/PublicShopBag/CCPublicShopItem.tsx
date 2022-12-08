
import React, { createRef, PureComponent } from "react";
import { PublicBagConfig } from "../../../../../game/scripts/tscripts/shared/PublicBagConfig";
import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCItemImage } from "../allCustomUIElement/CCItem/CCItemImage";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import "./CCPublicShopItem.less";
interface ICCPublicShopItem extends NodePropsData {
    iType: PublicBagConfig.EPublicShopType,
    sItemName?: string,
    iSlot: number,
    iLevel: number,
    iLeftCount?: number,
    iLimit?: number,
}

export class CCPublicShopItem extends CCPanel<ICCPublicShopItem, Button> {

    static defaultProps = {
        sItemName: "",
        iLeftCount: 0,
        iLimit: 0,
    }

    // defaultClass() {
    //     const sItemName = this.props.sItemName;
    //     return CSSHelper.ClassMaker("CC_PublicShopItem", {
    //         HasItem: Boolean(sItemName),
    //         CantBuy: !(bGoldEnough && bWoodEnough && bPointEnough && bCandyEnough && (iLeftCount == undefined || iLeftCount > 0)),
    //     })
    // }
    OnClick_Buy() {

    }
    render() {
        const sItemName = this.props.sItemName;
        const iLeftCount = this.props.iLeftCount;
        const iLevel = this.props.iLevel;
        const iLimit = this.props.iLimit;
        const tips = {
        } as any
        return (
            <Button ref={this.__root__}
                oncontextmenu={() => this.OnClick_Buy()}
                hittestchildren={false} hittest={true}  {...this.initRootAttrs()}>
                <CCPanel id="ShopItemBorder" hittest={false} dialogTooltip={tips} />
                <CCItemImage id="ShopItemImage" itemname={sItemName} iLevel={iLevel} showtooltip={false} />
                {iLeftCount != undefined && <Label id="leftCount" text={`${iLeftCount}/${iLimit}`} />}
            </Button>
        )
    }
}