
import React from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { ERoundBoardResultRecord } from "../../../../scripts/tscripts/shared/rules/Round/ERoundBoardResultRecord";
import { ERoundBoard } from "../../game/components/Round/ERoundBoard";
import { CSSHelper } from "../../helper/CSSHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { NetHelper } from "../../helper/NetHelper";
import { CCAvatar } from "../AllUIElement/CCAvatar/CCAvatar";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCIcon_CoinType } from "../AllUIElement/CCIcons/CCIcon_CoinType";
import { CCIcon_Star } from "../AllUIElement/CCIcons/CCIcon_Star";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelHeader } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCPopupBG } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCUnitSmallIcon } from "../AllUIElement/CCUnit/CCUnitSmallIcon";
import { CCUserName } from "../AllUIElement/CCUserName/CCUserName";
import { CCCombinationIcon } from "../Combination/CCCombinationIcon";
import { CCCombinationInfoDialog } from "../Combination/CCCombinationInfoDialog";
import { CCRankProgressItem } from "../Rank/CCRankProgressItem";
import { CCStorageIconItem } from "../Storage/CCStorageIconItem";
import "./CCGameEndPanel.less";
import { CCHeroExpProgressItem } from "./CCPlayerEndPanel";
interface ICCGameEndPanel extends NodePropsData {

}

export class CCGameEndPanel extends CCPanel<ICCGameEndPanel> {

