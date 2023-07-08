import React from "react";

import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { CSSHelper } from "../../helper/CSSHelper";
import { NetHelper } from "../../helper/NetHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCButtonBox } from "../AllUIElement/CCButton/CCButtonBox";
import { CCIcon_BattlepassLogo } from "../AllUIElement/CCIcons/CCIcon_BattlepassLogo";
import { CCIcon_Check } from "../AllUIElement/CCIcons/CCIcon_Check";
import { CCImageNumber } from "../AllUIElement/CCImageNumber/CCImageNumber";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCShopItem } from "../Shop/CCShopItem";
import { CCStorageItemGetDialog } from "../Storage/CCStorageItemGetDialog";
import "./CCBattlePassPrizeItem.less";
interface ICCBattlePassPrizeItem extends NodePropsData {

}

export class CCBattlePassPrizeItem extends CCPanel<ICCBattlePassPrizeItem> {

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.TCharacter.BattlePassComp)
    }
    render() {
        const BattlePassComp = (GGameScene.Local.TCharacter.BattlePassComp!)!;
        const iLevel = BattlePassComp.BattlePassLevel;
        const SeasonConfigId = BattlePassComp.SeasonConfigId;
        const iXP = BattlePassComp.BattlePassExp;
        const IsBattlePass = BattlePassComp.IsBattlePass;
        const BattlePassPrizeGet = BattlePassComp.BattlePassPrizeGet;
        const allConfig = GJSONConfig.BattlePassLevelUpConfig.getDataList().filter(v => v.SeasonId == SeasonConfigId);
        allConfig.sort((a, b) => { return a.BattlePassLevel - b.BattlePassLevel })
        const config = allConfig.find((v) => { return v.BattlePassLevel == iLevel })!;
        const LevelUpExp = config.LevelUpExp;
        return (<Panel className="CCBattlePassPrizeItem" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            <CCPanel width="200px" flowChildren="down" horizontalAlign="center" >
                <CCLabel text={"第10赛季"} type="Title" fontSize="20px" horizontalAlign="center" />
                <CCLabel text={"战令通行证"} type="UnitName" fontSize="30px" horizontalAlign="center" />
            </CCPanel>
            <CCPanel flowChildren="right" width="100%" height="500px" scroll={"x"}>
                {
                    allConfig.map((v, index) => {
                        const v_level = v.BattlePassLevel
                        return <CCBPLevelRewards key={index + ""} iLevel={v_level}
                            IsBattlePass={BattlePassComp.IsBattlePass}
                            widthPect={iLevel > v_level ? 100 : (iLevel == v_level ? 50 : 0)}
                            info={{
                                ItemConfigId: v.TaskComPrize.ItemConfigId,
                                ItemCount: v.TaskComPrize.ItemCount,
                                check: BattlePassPrizeGet.includes(v_level),
                                gray: iLevel < v_level,
                            }}
                            info_plus={{
                                ItemConfigId: v.TaskSpePrize.ItemConfigId,
                                ItemCount: v.TaskSpePrize.ItemCount,
                                check: BattlePassPrizeGet.includes(v_level + 10000),
                                gray: iLevel < v_level,
                            }}

                        />
                    })
                }
            </CCPanel>
            <CCBPTimerAndLevelItem horizontalAlign="center" showname={true} />
            <CCPanel flowChildren="right" horizontalAlign="center">
                {!IsBattlePass && <CCButton color="Green" width="200px" verticalAlign="center" flowChildren="right">
                    <CCLabel type="UnitName" text={"启用高级战令"} verticalAlign="center" marginLeft={"15px"} />
                    <CCIcon_BattlepassLogo type="Plus" width="40px" height="40px" verticalAlign="center" />
                </CCButton>
                }
                <CCButton color="Purple" text={"购买经验"} marginLeft={"100px"} verticalAlign="center" />
            </CCPanel>

        </Panel>)
    }
}

export class CCBPTimerAndLevelItem extends CCPanel<{ showname?: boolean }> {

