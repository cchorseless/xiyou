/** Create By Editor*/
import React, { createRef, useState } from "react";
import { ShenFenAllPlayerDialog_UI } from "./ShenFenAllPlayerDialog_UI";
import { ShenFenItem } from "./ShenFenItem";
export class ShenFenAllPlayerDialog extends ShenFenAllPlayerDialog_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		let playerCount = Players.GetMaxTeamPlayers();
		for (let i = 0; i < playerCount; i++) {
			if (!Players.IsValidPlayerID(i as PlayerID)) { continue; }
			this.addNodeChildAt(this.NODENAME.__root__, ShenFenItem,
				{
					uiScale: '50%',
					marginBottom: '1px',
					marginRight: '0px',
					horizontalAlign: 'right',
					playerID: i,
				}
			)
		}
		this.updateSelf()
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

	updateUI() {
		let _c_l = this.GetNodeChild(this.NODENAME.__root__, ShenFenItem)
		if (_c_l) {
			_c_l.forEach((c) => {
				c.updateUI()
			})
		}
	}
}
