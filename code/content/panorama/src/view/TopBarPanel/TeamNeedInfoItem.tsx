/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { LogHelper } from "../../helper/LogHelper";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { MainPanel } from "../MainPanel/MainPanel";
import { TeamNeedInfoItem_UI } from "./TeamNeedInfoItem_UI";
export class TeamNeedInfoItem extends TeamNeedInfoItem_UI {
	index: number = 0;
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		this.index = this.props.index;
		this.updateUI()
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
	updateUI() {
		// 人数
		let _allTaskRecord = System_Avalon.Sys_GetData.Get_allTaskRecord() as System_Avalon.TaskRecord;
		if (_allTaskRecord != null) {
			let _data = _allTaskRecord[this.index + 1];
			this.lbl_playercount.current!.text = '' + _data.needPlayerCount;
			// 任务状态
			this.img_0.current!.style.backgroundImage = System_Avalon.Sys_GetData.Get_TaskStatePath(_allTaskRecord[this.index + 1].state)
		}
		// 当前回合
		let roundinfo = System_Avalon.Sys_GetData.GetCurrentRoundInfo();
		if (roundinfo) {
			if (this.index + 1 == roundinfo.currentTaskID) {
				this.__root__.current!.style.backgroundColor = '#0ffd18FF'
			}
			else {
				this.__root__.current!.style.backgroundColor = null;

			}
		}


		this.updateSelf()
	}
	onbtn_click = () => {
		let roundinfo = System_Avalon.Sys_GetData.Get_allTaskRecord()
		if (roundinfo) {
			let info = roundinfo['' + (this.index + 1)]
			if (info) {
				MainPanel.GetInstance()!.showTaskRecord(this.index + 1);
			}
		}
	}

}

