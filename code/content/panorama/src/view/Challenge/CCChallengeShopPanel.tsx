import React from "react";
import { PlayerConfig } from "../../../../scripts/tscripts/shared/PlayerConfig";
import { CSSHelper } from "../../helper/CSSHelper";
import { NetHelper } from "../../helper/NetHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCDividerLine } from "../AllUIElement/CCDivider/CCDividerLine";
import { CCIcon_CoinType } from "../AllUIElement/CCIcons/CCIcon_CoinType";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCDrawCardPanel } from "../Draw/CCDrawCardPanel";
import { CCChallengeAbilityIcon } from "./CCChallengeAbilityIcon";

import { CCPublicShopBagPanel } from "../PublicShopBag/CCPublicShopBagPanel";
import "./CCChallengeShopPanel.less";

export interface ICCChallengeShopPanel {

}

export class CCChallengeShopPanel extends CCPanel<ICCChallengeShopPanel> {

    onReady() {
        return Boolean(GGameScene.Local.PlayerDataComp) && CSSHelper.IsReadyUI();
    }

    onInitUI() {
        GGameScene.Local.PlayerDataComp.RegRef(this);
        // GTimerHelper.AddTimer(1, GHandler.create(this, () => {
        //     this.__root__.current!.AddClass("Show")
        // }))

    }
    onbtnpop_click() {
        let playerdata = GGameScene.Local.PlayerDataComp;
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
        let playerdata = GGameScene.Local.PlayerDataComp;
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


    onbtnshop_click() {
        let shopbag = CCPublicShopBagPanel.GetInstance();
        if (shopbag != null) {
            shopbag.showSelf(!shopbag.isShowSelf());
        }
    }
    onbtndraw_click() {
        let draw = CCDrawCardPanel.GetInstance();
        if (draw != null) {
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
        const playerdata = this.GetStateEntity(GGameScene.Local.PlayerDataComp);
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