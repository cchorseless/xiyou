import { GameEnum } from "../../../GameEnum";
import { GameFunc } from "../../../GameFunc";
import { EventHelper } from "../../../helper/EventHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { item_towerchange_custom } from "../../../npc/items/avalon/item_towerchange_custom";
import { modifier_tp } from "../../../npc/modifier/modifier_tp";
import { AwalonEventHandler } from "./AwalonEventHandler";
import { AwalonConfig } from "./AwalonConfig";
import { AwalonState } from "./AwalonState";
import { PlayerHeroComponent } from "../../Components/Player/PlayerHeroComponent";

export class AwalonSystem {

    /**是否工作 */
    public static IsWorking: boolean = true;
    /**初始化 */
    public static Init(_PlayerCount: AwalonConfig.Avalon_PlayerCount) {
        if (!AwalonSystem.IsWorking) { return }
        if (AwalonConfig.Avalon_PlayerCount[_PlayerCount] == null) { return; }
        if (!IsServer()) { return; }
        AwalonState.Init(_PlayerCount);
        // 添加监听事件
        AwalonEventHandler.startListen(AwalonSystem);


    }
    /**游戏开始 */
    public static Start() {
        if (!AwalonSystem.IsWorking) { return }
        if (!IsServer()) { return }
        AwalonState.currentRound = 0;
        AwalonState.allRoundindex = 0;
        AwalonState.currentTaskID = 1;
        // 第一个任务状态
        AwalonState.allTaskRecord[AwalonState.currentTaskID].state = AwalonConfig.Avalon_TaskStage.taskstage_ing;
        AwalonSystem.NextRound(false);
    }
    /**下一个阶段 */
    public static NextStage() {
        if (!IsServer()) { return }
        if (AwalonState.currentStage == null) { return }
        AwalonState.currentStage += 1;
        // 强制流局
        if (AwalonState.currentStage == AwalonConfig.Avalon_GameStage.stage_chatTurn && AwalonState.currentRound == AwalonConfig.MaxRound) {
            AwalonState.currentStage = AwalonConfig.Avalon_GameStage.stage_task;
        }
        let allPlayerinfo = AwalonState.AllPlayerRoleConfig;
        // 具体处理
        switch (AwalonState.currentStage) {
            case AwalonConfig.Avalon_GameStage.stage_maketeam:
                break
            case AwalonConfig.Avalon_GameStage.stage_chatTurn:
                break
            case AwalonConfig.Avalon_GameStage.stage_chat:
                break;
            // 组队投票
            case AwalonConfig.Avalon_GameStage.stage_agreeteam:
                AwalonState.currentTeamIdea = {};
                break;
            // 任务投票--产生新的协作任务
            case AwalonConfig.Avalon_GameStage.stage_task:
                EventHelper.fireServerEvent(GameEnum.Event.CustomServer.onserver_create_team_task);
                // 传送队伍内的成员
                let teaminfo = AwalonState.currentTeamInfo;
                let redPoints = AwalonState.GetTpPoint(AwalonConfig.Avalon_CampType.Red, Object.keys(teaminfo).length);
                let bluePoints = AwalonState.GetTpPoint(AwalonConfig.Avalon_CampType.Blue,
                    Object.keys(allPlayerinfo).length - Object.keys(teaminfo).length);
                for (let playerid in allPlayerinfo) {
                    let _playerid = tonumber(playerid) as PlayerID;
                    let point: Vector = null;
                    let hero = GameRules.Addon.ETRoot.PlayerSystem().GetHero(_playerid)
                    // 队伍内
                    if (AwalonState.CheckPlayerInTeam(_playerid)) {
                        point = redPoints.shift();
                        // 给道具
                        item_towerchange_custom.CreateOneToUnit(hero)
                    }
                    else {
                        point = bluePoints.shift()
                    }
                    if (point) {
                        modifier_tp.TeleportToPoint(hero, null, point)
                    }
                }
                break
            // 刺杀
            case AwalonConfig.Avalon_GameStage.stage_cisha:
                break
        }
        AwalonSystem.SyncClient_Round_info()
    }
    /**下一个玩家发言 */
    public static NextPlayerToChat() {
        if (!IsServer()) { return };
        if (AwalonState.currentChatTurn.chatTurn == 1) {
            AwalonState.currentChatTurn.nowPlayerID += 1
            if (AwalonState.currentChatTurn.nowPlayerID == AwalonState.PlayerCount) {
                AwalonState.currentChatTurn.nowPlayerID = 0
            }
        }
        else {
            AwalonState.currentChatTurn.nowPlayerID -= 1;
            if (AwalonState.currentChatTurn.nowPlayerID == -1) {
                AwalonState.currentChatTurn.nowPlayerID = (AwalonState.PlayerCount - 1) as PlayerID;
            }
        }
        AwalonSystem.SyncClient_Round_info();
    }
    /**下个任务 */
    public static NextTask() {
        if (!IsServer()) { return }
        if (AwalonState.currentTaskID == null) { return };
        let allPlayerinfo = AwalonState.AllPlayerRoleConfig;
        // 传送回出生点
        for (let playerid in allPlayerinfo) {
            let _playerid = tonumber(playerid) as PlayerID;
            let hero = GameRules.Addon.ETRoot.PlayerSystem().GetHero(_playerid)
            let firstSpawnPoint = hero.ETRoot.GetComponent(PlayerHeroComponent).firstSpawnPoint;
            let istp = GameFunc.VectorFunctions.IsValidDiatance(hero.GetAbsOrigin(), firstSpawnPoint)
            if (!istp) {
                modifier_tp.TeleportToPoint(hero, null, firstSpawnPoint)
            }
        }
        // 判断胜利
        let camp = AwalonState.CheckGameOver();
        switch (camp) {
            // 蓝方，进入刺杀
            case AwalonConfig.Avalon_CampType.Blue:
                AwalonState.currentStage = AwalonConfig.Avalon_GameStage.stage_task
                AwalonSystem.NextStage()
                break
            // 红方胜利
            case AwalonConfig.Avalon_CampType.Red:
                AwalonSystem.Send_to_game_over(AwalonConfig.Avalon_CampType.Red)
                break
            // 正常
            default:
                AwalonState.currentTaskID += 1;
                AwalonState.currentRound = 0;
                AwalonSystem.NextRound()
                break
        }

    }
    /**开始下一回合 */
    public static NextRound(isSyncClient = true) {
        if (!IsServer()) { return }
        if (AwalonState.currentRound == null) { return }
        // 强制流局
        if (AwalonState.currentRound == AwalonConfig.MaxRound) {
        }
        AwalonState.currentRound += 1;
        AwalonState.allRoundindex += 1;
        AwalonState.currentStage = AwalonConfig.Avalon_GameStage.stage_maketeam;
        AwalonState.currentTeamInfo = null;
        AwalonState.currentChatTurn = null;
        AwalonState.currentTeamIdea = null;
        AwalonState.currentTaskIdea = null;
        AwalonState.canEndChat = true;
        AwalonSystem.SyncClient_Round_info(isSyncClient);
    }
    /**
     * 通知客户端游戏结束
     * @param winner
     */
    public static Send_to_game_over(winner: AwalonConfig.Avalon_CampType) {

        let event = {} as JS_TO_LUA_DATA;
        event.state = true;
        // 同步身份信息
        let campinfo = {} as any;
        let roleInfo = {} as any;
        for (let i in AwalonState.AllPlayerRoleConfig) {
            campinfo[i] = AwalonState.AllPlayerRoleConfig[i].CampType
            roleInfo[i] = [AwalonState.AllPlayerRoleConfig[i].RoleType]
        }
        event.data = {
            campInfo: campinfo,
            roleInfo: roleInfo,
            winner: winner,
        };
        EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_send_to_game_result, event);
    }
    /**同步回合信息到客户端 */
    public static SyncClient_Round_info(isSyncClient = true) {
        AwalonState.currentRoundInfo = AwalonState.currentRoundInfo || {};
        AwalonState.currentRoundInfo.currentRound = AwalonState.currentRound;
        AwalonState.currentRoundInfo.currentTaskID = AwalonState.currentTaskID;
        AwalonState.currentRoundInfo.stage = AwalonState.currentStage;
        AwalonState.currentRoundInfo.TeamLeaderid = AwalonState.GetCurrentTeamLeader(AwalonState.allRoundindex);
        AwalonState.currentRoundInfo.maxTeamCount = AwalonState.GetCurrentMaxTeamCount(AwalonState.PlayerCount, AwalonState.currentTaskID);
        AwalonState.currentRoundInfo.finishTaskNeedAgree = AwalonState.GetCurrentFinishTaskNeedAgree(AwalonState.PlayerCount, AwalonState.currentTaskID);
        AwalonState.currentRoundInfo.duration = AwalonState.GetCurrentDuration(AwalonState.currentStage);
        // AwalonState.SyncNetTable(AwalonState.enum_state.currentRoundInfo);
        // 倒计时
        if (AwalonState.timerID != null) {
            TimerHelper.removeTimer(AwalonState.timerID);
            AwalonState.timerID = null;
        }
        AwalonState.timerID = TimerHelper.addTimer(1, () => {
            AwalonState.currentRoundInfo.duration -= 1;
            LogHelper.print(AwalonState.currentRoundInfo.duration, 1111)
            if (AwalonState.currentRoundInfo.duration <= 0) {
                // 超时处理
                let event = {} as JS_TO_LUA_DATA;
                switch (AwalonState.currentRoundInfo.stage) {
                    case AwalonConfig.Avalon_GameStage.stage_maketeam:
                        let count = AwalonState.GetCurrentMaxTeamCount(AwalonState.PlayerCount, AwalonState.currentTaskID);
                        let arr = GameFunc.ArrayFunc.RandomArray(Object.keys(AwalonState.AllPlayerRoleConfig), count)
                        event.PlayerID = AwalonState.currentRoundInfo.TeamLeaderid;
                        event.data = {} as any
                        let i = 0
                        while (arr.length > 0) {
                            i += 1
                            event.data['' + i] = arr.shift()
                        }
                        // 模拟组队
                        // AwalonEventHandler.onreq_send_to_make_team(event);
                        break;
                    case AwalonConfig.Avalon_GameStage.stage_chatTurn:
                        event.PlayerID = AwalonState.currentRoundInfo.TeamLeaderid;
                        event.data = {} as AwalonConfig.ChatTurnInfo
                        event.data.chatTurn = 0;
                        event.data.nowPlayerID = event.PlayerID
                        // 模拟聊天
                        AwalonEventHandler.onreq_send_to_sure_chat_turn(event)
                        break;
                    case AwalonConfig.Avalon_GameStage.stage_chat:
                        event.PlayerID = AwalonState.currentChatTurn.nowPlayerID
                        AwalonEventHandler.onreq_end_current_player_chat(event)
                        break;
                    case AwalonConfig.Avalon_GameStage.stage_agreeteam:
                        let allplayerid = AwalonState.GetAllPlayerID()
                        allplayerid.forEach(
                            p => {
                                if (AwalonState.currentTeamIdea[p] == null) {
                                    event.PlayerID = p
                                    event.data = 1;
                                    AwalonEventHandler.onreq_send_to_make_team_idea(event)
                                }
                            }
                        )
                        break;
                    case AwalonConfig.Avalon_GameStage.stage_task:
                        AwalonSystem.checkTaskIsFinish()
                        break;
                    case AwalonConfig.Avalon_GameStage.stage_cisha:
                        AwalonSystem.checkTaskIsFinish()
                        break;
                }
            }
            else {
                return 1
            }
        }, AwalonSystem);
        // 是否广播
        if (isSyncClient) {
            let data: JS_TO_LUA_DATA = {} as any;
            data.state = true;
            data.data = AwalonState.currentRoundInfo;
            EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_get_current_round_info, data);
        }
    }
    /**
     * 检查任务是否成功
     * @returns
     */
    public static checkTaskIsFinish() {
        let alltower = AwalonState.allTowerEntity;
        let goodguy = 0;
        let badguy = 0;
        alltower.forEach((npc) => {
            if (npc.GetTeamNumber() == DOTATeam_t.DOTA_TEAM_GOODGUYS) {
                goodguy += 1
            }
            else if (npc.GetTeamNumber() == DOTATeam_t.DOTA_TEAM_BADGUYS) {
                badguy += 1
            }
        });
        // 全部投票完成
        let data: JS_TO_LUA_DATA;
        // 同步记录
        let _record = AwalonState.allTaskRecord[AwalonState.currentTaskID];
        if (goodguy > AwalonState.currentRoundInfo.finishTaskNeedAgree) {
            _record.state = AwalonConfig.Avalon_TaskStage.taskstage_success
        }
        else {
            _record.state = AwalonConfig.Avalon_TaskStage.taskstage_fail
        }
        _record.agreeCount = goodguy;
        _record.disagreeCount = badguy;
        data = {};
        data.state = true;
        data.data = AwalonState.allTaskRecord;
        // 同步任务数据
        EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_send_to_sync_task_record, data);
        data = {};
        data.state = true;
        data.data = {
            success: _record.state,
            agreeCount: goodguy,
            disagreeCount: badguy
        }
        // 选票结果界面
        EventHelper.fireProtocolEventToClient(GameEnum.Event.CustomProtocol.req_send_to_finish_task_idea_result, data);
        // 延迟2秒钟下一级阶段
        TimerHelper.addTimer(3, () => {
            AwalonSystem.NextTask()
        }, AwalonSystem, false);

    }


}