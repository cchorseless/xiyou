import { KV_DATA } from "../../config/KvAllInterface";
import { task_config } from "../../config/kvConfig/task_config";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { GameEnum } from "../../libs/GameEnum";
import { MainPanel } from "../../view/MainPanel/MainPanel";
import { CollectDialog } from "../../view/NpcPanel/CollectDialog";
import { NpcTalkDialog } from "../../view/NpcPanel/NpcTalkDialog";
import { TaskInfoDialog } from "../../view/TaskPanel/TaskInfoDialog";
import { Task_TalkInfoDialog } from "../../view/TaskPanel/Task_TalkInfoDialog";

export module System_Task {

    namespace Sys_state {
        /**个人所有任务 */
        export let selfTaskInfo: { [tasktype: string]: task_config.OBJ_1_1 };
        /**任务进度数据 */
        export let TaskJinDu: { [taskid: string]: number } = {};
        export function Init() {
            // 获取身份数据
            NetHelper.SendToLua(GameEnum.CustomProtocol.req_self_all_task, null, (event) => {
                if (event.state && event.data) {
                    Sys_state.selfTaskInfo = Sys_state.selfTaskInfo || {};
                    Sys_state.selfTaskInfo = Object.assign(Sys_state.selfTaskInfo, event.data)
                }
            }, System_Task);
        }
    };
    namespace Sys_netEvent {
        export function startListen() {
            GameEvents.Subscribe(GameEnum.GameEvent.dota_player_update_query_unit, (e) => {
                selectUnit()
            })
            GameEvents.Subscribe(GameEnum.GameEvent.dota_player_update_selected_unit, (e) => {
                selectUnit()
            });
            /**任务完成 */
            NetHelper.ListenOnLua(GameEnum.CustomProtocol.req_finish_task_from_client, (event) => {
                if (event.state && event.data && event.data.taskid) {
                    // 删除任务
                    // let tasktype = KV_DATA.task_config.taskdata![event.data.taskid as '1001']?.Tasktype
                    // delete Sys_state.selfTaskInfo[tasktype!][event.data.taskid as '1001'];
                    // // 删除任务进度
                    // delete Sys_state.TaskJinDu[event.data.taskid as '1001'];
                    TaskInfoDialog.GetInstance()?.updateUI();
                    MainPanel.GetInstance()?.showFinishTaskDialog(event.data.taskid);
                }

            }, System_Task)
            /**更新单个任务进度 */
            NetHelper.ListenOnLua(GameEnum.CustomProtocol.req_update_one_task, (event) => {
                if (event.state && event.data) {
                    Sys_state.TaskJinDu = Sys_state.TaskJinDu || {};
                    Sys_state.TaskJinDu = Object.assign(Sys_state.TaskJinDu, event.data);
                    TaskInfoDialog.GetInstance()?.updateUI()
                }

            }, System_Task)
            /**新任务 */
            NetHelper.ListenOnLua(GameEnum.CustomProtocol.req_new_task, (event) => {
                if (event.state && event.data) {
                    for (let taskid in event.data) {
                        let taskinfo: task_config.OBJ_2_1 = event.data[taskid];
                        Sys_state.selfTaskInfo = Sys_state.selfTaskInfo || {};
                        Sys_state.selfTaskInfo[taskinfo.Tasktype!] = Sys_state.selfTaskInfo[taskinfo.Tasktype!] || {};
                        Sys_state.selfTaskInfo[taskinfo.Tasktype!][taskid as '1001'] = taskinfo;
                        MainPanel.GetInstance()?.showNewTaskDialog(taskid)
                    }
                    TaskInfoDialog.GetInstance()?.updateUI()
                }
            }, System_Task)
        }

