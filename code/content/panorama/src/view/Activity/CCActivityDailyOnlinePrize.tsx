import React from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { TActivityDailyOnlinePrize } from "../../../../scripts/tscripts/shared/service/activity/TActivityDailyOnlinePrize";
import { TActivityDailyOnlinePrizeData } from "../../../../scripts/tscripts/shared/service/activity/TActivityDailyOnlinePrizeData";
import { CSSHelper } from "../../helper/CSSHelper";
import { NetHelper } from "../../helper/NetHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCButtonBox } from "../AllUIElement/CCButton/CCButtonBox";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelHeader } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCMainPanel } from "../MainPanel/CCMainPanel";
import { CCShopItem } from "../Shop/CCShopItem";
import { CCStorageItemGetDialog } from "../Storage/CCStorageItemGetDialog";
import "./CCActivityDailyOnlinePrize.less";
import { CCActivityRuleNoteItem } from "./CCActivityRuleNoteItem";


interface ICCActivityDailyOnlinePrize {
}

export class CCActivityDailyOnlinePrize extends CCPanel<ICCActivityDailyOnlinePrize> {
    onInitUI() {
        this.ListenUpdate(TActivityDailyOnlinePrizeData.GetOneInstance(GGameScene.Local.BelongPlayerid))
        GTimerHelper.AddTimer(30, GHandler.create(this, () => {
            this.UpdateSelf();
            return 30
        }))
    }

    render() {
        const DailyOnlinePrize = TActivityDailyOnlinePrize.GetOneInstance(-1);
        const DailyOnlinePrizeData = TActivityDailyOnlinePrizeData.GetOneInstance(GGameScene.Local.BelongPlayerid);
        const allitems = DailyOnlinePrize.Items.keys();
        const lastKey = allitems[allitems.length - 1];
        const TodayOnlineTime = GToNumber(DailyOnlinePrizeData.TodayOnlineTime);
        const LoginTimeSpan = GToNumber(DailyOnlinePrizeData.LoginTimeSpan);
        const onlineMins = Math.floor((TodayOnlineTime + GTimerHelper.NowUnix() - LoginTimeSpan) / 1000 / 60);
        return <Panel className={"CCActivityDailyOnlinePrize"} ref={this.__root__}  {...this.initRootAttrs()}>
            <CCPanel flowChildren="right-wrap" width="75%">
                {
                    allitems.map((v, index) => {
                        if (v == lastKey) { return }
                        const items = DailyOnlinePrize.Items.get(v);
                        return <CCActivityDailyOnlinePrizeItem key={index + ""} marginLeft={"10px"} mins={v / 60}
                            ischeck={DailyOnlinePrizeData.ItemHadGet.includes(v)}
                            items={items} isgray={onlineMins < v / 60} />
                    })
                }
            </CCPanel>
            <CCPanel flowChildren="down">
                <CCActivityRuleNoteItem str="每天在线时间达到指定时间即可领取奖励，每天零点重置。" height="200px" />
                <CCPanelHeader type="Tui7" localizedStr={`#今日累计在线:${onlineMins}分钟`} />
                <CCActivityDailyOnlinePrizeItem islast={true} mins={lastKey / 60}
                    ischeck={DailyOnlinePrizeData.ItemHadGet.includes(lastKey)}
                    items={DailyOnlinePrize.Items.get(lastKey)} isgray={onlineMins < lastKey / 60} />
            </CCPanel>
        </Panel>
    }
}


interface ICCActivityDailyOnlinePrizeItem {
    mins: number, items: IFItemInfo[];
    isgray: boolean,
    ischeck: boolean,
    islast?: boolean,
}

export class CCActivityDailyOnlinePrizeItem extends CCPanel<ICCActivityDailyOnlinePrizeItem> {


    OnBtnGetPrize() {
        const mins = this.props.mins * 60;
        NetHelper.SendToCSharp(GameProtocol.Protocol.GetPrize_ActivityDailyOnlinePrize, {
            PrizeIndex: mins
        }, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            if (e.state) {
                let info = JSON.parse(e.message!) as IFItemInfo[];
                CCMainPanel.GetInstance()!.addOnlyPanel(CCStorageItemGetDialog, {
                    Items: info
                })
            }
        }))

    }

    render() {
        const mins = this.props.mins;
        const isgray = this.props.isgray;
        const islast = this.props.islast || false;
        const ischeck = this.props.ischeck;
        const items = this.props.items || [];
        return <Panel className={CSSHelper.ClassMaker("CCActivityDailyOnlinePrizeItem", { IsLastItem: islast })} ref={this.__root__}  {...this.initRootAttrs()}>

            <CCLabel type="Title" text={`累计在线${mins}分钟`} horizontalAlign="center" marginTop={islast ? "15px" : "25px"} />
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
