
import React from "react";
import { PathHelper } from "../../helper/PathHelper";

import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { TRankSingleData } from "../../../../scripts/tscripts/shared/service/rank/TRankSingleData";
import { NetHelper } from "../../helper/NetHelper";
import { CCIcon_Loading } from "../AllUIElement/CCIcons/CCIcon_Loading";
import { CCImage } from "../AllUIElement/CCImage/CCImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCMenuNavigation } from "../AllUIElement/CCNavigation/CCMenuNavigation";
import { CCPagination } from "../AllUIElement/CCPagination/CCPagination";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCVerticalTable } from "../AllUIElement/CCTable/CCVerticalTable";
import "./CCRankPanel.less";
import { CCRankSingleDataItem } from "./CCRankSingleDataItem";
interface ICCRankPanel extends NodePropsData {

}

export class CCRankPanel extends CCPanel<ICCRankPanel> {
    onReady() {
        return Boolean(GGameScene.Local.TCharacter && GGameScene.Local.TCharacter.RankComp)
    }

    onInitUI() {
        const RankComp = GGameScene.Local.TCharacter.RankComp!;
        const SeasonRankData = RankComp.GetSeasonRankData()!;
        this.ListenUpdate(RankComp);
        this.ListenUpdate(SeasonRankData);
        this.loadRankData(GameProtocol.ERankType.SeasonBattleSorceRank)
    }

    closeThis() {
        this.close();
        CCMenuNavigation.GetInstance()?.NoSelectAny();
    }


