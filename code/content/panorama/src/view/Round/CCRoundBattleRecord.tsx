import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";

import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { RoundConfig } from "../../../../scripts/tscripts/shared/RoundConfig";
import { ERoundBoardResultRecord } from "../../../../scripts/tscripts/shared/rules/Round/ERoundBoardResultRecord";
import { ERoundBoard } from "../../game/components/Round/ERoundBoard";
import { NetHelper } from "../../helper/NetHelper";
import { CCAvatar } from "../AllUIElement/CCAvatar/CCAvatar";
import { CCIcon_Point } from "../AllUIElement/CCIcons/CCIcon_Point";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelHeader } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCTxtTable } from "../AllUIElement/CCTable/CCTxtTable";
import { CCUserName } from "../AllUIElement/CCUserName/CCUserName";
import "./CCRoundBattleRecord.less";

interface ICCRoundBattleRecord extends NodePropsData {
    // playerid: PlayerID;
}

export class CCRoundBattleRecord extends CCPanel<ICCRoundBattleRecord> {
    onReady() {
        return Boolean(GGameScene.Local.TCharacter && ERoundBoard.CurRoundBoard && GGameScene.Local.TCharacter.RankComp)
    }

    onInitUI() {
        const RankComp = GGameScene.Local.TCharacter.RankComp!;
        const selfdata0 = RankComp.GetRankData(GameProtocol.ERankType.SeasonBattleSorceRank)!;
        this.ListenClassUpdate(ERoundBoardResultRecord);
        this.ListenClassUpdate(ERoundBoard);
        this.ListenUpdate(selfdata0);

        NetHelper.ListenOnLua(RoundConfig.EProtocol.roundboard_onstart,
            GHandler.create(this, (e: JS_TO_LUA_DATA) => {
                this.UpdateState({ ExpandBattleRecord: true, selectindex: 0 })
            }))
    }

    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_RoundBattleRecord")
        }
        const RankComp = GGameScene.Local.TCharacter.RankComp!;
        const CurRound = ERoundBoard.CurRoundBoard;
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
        const selectindex = this.GetState<number>("selectindex", 0);
        const ExpandBattleRecord = this.GetState<boolean>("ExpandBattleRecord", false);
        let roundDes = "选择对手(3选1)";
        const israndomEnemy = CurRound.config.randomEnemy;
        const des1 = "#lang_Round_record_des1_" + (israndomEnemy ? 1 : 2);
        const des2 = "#lang_Round_record_des2_" + (israndomEnemy ? 1 : 2);
        const des3 = "#lang_Round_record_des3_" + (israndomEnemy ? 1 : 2);
        if (!israndomEnemy) {
            let enemyname = CurRound.config.enemyinfo[0].unitname;
            roundDes = Entities.GetLocalizeUnitName(enemyname);
        }
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
                    <CCPanel id="BattleRecordTitle" >
                        <CCTxtTable align="left center" marginLeft={"10px"} list={[`${"详情"}`, `${$.Localize("#lang_Module_BattleRecordTitle")}`]}
                            sepmarginleft="10px"
                            onChange={(index: number, text: string) => {
                                this.UpdateState({ selectindex: index })
                            }} />
                    </CCPanel>
                    <Panel id="BattleRecordPanel" hittest={false}>
                        <CCPanel id="BattleRecordInfo" opacity={selectindex == 0 ? "1" : "0"} hittest={false} scroll={"y"}>
                            <CCLabel text={`ROUND ${CurRound.config.roundIndex}`} marginTop={"20px"} horizontalAlign="center" fontSize="35px" type="Title" />
                            <CCLabel text={`${roundDes}`} horizontalAlign="center" fontSize="25px" type="UnitName" />
                            <CCLabel text={`战力：${CurRound.config.enemyScoreMin}-${CurRound.config.enemyScoreMax}`} horizontalAlign="center" fontSize="18px" type="UnitName" />
                            <CCPanelHeader localizedStr="#挑战小贴士" width="300px" marginTop={"5px"} />
                            <CCPanel flowChildren="right" marginLeft={"30px"} marginTop={"10px"}>
                                <CCIcon_Point width="20px" height="20px" />
                                <CCLabel key={des1} localizedText={des1} html={true} dialogVariables={{ battlescore: "" + CurRound.config.rankScore, heroexp: "" + CurRound.config.winPrizeHeroExp }} fontSize="16px" type="UnitName" />
                            </CCPanel>
                            <CCPanel flowChildren="right" marginLeft={"30px"} marginTop={"10px"}>
                                <CCIcon_Point width="20px" height="20px" />
                                <CCLabel key={des2} localizedText={des2} html={true} dialogVariables={{}} fontSize="16px" type="UnitName" />
                            </CCPanel>
                            <CCPanel flowChildren="right" marginLeft={"30px"} marginTop={"10px"}>
                                <CCIcon_Point width="20px" height="20px" />
                                <CCLabel key={des3} localizedText={des3} html={true} dialogVariables={{ damage: "" + CurRound.config.enemyDamge }} fontSize="16px" type="UnitName" />
                            </CCPanel>

                            {/* <CCButton color="Green" text={"赌注加倍"} /> */}
                        </CCPanel>
                        <CCPanel id="BattleRecordList" opacity={selectindex == 1 ? "1" : "0"} hittest={false} scroll={"y"}>
                            {
                                tBattleRecords.map((v, index) => {
                                    return <CCRoundBattleRecordSingleItem entity={v} key={index + ""} marginTop={"5px"} />
                                })
                            }
                        </CCPanel>

                    </Panel>
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