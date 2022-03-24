/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { LogHelper } from "../../helper/LogHelper";
import { ToolTipHelper } from "../../helper/ToolTipHelper";
import { RoundChatStartDialog } from "../RoundPanel/RoundChatStartDialog";
import { RoundCiShaDialog } from "../RoundPanel/RoundCiShaDialog";
import { TeamShenFenItemV1_UI } from "./TeamShenFenItemV1_UI";
export class TeamShenFenItemV1 extends TeamShenFenItemV1_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount();
		// 是否可以选择
		let canSelect = this.props.canSelect;
		if (canSelect) {
			this.panel_1.current!.SetPanelEvent("onmouseactivate",
				() => {
					LogHelper.print(1111)
					this.onbtn_select()
				}
			)
		}
		let hasSelected = this.props.hasSelected;
		if (hasSelected) {
			this.setSelect(true);
		}
		// 是否在队伍里面
		let inTeam = this.props.inTeam;
		if (inTeam != null) {
			this.setInTeam(inTeam);
		}
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
		// 队长身份
		this.img_isTeamleader.current!.visible = System_Avalon.Sys_GetData.CheckPlayerIsTeamLeader(playerID);
		let selfPlayid = Game.GetLocalPlayerID();
		// 玩家自己
		if (selfPlayid == playerID) {
			this.initSelfUI(playerID)
		}
		// 其他玩家
		else {
			this.initOtherUI(playerID)
		}
	};
	initSelfUI = (playerID: PlayerID) => {
		let selfRoleInfo = System_Avalon.Sys_GetData.GetSelfRoleInfo();
		let _campType = selfRoleInfo!.CampType;
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
	/**是否选中 */
	public hasSelect = false;
	/**点击选中 */
	onbtn_select = () => {
		// 更新父节点
		let node = RoundChatStartDialog.GetInstance()
		if (node) {
			node.selectChild(this.props.playerID)
		}
		let node1 = RoundCiShaDialog.GetInstance()
		if (node1) {
			node1.selectChild(this.props.playerID)
		}
	}
	/**选中状态 */
	setSelect(isSelect: boolean) {
		this.hasSelect = isSelect;
		if (isSelect) {
			this.panel_1.current!.style.border = '2px solid #f90c08FF'
		}
		else {
			this.panel_1.current!.style.border = null;
		}
		this.updateSelf();
	}
	/**在队伍内 */
	setInTeam(isInTeam: boolean) {
		if (isInTeam) {
			this.panel_1.current!.style.backgroundColor = '#0ffd18FF'
		}
		else {
			this.panel_1.current!.style.backgroundColor = '#000000FF';
		}
		this.updateSelf();
	}
}
