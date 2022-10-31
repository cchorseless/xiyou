/** Create By Editor*/
import React, { createRef, useState } from "react";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { PlayerInTeamItem_UI } from "./PlayerInTeamItem_UI";

interface IProps extends NodePropsData {
	playerID: PlayerID;
}

export class PlayerInTeamItem extends PlayerInTeamItem_UI<IProps> {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		let playerID = this.props.playerID
		// 头像
		let playinfo = Game.GetPlayerInfo(playerID)
		this.playerIcon.current!.steamid = playinfo.player_steamid;
		// 玩家名字
		this.lbl_playerName.current!.text = Players.GetPlayerName(playerID);
	};


}
