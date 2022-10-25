/** Create By Editor*/
import React, { createRef, useState } from "react";
import { FuncHelper } from "../../helper/FuncHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { TipsPanel_UI } from "./TipsPanel_UI";
export class TipsPanel extends TipsPanel_UI<NodePropsData> {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount()
		let s = this.props.str;
		if (s) {
			this.lbl.current!.text = s;
		}
		TimerHelper.AddTimer(1, FuncHelper.Handler.create(this, () => {
			this.destroy()
		}))
	};

}