    onInitUI() {
        NetHelper.ListenOnLua(GameProtocol.Protocol.push_GameEndResult, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            const data = e.data!;
            const iswin = GToBoolean(data.iswin);
            const playdata = data.playdata;

            this.UpdateState({ PopUpEffect: true, iswin: iswin, playdata: playdata });
        }))
    }



    render() {
        const PopUpEffect = this.GetState<boolean>("PopUpEffect");
        if (!PopUpEffect) {
            return this.defaultRender("CC_GameEndPanel");
        }
        const difficultydes = GGameScene.GameServiceSystem.getDifficultyChapterDes();
        const round = ERoundBoard.CurRoundBoard || { config: { roundIndex: 1 } };
        const HeroManageComp = (GGameScene.Local.TCharacter.HeroManageComp!);

        const iswin = this.GetState<boolean>("iswin");
        const playdata = this.GetState<{ [k: string]: ICCGameSingleDataItem }>("playdata") || {};
        const playdataarr = Object.values(playdata);
        playdataarr.sort((a, b) => { return a.scorechange - b.scorechange })
        const tCharacter = GGameScene.Local.TCharacter!;
        const BattlePassComp = (GGameScene.Local.TCharacter.BattlePassComp!)!;
        const IsVip = tCharacter.IsVip();
        const IsVipSeason = tCharacter.IsVipSeason();
        const IsVipForever = tCharacter.IsVipForever();
        const IsBattlePass = BattlePassComp.IsBattlePass;
        const SumHeroLevel = HeroManageComp.SumHeroLevel;

        const RankComp = GGameScene.Local.TCharacter.RankComp!;
        const selfdata0 = RankComp.GetRankData(GameProtocol.ERankType.SeasonBattleSorceRank)!;
        const tBattleRecords = ERoundBoardResultRecord.GetGroupInstance(GGameScene.Local.BelongPlayerid);
        let scorechange = 0;
        let wincount = 0;
        let losecount = 0;
        let drawcount = 0;
        const heroExps: { [unitname: string]: number } = {};
        const prizeItems: { [itemconfigid: string]: number } = {};
        tBattleRecords.forEach(v => {
            if (v.heroExps) {
                for (let heroname in v.heroExps) {
                    heroExps[heroname] = heroExps[heroname] || 0;
                    heroExps[heroname] += v.heroExps[heroname];
                }
            }
            if (v.prizeItems) {
                for (let itemconfigid in v.prizeItems) {
                    prizeItems[itemconfigid] = prizeItems[itemconfigid] || 0;
                    prizeItems[itemconfigid] += v.prizeItems[itemconfigid];
                }
            }
            scorechange += v.iBattleScoreChange;
            if (v.isWin == 1) {
                wincount++;
            }
            else if (v.isWin == 0) {
                drawcount++
            }
            else if (v.isWin == -1) {
                losecount++;
            }
        })
        return (
            <Panel id="CC_GameEndPanel" className={CSSHelper.ClassMaker("CCGameEndPanel", { PopUpEffect: PopUpEffect })} ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopupBG type="Tui7" hasTitle={false} />
                <CCPanel flowChildren="down">
                    <CCLabel type="Title" text={`` + (iswin ? "通关成功" : "通关失败")} color="Red" fontSize="40px" horizontalAlign="center" marginTop={"40px"} />
                    <CCPanel flowChildren="down" height="400px" >
                        {
                            playdataarr.map((v, index) => {
                                return <CCGameSingleDataItem key={index + ""}  {...v} />
                            })
                        }
                    </CCPanel>
                    <CCPanel flowChildren="right">
                        <CCPanel flowChildren="right" horizontalAlign="center">
                            <CCPanel flowChildren="down" width="150px" height="250px">
                                <CCAvatar id="CCRecordAvatar" steamid="local" horizontalAlign="center" />
                                <CCUserName accountid={tCharacter.Name} fontSize={"30px"} marginLeft={"10px"} width="100%" marginTop={"20px"} height="50px" />
                            </CCPanel>
                            <CCPanel flowChildren="down" height="250px">
                                <CCPanel id="BattleRecordTongJi" flowChildren="right" hittest={false} marginTop={"5px"}>
                                    <CCLabel text={`游戏用时：`} verticalAlign="center" fontSize="20px" type="Title" />
                                    <CCLabel text={`${selfdata0.Score}`} verticalAlign="center" fontSize="20px" type="UnitName" />
                                </CCPanel>
                                <CCPanel id="BattleRecordTongJi" flowChildren="right" hittest={false} marginTop={"5px"}>
                                    <CCLabel text={`挑战难度：`} verticalAlign="center" fontSize="20px" type="Title" />
                                    <CCLabel text={`${difficultydes}`} verticalAlign="center" fontSize="20px" type="UnitName" />
                                </CCPanel>
                                <CCPanel id="BattleRecordTongJi" flowChildren="right" hittest={false} marginTop={"5px"}>
                                    <CCLabel text={`胜负平：`} marginLeft={"5px"} verticalAlign="center" fontSize="20px" type="Title" />
                                    <CCLabel text={`${wincount}/${losecount}/${drawcount}`} verticalAlign="center" fontSize="20px" type="UnitName" />
                                    <CCLabel text={`本局获得积分：`} marginLeft={"5px"} verticalAlign="center" fontSize="20px" type="Title" />
                                    <CCLabel text={`${scorechange > 0 ? "+" : ""}${scorechange}`} color={scorechange > 0 ? "Green" : "Red"} verticalAlign="center" fontSize="20px" type="UnitName" />
                                </CCPanel>
                                <CCRankProgressItem />
                            </CCPanel>
                        </CCPanel>
                        <CCPanel flowChildren="down">
                            <CCPanel flowChildren="right" horizontalAlign="center">
                                {
                                    Object.keys(prizeItems).length > 0 && < CCLabel type="Title" text={"道具随机奖励："} fontSize="20px" verticalAlign="center" />
                                }
                                <CCPanel flowChildren="right">
                                    {
                                        Object.keys(prizeItems).map((ItemConfigId, index) => {
                                            const ItemCount = heroExps[ItemConfigId];
                                            if (ItemConfigId && ItemCount) {
                                                return <CCStorageIconItem key={index + ""} itemid={ItemConfigId} count={ItemCount} />
                                            }
                                        })
                                    }
                                </CCPanel>
                            </CCPanel>
                            <CCPanel flowChildren="down" horizontalAlign="center">
                                {
                                    Object.keys(heroExps).length > 0 && <CCPanelHeader type="Tui7" localizedStr="#英雄熟练度" horizontalAlign="center" fontSize="30px" width="400px" />
                                }
                                <CCPanel flowChildren="right-wrap" width="700px" height="350px" scroll={"y"}>
                                    {
                                        Object.keys(heroExps).map((unitname, index) => {
                                            const exp = heroExps[unitname];
                                            const herounit = HeroManageComp.GetHeroUnit(unitname)!;
                                            return <CCHeroExpProgressItem key={index + ""} entity={herounit} addexp={exp} />
                                        })
                                    }

                                </CCPanel>
                            </CCPanel>
                        </CCPanel>
                    </CCPanel>
                    <CCPanel flowChildren="right" horizontalAlign="center">
                        <CCButton color="Gold" text={"继续观战"} horizontalAlign="center" onactivate={(pSelf) => {
                            this.hide();
                        }} />
                        <CCButton color="Purple" marginLeft={"100px"} text={"离开游戏"} horizontalAlign="center" onactivate={(pSelf) => {
                            $.DispatchEvent("DOTAHUDShowDashboard", pSelf);
                        }} />
                    </CCPanel>
                </CCPanel>

                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}




export class CCGameSingleDataItem extends CCPanel<ICCGameSingleDataItem> {

    render() {
        const accountid = this.props.accountid;
        const wincount = this.props.wincount;
        const losecount = this.props.losecount;
        const drawcount = this.props.drawcount;
        const score = this.props.score;
        const scorechange = this.props.scorechange;
        const totaldamage = this.props.totaldamage;
        const units = FuncHelper.toArray<{ unitname: string, star: number }>(this.props.units) || [];
        const sectInfo: string[] = FuncHelper.toArray<string>(this.props.sectInfo) || [];
        const rankid = GJsonConfigHelper.GetRankScoreLevel(score)!;
        const rankconfig = GJSONConfig.RankBattleScoreExpConfig.get(rankid)!;
        units.sort((a, b) => {
            return Entities.GetUnitRarityNumber(a.unitname) - Entities.GetUnitRarityNumber(b.unitname);
        })
        return <Panel className="CCGameSingleDataItem" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            <CCAvatar width="50px" height="50px" accountid={accountid} />
            <CCPanel flowChildren="down" width="150px" height="250px">
                <CCUserName accountid={accountid} fontSize={"20px"} />
                <CCLabel text={`${rankconfig.Name}`} type="UnitName" />
            </CCPanel>
            <CCPanel flowChildren="right" marginLeft={"10px"} verticalAlign="center" tooltip="人口">
                <CCIcon_CoinType cointype={GEEnum.EMoneyType.Population} verticalAlign="center" hittest={false} width="30px" height="30px" />
                <CCLabel type="UnitName" text={"x" + units.length} fontSize="25px" verticalAlign="center" hittest={false} />
            </CCPanel>
            <CCPanel flowChildren="right">
                {
                    units.map((v, index) => {
                        const iStar = v.star;
                        return <CCPanel key={"" + index} flowChildren="down">
                            <CCUnitSmallIcon itemname={v.unitname} width="40px" height="40px" />
                            <CCPanel flowChildren="down">
                                <CCPanel flowChildren="right" horizontalAlign="center">
                                    <CCIcon_Star width="25px" height="25px" visible={iStar >= 1} key={1 + ""} type={"Filled"} />
                                    <CCIcon_Star width="25px" height="25px" visible={iStar >= 2} key={2 + ""} type={"Filled"} />
                                    <CCIcon_Star width="25px" height="25px" visible={iStar >= 3} key={3 + ""} type={"Filled"} />
                                </CCPanel>
                                <CCPanel flowChildren="right" horizontalAlign="center">
                                    <CCIcon_Star width="25px" height="25px" visible={iStar >= 4} key={4 + ""} type={"Filled"} />
                                    <CCIcon_Star width="25px" height="25px" visible={iStar >= 5} key={5 + ""} type={"Filled"} />
                                </CCPanel>
                            </CCPanel>
                        </CCPanel>
                    })
                }
            </CCPanel>
            <CCPanel flowChildren="right">
                {sectInfo.map((sectstr, index) => {
                    const _sectstr = sectstr.split("|");
                    const sectName = _sectstr[0];
                    return <CCCombinationIcon key={index + ""} uiScale={"70%"} marginLeft={"3px"} sectName={sectName} count={GToNumber(_sectstr[1])} dialogTooltip={
                        {
                            cls: CCCombinationInfoDialog,
                            props: {
                                showBg: true,
                                sectName: sectName,
                                showSectName: true,
                            }
                        }
                    } />
                })}
            </CCPanel>
            <CCLabel text={`${wincount}-${losecount}`} type="UnitName" />
            <CCLabel text={`输出:${totaldamage}`} type="UnitName" />
            <CCPanel flowChildren="right" marginLeft={"10px"} verticalAlign="center" tooltip="人口">
                <CCIcon_CoinType cointype={GEEnum.EMoneyType.BattleScore} verticalAlign="center" hittest={false} width="30px" height="30px" />
                <CCLabel type="UnitName" text={(scorechange > 0 ? "+" : "") + scorechange} color={scorechange > 0 ? "Green" : "Red"} fontSize="25px" verticalAlign="center" hittest={false} />
            </CCPanel>
        </Panel>
    }
}