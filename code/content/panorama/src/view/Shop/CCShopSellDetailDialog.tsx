
import React, { createRef, PureComponent } from "react";
import { EEnum } from "../../../../../game/scripts/tscripts/shared/Gen/Types";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { TShopSellItem } from "../../game/service/shop/TShopSellItem";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCShopItem } from "./CCShopItem";
import "./CCShopSellDetailDialog.less";

interface ICCShopSellDetailDialog {
    entity: TShopSellItem
}

export class CCShopSellDetailDialog extends CCPanel<ICCShopSellDetailDialog> {

    onInitUI() {
        this.props.entity && this.props.entity.RegRef(this);
    }

    render() {
        const sellitem = this.GetStateEntity(this.props.entity)!;
        return (
            <Panel className="CC_ShopSellDetailDialog" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            </Panel>
        )
    }
}