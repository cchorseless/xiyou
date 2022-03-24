/** Create By Editor*/
import React, { createRef, useState } from "react";
import { KV_DATA } from "../../config/KvAllInterface";
import { KVHelper } from "../../helper/KVHelper";
import { CSSHelper } from "../../helper/CSSHelper";
import { TaskInfoItem_UI } from "./TaskInfoItem_UI";
import { System_Task } from "../../game/system/System_Task";
import { LogHelper } from "../../helper/LogHelper";
export class TaskInfoItem extends TaskInfoItem_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		CSSHelper.addBorderStyle(this.__root__);
		let taskid = this.props.taskid;
		// let taskinfo = KV_DATA.task_config.taskdata![taskid as '1001'];
		// if (taskinfo) {
		// 	// 寻路
		// 	this.lbl_gototask.current!.visible = !!taskinfo.TaskFinishRequire;
		// 	switch (Number(taskinfo.TaskFinishType)) {
		// 		case System_Task.Sys_config.TaskFinishType.HasItem:
		// 		case System_Task.Sys_config.TaskFinishType.UseItem:
		// 			this.lbl_gototask.current!.visible = false;
		// 			break;
		// 	}
		// 	this.lbl_taskdes.current!.html = true;
		// 	let finishType = ['对话', '采集', '战斗', '使用', '给予', '收集', '协作', '破坏'][Number(taskinfo.TaskFinishType)]
		// 	if (finishType) {
		// 		finishType = CSSHelper.HtmlTxt.createHtmlTxt(`[${finishType}]`, { color: CSSHelper.enumColorDes.Red })
		// 	}
		// 	else {
		// 		finishType = ''
		// 	}
		// 	// 标题
		// 	let title = CSSHelper.HtmlTxt.createHtmlTxt(taskinfo.TaskName!, { color: CSSHelper.enumColorDes.Yellow });
		// 	// 描述
		// 	let des = taskinfo.TaskDes;
		// 	// 进度
		// 	let jindudes = ""
		// 	if (taskinfo.TaskFinishRequireCount) {
		// 		jindudes = `(${System_Task.Sys_GetData.GetTaskJinDu(taskid)}/${taskinfo.TaskFinishRequireCount})`
		// 	}
		// 	this.lbl_taskdes.current!.text = finishType + ' ' + title + '<br/>' + des + jindudes;
		// 	this.lbl_prizedes.current!.text = '奖励:' + KVHelper.GetPrizeStr(taskinfo.TaskPrize!);
		// 	this.lbl_tasktype.current!.text = ['', '对局', '角色', '协作', '金币'][parseInt(taskinfo.Tasktype!)];
		// }
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
	/**点击寻路 */
	onbtn_goTask = () => {
		let taskid = this.props.taskid;
		// let taskinfo = KV_DATA.task_config.taskdata![taskid as '1001'];
		// if (taskinfo) {
		// 	let unitName = taskinfo.TaskFinishRequire;
		// 	switch (Number(taskinfo.TaskFinishType)) {
		// 		case System_Task.Sys_config.TaskFinishType.Talk:
		// 		case System_Task.Sys_config.TaskFinishType.Kill:
		// 		case System_Task.Sys_config.TaskFinishType.Collect:
		// 			break
		// 		// 给予道具
		// 		case System_Task.Sys_config.TaskFinishType.GiveItem:
		// 			unitName = taskinfo.TaskFinishRequireWith;
		// 			break;
		// 	}
		// 	if (unitName == null) { return }
		// 	let selfEntity = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())
		// 	let v1 = Entities.GetAbsOrigin(selfEntity);
		// 	let posiid = KVHelper.FindNearestNpcByName(unitName!, v1)
		// 	let info = KV_DATA.npc_position_config.npcposition![posiid as '1001']
		// 	let target_v: [number, number, number] = [
		// 		Number(info!.position_x),
		// 		Number(info!.position_y),
		// 		Number(info!.position_z)
		// 	];
		// 	let order: PrepareUnitOrdersArgument = {
		// 		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION,
		// 		Position: target_v,
		// 		UnitIndex: selfEntity,
		// 		OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_HERO_ONLY,
		// 	}
		// 	Game.PrepareUnitOrders(order);
		// }


	}
}
