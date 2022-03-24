/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Task } from "../../game/system/System_Task";
import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { TaskInfoDialog_UI } from "./TaskInfoDialog_UI";
import { TaskInfoItem } from "./TaskInfoItem";
export class TaskInfoDialog extends TaskInfoDialog_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		CSSHelper.addBorderStyle(this.__root__);
		this.panel_0.current!.style.flowChildren = "down"
		this.panel_1.current!.style.flowChildren = "down"
		this.selectPanel(true)
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
	onbtn_close = () => {
		this.close(false);
	}
	onbtn_showpanel0 = () => {
		this.selectPanel(true)
	}
	onbtn_showpanel1 = () => {
		this.selectPanel(false)
	}
	/**显示 全部|金币 */
	selectPanel(b: boolean) {
		if (b) {
			this.panel_0.current!.visible = true;
			this.panel_1.current!.visible = false;
			CSSHelper.addBorderStyle(this.lbll_maintask, CSSHelper.enumColor.Red);
			CSSHelper.removeBorderStyle(this.lbll_goldtask);
		}
		else {
			this.panel_1.current!.visible = true;
			this.panel_0.current!.visible = false;
			CSSHelper.addBorderStyle(this.lbll_goldtask, CSSHelper.enumColor.Red);
			CSSHelper.removeBorderStyle(this.lbll_maintask);
		}
	}


	updateUI() {
		this.closeNode(this.NODENAME.panel_0);
		this.closeNode(this.NODENAME.panel_1);
		let selftaskinfo = System_Task.Sys_GetData.Get_selfTaskInfo();
		if (selftaskinfo) {
			let panel_0data = [
				selftaskinfo[System_Task.Sys_config.TaskType.GameTask],
				selftaskinfo[System_Task.Sys_config.TaskType.RoleTask],
				selftaskinfo[System_Task.Sys_config.TaskType.TeamTask],
			]
			while (panel_0data.length > 0) {
				let _info = panel_0data.shift()
				if (_info) {
					for (let taskid in _info) {
						this.addNodeChildAt(this.NODENAME.panel_0, TaskInfoItem,
							{
								taskid: taskid
							})
					}
				}
			}

			let panel_1data = [
				selftaskinfo[System_Task.Sys_config.TaskType.RandomTask],

			];
			while (panel_1data.length > 0) {
				let _info = panel_1data.shift()
				if (_info) {
					for (let taskid in _info) {
						this.addNodeChildAt(this.NODENAME.panel_1, TaskInfoItem,
							{
								taskid: taskid
							})
					}
				}
			}
		}
		this.updateSelf()
	}
}
