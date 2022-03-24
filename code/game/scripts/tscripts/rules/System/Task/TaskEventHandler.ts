// import { GameEnum } from "../../../GameEnum";
// import { GameFunc } from "../../../GameFunc";
// import { EventHelper } from "../../../helper/EventHelper";
// import { LogHelper } from "../../../helper/LogHelper";
// import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
// import { AwalonConfig } from "../Awalon/AwalonConfig";
// import { AwalonState } from "../Awalon/AwalonState";
// import { PlayerSystem } from "../Player/PlayerSystem";
// import { TaskConfig } from "./TaskConfig";
// import { TaskSystem } from "./TaskSystem";

// export class TaskEventHandler {

//     private static System: typeof TaskSystem;

//     public static startListen(sys: typeof TaskSystem) {
//         this.System = sys;
//         /**产生协作任务 */
//         EventHelper.addServerEvent(GameEnum.Event.CustomServer.onserver_create_team_task, (event: LUA_TO_LUA_DATA) => {
//             let teaminfo = AwalonState.GetcurrentTeamInfo();
//             for (let k in teaminfo) {
//                 let playerid = teaminfo[k];
//                 let roleconfig = AwalonState.GetRoleConfig(playerid);
//                 let taskinfo = sys.GetTaskByType(TaskConfig.TaskType.TeamTask, 1, roleconfig.RoleType, roleconfig.CampType);
//                 for (let taskid in taskinfo) {
//                     this.sendNewTask(playerid, taskid);
//                 }
//             }
//         }, this);
//         /**更新对局任务进度 */
//         EventHelper.addServerEvent(GameEnum.Event.CustomServer.onserver_update_game_task_jindu, (event: LUA_TO_LUA_DATA) => {
//             let success = event.data.success;
//             let fail = event.data.fail;
//             let successPlayer = event.data.successPlayer as PlayerID[];
//             let failPlayer = event.data.failPlayer as PlayerID[];
//             let allplayer = [].concat(successPlayer).concat(failPlayer);
//             allplayer.forEach(
//                 (playerid) => {
//                     if (sys.GetPlayerTask(playerid) == null) return;
//                     let alltaskid = sys.GetPlayerTask(playerid).allTaskInfo[TaskConfig.TaskType.GameTask];
//                     if (alltaskid == null) return;
//                     for (let taskid in alltaskid) {
//                         let _count = 0 as any;
//                         if (successPlayer.indexOf(playerid) > -1) {
//                             _count = success;
//                         }
//                         else {
//                             _count = fail;
//                         }
//                         let _event: JS_TO_LUA_DATA = {};
//                         _event.PlayerID = playerid;
//                         _event.state = false;
//                         _event.data = { taskid: taskid };
//                         _event.state = this.finishTask(_event.PlayerID, _event.data.taskid, _count, true)
//                         // 完成任务通知客户端
//                         if (_event.state) {
//                             EventHelper.fireProtocolEventToPlayer(GameEnum.Event.CustomProtocol.req_finish_task_from_client, _event, _event.PlayerID);
//                         }
//                     }
//                 }
//             )
//         })
//         /**服务器完成任务 */
//         EventHelper.addServerEvent(GameEnum.Event.CustomServer.onserver_finish_task, (event: LUA_TO_LUA_DATA) => {
//             let _event = event as JS_TO_LUA_DATA;
//             _event.state = false;
//             let _info = sys.GetPlayerTask(_event.PlayerID).allTaskInfo;
//             if (_info && _event.data && _event.data.taskid) {
//                 /**任务完成目标实体 */
//                 let entityIndex = _event.data.entityIndex;
//                 _event.state = this.finishTask(_event.PlayerID, _event.data.taskid, entityIndex, true)
//                 // 完成任务通知客户端
//                 if (_event.state) {
//                     EventHelper.fireProtocolEventToPlayer(GameEnum.Event.CustomProtocol.req_finish_task_from_client, _event, _event.PlayerID);
//                 }
//             };
//         }, this);
//         /**请求任务信息 */
//         EventHelper.addProtocolEvent(GameEnum.Event.CustomProtocol.req_self_all_task, (event: JS_TO_LUA_DATA) => {
//             event.state = false;
//             if (Sys_state.allPlayerTask[event.PlayerID] == null) {
//                 let role = AwalonState.GetRoleConfig(event.PlayerID).RoleType;
//                 if (role == null) {
//                     return
//                 }
//                 let camp = AwalonConfig.CampRole[role]
//                 let _info = {} as any;
//                 // 对局任务
//                 _info[TaskConfig.TaskType.GameTask] = sys.GetTaskByType(TaskConfig.TaskType.GameTask, 1, null, camp)
//                 // 角色任务
//                 _info[TaskConfig.TaskType.RoleTask] = sys.GetTaskByType(TaskConfig.TaskType.RoleTask, 1, role)
//                 // 随机任务
//                 _info[TaskConfig.TaskType.RandomTask] = sys.GetTaskByType(TaskConfig.TaskType.RandomTask, 3, null, camp);
//                 sys.GetPlayerTask(event.PlayerID).allTaskInfo = _info;
//             }
//             event.data = sys.GetPlayerTask(event.PlayerID).allTaskInfo;
//             event.state = true;

