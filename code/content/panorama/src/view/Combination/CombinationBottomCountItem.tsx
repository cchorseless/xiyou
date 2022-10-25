/** Create By Editor*/
import React, { createRef, useState } from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CombinationBottomCountItem_UI } from "./CombinationBottomCountItem_UI";

interface IProps extends NodePropsData {
	x: string;
	y: string;
	width: string;
	height: string;
	isactive: boolean;
}
export class CombinationBottomCountItem extends CombinationBottomCountItem_UI<IProps> {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
	};

	public onStartUI(): void {
		this.onRefreshUI(this.props as any);
	}
	onRefreshUI(data: IProps) {
		this.__root__.current!.style.width = data.width;
		this.__root__.current!.style.height = data.height;
		this.__root__.current!.style.x = data.x;
		this.__root__.current!.style.y = data.y;
		this.showActive(data.isactive);
		this.updateSelf();
	}
	showActive(isactive: boolean = false) {
		if (isactive) {
			CSSHelper.setBgImageUrl(this.img, `combination/exp_bar_1.png`);
		}
		else {
			CSSHelper.setBgImageUrl(this.img, `combination/exp_bar_0.png`);
		}
	}
}
