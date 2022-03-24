/** Create By Editor*/
import React, { createRef, useState } from "react";
import { LogHelper } from "../../helper/LogHelper";
import { TeamResultDialog_UI } from "./TeamResultDialog_UI";
export class TeamResultDialog extends TeamResultDialog_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		this.updateUI()
	};

	public updateUI(data?: { success: boolean, agreeCount: number, disagreeCount: number }) {
		if (data == null) {
			data = this.props.data;
		}
		if (data == null) { return };
		if (data.success) {
			this.lbl_resulttips.current!.text = '(队伍内玩家开始做任务)'
			this.lbl_tips.current!.text = '组队成功'
		}
		else {
			this.lbl_resulttips.current!.text = '(下一位队长重新组队)'
			this.lbl_tips.current!.text = '组队失败'
		}
		this.lbl_agree.current!.text = '' + data.agreeCount;
		this.lbl_disagree.current!.text = '' + data.disagreeCount;
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
}
