import React, { } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { PlayerConfig } from "../../game/system/Player/PlayerConfig";
import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { GameEnum } from "../../libs/GameEnum";
import { CCButton } from "../allCustomUIElement/CCButton/CCButton";
import { CCDividerLine } from "../allCustomUIElement/CCDivider/CCDividerLine";
import { CCIcon_CoinType } from "../allCustomUIElement/CCIcons/CCIcon_CoinType";
import { CCLabel } from "../allCustomUIElement/CCLabel/CCLabel";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCChallengeAbilityIcon } from "./CCChallengeAbilityIcon";

import "./CCChallengeShopPanel.less";

export interface ICCChallengeShopPanel {

}

export class CCChallengeShopPanel extends CCPanel<ICCChallengeShopPanel> {

    onReady() {
        return Boolean(PlayerScene.Local.PlayerDataComp) && CSSHelper.IsReadyUI();
    }

    onInitUI() {
        PlayerScene.Local.PlayerDataComp.RegRef(this);
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
        LogHelper.print("onbtnpop_click")
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

    render() {
        if (!this.__root___isValid) { return <></> }
        const playerdata = this.GetStateEntity(PlayerScene.Local.PlayerDataComp)
        return (
            <Panel id="CC_ChallengeShopPanel" ref={this.__root__}      {...this.initRootAttrs()}>
                <CCPanel id="challenge_imgBg" flowChildren="down" >
                    <CCLabel type="Title" horizontalAlign="center" text={$.Localize("#lang_LevelChallenge")} />
                    <CCDividerLine />
                    <CCPanel flowChildren="right" horizontalAlign="center" marginTop={"10px"}>
                        {["gold", "wood", "equip", "artifact"].map((ability, index) => {
                            let abilityname = "courier_challenge_" + ability;
                            return <CCChallengeAbilityIcon key={ability} abilityname={abilityname} marginLeft="10px" />;
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
                        {/* <CCButton id="challenge_shop" color="Green" type="Tui3" tooltip={"#todo"} onactivate={() => { this.onbtnshop_click() }}>
                            <CCLabel type="UnitName" align="center center" text={$.Localize("#lang_bagshop")} />
                        </CCButton> */}
                    </CCPanel>
                </CCPanel>
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}