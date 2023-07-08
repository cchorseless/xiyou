import React from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { TActivityTotalGainMetaStone } from "../../../../scripts/tscripts/shared/service/activity/TActivityTotalGainMetaStone";
import { TActivityTotalGainMetaStoneData } from "../../../../scripts/tscripts/shared/service/activity/TActivityTotalGainMetaStoneData";
import { CSSHelper } from "../../helper/CSSHelper";
import { NetHelper } from "../../helper/NetHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCButtonBox } from "../AllUIElement/CCButton/CCButtonBox";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelHeader } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCShopItem } from "../Shop/CCShopItem";
import { CCStorageItemGetDialog } from "../Storage/CCStorageItemGetDialog";
import { CCActivityRuleNoteItem } from "./CCActivityRuleNoteItem";
import "./CCActivityTotalGainMetaStone.less";


interface ICCActivityTotalGainMetaStone {
}

export class CCActivityTotalGainMetaStone extends CCPanel<ICCActivityTotalGainMetaStone> {
    onInitUI() {
        this.ListenUpdate(TActivityTotalGainMetaStoneData.GetOneInstance(GGameScene.Local.BelongPlayerid))
        GTimerHelper.AddTimer(30, GHandler.create(this, () => {
            this.UpdateSelf();
            return 30
        }))
    }

    render() {
        const TotalGainMetaStone = TActivityTotalGainMetaStone.GetOneInstance(-1);
        const TotalGainMetaStoneData = TActivityTotalGainMetaStoneData.GetOneInstance(GGameScene.Local.BelongPlayerid);
        const allitems = TotalGainMetaStone.Items.keys();
        const lastKey = allitems[allitems.length - 1];
        const TotalChargeMoney = TotalGainMetaStoneData.TotalChargeMoney
        return <Panel className={"CCActivityTotalGainMetaStone"} ref={this.__root__}  {...this.initRootAttrs()}>
            <CCPanel flowChildren="right-wrap" width="75%">
                {
                    allitems.map((v, index) => {
                        if (v == lastKey) { return }
                        const items = TotalGainMetaStone.Items.get(v);
                        return <CCActivityTotalGainMetaStoneItem key={index + ""} marginLeft={"10px"} moneycount={v}
                            ischeck={TotalGainMetaStoneData.ItemHadGet.includes(v)}
                            items={items} isgray={TotalChargeMoney < v} />
                    })
                }
            </CCPanel>
            <CCPanel flowChildren="down">
                <CCActivityRuleNoteItem str="每格赛季充值达到指定金额即可领取奖励，赛季开始重置。" height="200px" />
                <CCPanelHeader type="Tui7" localizedStr={`#本赛季累计充值￥:${TotalChargeMoney}`} />
                <CCActivityTotalGainMetaStoneItem islast={true} moneycount={lastKey}
                    ischeck={TotalGainMetaStoneData.ItemHadGet.includes(lastKey)}
                    items={TotalGainMetaStone.Items.get(lastKey)} isgray={TotalChargeMoney < lastKey} />
            </CCPanel>
        </Panel>
    }
}


interface ICCActivityTotalGainMetaStoneItem {
    moneycount: number, items: IFItemInfo[];
    isgray: boolean,
    ischeck: boolean,
    islast?: boolean,
}

export class CCActivityTotalGainMetaStoneItem extends CCPanel<ICCActivityTotalGainMetaStoneItem> {


    OnBtnGetPrize() {
        const moneycount = this.props.moneycount;
        NetHelper.SendToCSharp(GameProtocol.Protocol.GetPrize_ActivityTotalGainMetaStone, {
            PrizeIndex: moneycount
        }, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            if (e.state) {
                let info = JSON.parse(e.message!) as IFItemInfo[];
                CCStorageItemGetDialog.showItemGetDialog({
                    Items: info
                })
            }
        }))

    }

    render() {
        const moneycount = this.props.moneycount;
        const isgray = this.props.isgray;
        const islast = this.props.islast || false;
        const ischeck = this.props.ischeck;
        const items = this.props.items || [];
        return <Panel className={CSSHelper.ClassMaker("CCActivityTotalGainMetaStoneItem", { IsLastItem: islast })} ref={this.__root__}  {...this.initRootAttrs()}>

            <CCLabel type="Title" text={`累计充值￥${moneycount}`} horizontalAlign="center" marginTop={islast ? "15px" : "25px"} />
            <CCPanel flowChildren="right-wrap" width="100%" height="80%" marginTop={islast ? "60px" : "80px"} scroll={"y"}>
                {
                    items.map((v, index) => {
                        return <CCButtonBox key={index + ""} uiScale={"55%"}>
                            <CCShopItem hittest={false} isUnAvailable={isgray} itemid={v.ItemConfigId} count={v.ItemCount} />
                        </CCButtonBox>
                    })
                }
            </CCPanel>
            <CCButton text={ischeck ? "已领取" : "领取"} onactivate={() => {
                if (isgray) { return }
                if (ischeck) { return }
                this.OnBtnGetPrize()
            }} enabled={!isgray && !ischeck} color="Green" horizontalAlign="center" verticalAlign="bottom" marginBottom={"20px"} />
        </Panel>
    }
}
