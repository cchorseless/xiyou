import React from "react";
import { JsonConfigHelper } from "../../../../scripts/tscripts/shared/Gen/JsonConfigHelper";
import { PathHelper } from "../../helper/PathHelper";
import { CCIconButton } from "../AllUIElement/CCButton/CCIconButton";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCShopItemIcon.less";

interface ICCShopItemIcon extends NodePropsData {
    itemid: string;
    itemicon?: string;
    itemname?: string;
    onclick?: () => void;
}
export class CCShopItemIcon extends CCPanel<ICCShopItemIcon> {

    defaultClass() {
        return "CCShopItemIcon"
    }

    render() {
        let config = JsonConfigHelper.GetRecordItemConfig(this.props.itemid) || {} as any;
        const picurl = PathHelper.getCustomShopItemImageUrl((this.props.itemicon || config!.ItemIcon));
        const itemname = $.Localize("#" + (this.props.itemname || config!.ItemName));
        const itemdes = $.Localize("#" + config!.ItemDes);
        return (
            <Panel ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                {
                    this.props.onclick ?
                        <CCIconButton onactivate={() => this.props.onclick!()} icon={<CCPanel className="ShopItemImg" backgroundImage={picurl} />} titleTooltip={{ title: itemname, tip: itemdes }} />
                        :
                        <CCPanel className="ShopItemImg" backgroundImage={picurl} titleTooltip={{ title: itemname, tip: itemdes }} />
                }
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    }
}