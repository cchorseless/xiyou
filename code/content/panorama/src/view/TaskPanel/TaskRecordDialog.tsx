/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { TaskRecordDialog_UI } from "./TaskRecordDialog_UI";
export class TaskRecordDialog extends TaskRecordDialog_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		this.updateUI()
	};

	updateUI() {
		let taskID = this.props.taskID;

		let roundinfo = System_Avalon.Sys_GetData.Get_allTaskRecord()
		if (roundinfo) {
			let info = roundinfo['' + taskID]
			if (info) {
				this.lbl_taskname.current!.text = `第${taskID}轮任务 blue T:${info.needPlayerCount + 4}`;
				let stat_str = '';
				let agree_str = '';
				let disagree_str = '';
				switch (info.state) {
					case System_Avalon.Sys_config.Avalon_TaskStage.taskstage_fail:
						stat_str = '任务失败'
						agree_str = 'blue T：' + info.agreeCount
						disagree_str = 'red T：' + info.disagreeCount
						break
					case System_Avalon.Sys_config.Avalon_TaskStage.taskstage_success:
						stat_str = '任务成功'
						agree_str = 'blue T：' + info.agreeCount
						disagree_str = 'red T：' + info.disagreeCount
						break
					case System_Avalon.Sys_config.Avalon_TaskStage.taskstage_ing:
						stat_str = '任务进行中'
						break
				}
				this.lbl_taskstate.current!.text = stat_str;
				this.lbl_taskagree.current!.text = agree_str;
				this.lbl_taskdisagree.current!.text = disagree_str;
				for (let i = 1; i < 6; i++) {
					let cur = (this as any)["lbl_round" + i].current as LabelPanel
					cur!.visible = false;
					let rounddata = info['' + i]
					if (rounddata) {
						cur!.visible = true;
						cur!.html = true;
						cur!.text = 'Round' + i + '<br>';
						cur!.text += '同意x' + rounddata.agreeCount + '<br>';
						cur!.text += '反对x' + rounddata.disagreeCount + '<br>';
						if (rounddata.info) {
							let str_list = ['反对', '同意']
							let keys = Object.keys(rounddata.info).sort();
							for (let playerid in keys) {
								let index = parseInt(playerid) + 1;
								if (index > 9) {
									cur!.text += index + ' ' + str_list[rounddata.info[playerid]] + '<br>'
								}
								else {
									cur!.text += '0' + index + ' ' + str_list[rounddata.info[playerid]] + '<br>'

								}

							}
						}
					}
				}
			}
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
	onbtn_close = () => {
		this.destroy();
	}
}
