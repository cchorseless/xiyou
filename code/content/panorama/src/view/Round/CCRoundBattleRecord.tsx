import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";

import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { ERoundBoardResultRecord } from "../../../../scripts/tscripts/shared/rules/Round/ERoundBoardResultRecord";
import { CCAvatar } from "../AllUIElement/CCAvatar/CCAvatar";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCUserName } from "../AllUIElement/CCUserName/CCUserName";
import "./CCRoundBattleRecord.less";

interface ICCRoundBattleRecord extends NodePropsData {
    // playerid: PlayerID;
}

export class CCRoundBattleRecord extends CCPanel<ICCRoundBattleRecord> {
    onReady() {
        return Boolean(GGameScene.Local.TCharacter && GGameScene.Local.TCharacter.RankComp)
    }

    onInitUI() {
        const RankComp = GGameScene.Local.TCharacter.RankComp!;
        const selfdata0 = RankComp.GetRankData(GameProtocol.ERankType.SeasonBattleSorceRank)!;
        this.ListenClassUpdate(ERoundBoardResultRecord);
        this.ListenUpdate(selfdata0);
    }

    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_RoundBattleRecord")
        }
        const RankComp = GGameScene.Local.TCharacter.RankComp!;
        const selfdata0 = RankComp.GetRankData(GameProtocol.ERankType.SeasonBattleSorceRank)!;
        const tBattleRecords = ERoundBoardResultRecord.GetGroupInstance(GGameScene.Local.BelongPlayerid);
        tBattleRecords.sort((a, b) => {
            return a.GetConfig().roundIndex - b.GetConfig().roundIndex;
        })
        let scorechange = 0;
        let wincount = 0;
        let losecount = 0;
        let drawcount = 0;
        tBattleRecords.forEach(v => {
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
        const ExpandBattleRecord = this.GetState<boolean>("ExpandBattleRecord", false);
        return (
            <Panel id="CC_RoundBattleRecord" ref={this.__root__}  {...this.initRootAttrs()}>
                <Button id="ToggleBattleRecord"
                    className={CSSHelper.ClassMaker({ ExpandBattleRecord: ExpandBattleRecord })}
                    onactivate={
                        () => {
                            this.UpdateState({ ExpandBattleRecord: !ExpandBattleRecord })
                        }}>
                    <CCLabel id="ToggleDes" text={"记录"} marginLeft={"10px"} verticalAlign="center" width="20px" fontSize="16px" type="Title" />
                    <Image id="ToggleImg" />
                </Button>
                <Panel id="BattleRecordPanelAndTitle" className={CSSHelper.ClassMaker({ ExpandBattleRecord: ExpandBattleRecord })} hittest={false}>
                    <Label id="BattleRecordTitle" localizedText="#lang_Module_BattleRecordTitle" />
                    <Panel id="BattleRecordPanel" hittest={false}>
                        <CCPanel id="BattleRecordList" hittest={false} scroll={"y"}>
                            {
                                tBattleRecords.map((v, index) => {
                                    return <CCRoundBattleRecordSingleItem entity={v} key={index + ""} marginTop={"5px"} />
                                })
                            }
                        </CCPanel>
                        <CCPanel id="BattleRecordTongJi" flowChildren="right" hittest={false} marginTop={"5px"}>
                            <CCLabel text={`天梯积分：`} marginLeft={"30px"} verticalAlign="center" fontSize="16px" type="Title" />
                            <CCLabel text={`${selfdata0.Score}`} verticalAlign="center" fontSize="16px" type="UnitName" />
                            <CCLabel text={`本局积分：`} marginLeft={"5px"} verticalAlign="center" fontSize="16px" type="Title" />
                            <CCLabel text={`${scorechange > 0 ? "+" : ""}${scorechange}`} color={scorechange > 0 ? "Green" : "Red"} verticalAlign="center" fontSize="16px" type="UnitName" />
                            <CCLabel text={`胜负平：`} marginLeft={"5px"} verticalAlign="center" fontSize="16px" type="Title" />
                            <CCLabel text={`${wincount}/${losecount}/${drawcount}`} verticalAlign="center" fontSize="16px" type="UnitName" />
                        </CCPanel>
                    </Panel>
                </Panel>
            </Panel>
        );
    }
}


interface ICCRoundBattleRecordSingleItem {
    entity: ERoundBoardResultRecord
}


export class CCRoundBattleRecordSingleItem extends CCPanel<ICCRoundBattleRecordSingleItem> {


    onInitUI() {
        if (this.props.entity) {
            this.ListenUpdate(this.props.entity);
        }
    }

    render() {
        const entity = this.props.entity;
        const config = entity.GetConfig()
        const roundcls = entity.isWin == 1 ? "RoundWin" : (entity.isWin == 0) ? "RoundDraw" : "RoundLose";
        const isbossround = (config.roundIndex > 1 && !config.randomEnemy);
        const accountid = entity.accountid;
        const iBattleScoreChange = entity.iBattleScoreChange;
        let enemyname = "";
        if (entity.enemyid != null && entity.enemyid != "") {
            enemyname = Entities.GetLocalizeUnitName(entity.enemyid)
        }
        return (
            <Panel className={CSSHelper.ClassMaker("CCRoundBattleRecordSingleItem", { BossRound: isbossround })} ref={this.__root__}  {...this.initRootAttrs()}>
                <CCLabel type="Title" text={`Round${config.roundIndex}`} width="90px" fontSize="20px" verticalAlign="center" />
                <CCPanel className={CSSHelper.ClassMaker("RoundResult", roundcls)} />
                {
                    accountid != null && accountid != "" && <CCPanel flowChildren="right">
                        <CCAvatar id="playerAvatar" width="30px" height="30px" accountid={accountid} verticalAlign="center" />
                        <CCUserName id="PlayerName" accountid={accountid} width="80px" height="40px" fontSize={"24"} verticalAlign="center" />
                        <CCLabel type="UnitName" verticalAlign="center" text={`(${iBattleScoreChange > 0 ? "+" : ""}${iBattleScoreChange})`} fontSize="25px" color={iBattleScoreChange > 0 ? "Green" : "Red"} />
                    </CCPanel>
                }
                {
                    enemyname != "" && <CCLabel type="Title" text={enemyname} fontSize="20px" verticalAlign="center" marginLeft={"20px"} />
                }
            </Panel>
        )
    }
}