import React from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { TActivitySevenDayLogin } from "../../../../scripts/tscripts/shared/service/activity/TActivitySevenDayLogin";
import { TActivitySevenDayLoginData } from "../../../../scripts/tscripts/shared/service/activity/TActivitySevenDayLoginData";
import { CSSHelper } from "../../helper/CSSHelper";
import { NetHelper } from "../../helper/NetHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCButtonBox } from "../AllUIElement/CCButton/CCButtonBox";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCMainPanel } from "../MainPanel/CCMainPanel";
import { CCShopItem } from "../Shop/CCShopItem";
import { CCStorageItemGetDialog } from "../Storage/CCStorageItemGetDialog";
import { CCActivityRuleNoteItem } from "./CCActivityRuleNoteItem";
import "./CCActivitySevenDayLogin.less";


interface ICCActivitySevenDayLogin {
}

export class CCActivitySevenDayLogin extends CCPanel<ICCActivitySevenDayLogin> {
    onInitUI() {
        this.ListenUpdate(TActivitySevenDayLoginData.GetOneInstance(GGameScene.Local.BelongPlayerid))
    }

    render() {
        const SevenDayLogin = TActivitySevenDayLogin.GetOneInstance(-1);
        const SevenDayLoginData = TActivitySevenDayLoginData.GetOneInstance(GGameScene.Local.BelongPlayerid);
        const logdaycount = SevenDayLoginData.LoginDayCount;
        return <Panel className={"CCActivitySevenDayLogin"} ref={this.__root__}  {...this.initRootAttrs()}>
            <CCPanel flowChildren="right-wrap" width="75%">
                {
                    [1, 2, 3, 4, 5, 6].map((v, index) => {
                        const items = SevenDayLogin.Items.get(v);
                        return <CCActivitySevenDayPrizeItem key={v + ""} marginLeft={"10px"} day={v}
                            ischeck={SevenDayLoginData.ItemHadGet.includes(v)}
                            items={items} isgray={logdaycount < v} />
                    })
                }
            </CCPanel>
            <CCPanel flowChildren="down">
                <CCActivityRuleNoteItem str="赛季内登录对应天数即可领取奖励，每个赛季开始重置登录。" height="200px" />
                <CCActivitySevenDayPrizeItem key={7 + ""} day={7}
                    ischeck={SevenDayLoginData.ItemHadGet.includes(7)}
                    items={SevenDayLogin.Items.get(7)} isgray={logdaycount < 7} />
            </CCPanel>
        </Panel>
    }
}


interface ICCActivitySevenDayPrizeItem {
    day: number, items: IFItemInfo[];
    isgray: boolean,
    ischeck: boolean,
}

export class CCActivitySevenDayPrizeItem extends CCPanel<ICCActivitySevenDayPrizeItem> {


    OnBtnGetPrize() {
        const day = this.props.day;
        NetHelper.SendToCSharp(GameProtocol.Protocol.GetPrize_ActivitySevenDayLogin, {
            Day: day
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
        const day = this.props.day;
        const isgray = this.props.isgray;
        const ischeck = this.props.ischeck;
        const items = this.props.items;
        return <Panel className={CSSHelper.ClassMaker("CCActivitySevenDayPrizeItem", { SevenDay: day == 7 })} ref={this.__root__}  {...this.initRootAttrs()}>

            <CCLabel type="Title" text={`第${day}天`} horizontalAlign="center" marginTop={day == 7 ? "15px" : "25px"} />
            <CCPanel flowChildren="right-wrap" width="100%" height="80%" marginTop={day == 7 ? "60px" : "80px"} scroll={"y"}>
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
