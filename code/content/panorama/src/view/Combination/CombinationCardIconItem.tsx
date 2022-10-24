/** Create By Editor*/
import React, { createRef, useState } from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { KVHelper } from "../../helper/KVHelper";
import { PathHelper } from "../../helper/PathHelper";
import { CombinationCardIconItem_UI } from "./CombinationCardIconItem_UI";

interface IProps {
	heroid: string;
}
export class CombinationCardIconItem extends CombinationCardIconItem_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		this.img_check.current!.visible = false;
	};

	onStartUI() {
		this.onRefreshUI(this.props as IProps);
	}

	activeSelect(isselect: boolean = false) {
		this.img_check.current!.visible = isselect;
		this.updateSelf()
	}


	onRefreshUI(p: IProps) {
		if (!p.heroid) {
			return;
		}
		let KV_DATA = KVHelper.KVData();
		let config = KV_DATA.building_unit_tower[p.heroid];
		if (!config) { return }
		CSSHelper.setBgImageUrl(this.img_icon, `card/card_icon/${config.SmallIconRes}.png`);
		CSSHelper.setBgImageUrl(this.img_iconbg, PathHelper.getRaretyFrameUrl(config.Rarity));
		this.updateSelf()
	}

}
