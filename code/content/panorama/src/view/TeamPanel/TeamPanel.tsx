/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { GameEnum } from "../../libs/GameEnum";
import { TeamPanel_UI } from "./TeamPanel_UI";
import { TeamShenFenItem } from "./TeamShenFenItem";
export class TeamPanel extends TeamPanel_UI {
	static IsReadyForRender() { return !!System_Avalon.Sys_GetData.GetCurrentRoundInfo() }
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		this.panel_0.current!.style.flowChildren = 'right-wrap'
		let playerCount = Players.GetMaxTeamPlayers();
		let playid = Game.GetLocalPlayerID();
		for (let i = 0; i < playerCount; i++) {
			if (!Players.IsValidPlayerID(i as PlayerID)) { continue; }
			if (playid == i) {
				// 更新属性
				this.ui_item_attrs.playerID = playid;
				this.ui_item_attrs.canSelect = true;
				continue;
			}
			this.addNodeChildAt(this.NODENAME.panel_0, TeamShenFenItem,
				{
					marginBottom: '10px',
					marginRight: '10px',
					playerID: i,
					canSelect: true,
				}
			)
		}
		this.updateTeamCount(-1, false);
	};
	private selectPlayer: Set<PlayerID> = new Set<PlayerID>();
	updateTeamCount(playerid: PlayerID, isAdd: boolean) {
		let maxTeamCount = System_Avalon.Sys_GetData.GetCurrentRoundInfo()!.maxTeamCount;
		if (Players.IsValidPlayerID(playerid)) {
			if (isAdd) {
				if (!this.checkIsFull()) {
					this.selectPlayer.add(playerid)
				}
			}
			else {
				this.selectPlayer.delete(playerid)
			}
		}
		this.lbl_teamCount.current!.text = `成员数量:(${this.selectPlayer.size}/${maxTeamCount})`;
		this.updateSelf()
	}
	/**是否满员 */
	checkIsFull() {
		let maxTeamCount = System_Avalon.Sys_GetData.GetCurrentRoundInfo()!.maxTeamCount;
		return (maxTeamCount <= this.selectPlayer.size)
	}
	/**提交队伍 */
	onbtn_makeTeam = () => {
		if (!this.checkIsFull()) {
			TipsHelper.showTips('人不够，请点击挑选',this)
		}
		else {
			NetHelper.SendToLua(GameEnum.CustomProtocol.req_send_to_make_team, [...this.selectPlayer],(e)=>{
				LogHelper.print(11111)
				if(e.state){
					this.destroy()
				}
			},this)
		}
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