    render() {
        const showname = GToBoolean(this.props.showname);
        const BattlePassComp = (GGameScene.Local.TCharacter.BattlePassComp!)!;
        const iLevel = BattlePassComp.BattlePassLevel;
        const SeasonConfigId = BattlePassComp.SeasonConfigId;
        const iXP = BattlePassComp.BattlePassExp;
        const IsBattlePass = BattlePassComp.IsBattlePass;
        const allConfig = GJSONConfig.BattlePassLevelUpConfig.getDataList().filter(v => v.SeasonId == SeasonConfigId);
        allConfig.sort((a, b) => { return a.BattlePassLevel - b.BattlePassLevel })
        const config = allConfig.find((v) => { return v.BattlePassLevel == iLevel })!;
        const LevelUpExp = config.LevelUpExp;
        return <Panel className="CCBPTimerAndLevelItem" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            {showname && <CCLabel text={`${IsBattlePass ? "高级战令:" : "普通战令:"}`} type="UnitName" verticalAlign="center" />}
            <CCPanel id="BPTimerAndLevel" hittest={false} marginLeft={"20px"} >
                <Image id="BPIcon" className={CSSHelper.ClassMaker({ IsPlus: IsBattlePass })} />
                <Panel id="BPLevel" hittest={false}>
                    <ProgressBar value={LevelUpExp > 0 ? iXP / LevelUpExp : 1}>
                        <Label text={LevelUpExp > 0 ? `${iXP} / ${LevelUpExp}` : "已满级"} />
                    </ProgressBar>
                    <Countdown id="BPCountDown" endTime={GToNumber(BattlePassComp.SeasonEndTimeSpan)}>
                        <Label localizedText="#lang_hud_bp_deadline" />
                    </Countdown>
                </Panel>
                <CCBPLevelNum iLevel={iLevel} align="right center" />
            </CCPanel>
        </Panel>
    }
}



export class CCBPLevelNum extends CCPanel<{ iLevel: number }> {
    render() {
        const iLevel = this.props.iLevel;
        return <Panel className="CCBPLevelNum" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            <CCImageNumber type="3" value={Math.floor(iLevel)} align="center center" />
        </Panel>
    }
}


interface IRewardInfo extends IFItemInfo {
    check: boolean,
    gray: boolean,
}
interface ICCBPLevelRewards {
    iLevel: number, IsBattlePass: boolean, info?: IRewardInfo, info_plus?: IRewardInfo, widthPect?: 0 | 50 | 100,
}

export class CCBPLevelRewards extends CCPanel<ICCBPLevelRewards> {


    onGetPrize(isplus: boolean) {
        const iLevel = this.props.iLevel;
        const IsBattlePass = this.props.IsBattlePass;
        if (isplus && !IsBattlePass) {
            TipsHelper.showErrorMessage("升级至高级战令，才能领取高级战令奖励");
            return
        }
        NetHelper.SendToCSharp(GameProtocol.Protocol.BattlePass_GetPrize, {
            PrizeLevel: iLevel,
            IsPlusPrize: isplus,
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
        const info_plus = this.props.info_plus;
        const info = this.props.info;
        const widthPect = this.props.widthPect || 0;
        const iLevel = this.props.iLevel;
        const IsBattlePass = this.props.IsBattlePass;
        return (<Panel className="CCBPLevelRewards" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            {/* 普通奖励 */}
            {info && <CCButtonBox onactivate={() => {
                if (info.check) { return }
                if (info.gray) { return }
                this.onGetPrize(false);
            }}>
                <CCShopItem id="FreeItem" hittest={false} isUnAvailable={info.gray} itemid={info.ItemConfigId} count={info.ItemCount} >
                    {info.check && <CCIcon_Check align="right bottom" width="60px" height="60px" marginRight={"20px"} marginBottom={"20px"} />}
                </CCShopItem>
            </CCButtonBox>

            }
            <CCPanel height="100px" width="100%">
                <Panel id="BPListProgressBar" hittest={false}>
                    <Panel id="BPListProgressBarCenter" hittest={false} />
                </Panel>
                <CCPanel className="BPListProgressBarLeft" width={widthPect + "%"} hittest={false} />
                {iLevel > 0 && widthPect != 50 && <CCBPLevelNum id={`BPLevel${iLevel}`} iLevel={iLevel} align="center center" />}
                {widthPect == 50 && <CCPanel id="BPLevelIcon" className={CSSHelper.ClassMaker({ IsPlus: IsBattlePass })} align="center center" />}
            </CCPanel>
            {/* PLUS */}
            {info_plus && <CCButtonBox onactivate={() => {
                if (info_plus.check) { return }
                if (info_plus.gray) { return }
                this.onGetPrize(true);
            }}>
                <CCShopItem id="PlusItem" hittest={false} isUnAvailable={info_plus.gray} itemid={info_plus.ItemConfigId} count={info_plus.ItemCount}>
                    {info_plus.check && <CCIcon_Check align="right bottom" width="60px" height="60px" marginRight={"20px"} marginBottom={"20px"} />}
                    {!IsBattlePass && <CCIcon_BattlepassLogo type="Plus" id="PlusIcon" align="right bottom" marginRight={"20px"} marginBottom={"20px"} />}
                </CCShopItem>
            </CCButtonBox>
            }


        </Panel>
        )
    }
}