//         }, this);
//         /**客户端请求任务完成 */
//         EventHelper.addProtocolEvent(GameEnum.Event.CustomProtocol.req_finish_task_from_client, (event: JS_TO_LUA_DATA) => {
//             event.state = false;
//             let _info = sys.GetPlayerTask(event.PlayerID).allTaskInfo
//             if (_info && event.data && event.data.taskid) {
//                 /**任务完成目标实体 */
//                 let entityIndex = event.data.entityIndex;
//                 event.state = this.finishTask(event.PlayerID, event.data.taskid, entityIndex, false);
//                 LogHelper.print(event.state, 11111)
//             }
//         }, this);
//         /**请求采集 */
//         EventHelper.addProtocolEvent(GameEnum.Event.CustomProtocol.req_collect_entity, (event: JS_TO_LUA_DATA) => {
//             let entityIndex: EntityIndex = event.data;
//             event.state = false;
//             if (entityIndex) {
//                 let entity = EntIndexToHScript(entityIndex) as BaseNpc_Plus
//                 if (entity) {
//                     if (entity.GetUnitLabel() == GameEnum.Unit.UnitLabels.collect) {
//                         let hero = PlayerResource.GetPlayer(event.PlayerID).GetAssignedHero();
//                         // 使用采集技能
//                         let ability = hero.FindAbilityByName('ability2_courier_base')
//                         GameFunc.ExecuteOrder(hero, dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET, entity, ability);
//                     }
//                 }

//             }
//         })
//     }

//     /**
//      * 完成任务
//      * @param playerid
//      * @param taskid
//      * @param entityIndex 目标实体id || gameTASK 完成次数
//      * @param isByServer 是否是服务器触发
//      */
//     private static finishTask(playerid: PlayerID, taskid: string, entityIndex: EntityIndex = null, isByServer: boolean = true) {
//         let state = false;
//         let _info = this.System.GetPlayerTask(playerid).allTaskInfo;
//         if (_info) {
//             let taskinfo;
//             for (let k in _info) {
//                 taskinfo = _info[k][taskid as '1001']
//                 if (taskinfo) {
//                     let finishOnce = false;
//                     switch (tonumber(taskinfo.TaskFinishType)) {
//                         // 对话任务
//                         case TaskConfig.TaskFinishType.Talk:
//                             if (entityIndex != null) {
//                                 let entity = EntIndexToHScript(entityIndex) as BaseNpc_Plus;
//                                 let v = entity.GetAbsOrigin();
//                                 let v1 = PlayerResource.GetPlayer(playerid).GetAssignedHero().GetAbsOrigin();
//                                 finishOnce = GameFunc.VectorFunctions.IsValidDiatance(v, v1) && entity.GetUnitName() == taskinfo.TaskFinishRequire;
//                             }
//                             break;
//                         // 杀怪
//                         case TaskConfig.TaskFinishType.Kill:
//                         // 采集
//                         case TaskConfig.TaskFinishType.Collect:
//                         // 使用道具
//                         case TaskConfig.TaskFinishType.UseItem:
//                         // 上交道具
//                         case TaskConfig.TaskFinishType.GiveItem:
//                         // 拥有道具
//                         case TaskConfig.TaskFinishType.HasItem:
//                         // 对局任务计数
//                         case TaskConfig.TaskFinishType.SuccessTeamTask:
//                         case TaskConfig.TaskFinishType.FailTeamTask:
//                             finishOnce = isByServer;
//                             break;
//                     }
//                     // 任务完成次数对比
//                     if (finishOnce) {
//                         let needCount = tonumber(taskinfo.TaskFinishRequireCount)
//                         if (needCount != null) {
//                             if (needCount == 1) {
//                                 state = finishOnce
//                             }
//                             else if (needCount > 1) {
//                                 this.System.GetPlayerTask(playerid).TaskJinDu[playerid] = Sys_state.TaskJinDu[playerid] || {};
//                                 Sys_state.TaskJinDu[playerid][taskid] = Sys_state.TaskJinDu[playerid][taskid] || 0;
//                                 switch (tonumber(taskinfo.TaskFinishType)) {
//                                     case TaskConfig.TaskFinishType.HasItem:
//                                         // 道具数量
//                                         Sys_state.TaskJinDu[playerid][taskid] = PlayerSystem.GetPlayer(playerid).GetItemCount(taskinfo.TaskFinishRequire!)
//                                         break;
//                                     case TaskConfig.TaskFinishType.SuccessTeamTask:
//                                     case TaskConfig.TaskFinishType.FailTeamTask:
//                                         // 对局任务计数
//                                         Sys_state.TaskJinDu[playerid][taskid] = entityIndex || 0;
//                                         break;
//                                     default:
//                                         Sys_state.TaskJinDu[playerid][taskid] += 1;
//                                         break
//                                 }
//                                 // 完成
//                                 if (Sys_state.TaskJinDu[playerid][taskid] >= needCount) {
//                                     state = finishOnce;
//                                     delete Sys_state.TaskJinDu[playerid][taskid];
//                                 }
//                                 // 未完成，更新进度
//                                 else {
//                                     state = false;
//                                     this.sendTaskJinDu(playerid, taskid)
//                                 }
//                             }
//                         }
//                         else {
//                             state = finishOnce
//                         }
//                     }
//                     break
//                 }
//             }
//             if (state) {
//                 // 获取奖励
//                 this.sendTaskPrize(playerid, taskid);
//                 // 删除原任务
//                 if (taskinfo) {
//                     delete Sys_state.allPlayerTask[playerid][taskinfo.Tasktype][taskid as '1001']
//                 }
//                 // 任务链
//                 // let nexttask = KVHelper.KvServerConfig.task_config[taskid as '1001'].NextTask;
//                 // if (nexttask) {
//                 //     // 下一帧推送新任务
//                 //     TimerHelper.addFrameTimer(1, () => {
//                 //         sendNewTask(playerid, '' + nexttask)
//                 //     }, this)
//                 // };
//             }
//         }
//         return state;
//     }

