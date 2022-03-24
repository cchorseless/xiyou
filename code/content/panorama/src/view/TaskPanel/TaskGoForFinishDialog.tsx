/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { GameEnum } from "../../libs/GameEnum";
import { TeamShenFenItem } from "../TeamPanel/TeamShenFenItem";
import { TaskGoForFinishDialog_UI } from "./TaskGoForFinishDialog_UI";
export class TaskGoForFinishDialog extends TaskGoForFinishDialog_UI {
	static IsReadyForRender() { return !!System_Avalon.Sys_GetData.GetCurrentTeamInfo() }
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		this.panel_0.current!.style.flowChildren = 'right-wrap';
		let TeamInfo = System_Avalon.Sys_GetData.GetCurrentTeamInfo()
		if (TeamInfo) {
			let allPlayerID = Object.values(TeamInfo)
			let playid = Game.GetLocalPlayerID();
			for (let i = 0; i < allPlayerID.length; i++) {
				if (!Players.IsValidPlayerID(i as PlayerID)) { continue; }
				this.addChildAt_childs(this.NODENAME.panel_0, TeamShenFenItem,
					{
						marginBottom: '10px',
						marginRight: '10px',
						playerID: allPlayerID[i],
					}
				)
			}
		}
		let roundinfo = System_Avalon.Sys_GetData.GetCurrentRoundInfo();
		let taskRecord = System_Avalon.Sys_GetData.Get_allTaskRecord();
		if (taskRecord && roundinfo) {
			let needdplayer = taskRecord[roundinfo.currentTaskID].needPlayerCount;
			this.lbl_needplayerCount.current!.text = `本次任务需要${needdplayer}位玩家完成`;
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
	onbtn_agree = () => {
		NetHelper.SendToLua(GameEnum.CustomProtocol.req_send_to_finish_task_idea, 1, (event) => {
			if (event.state) {
				this.destroy()
			}
		}, this)
	}
	onbtn_disagree = () => {
		NetHelper.SendToLua(GameEnum.CustomProtocol.req_send_to_finish_task_idea, 0, (event) => {
			if (event.state) {
				this.destroy()
			}
		}, this)
	}
}
