
import React from "react";
import { TItem } from "../../../../scripts/tscripts/shared/service/bag/TItem";
import { CSSHelper } from "../../helper/CSSHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCShopItemIcon } from "./CCShopItemIcon";
import "./CCShopSixShenFuPanel.less";

interface ICCShopSixShenFuItem {
    itemid: string,
    usetime: number,
    entity?: TItem,
}

export class CCShopSixShenFuItem extends CCPanel<ICCShopSixShenFuItem> {

    onBtn_Use() {
        if (!this.props.entity) {
            return;
        }
        if (this.props.entity.ItemCount <= 0) return;
        if (this.props.usetime > 0) {
            TipsHelper.showErrorMessage("本局只能使用一次");
            return;
        };
        GGameScene.GameServiceSystem.UseBagItem(this.props.entity)
    }

    render() {
        const itemid = this.props.itemid;
        let itemcount = 0;
        let useTime = 0;
        if (this.props.entity) {
            useTime = this.props.usetime;
            itemcount = this.props.entity.ItemCount;
        }
        const isGray = useTime > 0 || itemcount <= 0;
        return (
            <Panel ref={this.__root__} className={"CCShopSixShenFuItem"} hittest={false}  {...this.initRootAttrs()}>
                <CCShopItemIcon className={CSSHelper.ClassMaker("ShopSixShenFu", { isGray: isGray })} itemid={itemid} enabled={!isGray} onclick={() => this.onBtn_Use()}>
                    <Label id="ShenFuCount" text={"x" + itemcount} />
                </CCShopItemIcon>
            </Panel>
        )
    }
}
export class CCShopSixShenFuPanel extends CCPanel<{}> {
    onReady() {
        return Boolean(GGameScene.Local.TCharacter && GGameScene.Local.TCharacter.BagComp && GGameScene.Local.TCharacter.GameRecordComp)
    }
    onInitUI() {
        this.ListenUpdate(GGameScene.Local.TCharacter.BagComp!);
        this.ListenUpdate(GGameScene.Local.TCharacter.GameRecordComp!);
        this.ListenClassUpdate(TItem, (e) => {
            if (this.allShenFu.includes(e.ConfigId + "")) {
                this.UpdateSelf();
            }
        });
    }
    private allShenFu: string[] = [
        "10017",
        "10018",
        "10019",
        "10020",
        "10021",
        "10022",
    ];
    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_ShopSixShenFuPanel")
        }
        const BagComp = GGameScene.Local.TCharacter.BagComp!;
        const GameRecordComp = GGameScene.Local.TCharacter.GameRecordComp!;
        return (
            <Panel id="CC_ShopSixShenFuPanel" ref={this.__root__} className="CCShopSixShenFuPanel" hittest={false} {...this.initRootAttrs()}>
                <CCPanel className="ShopSixShenFuContainer">
                    {
                        this.allShenFu.map((item, index) => {
                            const entity = BagComp.GetOneItem(item);
                            const usetime = GameRecordComp.GetItemUseRecord(item);
                            return <CCShopSixShenFuItem key={index + ""} itemid={item} usetime={usetime} entity={entity} />
                        })
                    }
                </CCPanel>
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    }
}