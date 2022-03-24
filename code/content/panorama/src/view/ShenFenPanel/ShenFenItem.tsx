/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { ToolTipHelper } from "../../helper/ToolTipHelper";
import { ShenFenItem_UI } from "./ShenFenItem_UI";
export class ShenFenItem extends ShenFenItem_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		let playerID = this.props.playerID;
		if (playerID >= 9) {
			this.lbl_index.current!.text = '' + (playerID + 1);
		}
		else {
			this.lbl_index.current!.text = '0' + (playerID + 1);
		}
		// 头像
		let playinfo = Game.GetPlayerInfo(playerID)
		this.playerIcon.current!.steamid = playinfo.player_steamid;
		// 玩家名字
		this.lbl_playerName.current!.text = Players.GetPlayerName(playerID);
		let selfPlayid = Game.GetLocalPlayerID();
		// 玩家自己
		if (selfPlayid == playerID) {
			this.initSelfUI(playerID)
		}
		// 其他玩家
		else {
			this.initOtherUI(playerID)
		}
		this.updateUI()
	};

	initSelfUI = (playerID: PlayerID) => {
		let selfRoleInfo = System_Avalon.Sys_GetData.GetSelfRoleInfo();
		let _campType = selfRoleInfo!.CampType;
		// 名字颜色
		this.lbl_playerName.current!.style.color = System_Avalon.Sys_GetData.Get_ShenFenNameColor(_campType);
		// 阵营图片
		if (_campType != null) {
			this.img_campicon.current!.visible = true;
			this.img_campicon.current!.style.backgroundImage = System_Avalon.Sys_GetData.Get_ShenFenCampPath(_campType);
		}
		else {
			this.img_campicon.current!.visible = false;
		}
		// 角色身份
		this.img_role2.current!.visible = false;
		let _roleType = selfRoleInfo!.RoleType;
		if (_roleType != null) {
			this.img_role1.current!.visible = true;
			this.img_role1.current!.style.backgroundImage = System_Avalon.Sys_GetData.Get_ShenFenCardiconPath(_roleType);
			// 添加相应事件
			let campstr = System_Avalon.Sys_GetData.Get_CampName(_roleType)
			let namestr = System_Avalon.Sys_GetData.Get_ShenFenName(_roleType)
			ToolTipHelper.Bind(this.img_role1.current!, ToolTipHelper.ToolTipType.DOTAShowTitleTextTooltip, campstr, namestr)
		}
	}


	initOtherUI = (playerID: PlayerID) => {
		let otherRoleInfo = System_Avalon.Sys_GetData.GetOtherRoleInfo();
		let _campType = otherRoleInfo!.CampInfo[playerID];
		// 名字颜色
		this.lbl_playerName.current!.style.color = System_Avalon.Sys_GetData.Get_ShenFenNameColor(_campType);
		// 阵营图片
		if (_campType != null) {
			this.img_campicon.current!.visible = true;
			this.img_campicon.current!.style.backgroundImage = System_Avalon.Sys_GetData.Get_ShenFenCampPath(_campType);
		}
		else {
			this.img_campicon.current!.visible = false;
		}
		// 角色身份
		this.img_role1.current!.visible = false;
		this.img_role2.current!.visible = false;
		let _roleType = otherRoleInfo!.RoleType[playerID];
		if (_roleType != null) {
			for (let i in _roleType) {
				let roleType = _roleType[i];
				let img: React.RefObject<ImagePanel> = (this as any)['img_role' + i];
				img.current!.visible = true;
				img.current!.style.backgroundImage = System_Avalon.Sys_GetData.Get_ShenFenCardiconPath(roleType);
				// 添加相应事件
				let campstr = System_Avalon.Sys_GetData.Get_CampName(roleType)
				let namestr = System_Avalon.Sys_GetData.Get_ShenFenName(roleType)
				ToolTipHelper.Bind(img.current!, ToolTipHelper.ToolTipType.DOTAShowTitleTextTooltip, campstr, namestr)
			}
		}
	}


	updateUI() {
		let playerID = this.props.playerID;
		// 队长身份
		let roundinfo = System_Avalon.Sys_GetData.GetCurrentRoundInfo();
		if (roundinfo) {
			this.img_cantchat.current!.visible = true;
			this.img_isTeamleader.current!.visible = roundinfo.TeamLeaderid == playerID;
			// 发言权限
			if (roundinfo.stage == System_Avalon.Sys_config.Avalon_GameStage.stage_chat) {
				let currentTurn = System_Avalon.Sys_GetData.GetCurrentChatTurn();
				if (currentTurn) {
					if (currentTurn.nowPlayerID == playerID) {
						this.img_cantchat.current!.visible = false;

					}
				}
			}
		}

		this.updateSelf()
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
}
