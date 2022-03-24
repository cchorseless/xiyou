/** Create By Editor*/
import React, { createRef, useState } from "react";
import { FuncHelper } from "../../../helper/FuncHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { Minimap_iconitem_UI } from "./Minimap_iconitem_UI";
import { Minimap_plus } from "./Minimap_plus";
export class Minimap_iconitem extends Minimap_iconitem_UI {


	playerid: PlayerID = -1;
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		this.playerid = Number(this.props.playerid) as PlayerID;
		Minimap_plus.GetInstance()?.updateIcon(this.playerid, this)
		let v = this.props.v;
		let q = this.props.q;
		this.__root__.current!.style.uiScale = '50%'
		this.img_0.current!.style.transformOrigin = '50% 50%'
		if (v && q) {
			this.updateUI(v, q)
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



	updateUI(v: any, q: any) {
		this.__root__.current!.visible = true;
		let _v = FuncHelper.StringToVector(v)
		let _q = FuncHelper.StringToVector(q)
		let x_off = (_v.x - 0.05) * 100 + '%'
		let y_off = (_v.y - 0.05) * 100 + '%'
		this.__root__.current!.style.x = x_off;
		this.__root__.current!.style.y = y_off;
		let angle = -Math.atan2(_q.y, _q.x) * 180 / Math.PI
		this.img_0.current!.style.transform = `rotateZ(${angle}deg)`;
		if (GameUI.IsAltDown()) {
			let info = Game.GetPlayerInfo(this.playerid)
			if (info && info.player_selected_hero) {
				this.img_0.current!.style.backgroundImage = `url("file://{images}/heroes/icons/${info.player_selected_hero}_png.png")`
			}
		}
		else {
			if (this.props.isSelf) {
				this.img_0.current!.style.backgroundImage = "url(\"file://{images}/textures/minimap_hero_self.png\")"
			}
			else {
				this.img_0.current!.style.backgroundImage = "url(\"file://{images}/textures/minimap_hero_team.png\")"
			}
		}
		this.updateSelf()
	}
}
