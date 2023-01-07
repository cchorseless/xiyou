import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";

import { CCAvatar } from "../AllUIElement/CCAvatar/CCAvatar";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCPlayerCard.less";

interface ICCPlayerCard extends NodePropsData {
    iPlayerID: PlayerID;
}

export class CCPlayerCard extends CCPanel<ICCPlayerCard> {


    onInitUI() {
        const iplayerID = this.props.iPlayerID;
        GTActivityMemberShipData.GetOneInstance(iplayerID).RegRef(this);
    }

    render() {
        const iplayerID = this.props.iPlayerID;
        const MemberData = this.GetStateEntity(GTActivityMemberShipData.GetOneInstance(iplayerID));
        const isPlus = MemberData?.IsVip();
        const isPlus_p = MemberData?.IsVipForever();
        const playerinfo = Game.GetPlayerInfo(iplayerID)
        return <Panel className={CSSHelper.ClassMaker("CCPlayerCard", { Plus: isPlus && !isPlus_p, PlusPlus: isPlus_p })} hittest={false}>
            <Panel id="PlusBG" hittest={false}>
                <AnimatedImageStrip id="PlusBG1" animating={true} frametime="0.06666667s"
                    src="file://{images}/custom_game/player_info/plus_bg_1.png"
                />
                <AnimatedImageStrip id="PlusBG2" animating={true} frametime="0.06666667s"
                    src="file://{images}/custom_game/player_info/plus_bg_2.png"
                />
            </Panel>
            <Panel id="PlusPlusBG" hittest={false}>
                <AnimatedImageStrip id="PlusBG3" frametime="0.0625s"
                    src="file://{images}/custom_game/player_info/plus_bg_3.png"
                />
                <AnimatedImageStrip id="PlusBG4" animating={true} frametime="0.06666667s"
                    src="file://{images}/custom_game/player_info/plus_bg_4.png"
                />
            </Panel>
            <CCAvatar id="PlayerAvatar" width="48px" height="48px" steamid={playerinfo.player_steamid} />
            <Label id="PlayerName" text={playerinfo.player_name} hittest={false} />
            {this.props.children}
            {/* TODO:玩家天梯勋章 */}
        </Panel>;
    }

}