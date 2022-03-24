/** Create By Editor*/
import React, { createRef, useState } from "react";
import { KV_DATA } from "../../config/KvAllInterface";
import { KVHelper } from "../../helper/KVHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { NpcTalkDialog_UI } from "./NpcTalkDialog_UI";
export class NpcTalkDialog extends NpcTalkDialog_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		let entityIndex = Players.GetLocalPlayerPortraitUnit();
		let selfEntity = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())
		if (entityIndex != selfEntity) {
			if (Entities.GetTeamNumber(entityIndex) == DOTATeam_t.DOTA_TEAM_FIRST) {
				let v1 = Entities.GetAbsOrigin(selfEntity);
				let v2 = Entities.GetAbsOrigin(entityIndex);
				if (FuncHelper.IsValidDiatance(v1, v2)) {
					let unitName = Entities.GetUnitName(entityIndex);
					let infoid = KVHelper.FindNpcByPositonAndName(unitName, v2)
					// if (infoid) {
						// let info = KV_DATA.npc_position_config.npcposition![infoid as '1001'];
						// this.lbl_tips.current!.text = FuncHelper.Random.RandomArray(info!.randomtalk!.split('|'))![0];
						return
					// }
				}
			}
		}
		this.close(true)
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
}