//     /**
//      * 推送新的任务
//      * @param playerid
//      * @param taskid
//      */
//     private static sendNewTask(playerid: PlayerID, taskid: string) {
//         Sys_state.allPlayerTask[playerid] = Sys_state.allPlayerTask[playerid] || {};
//         // let info = KVHelper.KvServerConfig.task_config[taskid as "1001"];
//         // if (info) {
//         //     Sys_state.allPlayerTask[playerid][info.Tasktype] = Sys_state.allPlayerTask[playerid][info.Tasktype] || {};
//         //     Sys_state.allPlayerTask[playerid][info.Tasktype][taskid as "1001"] = info;
//         //     let event = {} as JS_TO_LUA_DATA;
//         //     event.data = {};
//         //     event.data[taskid] = info;
//         //     EventHelper.fireProtocolEventToPlayer(GameEnum.Event.CustomProtocol.req_new_task, event, playerid);
//         // }
//     }
//     /**
//      * 更新任务进度
//      * @param playerid
//      * @param taskid
//      */
//     private static sendTaskJinDu(playerid: PlayerID, taskid: string) {
//         Sys_state.TaskJinDu[playerid] = Sys_state.TaskJinDu[playerid] || {};
//         Sys_state.TaskJinDu[playerid][taskid] = Sys_state.TaskJinDu[playerid][taskid] || 0;
//         if (Sys_state.TaskJinDu[playerid][taskid] > 0) {
//             let event = {} as JS_TO_LUA_DATA;
//             event.data = {};
//             event.data[taskid] = Sys_state.TaskJinDu[playerid][taskid];
//             EventHelper.fireProtocolEventToPlayer(GameEnum.Event.CustomProtocol.req_update_one_task, event, playerid);
//         }
//     }
//     /**
//      * 发放任务奖励
//      * @param playerid
//      * @param taskid
//      */
//     private static sendTaskPrize(playerid: PlayerID, taskid: string) {
//         Sys_state.allPlayerTask[playerid] = Sys_state.allPlayerTask[playerid] || {};
//         // let info = KVHelper.KvServerConfig.task_config[taskid as "1001"];
//         // if (info && info.TaskPrize) {
//         //     let prizeList = KVHelper.DealItemPrizeStr(info.TaskPrize);
//         //     LogHelper.print(prizeList);
//         //     prizeList.forEach(
//         //         (prize) => {
//         //             let itemid = prize[0];
//         //             let itemCount = prize[1];
//         //             switch (itemid) {
//         //                 case TaskConfig.PrizeType.Gold:
//         //                     PlayerResource.ModifyGold(playerid, itemCount, true, EDOTA_ModifyGold_Reason.DOTA_ModifyGold_AbilityGold)
//         //                     break
//         //                 case TaskConfig.PrizeType.Exp:
//         //                     PlayerResource.GetPlayer(playerid).GetAssignedHero().AddExperience(itemCount, EDOTA_ModifyXP_Reason.DOTA_ModifyXP_Unspecified, false, true)
//         //                     break
//         //                 case TaskConfig.PrizeType.RankExp:
//         //                     break
//         //             }
//         //         }
//         //     )
//         // }

//     }
// }