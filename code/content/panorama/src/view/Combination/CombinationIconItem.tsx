/** Create By Editor*/
import React, { createRef, useState } from "react";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CombinationIconItem_UI } from "./CombinationIconItem_UI";
export class CombinationIconItem extends CombinationIconItem_UI<NodePropsData> {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
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
