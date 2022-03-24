/** Create By Editor*/
import React, { createRef, useState } from "react";
import { DotaUIHelper } from "../../../helper/DotaUIHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { GameEnum } from "../../../libs/GameEnum";
import { Minimap_iconitem } from "./Minimap_iconitem";
import { Minimap_plus_UI } from "./Minimap_plus_UI";
export class Minimap_plus extends Minimap_plus_UI {

	minimap_width: number = 0;
	minimap_height: number = 0;
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		let minimap = DotaUIHelper.GetWindowRoot()?.FindChildTraverse('minimap');
		if (minimap) {
			if (minimap.GetChildCount() == 0) {
				this.__root__.current!.SetParent(minimap)
				this.minimap_width = Number(minimap.style.width?.replace('px', ''))
				this.minimap_height = Number(minimap.style.height?.replace('px', ''))
			}
			else {
				this.destroy()
				return
			}
		}
		this.addEvent()
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

	allheroicon: { [playerid: string]: Minimap_iconitem } = {};
	addEvent() {
		NetHelper.ListenOnLua(GameEnum.CustomProtocol.push_update_minimap, (e) => {
			if (e.state && e.data) {
				for (let playerid in e.data) {
					let v = e.data[playerid].v;
					let q = e.data[playerid].q;
					if (this.allheroicon[playerid] != null) {
						this.allheroicon[playerid].updateUI(v, q)
					}
					else {
						this.addNodeChildAt(this.NODENAME.__root__, Minimap_iconitem, {
							isSelf: playerid == '' + Players.GetLocalPlayer(),
							v: v,
							q: q,
							playerid: Number(playerid),
						})
					}
				}
				this.updateSelf()
			}
		}, this);
		NetHelper.ListenOnLua(GameEnum.CustomProtocol.push_update_minimap_nodraw, (e) => {
			LogHelper.print(e, 'push_update_minimap_nodraw')
			if (e.state && e.data) {
				for (let playerid in e.data) {
					if (this.allheroicon[playerid]) {
						this.allheroicon[playerid].close(false)
					}
				}
			}
		}, this)

	}
	updateIcon(playerid: PlayerID, m: Minimap_iconitem) {
		this.allheroicon[playerid] = m;
	}
}
