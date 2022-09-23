/** Create By Editor*/
import React, { createRef, useState } from "react";
import { KV_DATA } from "../../config/KvAllInterface";
import { ECombination } from "../../game/components/Combination/ECombination";
import { CSSHelper } from "../../helper/CSSHelper";
import { EventHelper } from "../../helper/EventHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { ET } from "../../libs/Entity";
import { CombinationSingleBottomItem_UI } from "./CombinationSingleBottomItem_UI";
export class CombinationSingleBottomItem extends CombinationSingleBottomItem_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		let InstanceIdList: string[] = this.props.InstanceIdList;
		InstanceIdList.forEach(entityid => {
			let entity = ET.EntityEventSystem.GetEntity(entityid) as ECombination;
			this.BindCombEntity(entity);
		})
	};
	public onStartUI(): void {
		this.onRefreshUI();
	}

	public onRefreshUI(): void {
		let allcomb = Object.values(this.bindCombEntity).sort((a, b) => {
			return b.activeNeedCount - a.activeNeedCount;
		});
		allcomb.forEach((entity) => {
			LogHelper.print(entity.activeNeedCount, entity.uniqueConfigList.length)
		})

	}

	refreshIcon() {
		if (this.combinationName == null) { return; };
		let data = KV_DATA.building_combination_ability.building_combination_ability
		for (let k in data) {
			if (data[k].relation == this.combinationName) {
				CSSHelper.setBgImageUrl(this.img_icon, data[k].relationicon);
				return;
			}
		}
	}


	public onDestroy(): void {
		this.UnBindAllCombEntity();
	}
	combinationName: string | null;
	private bindCombEntity: { [k: string]: ECombination } = {};
	public BindCombEntity(ecomb: ECombination): void {
		if (ecomb == null) { return; }
		if (this.combinationName == null) {
			this.combinationName = ecomb.combinationName;
			this.refreshIcon();
		}
		if (this.combinationName != ecomb.combinationName) { return; }
		if (this.bindCombEntity[ecomb.combinationId] == ecomb) {
			this.onRefreshUI();
			return;
		}
		let oldcomb = this.bindCombEntity[ecomb.combinationId]
		if (oldcomb) {
			EventHelper.RemoveClientEvent(oldcomb.updateEventName, this);
		}
		this.bindCombEntity[ecomb.combinationId] = ecomb;
		EventHelper.AddClientEvent(ecomb.updateEventName, FuncHelper.Handler.create(this, () => {
			this.onRefreshUI();
		}))
	}


	public UnBindAllCombEntity() {
		for (let k in this.bindCombEntity) {
			let ecomb = this.bindCombEntity[k];
			if (ecomb) {
				EventHelper.RemoveClientEvent(ecomb.updateEventName, this);
			}
		}
		this.bindCombEntity = {};
		this.combinationName = null;
	}


}
