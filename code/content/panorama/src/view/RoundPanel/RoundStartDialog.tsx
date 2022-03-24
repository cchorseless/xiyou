/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { LogHelper } from "../../helper/LogHelper";
import { RoundStartDialog_UI } from "./RoundStartDialog_UI";
export class RoundStartDialog extends RoundStartDialog_UI {
	static IsReadyForRender() { return !!System_Avalon.Sys_GetData.GetCurrentRoundInfo() }
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		let _rouneInfo = System_Avalon.Sys_GetData.GetCurrentRoundInfo();
		this.lbl_tips.current!.text = 'ROUND:' + _rouneInfo?.currentRound;
		this.ui_item_attrs.playerID = this.props.playerID;
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
}
