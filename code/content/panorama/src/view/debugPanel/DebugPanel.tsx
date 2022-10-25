/** Create By Editor*/
import React, { createRef, useState } from "react";
import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { GameEnum } from "../../libs/GameEnum";
import { DebugPanel_UI } from "./DebugPanel_UI";
export class DebugPanel extends DebugPanel_UI<NodePropsData> {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount()
	};
	// 更新渲染
	/**
	 *
	 * @param prevProps 上一个状态的 props
	 * @param prevState
	 * @param snapshot
	 */
	componentDidUpdate(prevProps: any, prevState: any, snapshot?: any) {
		super.componentDidUpdate(prevProps, prevState, snapshot)
	};
	onClick_tips = () => {
		TipsHelper.showTips('双击有效', this)
	}
	onbtn_close = () => {
		this.destroy()
	}
	onClick_btn_clearall = () => {
		NetHelper.SendToLua(GameEnum.CustomProtocol.req_DebugClearAll)
	}
	onClick_restartGame = () => {
		NetHelper.SendToLua(GameEnum.CustomProtocol.req_DebugRestart)
	}
	onClick_reload = () => {
		NetHelper.SendToLua(GameEnum.CustomProtocol.req_DebugReload)
	}
}
