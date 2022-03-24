/** Create By Editor*/
import React, { createRef, useState } from "react";
import { System_Avalon } from "../../game/system/System_Avalon";
import { DotaUIHelper } from "../../helper/DotaUIHelper";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { DebugPanel } from "../debugPanel/DebugPanel";
import { CollectDialog } from "../NpcPanel/CollectDialog";
import { NpcTalkDialog } from "../NpcPanel/NpcTalkDialog";
import { RoundChatProgressDialog } from "../RoundPanel/RoundChatProgressDialog";
import { RoundChatStartDialog } from "../RoundPanel/RoundChatStartDialog";
import { RoundCiShaDialog } from "../RoundPanel/RoundCiShaDialog";
import { RoundOverDialog } from "../RoundPanel/RoundOverDialog";
import { RoundStartDialog } from "../RoundPanel/RoundStartDialog";
import { ShenFenAllPlayerDialog } from "../ShenFenPanel/ShenFenAllPlayerDialog";
import { ShenFenDialog } from "../ShenFenPanel/ShenFenDialog";
import { ShenFenSmallDialog } from "../ShenFenPanel/ShenFenSmallDialog";
import { TaskGoForFinishDialog } from "../TaskPanel/TaskGoForFinishDialog";
import { TaskInfoDialog } from "../TaskPanel/TaskInfoDialog";
import { TaskRecordDialog } from "../TaskPanel/TaskRecordDialog";
import { TaskResultDialog } from "../TaskPanel/TaskResultDialog";
import { Task_FinishTaskDialog } from "../TaskPanel/Task_FinishTaskDialog";
import { Task_NewTaskDialog } from "../TaskPanel/Task_NewTaskDialog";
import { Task_TalkInfoDialog } from "../TaskPanel/Task_TalkInfoDialog";
import { TeamAgreeGoForTaskDialog } from "../TeamPanel/TeamAgreeGoForTaskDialog";
import { TeamPanel } from "../TeamPanel/TeamPanel";
import { TeamResultDialog } from "../TeamPanel/TeamResultDialog";
import { TopBarPanel } from "../TopBarPanel/TopBarPanel";
import { MainPanel_UI } from "./MainPanel_UI";
export class MainPanel extends MainPanel_UI {
	// 初始化数据
	componentDidMount() {
		super.componentDidMount()
		this.btn_showAllInfo_close.current!.visible = false;
		this.panel_allpanel.current!.hittest = false;

		this.updateSelf()

	};
	// 更新渲染
	/**
	 *
	 * @param prevProps 上一个状态的 props
	 * @param prevState
	 * @param snapshot
	 */
	componentDidUpdate(prevProps: any, prevState: any, snapshot?: any) {
		super.componentDidUpdate(prevProps, prevState, snapshot)
	};
	/**更新投票结果 */
	updateRoundUI() {
		let _rouneInfo = System_Avalon.Sys_GetData.GetCurrentRoundInfo();
		switch (_rouneInfo!.stage) {
			case System_Avalon.Sys_config.Avalon_GameStage.stage_maketeam:
				TeamResultDialog.GetInstance()?.destroy();
				if (_rouneInfo!.TeamLeaderid == Players.GetLocalPlayer()) {
					this.addOrShowOnlyNodeChild(this.NODENAME.panel_allpanel, TeamPanel, { marginTop: '190px', uiScale: '90%' });
				}
				else {
					this.addOrShowOnlyNodeChild(this.NODENAME.panel_allpanel, RoundStartDialog, { horizontalAlign: 'middle', verticalAlign: 'middle', playerID: _rouneInfo!.TeamLeaderid });
				}
				break;
			case System_Avalon.Sys_config.Avalon_GameStage.stage_chatTurn:
				RoundStartDialog.GetInstance()?.destroy()
				if (System_Avalon.Sys_GetData.CheckPlayerIsTeamLeader()) {
					/**队伍顺序安排界面 */
					this.addOrShowOnlyNodeChild(this.NODENAME.panel_allpanel, RoundChatStartDialog, { marginTop: '190px', uiScale: '90%' })
				}
				else {
					this.addOrShowOnlyNodeChild(this.NODENAME.panel_allpanel, RoundChatProgressDialog, { marginTop: '190px', uiScale: '90%' });
				}
				break;
			case System_Avalon.Sys_config.Avalon_GameStage.stage_chat:
				// 关闭老界面
				RoundChatStartDialog.GetInstance()?.destroy();
				let _turnInfo = System_Avalon.Sys_GetData.GetCurrentChatTurn();
				if (_turnInfo) {
					let v = RoundChatProgressDialog.GetInstance()
					if (v) {
						v.updateUI()
					}
					else {
						this.addOrShowOnlyNodeChild(this.NODENAME.panel_allpanel, RoundChatProgressDialog, { marginTop: '190px', uiScale: '90%' });
					}
				}
				break;
			case System_Avalon.Sys_config.Avalon_GameStage.stage_agreeteam:
				// 关闭老界面
				RoundChatProgressDialog.GetInstance()?.destroy();
				let v = TeamAgreeGoForTaskDialog.GetInstance()
				if (v) {
					v.updateAgreeInfo()
				}
				else {
					this.addOrShowOnlyNodeChild(this.NODENAME.panel_allpanel, TeamAgreeGoForTaskDialog, { marginTop: '190px', uiScale: '90%' });
				}
				break;
			case System_Avalon.Sys_config.Avalon_GameStage.stage_task:
				TeamResultDialog.GetInstance()?.destroy();
				break;
			case System_Avalon.Sys_config.Avalon_GameStage.stage_cisha:
				this.addOrShowOnlyNodeChild(this.NODENAME.panel_allpanel, RoundCiShaDialog, { marginTop: '190px', uiScale: '90%' })
				break;
		}
		this.updateSelf()
	}
	/**组队结果 */
	showTeamResult(data: { success: boolean, agreeCount: number, disagreeCount: number }) {
		// 关闭界面
		let TeamAgree = TeamAgreeGoForTaskDialog.GetInstance()
		if (TeamAgree) {
			TeamAgree.destroy()
		}
		let TeamResult = TeamResultDialog.GetInstance()
		if (TeamResult) {
			TeamResult.updateUI(data)
		}
		else {
			this.addOrShowOnlyNodeChild(this.NODENAME.panel_allpanel, TeamResultDialog, {
				horizontalAlign: 'middle',
				verticalAlign: 'middle',
				data: data
			})
		}
		this.updateSelf()
	}
	/**任务投票结果 */
	showTaskResult() {
		this.addOrShowOnlyNodeChild(this.NODENAME.panel_allpanel, TaskResultDialog, {
			horizontalAlign: 'middle',
			verticalAlign: 'middle',
		})
		this.updateSelf()

	}
	/**游戏结束 */
	showGameOver(data: {
		campinfo: any,
		roleInfo: any,
		winner: any,
	}) {
		this.addOrShowOnlyNodeChild(this.NODENAME.panel_allpanel, RoundOverDialog, {
			marginTop: '190px',
			uiScale: '90%',
			winner: data.winner
		})
		this.updateSelf()
	}

