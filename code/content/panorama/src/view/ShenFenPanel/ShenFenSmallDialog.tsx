/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { LogHelper } from "../../helper/LogHelper";
import { ShenFenSmallDialog_UI } from "./ShenFenSmallDialog_UI";
export class ShenFenSmallDialog extends ShenFenSmallDialog_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		this.updateUI()
	};
	updateUI() {
		let roleType = this.props.roleType;
		if (roleType != null) {
			this.img_0.current!.style.backgroundImage = System_Avalon.Sys_GetData.Get_ShenFenCardSmallPath(roleType)
		}
		LogHelper.print(this.img_0.current!.style.backgroundImage)
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
