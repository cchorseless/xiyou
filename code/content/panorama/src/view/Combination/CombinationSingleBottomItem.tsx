/** Create By Editor*/
import React, { createRef, useState } from "react";
import { KV_DATA } from "../../config/KvAllInterface";
import { ECombination } from "../../game/components/Combination/ECombination";
import { CSSHelper } from "../../helper/CSSHelper";
import { EventHelper } from "../../helper/EventHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { ET } from "../../libs/Entity";
import { CombinationBottomCountGroup } from "./CombinationBottomCountGroup";
import { CombinationBottomCountItem } from "./CombinationBottomCountItem";
import { CombinationBottomPanel } from "./CombinationBottomPanel";
import { CombinationSingleBottomItem_UI } from "./CombinationSingleBottomItem_UI";
export class CombinationSingleBottomItem extends CombinationSingleBottomItem_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		CSSHelper.setFlowChildren(this.panel_box, "down");
		let InstanceIdList: string[] = this.props.InstanceIdList;
		InstanceIdList.forEach(entityid => {
			let entity = ET.EntityEventSystem.GetEntity(entityid) as ECombination;
			this.BindCombEntity(entity);
		})
	};
	public async refreshCombEntityCount(combid: string) {
		let comb = this.bindCombEntity[combid];
		if (comb == null) { return; }
		if (comb.IsEmpty()) {
			this.UnBindAllCombEntity();
			this.close(true);
			return;
		}
		let allui = this.GetNodeChild(this.NODENAME.panel_box, CombinationBottomCountGroup);
		let combui: CombinationBottomCountGroup = null as any;
		let keys = Object.keys(this.bindCombEntity);
		allui.forEach((ui) => {
			if (ui.combinationId == combid) {
				combui = ui;
			}
			else if (!keys.includes(ui.combinationId)) {
				ui.close(true);
			}
		});
		let nodedata = {
			needcount: comb.activeNeedCount,
			hascount: comb.uniqueConfigList.length,
			combinationId: combid
		}
		if (combui) {
			combui.onRefreshUI(nodedata);
		}
		else {
			await this.addNodeChildAsyncAt(this.NODENAME.panel_box, CombinationBottomCountGroup, nodedata)
		}
		this.panel_box_childs.sort((a, b) => {
			return a.props.needcount - b.props.needcount;
		})
		this.updateSelf();
	}

	refreshIcon() {
		if (this.combinationName == null) { return; };
		let data = KV_DATA.building_combination_ability.building_combination_ability
		for (let k in data) {
			if (data[k].relation == this.combinationName) {
				CSSHelper.setBgImageUrl(this.img_icon, `combination/icon/${data[k].relationicon}.png`);
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
		if (this.bindCombEntity[ecomb.combinationId] != ecomb) {
			let oldcomb = this.bindCombEntity[ecomb.combinationId]
			if (oldcomb) {
				EventHelper.RemoveClientEvent(oldcomb.updateEventName, this);
			}
			this.bindCombEntity[ecomb.combinationId] = ecomb;
			EventHelper.AddClientEvent(ecomb.updateEventName, FuncHelper.Handler.create(this, () => {
				this.refreshCombEntityCount(ecomb.combinationId);
			}));
		}
		this.refreshCombEntityCount(ecomb.combinationId);
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
