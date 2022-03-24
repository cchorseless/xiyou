/** Create By Editor*/
import React, { createRef, useState } from "react";
import { KV_DATA } from "../../config/KvAllInterface";
import { System_Task } from "../../game/system/System_Task";
import { CSSHelper } from "../../helper/CSSHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { Task_TalkInfoDialog_UI } from "./Task_TalkInfoDialog_UI";
export class Task_TalkInfoDialog extends Task_TalkInfoDialog_UI {
	alltips: string[] = [];
	curtips: string = '';
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		CSSHelper.addBorderStyle(this.__root__);
		this.lbl_tipsself.current!.style.textAlign = 'right'
		if (this.props.taskid) {
			// let taskinfo = KV_DATA.task_config.taskdata![this.props.taskid as '1001'];
			// if (taskinfo && taskinfo.Taskingtips) {
			// 	let str = taskinfo.Taskingtips.replace(/：/g, ':');
			// 	this.alltips = str.split('|');
			// }
		}
		this.showTalk()
	};

	showTalk() {
		if (this.alltips.length == 0) {
			if (this.props.taskid) {
				System_Task.Sys_GetData.FinishTask(this.props.taskid)
			}
			this.close(true);
		}
		else {
			this.curtips = this.alltips.shift() || '';
			if (this.curtips.indexOf(':') > -1) {
				let _tips = this.curtips.split(':');
				let heroid = Number(_tips[0]);
				if (!isNaN(heroid)) {
					// 自己
					if (heroid == 0) {
						this.showLeftorRight(false)
						this.lbl_tipsself.current!.text = _tips[1];
						let playerInfo = Game.GetLocalPlayerInfo()
						if (playerInfo) {
							this.heroimaageself.current!.heroid = playerInfo.player_selected_hero_id as HeroID;
						}
						// Players.
					}
					// 其他NPC
					else {
						this.showLeftorRight(true)
						this.heroimaage.current!.heroid = heroid as HeroID;
						this.lbl_tips.current!.text = _tips[1];
					}
				}
			}
			this.updateSelf()
		}
	}


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

	/**当前显示左侧 */
	showLeft: boolean = false;
	/**
	 * 显示左侧
	 * @param b
	 */
	showLeftorRight(b: boolean) {
		this.showLeft = b;
		// 左侧
		if (b) {
			this.heroimaage.current!.visible = true;
			this.lbl_tips.current!.visible = true;
			this.heroimaageself.current!.visible = false;
			this.lbl_tipsself.current!.visible = false;
		}
		else {
			this.heroimaage.current!.visible = false;
			this.lbl_tips.current!.visible = false;
			this.heroimaageself.current!.visible = true;
			this.lbl_tipsself.current!.visible = true;
		}
	}

	onbtn_nexttalk = () => {
		let entityIndex = Players.GetLocalPlayerPortraitUnit();
		let selfEntity = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())
		if (entityIndex != selfEntity) {
			if (Entities.GetTeamNumber(entityIndex) == DOTATeam_t.DOTA_TEAM_FIRST) {
				let v1 = Entities.GetAbsOrigin(selfEntity);
				let v2 = Entities.GetAbsOrigin(entityIndex);
				if (FuncHelper.IsValidDiatance(v1, v2)) {
					this.showTalk()
				}
				else {
					this.close(true);
				}
			}
		}
	}
}
