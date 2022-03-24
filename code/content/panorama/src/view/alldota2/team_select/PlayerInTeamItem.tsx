/** Create By Editor*/
import React, { createRef, useState } from "react";
import { PlayerInTeamItem_UI } from "./PlayerInTeamItem_UI";
export class PlayerInTeamItem extends PlayerInTeamItem_UI {
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
	/**
	 *更新渲染
	 * @param prevProps 上一个状态的 props
	 * @param prevState
	 * @param snapshot
	 */
	componentDidUpdate(prevProps: any, prevState: any, snapshot?: any) {
		super.componentDidUpdate(prevProps, prevState, snapshot);
	};
	// 销毁
	componentWillUnmount() {
		super.componentWillUnmount();
	};
}
