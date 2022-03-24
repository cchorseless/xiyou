/** Create By Editor*/
import React, { createRef, useState } from "react";
import { NetHelper } from "../../helper/NetHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { GameEnum } from "../../libs/GameEnum";
import { CollectDialog_UI } from "./CollectDialog_UI";
export class CollectDialog extends CollectDialog_UI {
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
	/**采集一次 */
	onbtn_makeTeam = () => {
		let entityIndex = Players.GetLocalPlayerPortraitUnit();
		let enityLabel = Entities.GetUnitLabel(entityIndex);
		if (enityLabel != GameEnum.Unit.UnitLabels.collect || !Entities.IsAlive(entityIndex)) {
			TipsHelper.showTips('无法采集',this)
			return
		}
		NetHelper.SendToLua(GameEnum.CustomProtocol.req_collect_entity, entityIndex);
		let selfEntity = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())
		GameUI.SelectUnit(selfEntity, false)
	}
}
