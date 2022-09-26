/** Create By Editor*/
import React, { createRef, useState } from "react";
import { CombinationBottomCountGroup_UI } from "./CombinationBottomCountGroup_UI";


interface nodedata {
	needcount: number,
	hascount: number,
	combinationId: string
}

export class CombinationBottomCountGroup extends CombinationBottomCountGroup_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		this.combinationId = this.props.combinationId;

	};

	combinationId: string;
	onStartUI() {
		this.lbl.current!.style.fontSize = "20";
		this.lbl.current!.style.horizontalAlign = "middle"
		this.onRefreshUI(this.props as any)
	}

	onRefreshUI(data: nodedata) {
		this.combinationId = data.combinationId;
		this.lbl.current!.text = `${data.hascount}/${data.needcount}`;

	}
}
