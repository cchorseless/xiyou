
import React from "react";
import { ERoundBoard } from "../../game/components/Round/ERoundBoard";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCImageNumber } from "../AllUIElement/CCImageNumber/CCImageNumber";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCTopBarPanel.less";


export class CCTopBarCenter<T extends NodePropsData> extends CCPanel<T> {

    defaultStyle() {
        return {
            horizontalAlign: "center"
        }
    }

    onReady() {
        return Boolean(ERoundBoard.CurRoundBoard);
    }

    onInitUI() {
        this.ListenClassUpdate(ERoundBoard)
        this.UpdateState({ gametime: -1 });
        GTimerHelper.AddTimer(1, GHandler.create(this, () => {
            let round = ERoundBoard.CurRoundBoard;
            let lefttime = -1;
            if (round) {
                lefttime = round.roundLeftTime - Game.GetGameTime();
            }
            this.UpdateState({ gametime: lefttime });
            return 1
        }))
    }

    getDifficultyDes() {
        const difficultydes = GGameScene.GameServiceSystem.getDifficultyChapterDes();
        if (GGameScene.GameServiceSystem.DifficultyLevel > 0) {
            return difficultydes + "[" + GGameScene.GameServiceSystem.DifficultyLevel + "]";
        }
        return difficultydes;
    }

    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_TopBarCenter");
        }
        const round = ERoundBoard.CurRoundBoard;
        const gametime = this.GetState<number>("gametime");
        return (
            <Panel id="CC_TopBarCenter" ref={this.__root__}    {...this.initRootAttrs()} hittest={false}>
                <Image id="RoundBG" >
                    <CCPanel width="100%" flowChildren="right">
                        <Label id="RoundLabel" localizedText="#lang_TopBarRound" dialogVariables={{ round: round?.config.roundIndex + "" || "1" }} />
                        <Label id="RoundState" text={round?.getCurStateDes()} />
                    </CCPanel>
                    <Label id="RoundDifficulty" localizedText="#lang_TopBarDifficulty" dialogVariables={{ difficulty: this.getDifficultyDes() }} />
                </Image>
                <CCImageNumber id="RoundTime" type="9" value={Math.floor(gametime - 3)} />
                {this.props.children}
                {this.__root___childs}
            </Panel >
        )
    }
}


export class CCTopBarGameCoin<T extends NodePropsData> extends CCPanel<T> {

    onReady() {
        return Boolean(GGameScene.Local.PlayerDataComp);
    }

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.PlayerDataComp)

    }
    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_TopBarGameCoin");
        }
        const playerdata = GGameScene.Local.PlayerDataComp;
        const coindes = [
            `${playerdata.population}/${playerdata.populationRoof}`,
            `${playerdata.gold}(+${playerdata.perIntervalGold})`,
            `${playerdata.wood}(+${playerdata.perIntervalWood})`,
            `${playerdata.soulcrystal}(+${playerdata.perIntervalSoulCrystal})`,
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