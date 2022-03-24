/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { GameEnum } from "../../libs/GameEnum";
import { TeamShenFenItemV1 } from "../TeamPanel/TeamShenFenItemV1";
import { RoundChatProgressDialog_UI } from "./RoundChatProgressDialog_UI";
export class RoundChatProgressDialog extends RoundChatProgressDialog_UI {
	static IsReadyForRender() { return !!System_Avalon.Sys_GetData.GetCurrentTeamInfo() }
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		this.updateUI();
		let _currentChatTurn = System_Avalon.Sys_GetData.GetCurrentChatTurn()
		let playerCount = FuncHelper.getPlayerCount();
		for (let i = 0; i < playerCount; i++) {
			let nodename = (this.NODENAME as any)['panel_' + i];
			let node = (this as any)['panel_' + i] as React.RefObject<Panel>;
			if (nodename == null || node == null) { continue; }
			// 隐藏背景图片
			node.current!.style.backgroundImage = null;
			this.addNodeChildAt(nodename, TeamShenFenItemV1,
				{
					playerID: i,
					inTeam: System_Avalon.Sys_GetData.CheckPlayerInTeam(i),
					hasSelected: _currentChatTurn && _currentChatTurn.nowPlayerID == i,
				}
			)
		}
		this.updateSelf()
	};
	updateUI() {
		let _currentChatTurn = System_Avalon.Sys_GetData.GetCurrentChatTurn();
		let playerCount = FuncHelper.getPlayerCount();
		if (_currentChatTurn == null) {
			this.lbl_playerid.current!.visible = false;
			this.lbl_shunxu.current!.visible = false;
			this.lbl_tips.current!.visible = true;
			this.btn_end.current!.visible = false;
			return
		}
		this.lbl_playerid.current!.visible = true;
		this.lbl_shunxu.current!.visible = true;
		this.lbl_tips.current!.visible = false;
		let _index = _currentChatTurn.nowPlayerID + 1;
		this.lbl_playerid.current!.text = `当前发言玩家:${_index}号`;
		let nextid = 0;
		if (_currentChatTurn.chatTurn) {
			if (_index == playerCount) {
				nextid = 1
			}
			else {
				nextid = _index + 1
			}
		}
		else {
			if (_index - 1 == 0) {
				nextid = FuncHelper.getPlayerCount()
			}
			else {
				nextid = _index - 1
			}
		}
		this.lbl_shunxu.current!.text = `下一位发言玩家:${nextid}号`;
		// 发言按钮
		this.btn_end.current!.visible = _currentChatTurn.nowPlayerID == Players.GetLocalPlayer();
		// 更新子节点
		for (let i = 0; i < playerCount; i++) {
			let nodename = (this.NODENAME as any)['panel_' + i];
			let node = (this as any)['panel_' + i] as React.RefObject<Panel>;
			if (nodename == null || node == null) { continue; }
			let c = this.GetOneNodeChild(nodename, TeamShenFenItemV1);
			if (c) {
				if ((_currentChatTurn.nowPlayerID == i) != c.hasSelect) {
					c.setSelect(_currentChatTurn.nowPlayerID == i);
				}
			}
		}
		this.updateSelf()

	}
	/**结束发言 */
	onbtn_makeTeam = () => {
		NetHelper.SendToLua(GameEnum.CustomProtocol.req_end_current_player_chat);
	}

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
