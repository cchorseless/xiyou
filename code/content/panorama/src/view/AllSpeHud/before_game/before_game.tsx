/** Create By Editor*/
import React, { createRef } from "react";
import { GameProtocol } from "../../../../../scripts/tscripts/shared/GameProtocol";
import { GameServiceConfig } from "../../../../../scripts/tscripts/shared/GameServiceConfig";
import { EEnum } from "../../../../../scripts/tscripts/shared/Gen/Types";
import { CSSHelper } from "../../../helper/CSSHelper";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { CCDOTAChat } from "../../AllUIElement/CCDOTAChat/CCDOTAChat";
import { CCImageNumber } from "../../AllUIElement/CCImageNumber/CCImageNumber";
import { CCPanel } from "../../AllUIElement/CCPanel/CCPanel";
import { CCCourierCard } from "../../Courier/CCCourierCard";
import "./before_game.less";
import { CCGameDifficulty, CCGameEndlessDifficulty } from "./CCGameDifficulty";
import { CCPlayerInTeamItem } from "./CCPlayerInTeamItem";
export class CCBefore_Game extends CCPanel<NodePropsData> {

    TimerRef = createRef<Panel>();

    onReady() {
        return Boolean(GGameScene.Local.PlayerDataComp && GGameScene.GameServiceSystem)
    }

    onInitUI() {
        GGameScene.Local.PlayerDataComp.RegRef(this);
        GGameScene.GameServiceSystem.RegRef(this);
        this.UpdateState({ iTimeLeft: -1 });
        GTimerHelper.AddTimer(1, GHandler.create(this, () => {
            let lefttime = GGameScene.GameServiceSystem.BeforeGameEndTime - Game.GetGameTime();;
            this.UpdateState({ iTimeLeft: lefttime });
            return 1
        }))
    }


    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_Before_Game") }
        const iTimeLeft = this.GetState<number>("iTimeLeft");
        const DataComp = GGameScene.Local.TCharacter.DataComp!;
        const sCourierIDInUse = DataComp.getGameDataStr(GameProtocol.EGameDataStrDicKey.sCourierIDInUse) || GameServiceConfig.DefaultCourier;
        const iDifficultyMaxChapter = DataComp.getGameDataStr(GameProtocol.EGameDataStrDicKey.iDifficultyMaxChapter) || "0";
        const iDifficultyMaxLevel = DataComp.getGameDataStr(GameProtocol.EGameDataStrDicKey.iDifficultyMaxLevel) || "0";
        const maxDiff = Number(iDifficultyMaxChapter);
        const layers = Number(iDifficultyMaxLevel);
        const courierunlock = GGameScene.Local.TCharacter.BagComp?.getItemByType(EEnum.EItemType.Courier);
        const courierNames: Set<string> = new Set();
        courierNames.add(GameServiceConfig.DefaultCourier);
        courierunlock?.forEach(item => {
            courierNames.add(item.Config?.ItemName || "")
        })
        const GamseStateSys = this.GetStateEntity(GGameScene.GameServiceSystem)!;
        const tPlayerGameSelection = GamseStateSys.tPlayerGameSelection;
        return (
            <Panel ref={this.__root__} id="CC_Before_Game" hittest={false} {...this.initRootAttrs()}>
                {/* <Button id="CustomDashBoardButton" onactivate={() => $.DispatchEvent("DOTAHUDShowDashboard")} /> */}
                {/* <Button id="CustomSettingButton" onactivate={() => $.DispatchEvent("DOTAShowSettingsPopup")} /> */}
                <Label id="TimerTitle" localizedText="#TimerTitle" />
                <Panel id="Timer" hittest={false} ref={this.TimerRef}>
                    <CCImageNumber id="RoundTime" type="4" value={Math.floor(iTimeLeft)} />
                </Panel>
                {/* 左边信使选择 */}
                <Panel id="PlayerCourier" hittest={false} >
                    <Label id="PlayerCourierTitle" localizedText="#CourierSelectionTitle" />
                    {/* 第一次点击列表，列表总是会自动回到最顶上，SetFocus可以解决，虽然我不知道为什么能解决 */}
                    <CCPanel id="PlayerCourierList" onload={p => p.SetFocus()} scroll="y" >
                        {
                            Array.from(courierNames).map(([sCourierName, index]) => {
                                return (
                                    <CCCourierCard key={sCourierName}
                                        className={CSSHelper.ClassMaker("PlayerCourierCard", { "Selected": sCourierIDInUse == sCourierName })}
                                        sCourierName={sCourierName}
                                        onactivate={p => {
                                            GGameScene.GameServiceSystem.SelectCourier(sCourierName);
                                            p.ScrollParentToMakePanelFit(3, false);
                                        }}
                                        onload={p => {
                                            if (sCourierIDInUse == sCourierName) {
                                                p.ScrollParentToMakePanelFit(3, false);
                                            }
                                        }} />
                                );
                            })}
                    </CCPanel>
                </Panel>
                <Panel id="PlayerContainer" hittest={false}>
                    {
                        [...Array(GameServiceConfig.GAME_MAX_PLAYER)].map(
                            (_, index) => {
                                let iPlayerID = index as PlayerID;
                                if (Players.IsValidPlayerID(iPlayerID)) {
                                    return <CCPlayerInTeamItem id={"Player_" + index} iPlayerID={iPlayerID} />
                                }
                            })
                    }
                </Panel>
                <Panel id="Difficulties" hittest={false}>
                    <Label id="DifficultiesTitle" localizedText="#Select_Difficulties" />
                    {[...Array(GameServiceConfig.DIFFICULTY_LAST + 1)].map(
                        (_, index) => {
                            let charpter = index + 1;
                            if (index == GameServiceConfig.DIFFICULTY_LAST) {
                                charpter = GameServiceConfig.EDifficultyChapter.endless;
                            }
                            let aPlayerIDs: PlayerID[] = [];
                            let selected = false;
                            for (const sPlayerID in tPlayerGameSelection) {
                                const tData = tPlayerGameSelection[sPlayerID];
                                let iPlayerID = Number(sPlayerID) as PlayerID;
                                if (tData.Difficulty.Chapter == charpter) {
                                    aPlayerIDs.push(iPlayerID);
                                    if (iPlayerID == Players.GetLocalPlayer()) {
                                        selected = true;
                                    }
                                }
                            }
                            if (charpter == GameServiceConfig.EDifficultyChapter.endless) {
                                return <CCGameEndlessDifficulty key={index + ""} selected={selected} enable={maxDiff >= GameServiceConfig.DIFFICULTY_LAST} layers={layers} aPlayerIDs={aPlayerIDs} />;
                            }
                            return <CCGameDifficulty key={index + ""} iDifficulty={charpter} selected={selected} max={maxDiff} aPlayerIDs={aPlayerIDs} />;
                        })}
                </Panel>
                <Panel id="ChatContainer" hittest={false}>
                    <CCDOTAChat id="Chat" className="PreGameChat" chatstyle="hudpregame" />
                </Panel>
            </Panel>
        )
    }
}


