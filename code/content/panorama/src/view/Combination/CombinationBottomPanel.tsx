/** Create By Editor*/
import React, { createRef, useState } from "react";
import { ECombination } from "../../game/components/Combination/ECombination";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { EventHelper } from "../../helper/EventHelper";
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
	public showCombination(playerId: PlayerID, isFaker: boolean = false): void {
		let combinations: ECombination[] = [];
		if (isFaker) {
			combinations = PlayerScene.EntityRootManage.getFakerHero(playerId)!.FHeroCombinationManager.getAllCombination();
		}
		else {
			combinations = PlayerScene.EntityRootManage.getPlayer(playerId)!.CombinationManager.getAllCombination();
		}
		let allui = this.GetNodeChild(this.NODENAME.__root__, CombinationSingleBottomItem);
		for (let i = 0, len = allui.length; i < len; i++) {
			let entity = allui[i].bindCombEntity;
			if (entity) {
				let index = combinations.indexOf(entity);
				if (index > -1) {
					allui[i].BindCombEntity(entity);
					allui.splice(i, 1);
					combinations.splice(index, 1);
					i--;
					len--;
				}
			}
		}
		for (let comb of combinations) {
			let ui = allui.pop();
			if (ui) {
				ui.BindCombEntity(comb);
			}
			else {
				this.addNodeChildAt(this.NODENAME.__root__, CombinationSingleBottomItem, { CombEntityInstanceId: comb.InstanceId });
			}
		}
		for (let ui of allui) {
			ui.close(true)
		}
	}



}
