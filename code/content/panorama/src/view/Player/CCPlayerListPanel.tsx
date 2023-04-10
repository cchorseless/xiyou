import React from "react";

import { CCAvatar } from "../AllUIElement/CCAvatar/CCAvatar";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCIcon } from "../AllUIElement/CCIcons/CCIcon";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCProgressBar } from "../AllUIElement/CCProgressBar/CCProgressBar";
import { CCUserName } from "../AllUIElement/CCUserName/CCUserName";
import { CCPlayerInfoDialog } from "./CCPlayerInfoDialog";
import "./CCPlayerListPanel.less";

interface ICCPlayerListPanel extends NodePropsData {

}

export class CCPlayerListPanel extends CCPanel<ICCPlayerListPanel> {

    onReady() {
        let r = true;
        GPlayerEntityRoot.GetAllInstance().forEach(player => {
            if (player.CourierComp == null) { r = false }
        })
        return r;
    }


    onInitUI() {
        GPlayerEntityRoot.GetAllInstance().forEach(player => {
            this.ListenUpdate(player.CourierComp);
        })
    }

    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_PlayerInfoContainer");
        }
        const CourierDataComps = GPlayerEntityRoot.GetAllInstance().map((player) => {
            return (player.CourierComp);
        })
        return (
            <Panel ref={this.__root__} id="CC_PlayerInfoContainer" hittest={false} {...this.initRootAttrs()}>
                {CourierDataComps.map((CourierData) => {
                    if (!CourierData) { return }
                    const playerID = CourierData.BelongPlayerid;
                    return (
                        <CCButton key={playerID + ""}
                            type="Empty"
                            enabled={CourierData.health > 0}
                            className="PlayerInfo"
                            onactivate={self => { }}
                            dialogTooltip={{ cls: CCPlayerInfoDialog, props: { Playerid: playerID }, posRight: true }}>
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
                        </CCButton>
                    );
                })}
            </Panel>
        )
    }
}