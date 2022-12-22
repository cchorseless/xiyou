
import React, { createRef } from "react";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { ERoundBoard } from "../../game/components/Round/ERoundBoard";
import { PlayerDataComponent } from "../../game/components/Player/PlayerDataComponent";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { CCImageNumber } from "../AllUIElement/CCImageNumber/CCImageNumber";
import "./CCTopBarPanel.less";
import { CSSHelper } from "../../helper/CSSHelper";


export class CCTopBarCenter<T extends NodePropsData> extends CCPanel<T> {

    defaultStyle() {
        return {
            horizontalAlign: "center"
        }
    }

    onReady() {
        return Boolean(PlayerScene.Local.PlayerDataComp && PlayerScene.Local.RoundManagerComp?.getCurrentBoardRound());
    }

    onInitUI() {
        PlayerScene.Local.PlayerDataComp.RegRef(this);
        PlayerScene.Local.RoundManagerComp.RegRef(this);
        PlayerScene.Local.RoundManagerComp!.getCurrentBoardRound().RegRef(this);
        this.useEffectState(() => {
            let curround = PlayerScene.Local.RoundManagerComp!.getCurrentBoardRound();
            if (!this.hasState(curround.InstanceId)) {
                curround.RegRef(this);
            }
        }, PlayerScene.Local.RoundManagerComp.InstanceId)
        this.UpdateState({ gametime: -1 });
        TimerHelper.AddIntervalTimer(1, 1,
            FuncHelper.Handler.create(this, () => {
                let round = PlayerScene.Local.RoundManagerComp!.getCurrentBoardRound();
                let lefttime = -1;
                if (round) {
                    lefttime = round.roundLeftTime - Game.GetGameTime();
                }
                this.UpdateState({ gametime: lefttime });
            }), -1, false)
    }

    getDifficultyDes() {
        const difficultydes = PlayerScene.GameStateSystem.getDifficultyChapterDes();
        if (PlayerScene.GameStateSystem.DifficultyLevel > 0) {
            return difficultydes + "[" + PlayerScene.GameStateSystem.DifficultyLevel + "]";
        }
        return difficultydes;
    }

    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_TopBarCenter");
        }
        const playerdata = this.GetStateEntity(PlayerScene.Local.PlayerDataComp)!;
        const round = this.GetStateEntity(PlayerScene.Local.RoundManagerComp.getCurrentBoardRound())!;
        const gametime = this.GetState<number>("gametime");
        return (
            <Panel id="CC_TopBarCenter" ref={this.__root__}    {...this.initRootAttrs()} hittest={false}>
                <Image id="RoundBG" >
                    <CCPanel width="100%" flowChildren="right">
                        <Label id="RoundLabel" localizedText="#lang_TopBarRound" dialogVariables={{ round: round?.config.round_show || "1" }} />
                        <Label id="RoundState" text={round?.getCurStateDes()} />
                    </CCPanel>
                    <Label id="RoundDifficulty" localizedText="#lang_TopBarDifficulty" dialogVariables={{ difficulty: this.getDifficultyDes() }} />
                </Image>
                <CCImageNumber id="RoundTime" type="4" value={Math.floor(gametime)} />
                {this.props.children}
                {this.__root___childs}
            </Panel >
        )
    }
}


export class CCTopBarGameCoin<T extends NodePropsData> extends CCPanel<T> {

    onReady() {
        return Boolean(PlayerScene.Local.PlayerDataComp);
    }

    onInitUI() {
        PlayerScene.Local.PlayerDataComp.RegRef(this);

    }
    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_TopBarGameCoin");
        }
        const playerdata = this.GetStateEntity<PlayerDataComponent>(PlayerScene.Local.PlayerDataComp)!;
        const coindes = [
            `${playerdata.population}/${playerdata.populationRoof}`,
            `${playerdata.gold}(+${playerdata.perIntervalGold})`,
            `${playerdata.soulcrystal}(+${playerdata.perIntervalWood})`,
            `${playerdata.wood}(+${playerdata.perIntervalWood})`
        ];
        return (
            <Panel ref={this.__root__} id="CC_TopBarGameCoin"    {...this.initRootAttrs()} hittest={false}>
                <CCPanel id="TopBarGameCoinBg" flowChildren="right" />
                <CCPanel id="TopBarGameCoinGroup" flowChildren="right">
                    {
                        ["population", "gold", "wood", "soulcrystal"].map((nodename, index) => {
                            return (<CCPanel key={nodename} className="CoinGroup" flowChildren="right"  >
                                <Image className={CSSHelper.ClassMaker("imgIcon", nodename)} />
                                <CCPanel flowChildren="down">
                                    <Label className="CoinName" localizedText={"#lang_" + nodename} />
                                    <Label className="CoinCount" text={coindes[index]} />
                                </CCPanel>
                            </CCPanel>)
                        })
                    }
                </CCPanel>
                {this.props.children}
                {this.__root___childs}
            </Panel >
        )
    }
}