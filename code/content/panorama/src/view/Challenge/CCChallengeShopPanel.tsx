import React, { } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { CSSHelper } from "../../helper/CSSHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { GameEnum } from "../../../../../game/scripts/tscripts/shared/GameEnum";
import { CCButton } from "../allCustomUIElement/CCButton/CCButton";
import { CCDividerLine } from "../allCustomUIElement/CCDivider/CCDividerLine";
import { CCIcon_CoinType } from "../allCustomUIElement/CCIcons/CCIcon_CoinType";
import { CCLabel } from "../allCustomUIElement/CCLabel/CCLabel";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCChallengeAbilityIcon } from "./CCChallengeAbilityIcon";
import { PlayerConfig } from "../../../../../game/scripts/tscripts/shared/PlayerConfig";
import { CCDrawCardPanel } from "../Draw/CCDrawCardPanel";

import "./CCChallengeShopPanel.less";

export interface ICCChallengeShopPanel {

}

export class CCChallengeShopPanel extends CCPanel<ICCChallengeShopPanel> {

    onReady() {
        return Boolean(PlayerScene.Local.PlayerDataComp) && CSSHelper.IsReadyUI();
    }

    onInitUI() {
        PlayerScene.Local.PlayerDataComp.RegRef(this);
        // TimerHelper.AddTimer(1, FuncHelper.Handler.create(this, () => {
        //     this.__root__.current!.AddClass("Show")
        // }))

    }
    onbtnpop_click() {
        let playerdata = PlayerScene.Local.PlayerDataComp;
        if (playerdata.popuLevel >= playerdata.popuLevelMax) {
            TipsHelper.showErrorMessage("max level");
            return;
        }
        if (playerdata.gold < playerdata.popuLevelUpCostGold) {
            TipsHelper.showErrorMessage("gold is not enough");
            return;
        }
        if (playerdata.wood < playerdata.popuLevelUpCostWood) {
            TipsHelper.showErrorMessage("wood is not enough");
            return;
        }
        NetHelper.SendToLua(PlayerConfig.EProtocol.reqApplyPopuLevelUp);
    };
    onbtntec_click() {
        let playerdata = PlayerScene.Local.PlayerDataComp;
        if (playerdata.techLevel >= playerdata.techLevelMax) {
            TipsHelper.showErrorMessage("max level");
            return;
        }
        if (playerdata.gold < playerdata.techLevelUpCostGold) {
            TipsHelper.showErrorMessage("gold is not enough");
            return;
        }
        NetHelper.SendToLua(PlayerConfig.EProtocol.reqApplyTechLevelUp);
    };


    onbtnshop_click() { }
    onbtndraw_click() {
        let draw = CCDrawCardPanel.GetInstance();
        if (draw != null) {
            LogHelper.print(draw.IsHide())
            if (draw.IsHide()) {
                draw.show();
            }
            else {
                draw.hide();
            }
        }
    }
    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_ChallengeShopPanel");
        }
        const playerdata = this.GetStateEntity(PlayerScene.Local.PlayerDataComp);
        return (
            <Panel id="CC_ChallengeShopPanel" ref={this.__root__}      {...this.initRootAttrs()}>
                <CCPanel id="challenge_imgBg" flowChildren="down" >
                    <CCLabel type="Title" horizontalAlign="center" text={$.Localize("#lang_LevelChallenge")} />
                    <CCPanel flowChildren="right" horizontalAlign="center" marginTop={"10px"}>
                        {["gold", "wood", "equip", "artifact"].map((ability, index) => {
                            let abilityname = "courier_challenge_" + ability;
                            return <CCChallengeAbilityIcon key={ability} abilityname={abilityname} />;
                        })}
                    </CCPanel>
                    <CCDividerLine />
                    <CCPanel flowChildren="right" horizontalAlign="center">
                        <CCPanel id="challenge_popuUp" flowChildren="down">
                            <CCButton color="Green" type="Tui3" tooltip={"#todo"} onactivate={() => { this.onbtnpop_click() }}>
                                <CCLabel type="UnitName" align="center center" text={$.Localize("#lang_population") + ' Lv.' + `${playerdata?.popuLevel}/${playerdata?.popuLevelMax}`} />
                            </CCButton>
                            <CCPanel flowChildren="right" horizontalAlign="center">
                                <CCIcon_CoinType cointype={"Gold"} width="20px" height="20px" />
                                <CCLabel type="Gold" text={playerdata?.popuLevelUpCostGold} fontSize="18px" />
                                <CCIcon_CoinType cointype={"Wood"} width="20px" height="20px" />
                                <CCLabel type="Gold" text={playerdata?.popuLevelUpCostWood} fontSize="18px" />
                            </CCPanel>

                        </CCPanel>
                        <CCPanel id="challenge_tectUp" flowChildren="down">
                            <CCButton color="Green" type="Tui3" tooltip={"#todo"} onactivate={() => { this.onbtntec_click() }}>
                                <CCLabel type="UnitName" align="center center" text={$.Localize("#lang_tech") + ' Lv.' + `${playerdata?.techLevel}/${playerdata?.techLevelMax}`} />
                            </CCButton>
                            <CCPanel flowChildren="right" horizontalAlign="center">
                                <CCIcon_CoinType cointype={"Gold"} />
                                <CCLabel type="Gold" text={playerdata?.techLevelUpCostGold} />
                            </CCPanel>
                        </CCPanel>
                    </CCPanel>
                    <CCDividerLine />
                    <CCPanel flowChildren="right" horizontalAlign="center">
                        <CCButton id="challenge_draw" color="Purple" type="Tui3" tooltip={"#todo"} onactivate={() => { this.onbtndraw_click() }}>
                            <CCLabel type="UnitName" align="center center" text={$.Localize("#lang_draw")} />
                        </CCButton>
                        <CCButton id="challenge_shop" color="Gold" type="Tui3" tooltip={"#todo"} onactivate={() => { this.onbtnshop_click() }}>
                            <CCLabel type="UnitName" align="center center" text={$.Localize("#lang_bagshop")} />
                        </CCButton>
                    </CCPanel>
                </CCPanel>
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}