import React from "react";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCAvatar } from "../allCustomUIElement/CCAvatar/CCAvatar";
import { CCBaseButton } from "../allCustomUIElement/CCButton/CCButton";
import { CCIcon } from "../allCustomUIElement/CCIcons/CCIcon";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCProgressBar } from "../allCustomUIElement/CCProgressBar/CCProgressBar";
import { CCUserName } from "../allCustomUIElement/CCUserName/CCUserName";
import "./CCPlayerListPanel";

interface ICCPlayerListPanel extends NodePropsData {

}

export class CCPlayerListPanel extends CCPanel<ICCPlayerListPanel> {
    onInitUI() {
    }

    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="PlayerInfoContainer" hittest={false} {...this.initRootAttrs()}>
                {[0, 1, 2, 3, 4].map((playerID) => {
                    const playerInfo = playerData[playerID];
                    return (
                        <CCBaseButton key={playerID + ""} enabled={playerInfo.health > 0} className="PlayerInfo" onactivate={self => { }} customTooltip={{ name: "player_info", playerID: playerID }}>
                            <CCAvatar id="playerAvatar" width="48px" height="48px" accountid={playerInfo.steamID.toString()} />
                            {playerInfo.steamID == "0" &&
                                <Image id="playerAvatar" style={{ width: "48px", height: "48px" }} src="s2r://panorama/images/bot_icon_unfair_png.vtex" />
                            }
                            <CCPanel id="PlayerInfoRight">
                                <CCPanel flowChildren="right">
                                    <Label id="PlayerDamage" text={playerInfo.damage} />
                                    <CCIcon width="18px" src="file://{images}/custom_game/hud/damage_icon.png" />
                                </CCPanel>
                                {playerInfo.steamID == "0" &&
                                    <Label id="PlayerName" text={Players.GetPlayerName(Number(playerID) as PlayerID)} />
                                }
                                {playerInfo.steamID != "0" &&
                                    <CCUserName id="PlayerName" accountid={playerInfo.steamID.toString()} />
                                }
                                <CCProgressBar min={0} value={playerInfo.health} max={playerInfo.maxHealth} >
                                    <Label id="PlayerHealthLabel" text={playerInfo.health + " / " + playerInfo.maxHealth} />
                                </CCProgressBar>
                            </CCPanel>
                        </CCBaseButton>
                    );
                })
                }
            </Panel>
        )
    }
}