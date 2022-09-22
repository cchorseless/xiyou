/** Create By Editor*/
import React, { createRef, useState } from "react";
import { ECombination } from "../../game/components/Combination/ECombination";
import { EventHelper } from "../../helper/EventHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { ET } from "../../libs/Entity";
import { CombinationSingleBottomItem_UI } from "./CombinationSingleBottomItem_UI";
export class CombinationSingleBottomItem extends CombinationSingleBottomItem_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		let CombEntityInstanceId = this.props.CombEntityInstanceId;
		let entity = ET.EntityEventSystem.GetEntity(CombEntityInstanceId) as ECombination
		this.BindCombEntity(entity);
	};
	public onStartUI(): void {
		this.onRefreshUI();
	}

	public onRefreshUI(): void {

	}

	public onDestroy(): void {
		this.UnBindCombEntity();
	}
	public bindCombEntity: ECombination | null;
	public BindCombEntity(ecomb: ECombination): void {
		if (ecomb == null) { return; }
		if (this.bindCombEntity == ecomb) {
			this.onRefreshUI();
			return;
		}
		this.UnBindCombEntity();
		this.bindCombEntity = ecomb;
		EventHelper.AddClientEvent(ecomb.updateEventName, FuncHelper.Handler.create(this, () => {
			this.onRefreshUI();
		}))
	}
	public UnBindCombEntity() {
		if (this.bindCombEntity == null) { return; }
		EventHelper.RemoveClientEvent(this.bindCombEntity.updateEventName, this);
		this.bindCombEntity = null;
	}


}