        function selectUnit() {
            let entityIndex = Players.GetLocalPlayerPortraitUnit();
            let selfEntity = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())
            let enityLabel = Entities.GetUnitLabel(entityIndex);
            if (entityIndex != selfEntity) {
                switch (enityLabel) {
                    // NPC
                    case GameEnum.Unit.UnitLabels.npc:
                        let v1 = Entities.GetAbsOrigin(selfEntity);
                        let v2 = Entities.GetAbsOrigin(entityIndex);
                        if (!FuncHelper.IsValidDiatance(v1, v2)) { return }
                        let unitName = Entities.GetUnitName(entityIndex);
                        let _task = [];
                        for (let tasktype in Sys_state.selfTaskInfo) {
                            let allTask = Sys_state.selfTaskInfo[tasktype];
                            for (let taskid in allTask) {
                                let taskInfo: task_config.OBJ_2_1 = (allTask as any)[taskid];
                                if (taskInfo.TaskFinishRequire == unitName) {
                                    _task.push(taskid)
                                }
                            }
                        };
                        // 没有任务
                        if (_task.length == 0) {
                            MainPanel.GetInstance()?.showNpcRandomTalkDialog()
                        }
                        // 只有一个任务关联
                        else if (_task.length == 1) {
                            MainPanel.GetInstance()?.showTaskTalkDialog(_task[0])
                        }
                        // 多个任务关联
                        else if (_task.length > 1) {
                        };
                        break;
                    /**采集物 */
                    case GameEnum.Unit.UnitLabels.collect:
                        MainPanel.GetInstance()?.showCollectDialog()
                        break;
                }
            }
            else {
                Task_TalkInfoDialog.GetInstance()?.close(true)
                NpcTalkDialog.GetInstance()?.close(true)
                CollectDialog.GetInstance()?.close(true)
            }
        }
    };
    export namespace Sys_config {

        /**任务类型 */
        export enum TaskType {
            /**对局任务 */
            GameTask = 1,
            /**角色任务 */
            RoleTask,
            /**协作任务 */
            TeamTask,
            /**随机任务 */
            RandomTask,
        }
        /**奖励类型 */
        export enum PrizeType {
            Gold = 1000,
            Exp,
            RankExp,
        }
        /**奖励等级 */
        export enum PrizeLevel {
            /**无星级 */
            noneStar,
            /**1星奖励 */
            oneStar,
            twoStar,
            threeStar
        }
        /**任务完成类型  */
        export enum TaskFinishType {
            /**对话 */
            Talk,
            /**采集 */
            Collect,
            /**杀怪 */
            Kill,
            /**使用道具 */
            UseItem,
            /**上交道具 */
            GiveItem,
            /**拥有道具 */
            HasItem,
            /**协作任务完成 */
            SuccessTeamTask,
            /**破坏协作任务 */
            FailTeamTask,
        }
    };
    export namespace Sys_GetData {

        export function Get_selfTaskInfo() {
            return Sys_state.selfTaskInfo as Readonly<{ [tasktype: string]: task_config.OBJ_1_1 }>
        }
        /**
         * 完成任务
         * @param taskid
         */
        export function FinishTask(taskid: string) {
            if (Sys_state.selfTaskInfo) {
                let entityIndex = Players.GetLocalPlayerPortraitUnit();
                let selfEntity = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())
                let v1 = Entities.GetAbsOrigin(selfEntity);
                let v2 = Entities.GetAbsOrigin(entityIndex);
                for (let k in Sys_state.selfTaskInfo) {
                    let taskinfo = Sys_state.selfTaskInfo[k][taskid as '1001']
                    if (taskinfo) {
                        let isFinish = false;
                        switch (Number(taskinfo.TaskFinishType)) {
                            // 对话任务
                            case Sys_config.TaskFinishType.Talk:
                                let unitName = Entities.GetUnitName(entityIndex);
                                isFinish = FuncHelper.IsValidDiatance(v1, v2) && taskinfo.TaskFinishRequire == unitName
                                break;
                        }
                        if (isFinish) {
                            NetHelper.SendToLua(GameEnum.CustomProtocol.req_finish_task_from_client, {
                                taskid: taskid,
                                entityIndex: entityIndex
                            });
                        }
                        return
                    }
                }
            }
        }
        /**
         * 获取任务进度
         * @param taskid
         */
        export function GetTaskJinDu(taskid: string) {
            return Sys_state.TaskJinDu[taskid] || 0
        }

    };
    /**是否工作 */
    export const IsWorking: boolean = true;
    export function Init() {
        IsWorking && Sys_netEvent.startListen()
    }
    export function OnAwake() {
        IsWorking && Sys_state.Init()
    }
    /**系统准备好 */
    export function IsReady() {
        if (IsWorking) {
            return Sys_GetData.Get_selfTaskInfo();
        }
    }
}