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
export class CCBefore_Game extends CCPanel<NodePropsData> {

    TimerRef = createRef<Panel>();


    onInitUI() {
        PlayerScene.Local.PlayerDataComp.RegRef(this);
        this.UpdateState({ iTimeLeft: -1 });
        TimerHelper.AddIntervalTimer(1, 1,
            FuncHelper.Handler.create(this, () => {
                let lefttime = PlayerScene.GameStateSystem.BeforeGameEndTime - Game.GetGameTime();;
                this.UpdateState({ iTimeLeft: lefttime });
            }), -1, false)
    }



    render() {
        const iTimeLeft = this.GetState<number>("iTimeLeft");
        const sCourierIDInUse = PlayerScene.Local.TCharacter.DataComp!.getGameDataStr(GameProtocol.EGameDataStrDicKey.sCourierIDInUse)
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
                    <CCPanel id="PlayerCourierList" onload={p => p.SetFocus()} >
                        {
                            Object.keys(KVHelper.KVData().CourierUnits).map(([sCourierName, index]) => {
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
                    <ReactUtils.Repeat iTime={4}>
                        {(index) => {
                            let iPlayerID = index as PlayerID;

                            if (Players.IsValidPlayerID(iPlayerID)) {
                                let sCourierID = tPlayerInUse?.[iPlayerID]?.courier;
                                let tPlayerTitle = tPlayerInUse?.[iPlayerID]?.title;
                                let sCourierName = CustomUIConfig.CourierID2Name[String(sCourierID ?? "")];
                                let tCourierData = CustomUIConfig.CourierKv[sCourierName];

                                let tGameSelection = tPlayerGameSelection?.[iPlayerID];
                                let iDifficulty = tGameSelection?.difficulty ?? 0;
                                let bIsReady = (tGameSelection?.is_default_difficulty ?? 1) == 0;
                                let bNewPlayer = unlockDiff?.[iPlayerID]?.noobPlayer == 1;
                                let iHelpDiff = safeNumber(unlockDiff?.[iPlayerID]?.diff, 1);

                                let iRank = safeNumber(endlessRLData?.[iPlayerID]?.user.rank, -1);

                                return (
                                    <Panel key={index} id={"Player_" + index} className={classNames("PlayerMain", `Difficulty${iDifficulty}`, `Courier${tCourierData?.Rarity ?? "R"}`)} hittest={false} style={{ borderColor: "#" + intToARGB(Players.GetPlayerColor(iPlayerID)) }}>
                                        {tPlayerTitle != undefined && <CourierTitle id="PlayerTitleUse" sCourierTitleID={tPlayerTitle} />}
                                        {tCourierData && <>
                                            <Panel id="PlayerCourierRarity" hittest={false} />
                                            <Panel id="PlayerCourierScene" hittest={false} >
                                                <GenericPanel type="DOTAUIEconSetPreview" key={sCourierName} itemdef={tCourierData?.ItemDef ?? 0} itemstyle={tCourierData?.ItemStyle ?? 0} displaymode="loadout_small" drawbackground={true} antialias={true} allowrotation={true} />
                                            </Panel>
                                            <Label id="PlayerCourierName" text={$.Localize("#" + sCourierName as string)} hittest={false} />
                                            {tCourierData.Ability1 && <DOTAAbilityImage id="PlayerCourierAbility" abilityname={tCourierData.Ability1} showtooltip={true} />}
                                        </>}
                                        <Panel id="PlayerDifficulty" hittest={false} >
                                            {(() => {
                                                if (iDifficulty == 999) {
                                                    return <Label id="PlayerDifficultyEndless" localizedText="#Difficult_999" />;
                                                }
                                                return <Panel id="PlayerDifficultyNum" />;
                                            })()}
                                        </Panel>
                                        <Panel id="PlayerState" >
                                            {(() => {
                                                if (bIsReady) {
                                                    return <Panel id="PlayerReady" />;
                                                }
                                                return <Label id="PlayerNotReady" localizedText="#PlayerNotReady" />;
                                            })()}
                                        </Panel>
                                        <PlayerCard iPlayerID={iPlayerID} />
                                        {<EndlessRankEmblem id="PlayerEndlessRankEmblem" rank={iRank} />}
                                        {bNewPlayer && <Panel id="NewPlayerMain">
                                            <Label localizedText="#Help_new_player" dialogVariables={{ help_dif: iHelpDiff }} />
                                            <Image />
                                        </Panel>}
                                    </Panel>
                                );
                            }
                        }}
                    </ReactUtils.Repeat>
                </Panel>
                <Panel id="Difficulties" hittest={false}>
                    <Label id="DifficultiesTitle" localizedText="#Select_Difficulties" />
                    <ReactUtils.Repeat iTime={DIFFICULTY_LAST + 1}>
                        {(index) => {
                            let aPlayerIDs: PlayerID[] = [];
                            let selected = false;
                            if (tPlayerGameSelection) {
                                for (const sPlayerID in tPlayerGameSelection) {
                                    const tData = tPlayerGameSelection[sPlayerID];
                                    let iPlayerID = safeNumber(sPlayerID) as PlayerID;
                                    if (tData.difficulty == index) {
                                        aPlayerIDs.push(iPlayerID);
                                        if (iPlayerID == Players.GetLocalPlayer()) {
                                            selected = true;
                                        }
                                    } else if (index == DIFFICULTY_LAST && tData.difficulty == DIFFICULTY_ENDLESS) {
                                        aPlayerIDs.push(iPlayerID);
                                        if (iPlayerID == Players.GetLocalPlayer()) {
                                            selected = true;
                                        }
                                    }
                                }
                            }

                            if (index == DIFFICULTY_LAST) {
                                return <CCGameEndlessDifficulty key={index} selected={selected} enable={maxDiff >= DIFFICULTY_LAST} layers={layers} aPlayerIDs={aPlayerIDs} />;
                            }
                            return <CCGameDifficulty iDifficulty={index} selected={selected} max={maxDiff} key={index} aPlayerIDs={aPlayerIDs} />;
                        }}
                    </ReactUtils.Repeat>
                </Panel>
                <Panel id="ChatContainer" hittest={false}>
                    <CCDOTAChat id="Chat" className="PreGameChat" chatstyle="hudpregame" />
                </Panel>
            </Panel>
        )
    }
}


