import React, { createRef, useState } from "react";
import { GameStateConfig } from "../../../../../../game/scripts/tscripts/shared/GameStateConfig";
import { PlayerScene } from "../../../game/components/Player/PlayerScene";
import { CSSHelper } from "../../../helper/CSSHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { CCPanel } from "../../AllUIElement/CCPanel/CCPanel";
import { CCOverheadTitle } from "../../OverHead/CCOverheadTitle";
import { CCPlayerCard } from "../../Player/CCPlayerCard";
import { CCRankEmblem } from "../../Rank/CCRankEmblem";
import "./CCPlayerInTeamItem.less";

interface ICCPlayerInTeamItem {
    iPlayerID: PlayerID
}
export class CCPlayerInTeamItem extends CCPanel<ICCPlayerInTeamItem> {

    onReady() {
        return Boolean(PlayerScene.GameStateSystem)
    }

    onInitUI() {
        PlayerScene.GameStateSystem.RegRef(this);
    }

    defaultStyle() {
        const iPlayerID = this.props.iPlayerID;
        return { borderColor: CSSHelper.GetPlayerColor(iPlayerID) }
    }

    render() {
        const iPlayerID = this.props.iPlayerID;
        const GamseStateSys = this.GetStateEntity(PlayerScene.GameStateSystem)!;
        const tPlayerGameSelection = GamseStateSys.tPlayerGameSelection!;
        const tGameSelection = tPlayerGameSelection[iPlayerID + ""];
        const sCourierName = tGameSelection.Courier;
        const tCourierData = KVHelper.KVData().CourierUnits[sCourierName];
        const tPlayerTitle = tGameSelection.Title;
        const iDifficulty = tGameSelection.Difficulty.MaxChapter;

        return (
            <Panel className={CSSHelper.ClassMaker("CCPlayerInTeamItem", `Difficulty${iDifficulty}`, `Courier${tCourierData?.Rarity ?? "R"}`)}
                ref={this.__root__} hittest={false} {...this.initRootAttrs()}  >
                {tPlayerTitle != undefined && <CCOverheadTitle id="PlayerTitleUse" sCourierTitleID={tPlayerTitle} />}
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
                        if (iDifficulty == GameStateConfig.EDifficultyChapter.endless) {
                            return <Label id="PlayerDifficultyEndless" localizedText="#Difficult_999" />;
                        }
                        return <Panel id="PlayerDifficultyNum" />;
                    })()}
                </Panel>
                <Panel id="PlayerState" >
                    {(() => {
                        if (tGameSelection.IsReady) {
                            return <Panel id="PlayerReady" />;
                        }
                        return <Label id="PlayerNotReady" localizedText="#PlayerNotReady" />;
                    })()}
                </Panel>
                <CCPlayerCard iPlayerID={iPlayerID} />
                <CCRankEmblem id="PlayerEndlessRankEmblem" rank={tGameSelection.EndlessRank} />
                {tGameSelection.bNewPlayer && <Panel id="NewPlayerMain">
                    <Label localizedText="#Help_new_player" />
                    <Image />
                </Panel>}
            </Panel>
        );
    }
}