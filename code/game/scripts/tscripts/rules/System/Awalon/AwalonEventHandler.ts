import { GameEnum } from "../../../GameEnum";
import { EventHelper } from "../../../helper/EventHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { AwalonState } from "./AwalonState";
import { AwalonConfig } from "./AwalonConfig";
import { AwalonSystem } from "./AwalonSystem";

export class AwalonEventHandler {

    private static System: typeof AwalonSystem;

    /**添加协议事件 */
    public static startListen(System: typeof AwalonSystem) {
        AwalonEventHandler.System = System;
        /**获取自己身份信息 */
        EventHelper.addProtocolEvent(AwalonEventHandler,GameEnum.Event.CustomProtocol.req_get_self_shen_fen_info, (event: JS_TO_LUA_DATA) => {
            event.data = AwalonState.AllPlayerRoleConfig[event.PlayerID];
            event.state = true;
        }, );
        /**获取他人身份信息 */
        EventHelper.addProtocolEvent(AwalonEventHandler,GameEnum.Event.CustomProtocol.req_get_know_other_shen_fen_info, (event: JS_TO_LUA_DATA) => {
            let selfRoleInfo = AwalonState.AllPlayerRoleConfig[event.PlayerID];
            let data: AwalonConfig.OtherRoleInfo = {
                CampInfo: {},
                RoleType: {},
            };
            for (let playerid in AwalonState.AllPlayerRoleConfig) {
                let roletype = AwalonState.AllPlayerRoleConfig[playerid].RoleType;
                if (selfRoleInfo.Know_Player_BelongCampType[roletype] != null) {
                    data.CampInfo[playerid] = AwalonState.AllPlayerRoleConfig[playerid].CampType
                }
                if (selfRoleInfo.Know_Player_BelongRoleType[roletype] != null) {
                    data.RoleType[playerid] = selfRoleInfo.Know_Player_BelongRoleType[roletype]
                }
            }
            event.data = data;
            event.state = true;
        });
        /**请求数据，用于断线重连 */
        EventHelper.addProtocolEvent(AwalonEventHandler,GameEnum.Event.CustomProtocol.req_get_current_reconnect_data, (event: JS_TO_LUA_DATA) => {
            event.state = true;
            let data: JS_TO_LUA_DATA = {} as any;
            // 同步回合信息
            if (AwalonState.currentRoundInfo) {
                data = {} as any;
                data.state = true;
                data.data = AwalonState.currentRoundInfo;
                EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_get_current_round_info, data);
            }
            // 同步队伍信息
            if (AwalonState.currentTeamInfo) {
                data = {} as any;
                data.state = true;
                data.data = AwalonState.currentTeamInfo;
                EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_send_to_make_team, data);
            }
            // 同步队伍选票信息
            if (AwalonState.currentTeamIdea) {
                data = {} as any;
                data.state = true;
                data.data = AwalonState.currentTeamIdea;
                EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_send_to_make_team_idea, data);
            }
            // 同步发言信息
            if (AwalonState.currentChatTurn) {
                data = {} as any;
                data.state = true;
                data.data = AwalonState.currentChatTurn;
                EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_end_current_player_chat, data);
            }
            // 同步任务信息
            if (AwalonState.allTaskRecord) {
                data = {} as any;
                data.state = true;
                data.data = AwalonState.allTaskRecord;
                EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_send_to_sync_task_record, data);
            }
            // 同步任务投票
            if (AwalonState.currentTaskIdea) {
                data = {} as any;
                data.state = true;
                data.data = AwalonState.currentTaskIdea;
                EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_send_to_finish_task_idea, data);
            }
        });
        /**请求创建队伍 */
        EventHelper.addProtocolEvent(AwalonEventHandler,GameEnum.Event.CustomProtocol.req_send_to_make_team, (event: JS_TO_LUA_DATA) => {
            AwalonEventHandler.onreq_send_to_make_team(event)
        }, );
        /**提交发言顺序 */
        EventHelper.addProtocolEvent(AwalonEventHandler,GameEnum.Event.CustomProtocol.req_send_to_sure_chat_turn, (event: JS_TO_LUA_DATA) => {
            AwalonEventHandler.onreq_send_to_sure_chat_turn(event)
        }, );
        /**结束本轮发言 */
        EventHelper.addProtocolEvent(AwalonEventHandler,GameEnum.Event.CustomProtocol.req_end_current_player_chat, (event: JS_TO_LUA_DATA) => {
            AwalonEventHandler.onreq_end_current_player_chat(event)
        }, );
        /**投票組隊意见 */
        EventHelper.addProtocolEvent(AwalonEventHandler,GameEnum.Event.CustomProtocol.req_send_to_make_team_idea, (event: JS_TO_LUA_DATA) => {
            AwalonEventHandler.onreq_send_to_make_team_idea(event)
        }, );
        /**任务记录 */
        EventHelper.addProtocolEvent(AwalonEventHandler,GameEnum.Event.CustomProtocol.req_send_to_sync_task_record, (event: JS_TO_LUA_DATA) => {
            AwalonEventHandler.onreq_send_to_sync_task_record(event)
        }, );
        /**投票任务意见 */
        EventHelper.addProtocolEvent(AwalonEventHandler,GameEnum.Event.CustomProtocol.req_send_to_finish_task_idea, (event: JS_TO_LUA_DATA) => {
            AwalonEventHandler.onreq_send_to_finish_task_idea(event)
        }, );
        /**投票刺杀 */
        EventHelper.addProtocolEvent(AwalonEventHandler,GameEnum.Event.CustomProtocol.req_send_to_goto_ci_sha, (event: JS_TO_LUA_DATA) => {
            AwalonEventHandler.onreq_send_to_goto_ci_sha(event)
        }, );
    }
    /**请求创建队伍 */
    public static onreq_send_to_make_team(event: JS_TO_LUA_DATA) {
        if (event.PlayerID != AwalonState.currentRoundInfo.TeamLeaderid) {
            event.state = false;
        }
        else {
            event.state = true;
            AwalonState.currentTeamInfo = event.data;
            // AwalonState.SyncNetTable(AwalonState.enum_state.currentTeamInfo);
            // 通知所有玩家创建队伍成功
            EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_send_to_make_team_finish, event);
            TimerHelper.addTimer(0.5, () => {
                AwalonEventHandler.System.NextStage();
            }, AwalonEventHandler)
        }
    }
    /**提交发言顺序 */
    public static onreq_send_to_sure_chat_turn(event: JS_TO_LUA_DATA) {
        if (event.PlayerID != AwalonState.currentRoundInfo.TeamLeaderid) {
            event.state = false;
        }
        else if (AwalonState.currentStage != AwalonConfig.Avalon_GameStage.stage_chatTurn) {
            event.state = false;
        }
        else {
            event.state = true;
            AwalonState.currentChatTurn = event.data;
            // 计算结束PLAYERID
            if (AwalonState.currentChatTurn.chatTurn == 1) {
                AwalonState.currentChatTurn.endPlayerID = (AwalonState.currentChatTurn.nowPlayerID - 1) as PlayerID;
                if (AwalonState.currentChatTurn.endPlayerID == -1) {
                    AwalonState.currentChatTurn.endPlayerID = (AwalonState.PlayerCount - 1) as PlayerID;
                }
            }
            else {
                AwalonState.currentChatTurn.endPlayerID = (AwalonState.currentChatTurn.nowPlayerID + 1) as PlayerID;;
                if (AwalonState.currentChatTurn.endPlayerID == AwalonState.PlayerCount) {
                    AwalonState.currentChatTurn.endPlayerID = 0;
                }
            }
            event.data = AwalonState.currentChatTurn;
            // AwalonState.SyncNetTable(AwalonState.enum_state.currentChatTurn);
            // 通知所有玩家发言顺序，开始发言
            EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_send_to_sure_chat_turn, event)
            // 通知客户端下一个阶段
            AwalonEventHandler.System.NextStage();
        }
    }
    /**结束本轮发言 */
    public static onreq_end_current_player_chat(event: JS_TO_LUA_DATA) {
        AwalonState.currentChatTurn = AwalonState.currentChatTurn || {} as any;
        if (AwalonState.currentChatTurn == null || event.PlayerID != AwalonState.currentChatTurn.nowPlayerID) {
            event.state = false;
        }
        else {
            // 不可以结束发言，有个最小发言间隔
            if (!AwalonState.canEndChat) {
                event.state = false;
                return
            }
            event.state = true;
            if (AwalonState.currentChatTurn.endPlayerID != null && AwalonState.currentChatTurn.nowPlayerID != AwalonState.currentChatTurn.endPlayerID) {
                // 刷新发言时间
                AwalonEventHandler.System.NextPlayerToChat();
                event.data = AwalonState.currentChatTurn;
                // AwalonState.SyncNetTable(AwalonState.enum_state.currentChatTurn);
                // 通知所有玩家发言顺序，开始下一轮发言
                EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_end_current_player_chat, event);
                // 最小发言时间标记
                AwalonState.canEndChat = false;
                TimerHelper.addTimer(AwalonConfig.MinChatDuration, () => {
                    AwalonState.canEndChat = true
                }, AwalonEventHandler);
            }
            // 全部发言结束
            else {
                // 开始投票
                // 通知客户端下一个阶段
                AwalonEventHandler.System.NextStage();
            }
        }
    }
    /**投票組隊意见 */
    public static onreq_send_to_make_team_idea(event: JS_TO_LUA_DATA) {
        AwalonState.currentTeamIdea = AwalonState.currentTeamIdea || {};
        // LogHelper.print(event.PlayerID, event.data);
        if (AwalonState.currentStage != AwalonConfig.Avalon_GameStage.stage_agreeteam) {
            event.state = false;
        }
        else {
            if (AwalonState.currentTeamIdea['' + event.PlayerID] == null) {
                event.state = true;
                AwalonState.currentTeamIdea['' + event.PlayerID] = event.data;
                event.data = AwalonState.currentTeamIdea;
                // LogHelper.print(AwalonState.currentTeamIdea);
                // AwalonState.SyncNetTable(AwalonState.enum_state.currentTeamIdea);
                // 广播客户端投票进度
                EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_send_to_make_team_idea, event);
                // 全部投票完成
                if (Object.keys(AwalonState.currentTeamIdea).length == AwalonState.PlayerCount) {
                    let [_agreeCount, _disagreeCount] = AwalonState.GetTeamIdeaIsSuccess();
                    let data: JS_TO_LUA_DATA;
                    AwalonState.allTaskRecord[AwalonState.currentTaskID] = AwalonState.allTaskRecord[AwalonState.currentTaskID] || {} as any;
                    AwalonState.allTaskRecord[AwalonState.currentTaskID][AwalonState.currentRound] = AwalonState.allTaskRecord[AwalonState.currentTaskID][AwalonState.currentRound] || {} as any;
                    // 同步记录
                    let _record = AwalonState.allTaskRecord[AwalonState.currentTaskID][AwalonState.currentRound];
                    _record.success = _agreeCount >= _disagreeCount;
                    _record.agreeCount = _agreeCount;
                    _record.disagreeCount = _disagreeCount;
                    _record.info = AwalonState.currentTeamIdea;
                    data = {};
                    data.state = true;
                    data.data = AwalonState.allTaskRecord;
                    // 同步任务数据
                    EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_send_to_sync_task_record, data);
                    data = {};
                    data.state = true;
                    data.data = {
                        success: _agreeCount >= _disagreeCount,
                        agreeCount: _agreeCount,
                        disagreeCount: _disagreeCount
                    }
                    // 选票结果界面
                    EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_send_to_make_team_idea_result, data);
                    // 延迟2秒钟下一级阶段
                    TimerHelper.addTimer(2, () => {
                        if (_agreeCount >= _disagreeCount) {
                            // 成功，进入投票阶段
                            AwalonEventHandler.System.NextStage()
                        }
                        else {
                            // 失败，重新拉队伍
                            AwalonEventHandler.System.NextRound()
                        }
                    }, AwalonEventHandler, false);
                }
            }
        }
    }
    /**任务记录 */
    public static onreq_send_to_sync_task_record(event: JS_TO_LUA_DATA) {
        event.state = true;
        event.data = AwalonState.allTaskRecord;
    }
    /**完成任务意见 */
    public static onreq_send_to_finish_task_idea(event: JS_TO_LUA_DATA) {
        // LogHelper.print(event.data, event.PlayerID)
        AwalonState.currentTaskIdea = AwalonState.currentTaskIdea || {};
        if (AwalonState.currentStage != AwalonConfig.Avalon_GameStage.stage_task) {
            event.state = false;
        }
        else if (!AwalonState.CheckPlayerInTeam(event.PlayerID)) {
            event.state = false;
        }
        else if (AwalonState.currentTaskIdea['' + event.PlayerID] != null) {
            event.state = false;
        }
        else {
            event.state = true;
            AwalonState.currentTaskIdea['' + event.PlayerID] = event.data;
            let hasVote = Object.keys(AwalonState.currentTaskIdea);
            event.data = hasVote;
            // AwalonState.SyncNetTable(AwalonState.enum_state.currentTeamIdea);
            // 广播客户端投票进度
            EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_send_to_finish_task_idea, event);
            // 全部投票完成
            if (hasVote.length == Object.keys(AwalonState.currentTeamInfo).length) {
                let [_agreeCount, _disagreeCount] = AwalonState.GetTaskIdeaIsSuccess();
                let data: JS_TO_LUA_DATA;
                // 同步记录
                let _record = AwalonState.allTaskRecord[AwalonState.currentTaskID];
                if (_agreeCount >= _record.needPlayerCount) {
                    _record.state = AwalonConfig.Avalon_TaskStage.taskstage_success
                }
                else {
                    _record.state = AwalonConfig.Avalon_TaskStage.taskstage_fail
                }
                _record.agreeCount = _agreeCount;
                _record.disagreeCount = _disagreeCount;
                data = {};
                data.state = true;
                data.data = AwalonState.allTaskRecord;
                // 同步任务数据
                EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_send_to_sync_task_record, data);
                data = {};
                data.state = true;
                data.data = {
                    success: _record.state,
                    agreeCount: _agreeCount,
                    disagreeCount: _disagreeCount
                }
                // 选票结果界面
                EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_send_to_finish_task_idea_result, data);
                // 延迟2秒钟下一级阶段
                TimerHelper.addTimer(3, () => {
                    AwalonEventHandler.System.NextTask()
                }, AwalonEventHandler, false);
            }
        }
    }
    /**刺杀意见 */
    public static onreq_send_to_goto_ci_sha(event: JS_TO_LUA_DATA) {
        if (AwalonState.currentStage != AwalonConfig.Avalon_GameStage.stage_cisha) {
            event.state = false;
        }
        else if (AwalonState.AllPlayerRoleConfig[event.PlayerID].RoleType != AwalonConfig.Avalon_RoleType.CI_KE) {
            event.state = false;
        }
        else if (!PlayerResource.IsValidPlayerID(event.data)) {
            event.state = false;
        }
        else {
            event.state = true;
            // 红方胜利
            if (AwalonState.AllPlayerRoleConfig[event.data].RoleType == AwalonConfig.Avalon_RoleType.MEI_LIN) {
                AwalonEventHandler.System.Send_to_game_over(AwalonConfig.Avalon_CampType.Red)
            }
            // 蓝方胜利
            else {
                AwalonEventHandler.System.Send_to_game_over(AwalonConfig.Avalon_CampType.Blue)
            }
        }
    }
}