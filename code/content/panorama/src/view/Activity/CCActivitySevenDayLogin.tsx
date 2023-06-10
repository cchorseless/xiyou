import React from "react";
import { TActivitySevenDayLogin } from "../../../../scripts/tscripts/shared/service/activity/TActivitySevenDayLogin";
import { TActivitySevenDayLoginData } from "../../../../scripts/tscripts/shared/service/activity/TActivitySevenDayLoginData";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCButtonBox } from "../AllUIElement/CCButton/CCButtonBox";
import { CCIcon_Check } from "../AllUIElement/CCIcons/CCIcon_Check";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCShopItem } from "../Shop/CCShopItem";
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
                        return <CCActivitySevenDayPrizeItem key={v + ""} day={v}
                            ischeck={SevenDayLoginData.ItemHadGet.includes(v)}
                            items={items} isgray={logdaycount < v} />
                    })
                }
            </CCPanel>
            <CCActivitySevenDayPrizeItem key={7 + ""} day={7}
                ischeck={SevenDayLoginData.ItemHadGet.includes(7)}
                items={SevenDayLogin.Items.get(7)} isgray={logdaycount < 7} />
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
    }

    render() {
        const day = this.props.day;
        const isgray = this.props.isgray;
        const ischeck = this.props.ischeck;
        const items = this.props.items;
        return <Panel className={CSSHelper.ClassMaker("CCActivitySevenDayPrizeItem", { SevenDay: day == 7 })} ref={this.__root__}  {...this.initRootAttrs()}>

            <CCLabel type="Title" text={`第${day}天`} horizontalAlign="center" />
            <CCPanel flowChildren="right" width="100%" height="80%" marginTop={"20px"} scroll={"x"}>
                {
                    items.map((v, index) => {
                        return <CCButtonBox key={index + ""}>
                            <CCShopItem hittest={false} isUnAvailable={isgray} itemid={v.ItemConfigId} count={v.ItemCount} >
                                {ischeck && <CCIcon_Check align="right bottom" width="60px" height="60px" marginRight={"20px"} marginBottom={"20px"} />}
                            </CCShopItem>
                        </CCButtonBox>
                    })
                }
            </CCPanel>
            <CCButton text={"领取"} onactivate={() => {
                if (isgray) { return }
                if (ischeck) { return }
                this.OnBtnGetPrize()
            }} enabled={!isgray && !ischeck} color="Green" verticalAlign="bottom" marginBottom={"20px"} />
        </Panel>
    }
}
