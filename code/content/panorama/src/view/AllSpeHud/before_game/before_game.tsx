/** Create By Editor*/
import React, { createRef, useState } from "react";
import { render } from "@demon673/react-panorama";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { CCPanel } from "../../AllUIElement/CCPanel/CCPanel";
import { CCDOTAChat } from "../../AllUIElement/CCDOTAChat/CCDOTAChat";
import { CCImageNumber } from "../../AllUIElement/CCImageNumber/CCImageNumber";
import { TimerHelper } from "../../../helper/TimerHelper";
import { PlayerScene } from "../../../game/components/Player/PlayerScene";
import { FuncHelper } from "../../../helper/FuncHelper";
import { CCGameDifficulty, CCGameEndlessDifficulty } from "./CCGameDifficulty";
import { CCCourierCard } from "../../Courier/CCCourierCard";
import { CSSHelper } from "../../../helper/CSSHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { GameProtocol } from "../../../../../../game/scripts/tscripts/shared/GameProtocol";
import "./before_game.less";
import { EEnum } from "../../../../../../game/scripts/tscripts/shared/Gen/Types";
import { GameStateConfig } from "../../../../../../game/scripts/tscripts/shared/GameStateConfig";
import { CCPlayerInTeamItem } from "./CCPlayerInTeamItem";
export class CCBefore_Game extends CCPanel<NodePropsData> {

    TimerRef = createRef<Panel>();

    onReady() {
        return Boolean(PlayerScene.Local.PlayerDataComp && PlayerScene.GameStateSystem)
    }

    onInitUI() {
        PlayerScene.Local.PlayerDataComp.RegRef(this);
        PlayerScene.GameStateSystem.RegRef(this);
        this.UpdateState({ iTimeLeft: -1 });
        TimerHelper.AddIntervalTimer(1, 1,
            FuncHelper.Handler.create(this, () => {
                let lefttime = PlayerScene.GameStateSystem.BeforeGameEndTime - Game.GetGameTime();;
                this.UpdateState({ iTimeLeft: lefttime });
            }), -1, false)
    }


    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_Before_Game") }
        const iTimeLeft = this.GetState<number>("iTimeLeft");
        const DataComp = PlayerScene.Local.TCharacter.DataComp!;
        const sCourierIDInUse = DataComp.getGameDataStr(GameProtocol.EGameDataStrDicKey.sCourierIDInUse) || GameStateConfig.DefaultCourier;
        const iDifficultyMaxChapter = DataComp.getGameDataStr(GameProtocol.EGameDataStrDicKey.iDifficultyMaxChapter) || "0";
        const iDifficultyMaxLevel = DataComp.getGameDataStr(GameProtocol.EGameDataStrDicKey.iDifficultyMaxLevel) || "0";
        const maxDiff = Number(iDifficultyMaxChapter);
        const layers = Number(iDifficultyMaxLevel);
        const courierunlock = PlayerScene.Local.TCharacter.BagComp?.getItemByType(EEnum.EItemType.Courier);
        const courierNames: Set<string> = new Set();
        courierNames.add(GameStateConfig.DefaultCourier);
        courierunlock?.forEach(item => {
            courierNames.add(item.Config?.ItemName || "")
        })
        const GamseStateSys = this.GetStateEntity(PlayerScene.GameStateSystem)!;
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
                                            PlayerScene.GameStateSystem.SelectCourier(sCourierName);
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
                        [...Array(GameStateConfig.GAME_MAX_PLAYER)].map(
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
                    {[...Array(GameStateConfig.DIFFICULTY_LAST + 1)].map(
                        (_, index) => {
                            let charpter = index + 1;
                            if (index == GameStateConfig.DIFFICULTY_LAST) {
                                charpter = GameStateConfig.EDifficultyChapter.endless;
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
                            if (charpter == GameStateConfig.EDifficultyChapter.endless) {
                                return <CCGameEndlessDifficulty key={index + ""} selected={selected} enable={maxDiff >= GameStateConfig.DIFFICULTY_LAST} layers={layers} aPlayerIDs={aPlayerIDs} />;
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


