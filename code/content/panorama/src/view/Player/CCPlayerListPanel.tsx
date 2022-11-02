import React from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { LogHelper } from "../../helper/LogHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCAvatar } from "../allCustomUIElement/CCAvatar/CCAvatar";
import { CCBaseButton } from "../allCustomUIElement/CCButton/CCButton";
import { CCIcon } from "../allCustomUIElement/CCIcons/CCIcon";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCProgressBar } from "../allCustomUIElement/CCProgressBar/CCProgressBar";
import { CCUserName } from "../allCustomUIElement/CCUserName/CCUserName";
import "./CCPlayerListPanel.less";

interface ICCPlayerListPanel extends NodePropsData {

}

export class CCPlayerListPanel extends CCPanel<ICCPlayerListPanel> {
    onInitUI() {
        PlayerScene.EntityRootManage.getAllPlayer().forEach(player => {
            player.CourierDataComp?.RegRef(this);
        })
    }

    render() {
        const CourierDataComps = PlayerScene.EntityRootManage.getAllPlayer().map((player) => {
            return this.GetStateEntity(player.CourierDataComp);
        })
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="PlayerInfoContainer" hittest={false} {...this.initRootAttrs()}>
                {CourierDataComps.map((CourierData) => {
                    if (!CourierData) { return }
                    const playerID = CourierData.BelongPlayerid;
                    return (
                        <CCBaseButton key={playerID + ""} enabled={CourierData.health > 0} className="PlayerInfo" onactivate={self => { }} >
                            <CCAvatar id="playerAvatar" width="48px" height="48px" accountid={CourierData.steamID} />
                            {!CourierData.IsValidSteamID() &&
                                <Image id="playerAvatar" style={{ width: "48px", height: "48px" }} src="s2r://panorama/images/bot_icon_unfair_png.vtex" />
                            }
                            <CCPanel id="PlayerInfoRight">
                                <CCPanel flowChildren="right">
                                    <Label id="PlayerDamage" text={CourierData.damage} />
                                    <CCIcon width="18px" src="file://{images}/custom_game/hud/damage_icon.png" />
                                </CCPanel>
                                {!CourierData.IsValidSteamID() &&
                                    <Label id="PlayerName" text={Players.GetPlayerName(Number(playerID) as PlayerID)} />
                                }
                                {CourierData.IsValidSteamID() &&
                                    <CCUserName id="PlayerName" accountid={CourierData.steamID} />
                                }
                                <CCProgressBar min={0} value={CourierData.health} max={CourierData.maxHealth} >
                                    <Label id="PlayerHealthLabel" text={CourierData.health + " / " + CourierData.maxHealth} />
                                </CCProgressBar>
                            </CCPanel>
                        </CCBaseButton>
                    );
                })}
            </Panel>
        )
    }
}