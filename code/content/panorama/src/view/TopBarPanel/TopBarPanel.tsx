/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { TopBarPanel_UI } from "./TopBarPanel_UI";
export class TopBarPanel extends TopBarPanel_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		// this.panel_0.current!.style.flowChildren = 'right'
		// for (let i = 0; i < 5; i++) {
		// 	this.addNodeChildAt(this.NODENAME.panel_0, TeamNeedInfoItem, { marginLeft: '20px', uiScale: '40%', index: i })
		// }
		this.updateUI()
	};

	updateUI = () => {
		TimerHelper.removeAllTimer(this);
		let roundInfo = System_Avalon.Sys_GetData.GetCurrentRoundInfo() as System_Avalon.RoundInfo;
		if (roundInfo == null) { return };
		let stageDes = ['组队阶段', '发言顺序', '发言阶段', '投票组队', '任务阶段', '', '刺杀阶段', '', '', '', '', '']
		// this.lbl_chooseteam.current!.text = '阶段:' + stageDes[roundInfo.stage];
		this.lbl_lefttime.current!.text = '倒计时:' + roundInfo.duration;
		this.lbl_round.current!.text = 'ROUND:' + roundInfo.currentRound;
		// 历史记录
		let _allTaskRecord = System_Avalon.Sys_GetData.Get_allTaskRecord() as System_Avalon.TaskRecord;
		if (_allTaskRecord != null) {
			// let _c_l = this.GetNodeChild(this.NODENAME.panel_0, TeamNeedInfoItem);
			// if (_c_l) {
			// 	_c_l.forEach((c) => {
			// 		c.updateUI()
			// 	})
			// }
		}
		TimerHelper.addTimer(1,
			() => {
				if (roundInfo.duration > 1) {
					roundInfo.duration -= 1;
					this.lbl_lefttime.current!.text = '倒计时:' + roundInfo.duration;
					this.updateSelf()
					return 1
				}
			}, this);
		this.updateSelf()
	}

}
