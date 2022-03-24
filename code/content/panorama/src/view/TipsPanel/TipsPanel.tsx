/** Create By Editor*/
import React, { createRef, useState } from "react";
import { TimerHelper } from "../../helper/TimerHelper";
import { TipsPanel_UI } from "./TipsPanel_UI";
export class TipsPanel extends TipsPanel_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount()
		let s = this.props.str;
		if (s) {
			this.lbl.current!.text = s;
		}
		TimerHelper.addTimer(1, () => {
			this.destroy()
		}, this)
	};

}
