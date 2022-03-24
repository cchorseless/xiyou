/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { FuncHelper } from "../../helper/FuncHelper";
import { NetHelper } from "../../helper/NetHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { GameEnum } from "../../libs/GameEnum";
import { TeamShenFenItemV1 } from "../TeamPanel/TeamShenFenItemV1";
import { RoundCiShaDialog_UI } from "./RoundCiShaDialog_UI";
export class RoundCiShaDialog extends RoundCiShaDialog_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		let canSelect = false;
		if (System_Avalon.Sys_GetData.CheckPlayerIsCiKe()) {
			this.btn_end.current!.visible = true;
			this.lbl_tips.current!.text = '刺杀对方领袖获取最终胜利'
			canSelect = true
		}
		else {
			this.btn_end.current!.visible = false;
			this.lbl_tips.current!.text = '等待刺客选择领袖进行刺杀'
			canSelect = false
		}
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
					canSelect: canSelect
				}
			)
		}
		this.updateSelf()
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
		let selfInfo = System_Avalon.Sys_GetData.GetSelfRoleInfo()
		if (selfInfo) {
			let info = selfInfo.Know_Player_BelongCampType;
			if (info[playerID] && info[playerID] == selfInfo.CampType) {
				TipsHelper.showTips('不能选择同阵营进行刺杀',this)
				return
			}
		}
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
		this.lbl_cishades.current!.text = '当前刺杀目标:' + (playerID + 1) + '号';
		this.updateSelf()
	}
	onbtn_makeTeam = () => {
		if (System_Avalon.Sys_GetData.CheckPlayerIsCiKe()) {
			if (!Players.IsValidPlayerID(this.selectPlayerid)) {
				return;
			}
			let playerID = this.selectPlayerid;
			let selfInfo = System_Avalon.Sys_GetData.GetSelfRoleInfo()
			if (selfInfo) {
				let info = selfInfo.Know_Player_BelongCampType;
				if (info[playerID] && info[playerID] == selfInfo.CampType) {
					TipsHelper.showTips('不能选择同阵营进行刺杀',this)
					return
				}
			}
			NetHelper.SendToLua(GameEnum.CustomProtocol.req_send_to_goto_ci_sha, playerID, (event) => {
				if (event.state) {
					this.destroy()
				}
			}, this)
		}
	}
}
