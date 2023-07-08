import React from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { TActivityMonthLogin } from "../../../../scripts/tscripts/shared/service/activity/TActivityMonthLogin";
import { TActivityMonthLoginData } from "../../../../scripts/tscripts/shared/service/activity/TActivityMonthLoginData";
import { CSSHelper } from "../../helper/CSSHelper";
import { NetHelper } from "../../helper/NetHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCButtonBox } from "../AllUIElement/CCButton/CCButtonBox";
import { CCIcon_Check } from "../AllUIElement/CCIcons/CCIcon_Check";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelHeader } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCShopItem } from "../Shop/CCShopItem";
import { CCStorageItemGetDialog } from "../Storage/CCStorageItemGetDialog";
import "./CCActivityMonthLogin.less";
import { CCActivityRuleNoteItem } from "./CCActivityRuleNoteItem";


interface ICCActivityMonthLogin {
}

export class CCActivityMonthLogin extends CCPanel<ICCActivityMonthLogin> {
    onReady() {
        return TActivityMonthLoginData.GetOneInstance(GGameScene.Local.BelongPlayerid) != null;
    }

    onInitUI() {
        this.ListenUpdate(TActivityMonthLoginData.GetOneInstance(GGameScene.Local.BelongPlayerid))
    }

    OnBtnGetPrize(day: number) {
        NetHelper.SendToCSharp(GameProtocol.Protocol.GetPrize_ActivityMonthTotalLogin, {
            Day: day
        }, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            if (e.state) {
                let info = JSON.parse(e.message!) as IFItemInfo;
                CCStorageItemGetDialog.showItemGetDialog({
                    Items: [
                        { ItemConfigId: info.ItemConfigId, ItemCount: info.ItemCount },
                    ]
                })
            }
        }))

    }
    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_ActivityMonthLogin");
        }
        const MonthLogin = TActivityMonthLogin.GetOneInstance(-1);
        const MonthLoginData = TActivityMonthLoginData.GetOneInstance(GGameScene.Local.BelongPlayerid);
        const logdaycount = MonthLoginData.LoginDayCount;
        const allmonthitems = MonthLogin.Items.keys();
        const allmonthTotleitems = MonthLogin.TotalLoginItems.keys();
        allmonthTotleitems.sort();
        let totalday = 0;
        for (let _totalday of allmonthTotleitems) {
            if (!MonthLoginData.TotalLoginItemHadGet.includes(_totalday)) {
                totalday = _totalday;
                break;
            }
        }
        const totalitem = MonthLogin.TotalLoginItems.get(totalday);
        return <Panel id="CC_ActivityMonthLogin" className={"CCActivityMonthLogin"} ref={this.__root__}  {...this.initRootAttrs()}>
            <CCPanel flowChildren="right-wrap" width="75%" height="100%" scroll={"y"}>
                {
                    allmonthitems.map((v, index) => {
                        const item = MonthLogin.Items.get(v);
                        const ischeck = MonthLoginData.ItemHadGet.includes(v)
                        return <CCActivityMonthLoginPrizeItem key={index + ""} marginTop={"2px"} day={v} item={item} isgray={logdaycount < v} ischeck={ischeck} />
                    })
                }
            </CCPanel>
            <CCPanel flowChildren="down" width="25%" height="100%" >
                <CCActivityRuleNoteItem str="每自然月内累计登录即可领取好礼,每月1号0点(GT+8)重置累计登录。" height="200px" />
                <CCPanelHeader type="Tui7" localizedStr="#累计登录奖励" />
                <Panel className="TotalLoginItemBg" >
                    <CCLabel type="Title" text={`累计签到(${logdaycount}/${totalday})天`} horizontalAlign="center" marginTop={"25px"} />
                    <CCShopItem marginTop={"10px"} horizontalAlign="center" hittest={false} isUnAvailable={logdaycount < totalday}
                        itemid={totalitem.ItemConfigId} count={totalitem.ItemCount} />
                    <CCButton text={"点击领取"} horizontalAlign="center" enabled={logdaycount >= totalday}
                        onactivate={() => {
                            if (logdaycount < totalday) { return }
                            this.OnBtnGetPrize(totalday)
                        }}
                    />
                </Panel>

            </CCPanel>
        </Panel>
    }
}


interface ICCActivityMonthLoginPrizeItem {
    day: number, item: IFItemInfo;
    isgray: boolean,
    ischeck: boolean,
}

export class CCActivityMonthLoginPrizeItem extends CCPanel<ICCActivityMonthLoginPrizeItem> {


    OnBtnGetPrize() {
        const day = this.props.day;
        NetHelper.SendToCSharp(GameProtocol.Protocol.GetPrize_ActivityMonthLogin, {
            Day: day
        }, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            if (e.state) {
                let info = JSON.parse(e.message!) as IFItemInfo;
                CCStorageItemGetDialog.showItemGetDialog({
                    Items: [
                        { ItemConfigId: info.ItemConfigId, ItemCount: info.ItemCount },
                    ]
                })
            }
        }))

    }

    render() {
        const day = this.props.day;
        const isgray = this.props.isgray;
        const ischeck = this.props.ischeck;
        const item = this.props.item;
        return <Panel className={CSSHelper.ClassMaker("CCActivityMonthLoginPrizeItem")} ref={this.__root__}  {...this.initRootAttrs()}>
            <CCLabel type="Title" text={`第${day}天`} horizontalAlign="center" marginTop={"5px"} />
            <CCButtonBox uiScale={"50%"} marginTop={"30px"} horizontalAlign="center" onactivate={() => {
                if (ischeck) { return }
                if (isgray) { return }
                this.OnBtnGetPrize();
            }}>
                <CCShopItem hittest={false} isUnAvailable={isgray}
                    itemid={item.ItemConfigId} count={item.ItemCount} />
                {ischeck && <CCIcon_Check align="right bottom" width="80px" height="80px" marginRight={"10px"} marginBottom={"10px"} />}
            </CCButtonBox>
        </Panel>
    }
}
