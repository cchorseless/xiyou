import React from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { TActivityInvestMetaStone } from "../../../../scripts/tscripts/shared/service/activity/TActivityInvestMetaStone";
import { TActivityInvestMetaStoneData } from "../../../../scripts/tscripts/shared/service/activity/TActivityInvestMetaStoneData";
import { NetHelper } from "../../helper/NetHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCIcon_CoinType } from "../AllUIElement/CCIcons/CCIcon_CoinType";
import { CCScrollImageNumber } from "../AllUIElement/CCImageNumber/CCScrollImageNumber";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelHeader } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCMainPanel } from "../MainPanel/CCMainPanel";
import { CCStorageItemGetDialog } from "../Storage/CCStorageItemGetDialog";
import "./CCActivityInvestMetaStone.less";
import { CCActivityRuleNoteItem } from "./CCActivityRuleNoteItem";


interface ICCActivityInvestMetaStone {
}

export class CCActivityInvestMetaStone extends CCPanel<ICCActivityInvestMetaStone> {
    onInitUI() {
        // this.ListenUpdate(TActivityInvestMetaStoneData.GetOneInstance(GGameScene.Local.BelongPlayerid))

    }

    onBtnStartAni(curInvest: number) {
        NetHelper.SendToCSharp(GameProtocol.Protocol.GetPrize_ActivityInvestMetaStone, {
            MetaStone: curInvest
        }, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            if (e.state) {
                let info = GToNumber(e.message!)
                this.UpdateState({ isstartani: true, tometastone: info })
            }
        }))

    }
    render() {
        const isstartani = this.GetState<boolean>("isstartani") || false;
        const tometastone = this.GetState<number>("tometastone") || 0;
        const InvestMetaStone = TActivityInvestMetaStone.GetOneInstance(-1);
        const InvestMetaStoneData = TActivityInvestMetaStoneData.GetOneInstance(GGameScene.Local.BelongPlayerid);
        const allitems = InvestMetaStone.Items.keys();
        allitems.sort((a, b) => { return GToNumber(a) - GToNumber(b) })
        const allItemStates = InvestMetaStoneData.ItemState.keys();
        allItemStates.sort((a, b) => { return GToNumber(a) - GToNumber(b) });
        let curInvest = allitems[0];
        let isinvestFinish = true;
        for (let invest of allitems) {
            if (!allItemStates.includes(invest)) {
                curInvest = invest;
                isinvestFinish = false;
                break;
            }
        }
        const curInvestArr = (curInvest + "").split("");
        while (curInvestArr.length < 5) {
            curInvestArr.unshift("0");
        }
        const tometastoneArr = (tometastone + "").split("");
        while (tometastoneArr.length < 5) {
            tometastoneArr.unshift("0");
        }
        const InvestInfo = InvestMetaStone.Items.get(curInvest);
        return <Panel className={"CCActivityInvestMetaStone"} ref={this.__root__}  {...this.initRootAttrs()}>
            <CCPanel flowChildren="down" width="75%">
                <CCPanel id="InvestMetaStoneImg" marginTop={"20px"} horizontalAlign="center">
                    <CCLabel type="Title" text={`投入原石`} fontSize="40px" marginTop={"20px"} horizontalAlign="center" />
                    <CCPanel flowChildren="right" marginTop={"100px"} horizontalAlign="center" >
                        <CCScrollImageNumber key={curInvest + "1"} type="9" start={GToNumber(curInvestArr[0])} to={GToNumber(tometastoneArr[0])} anistoptime={4} isaniplay={isstartani} anistopFunc={() => {
                            CCMainPanel.GetInstance()!.addOnlyPanel(CCStorageItemGetDialog, {
                                Items: [{ ItemConfigId: GEEnum.EMoneyType.MetaStone, ItemCount: tometastone }]
                            });
                            this.UpdateState({ isstartani: false, tometastone: 0 })
                        }} />
                        <CCScrollImageNumber key={curInvest + "2"} type="9" start={GToNumber(curInvestArr[1])} to={GToNumber(tometastoneArr[1])} anistoptime={3.5} marginLeft={"10px"} isaniplay={isstartani} />
                        <CCScrollImageNumber key={curInvest + "3"} type="9" start={GToNumber(curInvestArr[2])} to={GToNumber(tometastoneArr[2])} anistoptime={3} marginLeft={"10px"} isaniplay={isstartani} />
                        <CCScrollImageNumber key={curInvest + "4"} type="9" start={GToNumber(curInvestArr[3])} to={GToNumber(tometastoneArr[3])} anistoptime={2.5} marginLeft={"10px"} isaniplay={isstartani} />
                        <CCScrollImageNumber key={curInvest + "5"} type="9" start={GToNumber(curInvestArr[4])} to={GToNumber(tometastoneArr[4])} anistoptime={2} marginLeft={"10px"} isaniplay={isstartani} />
                    </CCPanel>
                </CCPanel>
                <CCPanel flowChildren="right" marginTop={"20px"} horizontalAlign="center">
                    <CCLabel type="Title" text={`回报原石数量范围：`} verticalAlign="center" />
                    <CCIcon_CoinType cointype={GEEnum.EMoneyType.MetaStone} width="30px" height="30px" verticalAlign="center" />
                    <CCLabel type="UnitName" fontSize="30px" text={`x[${InvestInfo.ItemConfigId},${InvestInfo.ItemCount}]`} verticalAlign="center" />
                </CCPanel>
                <CCButton color="Purple" enabled={!isinvestFinish} text={isinvestFinish ? "已完成全部" : "投入原石"} marginTop={"20px"} horizontalAlign="center" onactivate={() => {
                    if (isstartani) { return }
                    this.onBtnStartAni(curInvest);
                }} />
            </CCPanel>
            <CCPanel flowChildren="down">
                <CCActivityRuleNoteItem str="投入指定数量的原石,可立即获得随机数量的原石回报。每次投入必定赚取原石。每个赛季开始重置。" height="200px" />
                <CCPanelHeader type="Tui7" localizedStr={`#理财记录`} />
                <CCPanel flowChildren="down" height="400px">
                    {
                        allItemStates.map((v, index) => {
                            const chanchu = InvestMetaStoneData.ItemState.get(v);
                            return <CCPanel flowChildren="right" key={index + ""} marginTop={"5px"} >
                                <CCLabel type="Title" text={`投入:${v}`} width="130px" verticalAlign="center" />
                                <CCLabel type="UnitName" text={`回报:${chanchu}`} width="130px" verticalAlign="center" />
                            </CCPanel>
                        })
                    }

                </CCPanel>
            </CCPanel>
        </Panel>
    }
}


