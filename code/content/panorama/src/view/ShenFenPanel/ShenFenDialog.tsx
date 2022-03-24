/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { LogHelper } from "../../helper/LogHelper";
import { ShenFenDialog_UI } from "./ShenFenDialog_UI";
export class ShenFenDialog extends ShenFenDialog_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		let data = System_Avalon.Sys_GetData.GetSelfRoleInfo();
		if (data) {
			this.lbl_name.current!.text = System_Avalon.Sys_GetData.Get_ShenFenName(data.RoleType);
			this.lbl_name.current!.style.color = System_Avalon.Sys_GetData.Get_ShenFenNameColor(data.CampType)
			this.img_bg.current!.style.backgroundImage = System_Avalon.Sys_GetData.GetPath_ShenFenCard(data.RoleType)
		}
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
}
