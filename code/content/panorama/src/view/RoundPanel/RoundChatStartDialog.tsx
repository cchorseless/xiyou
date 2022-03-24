/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { GameEnum } from "../../libs/GameEnum";
import { TeamShenFenItemV1 } from "../TeamPanel/TeamShenFenItemV1";
import { RoundChatStartDialog_UI } from "./RoundChatStartDialog_UI";
export class RoundChatStartDialog extends RoundChatStartDialog_UI {
	static IsReadyForRender() { return !!System_Avalon.Sys_GetData.GetCurrentTeamInfo() }
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		let playerCount = Players.GetMaxTeamPlayers();
		let playid = Game.GetLocalPlayerID();
		for (let i = 0; i < playerCount; i++) {
			if (!Players.IsValidPlayerID(i as PlayerID)) { continue; }
			let nodename = (this.NODENAME as any)['panel_' + i];
			let node = (this as any)['panel_' + i] as React.RefObject<Panel>;
			if (nodename == null || node == null) { continue; }
			// 隐藏背景图片
			node.current!.style.backgroundImage = null;
			this.addNodeChildAt(nodename, TeamShenFenItemV1,
				{
					playerID: i,
					canSelect: true,
					hasSelected: playid === i,
					inTeam: System_Avalon.Sys_GetData.CheckPlayerInTeam(i),
				}
			)
		}
		this.selectChild(playid);
		this.onbtn_changeTurn()
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
	selectPlayerid: PlayerID = -1;
	/**选择节点 */
	selectChild(playerID: number) {
		this.selectPlayerid = playerID as PlayerID;
		let playerCount = Players.GetMaxTeamPlayers();
		for (let i = 0; i < playerCount; i++) {
			if (!Players.IsValidPlayerID(i as PlayerID)) { continue; }
			let nodename = (this.NODENAME as any)['panel_' + i];
			let node = (this as any)['panel_' + i] as React.RefObject<Panel>;
			if (nodename == null || node == null) { continue; }
			// 隐藏背景图片
			let allc = this.GetOneNodeChild(nodename, TeamShenFenItemV1)
			if (allc && allc.hasSelect != (playerID == i)) {
				allc.setSelect(playerID == i)
			}
		}
		this.lbl_playerid.current!.text = '首位发言玩家:' + (playerID + 1) + '号';
		this.updateSelf()
	}
	chatTurn: boolean = true;
	/**更改发言顺序 */
	onbtn_changeTurn = () => {
		this.chatTurn = !this.chatTurn;
		this.lbl_shunxu.current!.text = '当前发言顺序:' + (this.chatTurn ? '正序' : "倒序");
		this.updateSelf()
	}
	/**提交信息 */
	onbtn_makeTeam = () => {
		if (this.selectPlayerid != -1) {
			NetHelper.SendToLua(GameEnum.CustomProtocol.req_send_to_sure_chat_turn,
				{
					chatTurn: this.chatTurn,
					nowPlayerID: this.selectPlayerid,
				},
				() => {
					this.destroy()
				}, this)
		}
	}
}
