/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { TaskResultDialog_UI } from "./TaskResultDialog_UI";
export class TaskResultDialog extends TaskResultDialog_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		this.panel_resultinfo.current!.visible = false;
		this.panel_resultinfo.current!.visible = false;
		this.panel_taskprogress.current!.visible = false;
		this.updateUI();
		TimerHelper.addTimer(3,()=>{
			this.destroy()
		},this)
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
		let data = System_Avalon.Sys_GetData.GetCurrentTaskIdea()
		if (data == null) {
			return
		}
		if (data.success == null) {
			this.lbl_tips.current!.text = '任务进行中';
			this.panel_resultinfo.current!.visible = false;
			this.panel_taskprogress.current!.visible = true;
			let r = 0;
			if (data.info) {
				r = data.info.length;
			}
			let max_r = 0;
			let teamInfo = System_Avalon.Sys_GetData.GetCurrentTeamInfo();
			if (teamInfo) {
				max_r = Object.keys(teamInfo).length;
			}
			this.lbl_task_progress.current!.text = `任务进度：(${r}/${max_r})`;
			if (r < max_r) {
				this.lbl_resulttips.current!.text = '(队员任务中)'
			}
			else {
				this.lbl_resulttips.current!.text = '(队员任务中)'
			}
		}
		else {
			this.panel_resultinfo.current!.visible = true;
			this.panel_taskprogress.current!.visible = false;
			this.lbl_agree.current!.text = '' + data.agreeCount
			this.lbl_disagree.current!.text = '' + data.disagreeCount;
			if (data.success == System_Avalon.Sys_config.Avalon_TaskStage.taskstage_success) {
				this.lbl_tips.current!.text = '任务成功'
			}
			else if (data.success == System_Avalon.Sys_config.Avalon_TaskStage.taskstage_fail) {
				this.lbl_tips.current!.text = '任务失败'
			}

		}
		this.updateSelf()
	}
}
