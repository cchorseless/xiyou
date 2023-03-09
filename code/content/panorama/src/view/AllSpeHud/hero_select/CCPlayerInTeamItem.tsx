import React from "react";
import { GameServiceConfig } from "../../../../../scripts/tscripts/shared/GameServiceConfig";
import { PlayerConfig } from "../../../../../scripts/tscripts/shared/PlayerConfig";
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
        return Boolean(GGameScene.GameServiceSystem)
    }

    onInitUI() {
        GGameScene.GameServiceSystem.RegRef(this);
    }

    defaultStyle() {
        const iPlayerID = this.props.iPlayerID;
        return { borderColor: PlayerConfig.GetPlayerColor(iPlayerID) }
    }

    render() {
        const iPlayerID = this.props.iPlayerID;
        const GamseStateSys = this.GetStateEntity(GGameScene.GameServiceSystem)!;
        const tGameSelection = GamseStateSys.getPlayerGameSelection(iPlayerID);
        const sCourierName = tGameSelection.Courier;
        const tCourierData = KVHelper.KVData().courier_units[sCourierName];
        const tPlayerTitle = tGameSelection.Title;
        const iDifficulty = tGameSelection.Difficulty.MaxChapter;
        return (
            <Panel className={CSSHelper.ClassMaker("CCPlayerInTeamItem", `Difficulty${iDifficulty}`, `Courier${tCourierData.Rarity || "R"}`)}
                ref={this.__root__} hittest={false} {...this.initRootAttrs()}  >
                {tPlayerTitle != null && tPlayerTitle.length > 0 && <CCOverheadTitle id="PlayerTitleUse" sCourierTitleID={tPlayerTitle} />}
                {tCourierData && <>
                    <Panel id="PlayerCourierRarity" hittest={false} />
                    <Panel id="PlayerCourierScene" hittest={false} >
                        <GenericPanel type="DOTAUIEconSetPreview" key={sCourierName} itemdef={tCourierData?.ItemDef || 0} itemstyle={tCourierData?.ItemStyle || 0} displaymode="loadout_small" drawbackground={true} antialias={true} allowrotation={true} />
                    </Panel>
                    <Label id="PlayerCourierName" text={$.Localize("#" + sCourierName as string)} hittest={false} />
                    {tCourierData.Ability1 && <DOTAAbilityImage id="PlayerCourierAbility" abilityname={tCourierData.Ability1} showtooltip={true} />}
                </>}
                <Panel id="PlayerDifficulty" hittest={false} >
                    {
                        (iDifficulty == GameServiceConfig.EDifficultyChapter.endless) ?
                            <Label id="PlayerDifficultyEndless" localizedText="#lang_Difficult_999" /> :
                            <Panel id="PlayerDifficultyNum" />
                    }
                </Panel>
                <Panel id="PlayerState" >
                    {
                        tGameSelection.IsReady ?
                            <Panel id="PlayerReady" /> :
                            <Label id="PlayerNotReady" localizedText="#lang_PlayerNotReady" />
                    }
                </Panel>
                <CCPlayerCard iPlayerID={iPlayerID} />
                <CCRankEmblem id="PlayerEndlessRankEmblem" rank={tGameSelection.EndlessRank} />
                {tGameSelection.bNewPlayer &&
                    <Panel id="NewPlayerMain">
                        <Label id="NewPlayer_lbl" localizedText="#lang_Help_new_player" />
                        <Image id="NewPlayer_Img" />
                    </Panel>}
            </Panel>
        );
    }
}
`




`