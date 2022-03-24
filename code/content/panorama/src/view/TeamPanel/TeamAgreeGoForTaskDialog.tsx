/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { GameEnum } from "../../libs/GameEnum";
import { TeamAgreeGoForTaskDialog_UI } from "./TeamAgreeGoForTaskDialog_UI";
import { TeamShenFenItemV1 } from "./TeamShenFenItemV1";
export class TeamAgreeGoForTaskDialog extends TeamAgreeGoForTaskDialog_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		// 隐藏投票
		for (let i = 0; i < 10; i++) {
			let nodename = (this.NODENAME as any)['lbl_agree_' + i];
			let node = (this as any)['lbl_agree_' + i] as React.RefObject<Panel>;
			if (nodename == null || node == null) { continue; }
			node.current!.visible = false;
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
					inTeam: System_Avalon.Sys_GetData.CheckPlayerInTeam(i),
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
	/**更新投票进度 */
	updateAgreeInfo() {
		let teamdata = System_Avalon.Sys_GetData.GetCurrentTeamIdea();
		if (teamdata) {
			for (let i in teamdata) {
				let nodename = (this.NODENAME as any)['lbl_agree_' + i];
				let node = (this as any)['lbl_agree_' + i] as React.RefObject<Panel>;
				if (nodename == null || node == null) { continue; }
				node.current!.visible = true;
			}
			this.updateSelf()
		}
	}


	/**同意 */
	onbtn_agree = () => {
		LogHelper.print("onbtn_agree")
		NetHelper.SendToLua(GameEnum.CustomProtocol.req_send_to_make_team_idea, 1, (event) => {
			LogHelper.print(event)
			if (event.state) {
				this.panel_agreeinfo.current!.visible = false;
			}
		}, this)
	}
	/**反对 */
	onbtn_disagree = () => {
		LogHelper.print("onbtn_disagree")
		NetHelper.SendToLua(GameEnum.CustomProtocol.req_send_to_make_team_idea, 0, (event) => {
			if (event.state) {
				this.panel_agreeinfo.current!.visible = false;
			}
		}, this);
	}
}