    loadRankData(selectindex: number, page: number = 1) {
        let ranktype = GameProtocol.ERankType.HeroSumBattleSorceRank;
        if (selectindex == 0) {
            ranktype = (GameProtocol.ERankType.SeasonBattleSorceRank)
        }
        else if (selectindex == 1) {
            ranktype = (GameProtocol.ERankType.SeasonSingleCharpterRank)
        }
        else if (selectindex == 2) {
            ranktype = (GameProtocol.ERankType.HeroSumBattleSorceRank)
        }
        NetHelper.SendToCSharp(GameProtocol.Protocol.Rank_CurRankDataInfo, {
            RankType: ranktype,
            Page: page,
        }, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            if (e.state && e.message) {
                const infolist: any[] = JSON.parse(e.message);
                this.UpdateState({ ["curdata" + selectindex]: infolist })

            }
        }))

    }




    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_RankPanel")
        }
        const sName = "rank";
        const selectindex = this.GetState<number>("selectindex") || 0;
        const curdata0 = this.GetState<any[]>("curdata0") || [];
        const curdata1 = this.GetState<any[]>("curdata1") || [];
        const curdata2 = this.GetState<any[]>("curdata2") || [];
        const curdata = this.GetState<any[]>("curdata" + selectindex) || [];
        const RankComp = GGameScene.Local.TCharacter.RankComp!;
        const selfdata0 = RankComp.GetRankData(GameProtocol.ERankType.SeasonBattleSorceRank);
        const selfdata1 = RankComp.GetRankData(GameProtocol.ERankType.SeasonSingleCharpterRank);
        const selfdata2 = RankComp.GetRankData(GameProtocol.ERankType.HeroSumBattleSorceRank);
        if (curdata.length == 0) {
            this.loadRankData(selectindex)
        }
        return (
            <Panel id="CC_RankPanel" className="CC_root" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog id="PanelBg" fullcontent={true} verticalAlign="top" marginTop="120px" onClose={() => this.closeThis()} >
                    <CCPanel id="PanelHeader" flowChildren="right">
                        <CCImage id="PanelIcon" backgroundImage={PathHelper.getCustomImageUrl("icon/" + sName + ".png")} />
                        <CCLabel id="PanelName" localizedText={"#lang_MenuButton_" + sName} />

                    </CCPanel>
                    <CCPanel id="PanelContent" flowChildren="right">
                        <CCVerticalTable marginTop={"20px"} list={[
                            "天梯积分",
                            "章节进度",
                            "英雄战力",
                        ]} defaultSelected={0} onChange={(index: number, text: string) => {
                            this.UpdateState({ selectindex: index })
                        }} />
                        {
                            <CCPanel id="PanelContentBg"  >

                                <CCPanel opacity={selectindex == 0 ? "1" : "0"} flowChildren="down" hittest={false} >
                                    <CCPanel flowChildren="right">
                                        <CCLabel type="UnitName" text={"排名"} />
                                        <CCLabel type="UnitName" text={"玩家"} marginLeft={"50px"} />
                                        <CCLabel type="UnitName" text={"天梯积分"} marginLeft={"150px"} />
                                    </CCPanel>
                                    {
                                        curdata0.length == 0 ? <CCIcon_Loading align="center center" width="50px" height="50px" />
                                            :
                                            curdata0.map((v: TRankSingleData, index) => {
                                                const rank = v.RankIndex;
                                                const accoundid = v.SteamAccountId;
                                                const score = v.Score + "";
                                                return <CCRankSingleDataItem key={"" + index} rank={rank} accoundid={accoundid} score={score} marginTop={"3px"} />
                                            })
                                    }
                                    <CCPagination boundaryCount={5} pageCount={20} defaultPage={1} showJumpButton={false} marginTop={"20px"} onChange={(page: number) => {
                                        this.loadRankData(selectindex, page)
                                    }} />
                                    {
                                        selfdata0 && <CCRankSingleDataItem rank={selfdata0.RankIndex} accoundid={selfdata0.SteamAccountId} score={selfdata0.Score + ""} marginTop={"20px"} />
                                    }
                                </CCPanel>
                                <CCPanel opacity={selectindex == 1 ? "1" : "0"} flowChildren="down" hittest={false} >
                                    <CCPanel flowChildren="right">
                                        <CCLabel type="UnitName" text={"排名"} />
                                        <CCLabel type="UnitName" text={"玩家"} marginLeft={"50px"} />
                                        <CCLabel type="UnitName" text={"章节进度"} marginLeft={"150px"} />
                                    </CCPanel>
                                    {
                                        curdata1.length == 0 ? <CCIcon_Loading align="center center" width="50px" height="50px" />
                                            :
                                            curdata1.map((v: TRankSingleData, index) => {
                                                const rank = v.RankIndex;
                                                const accoundid = v.SteamAccountId;
                                                const score = v.Score + "";
                                                return <CCRankSingleDataItem key={"" + index} rank={rank} accoundid={accoundid} score={score} marginTop={"3px"} />
                                            })
                                    }
                                    <CCPagination boundaryCount={5} pageCount={20} defaultPage={1} showJumpButton={false} marginTop={"20px"} onChange={(page: number) => {
                                        this.loadRankData(selectindex, page)
                                    }} />
                                    {
                                        selfdata1 && <CCRankSingleDataItem rank={selfdata1.RankIndex} accoundid={selfdata1.SteamAccountId} score={selfdata1.Score + ""} marginTop={"20px"} />
                                    }
                                </CCPanel>
                                <CCPanel opacity={selectindex == 2 ? "1" : "0"} flowChildren="down" hittest={false} >
                                    <CCPanel flowChildren="right">
                                        <CCLabel type="UnitName" text={"排名"} />
                                        <CCLabel type="UnitName" text={"玩家"} marginLeft={"50px"} />
                                        <CCLabel type="UnitName" text={"英雄总战力"} marginLeft={"150px"} />
                                    </CCPanel>
                                    {
                                        curdata2.length == 0 ? <CCIcon_Loading align="center center" width="50px" height="50px" />
                                            :
                                            curdata2.map((v: TRankSingleData, index) => {
                                                const rank = v.RankIndex;
                                                const accoundid = v.SteamAccountId;
                                                const score = v.Score + "";
                                                return <CCRankSingleDataItem key={"" + index} rank={rank} accoundid={accoundid} score={score} marginTop={"3px"} />
                                            })
                                    }
                                    <CCPagination boundaryCount={5} pageCount={20} defaultPage={1} showJumpButton={false} marginTop={"20px"} onChange={(page: number) => {
                                        this.loadRankData(selectindex, page)
                                    }} />
                                    {
                                        selfdata2 && <CCRankSingleDataItem rank={selfdata2.RankIndex} accoundid={selfdata2.SteamAccountId} score={selfdata2.Score + ""} marginTop={"20px"} />
                                    }
                                </CCPanel>

                            </CCPanel>



                        }
                    </CCPanel>
                    {this.props.children}
                    {this.__root___childs}
                </CCPopUpDialog>
            </Panel>
        )
    };
}