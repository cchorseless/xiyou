import { render } from "@demon673/react-panorama";
import React, { createRef } from "react";
import { AllShared } from "../../../../../scripts/tscripts/shared/AllShared";
import { GameEnum } from "../../../../../scripts/tscripts/shared/GameEnum";
import { GameServiceConfig } from "../../../../../scripts/tscripts/shared/GameServiceConfig";
import { AllEntity } from "../../../game/AllEntity";
import { GameScene } from "../../../game/GameScene";
import { CSSHelper } from "../../../helper/CSSHelper";
import { DotaUIHelper } from "../../../helper/DotaUIHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { CCButton } from "../../AllUIElement/CCButton/CCButton";
import { CCDOTAChat } from "../../AllUIElement/CCDOTAChat/CCDOTAChat";
import { CCImageNumber } from "../../AllUIElement/CCImageNumber/CCImageNumber";
import { CCMenuDashBoardBackAndSetting } from "../../AllUIElement/CCNavigation/CCMenuDashBoardBackAndSetting";
import { CCPanel } from "../../AllUIElement/CCPanel/CCPanel";
import { CCCourierCard } from "../../Courier/CCCourierCard";
import { CCGameDifficulty, CCGameEndlessDifficulty } from "./CCGameDifficulty";
import { CCPlayerInTeamItem } from "./CCPlayerInTeamItem";
import "./hero_select.less";

export class CCHero_Select extends CCPanel<NodePropsData> {

    TimerRef = createRef<Panel>();
    onReady() {
        const localplayerid = Players.GetLocalPlayer();
        return Boolean(GGameScene.GameServiceSystem && GBagComponent.GetOneInstance(localplayerid))
    }

    onInitUI() {
        const localplayerid = Players.GetLocalPlayer()
        GGameScene.GameServiceSystem.RegRef(this);
        GBagComponent.GetOneInstance(localplayerid).RegRef(this);
        this.UpdateState({ iTimeLeft: -1 });
        GTimerHelper.AddTimer(1, GHandler.create(this, () => {
            let lefttime = GGameScene.GameServiceSystem.BeforeGameEndTime - Game.GetGameTime();;
            this.UpdateState({ iTimeLeft: lefttime });
            if (lefttime >= 0) {
                return 1
            }
        }))
        this.addEvent();
        this.onGameStateChange();
    }

    onDestroy() {
        this.__root___isValid = false;
        TimerHelper.Stop();
        DotaUIHelper.Quit();
        GameScene.Scene.Dispose();
        LogHelper.print("----------------CCHero_Select close----------------")
    }

    addEvent() {
        this.addGameEvent(GameEnum.GameEvent.game_rules_state_change, (e) => {
            this.onGameStateChange()
        })
    }

    onGameStateChange() {
        const state = Game.GetState();
        if (state != DOTA_GameState.DOTA_GAMERULES_STATE_HERO_SELECTION) {
            this.close()
        }
    }
    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_Hero_Select") }
        const localplayerid = Players.GetLocalPlayer()
        const iTimeLeft = this.GetState<number>("iTimeLeft");
        const GamseStateSys = this.GetStateEntity(GGameScene.GameServiceSystem)!;
        const bagcomp = this.GetStateEntity(GBagComponent.GetOneInstance(localplayerid))!;
        const tPlayerGameSelection = GamseStateSys.tPlayerGameSelection;
        const localselect = GamseStateSys.getPlayerGameSelection(localplayerid);
        const sCourierIDInUse = localselect.Courier;
        const maxDiff = localselect.Difficulty.MaxChapter
        const layers = localselect.Difficulty.MaxLevel;
        const courierNames = bagcomp.getAllCourierNames();
        return (
            <Panel ref={this.__root__} id="CC_Hero_Select" hittest={false} {...this.initRootAttrs()}>
                <CCMenuDashBoardBackAndSetting />
                <Label id="TimerTitle" localizedText="#lang_TimerTitle" />
                <Panel id="Timer" hittest={false} ref={this.TimerRef}>
                    <CCImageNumber id="RoundTime" type="4" value={Math.floor(iTimeLeft)} />
                </Panel>
                {/* 左边信使选择 */}
                <Panel id="PlayerCourier" hittest={false} >
                    <Label id="PlayerCourierTitle" localizedText="#lang_CourierSelectionTitle" />
                    {/* 第一次点击列表，列表总是会自动回到最顶上，SetFocus可以解决，虽然我不知道为什么能解决 */}
                    <CCPanel id="PlayerCourierList" onload={p => p.SetFocus()} scroll="y" >
                        {
                            courierNames.map((sCourierName, index) => {
                                return (
                                    <CCCourierCard key={sCourierName + ""}
                                        className={CSSHelper.ClassMaker("PlayerCourierCard", { "Selected": sCourierIDInUse == sCourierName })}
                                        sCourierName={sCourierName}
                                        allowrotation={false}
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
                                    return <CCPlayerInTeamItem key={index + ""} id={"Player_" + index} iPlayerID={iPlayerID} />
                                }
                            }).filter(t => { return Boolean(t) })
                    }
                </Panel>
                <Panel id="Difficulties" hittest={false}>
                    <Label id="DifficultiesTitle" localizedText="#lang_Select_Difficulties" />
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
                                return <CCGameEndlessDifficulty key={index + ""} selected={selected} enable={maxDiff == GameServiceConfig.EDifficultyChapter.endless} layers={layers} aPlayerIDs={aPlayerIDs} />
                            }
                            return <CCGameDifficulty key={index + ""} iDifficulty={charpter} selected={selected} max={maxDiff} aPlayerIDs={aPlayerIDs} />
                        })}
                </Panel>
                {/* 准备 */}
                <CCButton id="ReadyButton"
                    type="Style1"
                    enabled={!localselect.IsReady}
                    color="Green"
                    onactivate={() => { GamseStateSys.SelectReady(); }} >
                    <Label className="btn_lbl" localizedText="#lang_ready" />
                </CCButton>
                <Panel id="ChatContainer" hittest={false}>
                    <CCDOTAChat id="Chat" className="PreGameChat" />
                </Panel>
            </Panel>
        )
    }
}
AllShared.Init();
AllEntity.Init();
TimerHelper.Init();
GameScene.Init();
DotaUIHelper.Init();
render(<CCHero_Select />, $.GetContextPanel());