	/**自己身份 */
	onbtn_showInfo = () => {
		this.addOrShowOnlyNodeChild(this.NODENAME.__root__, ShenFenDialog, { marginTop: '150px' });
		this.updateSelf()
	}

	/**debug */
	onbtn_click = () => {
		this.addOrShowOnlyNodeChild(this.NODENAME.__root__, DebugPanel)
		this.updateSelf()
	}
	/**任务界面 */
	onbtn_showtask = () => {
		this.addOrShowOnlyNodeChild(this.NODENAME.__root__, TaskInfoDialog, { marginTop: '360px' })
		LogHelper.print('onbtn_showtask')
		this.updateSelf()
	}
	/**全队玩家 */
	onbtn_showAllInfo = () => {
		let show = this.btn_showAllInfo_close.current!.visible;
		this.btn_showAllInfo_close.current!.visible = !show;
		if (show) {
			ShenFenAllPlayerDialog.GetInstance()!.close(false);
		}
		else {
			this.addOrShowOnlyNodeChild(this.NODENAME.__root__, ShenFenAllPlayerDialog,
				{
					flowChildren: 'down',
					marginTop: '35px',
					marginRight: '0px',
					horizontalAlign: 'right',
				});
		}
		this.updateSelf()
	}
	/**更新所有玩家信息 */
	updateshowAllInfo() {
		this.GetOneNodeChild(this.NODENAME.__root__, ShenFenAllPlayerDialog)?.updateUI()
	}
	/**头部条 */
	show_TopBar = () => {
		this.addOrShowOnlyNodeChild(this.NODENAME.__root__, TopBarPanel);
	}
	/**显示投票记录 */
	showTaskRecord = (taskID: number) => {
		this.addOrShowOnlyNodeChild(this.NODENAME.__root__, TaskRecordDialog, {
			taskID: taskID,
			horizontalAlign: 'middle', verticalAlign: 'middle',
		})
		this.updateSelf()
	}
	/**是否显示中央的界面 */
	isShowAllpanel = true;
	/**游戏界面 */
	onbtn_showgamepanel = () => {
		this.isShowAllpanel = !this.isShowAllpanel
		this.panel_allpanel.current!.visible = this.isShowAllpanel
		this.updateSelf()
	}
	/**显示任务对话列表 */
	showTaskTalkListDialog = () => {

	}
	/**NPC随机聊天界面 */
	showNpcRandomTalkDialog = () => {
		this.addOrShowOnlyNodeChild(this.NODENAME.__root__, NpcTalkDialog,
			{
				horizontalAlign: 'middle',
				verticalAlign: 'bottom',
				marginBottom: '170px'
			}
		);
		this.updateSelf()
	}

