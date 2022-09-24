/** Create By Editor*/
import React, { createRef, useState } from "react";
import { ECombination } from "../../game/components/Combination/ECombination";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { EventHelper } from "../../helper/EventHelper";
import { LogHelper } from "../../helper/LogHelper";
import { GameEnum } from "../../libs/GameEnum";
import { CombinationBottomPanel_UI } from "./CombinationBottomPanel_UI";
import { CombinationSingleBottomItem } from "./CombinationSingleBottomItem";
export class CombinationBottomPanel extends CombinationBottomPanel_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
	};

	public addEvent() {
	}

	public onStartUI(): void {
		this.showCombination(Players.GetLocalPlayer());
	}
	playerId: PlayerID;
	isFaker: boolean;
	public showCombination(playerId: PlayerID, isFaker: boolean = false): void {
		this.playerId = playerId;
		this.isFaker = isFaker;
		let combinations: { [k: string]: ECombination[] } = {}
		if (isFaker) {
			combinations = PlayerScene.EntityRootManage.getFakerHero(playerId)!.FHeroCombinationManager.getAllCombination();
		}
		else {
			combinations = PlayerScene.EntityRootManage.getPlayer(playerId)!.CombinationManager.getAllCombination();
		}
		let allui = this.GetNodeChild(this.NODENAME.__root__, CombinationSingleBottomItem);
		for (let i = 0, len = allui.length; i < len; i++) {
			let combinationName = allui[i].combinationName;
			if (combinationName && combinations[combinationName]) {
				combinations[combinationName].forEach(entity => {
					allui[i].BindCombEntity(entity);
				});
				allui.splice(i, 1);
				delete combinations[combinationName];
				i--;
				len--;
			}
		}
		for (let key in combinations) {
			let combs = combinations[key];
			if (combs && combs.length > 0) {
				let ui = allui.pop();
				if (ui) {
					ui.UnBindAllCombEntity();
					combs.forEach(entity => {
						ui!.BindCombEntity(entity);
					});
				}
				else {
					let InstanceIdList: string[] = [];
					combs.forEach(entity => {
						InstanceIdList.push(entity.InstanceId)
					})
					this.addNodeChildAt(this.NODENAME.__root__, CombinationSingleBottomItem, {
						InstanceIdList: InstanceIdList
					});
				}
			}

		}
		for (let ui of allui) {
			ui.close(true)
		}
		this.updateSelf();
	}

	public async addOneCombination(playerId: PlayerID, _comb: ECombination) {
		if (this.playerId != playerId || this.isFaker != _comb.isFakerCombination()) { return }
		let allui = this.GetNodeChild(this.NODENAME.__root__, CombinationSingleBottomItem);
		for (let i = 0, len = allui.length; i < len; i++) {
			if (allui[i].combinationName == _comb.combinationName) {
				allui[i].BindCombEntity(_comb);
				return;
			}
		}
		await this.addNodeChildAsyncAt(this.NODENAME.__root__, CombinationSingleBottomItem, {
			InstanceIdList: [_comb.InstanceId]
		});
	}

}
