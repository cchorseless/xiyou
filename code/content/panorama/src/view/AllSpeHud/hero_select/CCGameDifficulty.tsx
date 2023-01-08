import React, { createRef } from "react";
import { GameServiceConfig } from "../../../../../scripts/tscripts/shared/GameServiceConfig";
import { CSSHelper } from "../../../helper/CSSHelper";
import { FuncHelper } from "../../../helper/FuncHelper";
import { CCButton } from "../../AllUIElement/CCButton/CCButton";
import { CCPanel } from "../../AllUIElement/CCPanel/CCPanel";
import "./CCGameDifficulty.less";


interface ICCGameDifficulty {
    iDifficulty: number, max: number, selected: boolean, aPlayerIDs?: PlayerID[], forceEnable?: boolean
}
export class CCGameDifficulty extends CCPanel<ICCGameDifficulty, RadioButton> {

    defaultClass() {
        const iDifficulty = this.props.iDifficulty;
        return CSSHelper.ClassMaker("CC_GameDifficulty", "Difficulty_" + iDifficulty)
    }

    render() {
        const iDifficulty = this.props.iDifficulty;
        const max = this.props.max;
        const selected = this.props.selected;
        const aPlayerIDs = this.props.aPlayerIDs || [];
        const forceEnable = this.props.forceEnable;
        return (
            <RadioButton selected={selected}
                enabled={forceEnable || iDifficulty <= max}
                group="DifficultySelected"
                onactivate={p => GGameScene.GameServiceSystem.SelectDifficultyChapter(iDifficulty)}
                onmouseover={p => { $.DispatchEvent("DOTAShowTextTooltip", p, $.Localize("#Difficult_" + iDifficulty + "_Description")); }}
                onmouseout={p => { $.DispatchEvent("DOTAHideTextTooltip", p); }}
                ref={this.__root__}      {...this.initRootAttrs()}
            >
                {/* <Label localizedText={"#Difficult_" + iDifficulty} /> */}
                < Panel id="DifficultyNumMain" hittest={false} >
                    <Image id="DifficultyHover" />
                    <Label id="DifficultyLabel" key={iDifficulty} localizedText={"#Difficult_" + iDifficulty} />
                    {/* <Image id="DifficultyNum" /> */}
                </Panel >
                <Image id="Lock" />
                <Panel className="DifficultyPlayers" hittest={false}>
                    {aPlayerIDs.map(iPlayerID => {
                        let PlayerInfo = Game.GetPlayerInfo(iPlayerID);
                        return (
                            <DOTAAvatarImage key={iPlayerID} style={{ width: "32px", height: "32px", borderRadius: "16px" }} steamid={PlayerInfo?.player_steamid} />
                        );
                    })}
                </Panel>
            </RadioButton >
        )
    }

}



interface IEndlessDifficulty {
    enable: boolean, layers: number, selected: boolean, aPlayerIDs?: PlayerID[]
}
export class CCGameEndlessDifficulty extends CCPanel<IEndlessDifficulty, RadioButton> {


    refText = createRef<TextEntry>()
    iOldOffset: number | null;
    sLastText: string;


    onTextChange(pSelf: TextEntry) {
        if (!this.iOldOffset) {
            let iNumber = 1;
            if (pSelf.text != "") {
                let sOld = pSelf.text;
                if (isFinite(Number(sOld))) {
                    iNumber = FuncHelper.Clamp(Number(sOld), 1, GameServiceConfig.iMaxEndless);
                } else {
                    iNumber = Number(this.sLastText == "" ? "1" : this.sLastText);
                }
                let sNew = String(iNumber);
                GGameScene.GameServiceSystem.SelectDifficultyEndlessLevel(iNumber)
                if (sOld != sNew) {
                    this.iOldOffset = pSelf.GetCursorOffset();
                    pSelf.text = sNew;
                    this.iOldOffset = null;
                }
            }
            else {
                GGameScene.GameServiceSystem.SelectDifficultyEndlessLevel(iNumber)
            }
            this.UpdateState({ pDecreaseButton: (iNumber > 1) })
            this.UpdateState({ pIncreaseButton: iNumber < GameServiceConfig.iMaxEndless })
        }
        this.sLastText = pSelf.text;
    }

    render() {
        const enable = this.props.enable;
        const pDecreaseButton = this.GetState<boolean>("pDecreaseButton", enable);
        const pIncreaseButton = this.GetState<boolean>("pIncreaseButton", enable);
        const layers = this.props.layers;
        const selected = this.props.selected;
        const aPlayerIDs = this.props.aPlayerIDs || [];
        return (
            <RadioButton id="CC_GameEndlessDifficulty"
                group="DifficultySelected"
                enabled={enable}
                selected={selected}
                onactivate={p => {
                    let iNumber = Number(this.refText.current?.text) || 0;
                    if (iNumber > GameServiceConfig.iMaxEndless) {
                        iNumber = GameServiceConfig.iMaxEndless;
                    }
                    GGameScene.GameServiceSystem.SelectDifficultyEndlessLevel(iNumber)
                }}
                onmouseover={p => $.DispatchEvent("DOTAShowTextTooltip", p, $.Localize("#Difficult_" + 999 + "_Description"))}
                onmouseout={p => $.DispatchEvent("DOTAHideTextTooltip", p)}
                ref={this.__root__}  {...this.initRootAttrs()}
            >
                <Panel className="DifficultyPlayers" hittest={false}>
                    {aPlayerIDs.map(iPlayerID => {
                        let PlayerInfo = Game.GetPlayerInfo(iPlayerID);
                        return (
                            <DOTAAvatarImage key={iPlayerID} style={{ width: "32px", height: "32px", borderRadius: "16px" }} steamid={PlayerInfo?.player_steamid} />
                        );
                    })}
                </Panel>
                <Image id="Lock" />
                <Label id="endlessName" localizedText="#Difficult_999" />
                <Panel id="TextEntryAndButtons" hittest={false}>
                    <TextEntry id="OperatorEndlessTextEntry" enabled={enable} textmode="numeric" multiline={false} placeholder="1" ref={this.refText} text={layers + ""}
                        ontextentrychange={(pSelf) => { this.onTextChange(pSelf) }} />
                    <Panel id="Buttons" hittest={false}>
                        <CCButton id="OperatorEndlessDecreaseButton" enabled={pDecreaseButton}
                            onactivate={() => {
                                let p = this.refText.current;
                                if (p) {
                                    p.text = String((Number(p.text) || 1) - 1);
                                }
                            }} />
                        <CCButton id="OperatorEndlessIncreaseButton" enabled={pIncreaseButton}
                            onactivate={() => {
                                let p = this.refText.current;
                                if (p) {
                                    p.text = String((Number(p.text) || 1) + 1);
                                }
                            }} />
                    </Panel>
                </Panel>
            </RadioButton>
        )
    }

}