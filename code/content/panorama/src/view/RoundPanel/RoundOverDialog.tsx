/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { FuncHelper } from "../../helper/FuncHelper";
import { TeamShenFenItemV1 } from "../TeamPanel/TeamShenFenItemV1";
import { RoundOverDialog_UI } from "./RoundOverDialog_UI";
export class RoundOverDialog extends RoundOverDialog_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		this.updateUI()
	};

	updateUI() {
		let winner = this.props.winner;
		switch (winner) {
			case System_Avalon.Sys_config.Avalon_CampType.Blue:
				this.lbl_winner.current!.text = '蓝方胜利'
				break;
			case System_Avalon.Sys_config.Avalon_CampType.Red:
				this.lbl_winner.current!.text = '红方胜利'
				break;
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
					hasSelected: System_Avalon.Sys_GetData.GetOtherRoleInfo()!.CampInfo[i] == winner
				}
			)
		}
		this.updateSelf()
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
	onbtn_makeTeam = () => {
		this.destroy()
	}
}
