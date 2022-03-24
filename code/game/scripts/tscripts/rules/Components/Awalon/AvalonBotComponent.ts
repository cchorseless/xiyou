import { GameEnum } from "../../../GameEnum";
import { EventHelper } from "../../../helper/EventHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { AwalonConfig } from "../../../rules/System/Awalon/AwalonConfig";
import { AwalonState } from "../../../rules/System/Awalon/AwalonState";
import { ET } from "../../Entity/Entity";
import { TaskConfig } from "../../System/Task/TaskConfig";
import { TaskSystem } from "../../System/Task/TaskSystem";

export class AvalonBotComponent extends ET.Component {
    onAwake() {
        this.startServerUpdate(60);
    }
    onUpdate() {
        let currentRoundInfo = AwalonState.GetcurrentRoundInfo();
        let currentTurnInfo = AwalonState.GetcurrentChatTurn();
        let currentTeamIdea = AwalonState.GetcurrentTeamIdea();
        let currentTeamInfo = AwalonState.GetcurrentTeamInfo();
        let currentTaskIdea = AwalonState.GetcurrentTaskIdea();
        let domain = this.GetDomain<BaseNpc_Plus>()
        let playerid = domain.GetPlayerOwnerID();
        if (currentRoundInfo) {
            switch (currentRoundInfo.stage) {
                case AwalonConfig.Avalon_GameStage.stage_maketeam:
                    if (AwalonState.CheckPlayerIsTeamLeader(playerid) && currentTeamInfo == null) {
                        let info: AwalonConfig.TeamInfo = AwalonState.CreateCurrentTeamInfo();
                        EventHelper.fireProtocolEventOnServer(GameEnum.Event.CustomProtocol.req_send_to_make_team,
                            {
                                PlayerID: playerid,
                                data: info
                            });
                    }
                    break;
                case AwalonConfig.Avalon_GameStage.stage_chatTurn:
                    if (AwalonState.CheckPlayerIsTeamLeader(playerid) && currentTurnInfo == null) {
                        let info: AwalonConfig.ChatTurnInfo = {} as any;
                        info.chatTurn = 1;
                        info.nowPlayerID = playerid;
                        EventHelper.fireProtocolEventOnServer(GameEnum.Event.CustomProtocol.req_send_to_sure_chat_turn,
                            {
                                PlayerID: playerid,
                                data: info
                            });
                    }
                    break;
                case AwalonConfig.Avalon_GameStage.stage_chat:
                    // 自己发言
                    if (currentTurnInfo && currentTurnInfo.nowPlayerID == playerid) {
                        EventHelper.fireProtocolEventOnServer(GameEnum.Event.CustomProtocol.req_end_current_player_chat,
                            {
                                PlayerID: playerid
                            });
                    }
                    break;
                case AwalonConfig.Avalon_GameStage.stage_agreeteam:
                    if (currentTeamIdea && currentTeamInfo) {
                        if (currentTeamIdea['' + playerid] == null) {
                            let _info = 1;
                            let _data = Object.values(currentTeamInfo);
                            // 随机投票结果
                            if (_data.indexOf(playerid) > -1) {
                                _info = 1;
                            }
                            else {
                                _info = RandomInt(0, 1);
                            }
                            _info = RandomInt(0, 1);
                            EventHelper.fireProtocolEventOnServer(GameEnum.Event.CustomProtocol.req_send_to_make_team_idea,
                                {
                                    PlayerID: playerid,
                                    data: _info
                                });
                        }
                    }
                    break;
                case AwalonConfig.Avalon_GameStage.stage_task:
                    if (currentTeamInfo && AwalonState.CheckPlayerInTeam(playerid)) {
                        if (currentTaskIdea && currentTaskIdea['' + playerid] != null) {
                            return
                        }
                        // let _info = RandomInt(0, 1);
                        // EventHelper.fireProtocolEventOnServer(GameEnum.Event.CustomProtocol.req_send_to_finish_task_idea,
                        //     {
                        //         PlayerID: this.parent.GetPlayerOwnerID(),
                        //         data: _info
                        //     }
                        // );

                    }
                    break;
            }

        }
    }

    isTasking: boolean = false
    goFinishTask() {
        if (this.isTasking) { return };
        let domain = this.GetDomain<BaseNpc_Plus>()
        this.isTasking = true;
        let playerid = domain.GetPlayerOwnerID();
        let task_team =  TaskSystem.GetPlayerTask(playerid).GetPlayerTaskInfo( TaskConfig.TaskType.TeamTask);
        for (let k in task_team) {
            let taskinfo = task_team[k as '1001'];
            switch (tonumber(taskinfo.TaskFinishType)) {
                case TaskConfig.TaskFinishType.Talk:
                    break;
            }
        }

    }



}