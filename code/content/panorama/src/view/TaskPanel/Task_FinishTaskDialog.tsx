/** Create By Editor*/
import React, { createRef, useState } from "react";
import { KV_DATA } from "../../config/KvAllInterface";
import { CSSHelper } from "../../helper/CSSHelper";
import { KVHelper } from "../../helper/KVHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { Task_FinishTaskDialog_UI } from "./Task_FinishTaskDialog_UI";
export class Task_FinishTaskDialog extends Task_FinishTaskDialog_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		CSSHelper.addBorderStyle(this.__root__);
		let taskid = this.props.taskid;
		// let taskinfo = KV_DATA.task_config.taskdata![taskid as '1001'];
		// if (taskinfo) {
		// 	this.lbl_taskdes.current!.html = true;
		// 	let finishType = ['对话', '采集', '战斗', '道具',][Number(taskinfo.TaskFinishType)]
		// 	if (finishType) {
		// 		finishType = CSSHelper.HtmlTxt.createHtmlTxt(`[${finishType}]`, { color: CSSHelper.enumColorDes.Red })
		// 	}
		// 	else {
		// 		finishType = ''
		// 	}
		// 	// 标题
		// 	let title = CSSHelper.HtmlTxt.createHtmlTxt(taskinfo.TaskName!, { color: CSSHelper.enumColorDes.Yellow });
		// 	// 描述
		// 	let des = taskinfo.TaskFinishtips;
		// 	// this.
		// 	this.lbl_taskdes.current!.text = finishType + ' ' + title + '<br/>' + des;
		// 	this.lbl_prizedes.current!.text = '奖励:' + KVHelper.GetPrizeStr(taskinfo.TaskPrize!);
		// }
		TimerHelper.addTimer(2, () => {
			this.close(true);
		}, this)
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
}