	/**显示任务对话界面 */
	showTaskTalkDialog = (taskid: string) => {
		this.addOrShowOnlyNodeChild(this.NODENAME.__root__, Task_TalkInfoDialog,
			{
				taskid: taskid,
				horizontalAlign: 'middle',
				verticalAlign: 'bottom',
				marginBottom: '170px'
			}
		);
		this.updateSelf()
	}

	/**新任务 */
	showNewTaskDialog = (taskid: string) => {
		let bottom = 150;
		let count = Task_NewTaskDialog.GetAllNode();
		let count1 = Task_FinishTaskDialog.GetAllNode();
		if (count) {
			bottom += count.length * 120
		}
		if (count1) {
			bottom += count1.length * 120
		}
		this.addNodeChildAt(this.NODENAME.__root__, Task_NewTaskDialog,
			{
				taskid: taskid,
				horizontalAlign: 'middle',
				verticalAlign: 'bottom',
				marginBottom: bottom + 'px'
			}
		);
		this.updateSelf()
	}

	/**任务完成 */
	showFinishTaskDialog = (taskid: string) => {
		let bottom = 150;
		let count = Task_NewTaskDialog.GetAllNode();
		let count1 = Task_FinishTaskDialog.GetAllNode();
		if (count) {
			bottom += count.length * 120
		}
		if (count1) {
			bottom += count1.length * 120
		}
		this.addNodeChildAt(this.NODENAME.__root__, Task_FinishTaskDialog,
			{
				taskid: taskid,
				horizontalAlign: 'middle',
				verticalAlign: 'bottom',
				marginBottom: bottom + 'px'
			}
		);
		this.updateSelf()
	}

	/**
	 * 采集物界面
	 */
	showCollectDialog = () => {
		this.addOrShowOnlyNodeChild(this.NODENAME.__root__, CollectDialog,
			{
				horizontalAlign: 'middle',
				verticalAlign: 'bottom',
				marginBottom: '15px'
			}
		);
		this.updateSelf()
	}

}
