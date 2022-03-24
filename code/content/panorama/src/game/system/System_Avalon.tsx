/*
梅林（法师） [1]
蓝方的幕后主公
能看到所有红方成员，除了莫德雷德
需要隐藏自己，给蓝方巧妙的递送信息

派西维尔（骑士） [1]
蓝方的领队，能看到梅林和莫甘娜
但需要去自行分辨两者
是蓝方的核心成员

亚瑟忠臣（水蓝） [1]
蓝方成员
没有特殊能力的角色
但却起到掩护梅林的重要作用

红方成员： [3]
莫甘娜（皇姐） [1]
红方的核心人物
与红方队友互见
模仿梅林，误导派西维尔

刺客 [1]
梅林的死兆星
在正义方成功完成3个任务后，掀刀刺杀梅林，为红方扳回最后的胜利

奥伯伦（妖精） [1]
孤立的红方成员
由于与其他红方无法互见，需尽快辨识他们，以及证明自己

莫德蕾德（大莫） [1]
唯一无法被梅林看到的红方成员
有趣的角色，玩法灵活

爪牙 [1]
红方角色，能被梅林看到

参与人数构成： [3]
人数 5 6 7 8 9 10
蓝方 3 4 4 5 6  6
红方 2 2 3 3 3  4

任务人数构成： [3]
人数  5 6 7  8  9  10
任务1 2 2 2  3  3  3
任务2 3 3 3  4  4  4
任务3 2 4 3  4  4  4
任务4 3 3 4+ 5+ 5+ 5+
任务5 3 3 4+ 5+ 5+ 5+

人数及配置： [3]
参与人数
蓝方阵营
红方阵营
5
梅林、派西维尔、忠臣
莫甘娜、刺客
6
梅林、派西维尔、忠臣 x 2
莫甘娜、刺客
7
梅林、派西维尔、忠臣 x 2
莫甘娜、刺客、奥伯伦
8
梅林、派西维尔、忠臣 x 3
莫甘娜、刺客、爪牙
9
梅林、派西维尔、忠臣 x 4
莫甘娜、刺客、莫德雷德
10
梅林、派西维尔、忠臣 x 4
莫甘娜、刺客、莫德雷德、奥伯伦
*/
import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { GameEnum } from "../../libs/GameEnum";
import { RootPanel } from "../../view/game_main";
import { MainPanel } from "../../view/MainPanel/MainPanel";
import { TeamAgreeGoForTaskDialog } from "../../view/TeamPanel/TeamAgreeGoForTaskDialog";
import { TeamPanel } from "../../view/TeamPanel/TeamPanel";
import { TopBarPanel } from "../../view/TopBarPanel/TopBarPanel";
export module System_Avalon {

    export interface Avalon_RoleConfig {
        /**角色类型 */
        RoleType: Sys_config.Avalon_RoleType,
        /**阵营 */
        CampType: Sys_config.Avalon_CampType,
        /**名字 */
        Name?: string,
        /**职业 */
        Job: Sys_config.Avalon_JobType,
        /**知道其他玩家所属的阵营 */
        Know_Player_BelongCampType: { [k: string]: Sys_config.Avalon_CampType },
        /**知道其他玩家所属的具体角色列表 */
        Know_Player_BelongRoleType: { [k: string]: Array<Sys_config.Avalon_RoleType> },
    }
    /**回合信息 */
    export interface RoundInfo {
        /**回合数 */
        currentRound: number;
        /**当前任务ID */
        currentTaskID: number;
        /**队长id */
        TeamLeaderid: PlayerID;
        /**队伍信息 */
        TeamInfo?: TeamInfo
        /**游戏阶段 */
        stage: Sys_config.Avalon_GameStage;
        /**时间 */
        duration: number
        /**团队最大人数 */
        maxTeamCount: number;
        /**完成任务需要赞同数量 */
        finishTaskNeedAgree: number;
    }
    interface OtherRoleInfo {
        CampInfo: { [playerid: string]: Sys_config.Avalon_CampType },
        RoleType: { [playerid: string]: Array<Sys_config.Avalon_RoleType> }
    }
    interface TeamInfo {
        [k: string]: PlayerID
    }
    interface ChatTurnInfo {
        chatTurn: boolean,
        nowPlayerID: PlayerID,
        endPlayerID?: PlayerID
    }
    interface VoteInfo {
        [playerid: string]: 0 | 1
    }
    export interface TaskRecord {
        [taskid: string]: {
            // 组队信息
            [roundid: string]: {
                // 是否成功
                success: boolean,
                // 同意票数
                agreeCount: number,
                // 不同意票数
                disagreeCount: number,
                // 组队投票详情
                info: VoteInfo
            }

        } & {
            /**任务状态 */
            state: Sys_config.Avalon_TaskStage,
            /**需要的玩家数量 */
            needPlayerCount: number,
            // 任务同意票数
            agreeCount: number,
            // 任务不同意票数
            disagreeCount: number,
        };
    }
    interface TeamIdea {
        [playerid: string]: 0 | 1
    }
    /**任务相关 */
    interface TaskInfo {
        info: Array<string>,
        success: System_Avalon.Sys_config.Avalon_TaskStage,
        agreeCount: number,
        disagreeCount: number
    }

    namespace Sys_state {
        export let _selfRoleInfo: Avalon_RoleConfig;
        export let _otherRoleInfo: OtherRoleInfo;
        export let _currentRoundInfo: RoundInfo;
        export let _currentTeamInfo: TeamInfo;
        export let _currentChatTurn: ChatTurnInfo;
        export let _currentTeamIdea: TeamIdea;
        export let _currentTaskIdea: TaskInfo;
        /**所有的任务记录 */
        export let _allTaskRecord: TaskRecord;
        /**初始化配置 */
        export function Init() {
            // 获取身份数据
            NetHelper.SendToLua(GameEnum.CustomProtocol.req_get_self_shen_fen_info, null, (event) => {
                if (event.state && event.data) {
                    Sys_state._selfRoleInfo = Sys_state._selfRoleInfo || {};
                    Sys_state._selfRoleInfo = Object.assign(Sys_state._selfRoleInfo, event.data)
                }
            }, System_Avalon);
            // 获取他人数据
            NetHelper.SendToLua(GameEnum.CustomProtocol.req_get_know_other_shen_fen_info, null, (event) => {
                if (event.state && event.data) {
                    Sys_state._otherRoleInfo = event.data;
                }
            }, System_Avalon);
            // 主动获取回合数据
            NetHelper.SendToLua(GameEnum.CustomProtocol.req_get_current_reconnect_data);
            // 读取网表数据
        }
        /**同步的属性枚举 */
        export enum enum_state {
            PlayerCount = 'PlayerCount',
            createdRoleConfig = 'createdRoleConfig',
            AllRoleList = 'AllRoleList',
            AllPlayerRoleConfig = 'AllPlayerRoleConfig',
            randomTeamLeaderArg = 'randomTeamLeaderArg',
            currentRound = 'currentRound',
            currentTaskID = 'currentTaskID',
            currentStage = 'currentStage',
            currentRoundInfo = 'currentRoundInfo',
            currentTeamInfo = 'currentTeamInfo',
            currentChatTurn = 'currentChatTurn',
            currentTeamIdea = 'currentTeamIdea',
            currentTaskIdea = 'currentTaskIdea',
            canEndChat = 'canEndChat',
        }
        /**获取网表数据 */
        export function GetNetTable(k: enum_state) {
            let netTableName = "System_Avalon_Sys_state" as never;
            return CustomNetTables.GetTableValue(netTableName, k)
        }
    }
    namespace Sys_netEvent {
        let hasStart = false;
        /**添加服务器监听事件 */
        export function startListen() {
            if (hasStart) { return };
            hasStart = true;
            // 监听服务器数据推送
            NetHelper.ListenOnLua(GameEnum.CustomProtocol.req_get_current_round_info, (event) => {
                if (event.state && event.data) {
                    // 新任务回合
                    if (Sys_state._currentRoundInfo) {
                        // 新任务 或者 新回合
                        if (Sys_state._currentRoundInfo.currentTaskID != event.data.currentTaskID || Sys_state._currentRoundInfo.currentRound != event.data.currentRound) {
                            Sys_state._currentTeamInfo = null as any;
                            Sys_state._currentChatTurn = null as any;
                            Sys_state._currentTeamIdea = null as any;
                            Sys_state._currentTaskIdea = null as any;
                        }
                    }
                    Sys_state._currentRoundInfo = event.data;
                    // 刷新顶部条
                    TopBarPanel.GetInstance()?.updateUI()
                    // 刷新主界面
                    MainPanel.GetInstance()?.updateRoundUI();
                    MainPanel.GetInstance()?.updateshowAllInfo();
                }
            }, System_Avalon);
            // 监听服务器推送创建队伍
            NetHelper.ListenOnLua(GameEnum.CustomProtocol.req_send_to_make_team_finish, (event) => {
                if (event.state) {
                    Sys_state._currentTeamInfo = event.data;
                }
                else {
                    TipsHelper.showTips('创建队伍失败',RootPanel.instance);
                }
            }, System_Avalon);
            // 监听服务器推送发言顺序
            NetHelper.ListenOnLua(GameEnum.CustomProtocol.req_send_to_sure_chat_turn, (event) => {
                if (event.state) {
                    Sys_state._currentChatTurn = event.data;
                    MainPanel.GetInstance()?.updateRoundUI();
                }
                else {
                    TipsHelper.showTips('发言顺序设置失败',RootPanel.instance);
                }
            }, System_Avalon);
            // 监听服务器更改发言顺序
            NetHelper.ListenOnLua(GameEnum.CustomProtocol.req_end_current_player_chat, (event) => {
                if (event.state) {
                    Sys_state._currentChatTurn = event.data;
                    // 刷新主界面
                    MainPanel.GetInstance()?.updateRoundUI();
                    MainPanel.GetInstance()?.updateshowAllInfo();
                }
                else {
                    TipsHelper.showTips('发言顺序设置失败',RootPanel.instance);
                }
            }, System_Avalon);
            // 监听服务器组队投票意见
            NetHelper.ListenOnLua(GameEnum.CustomProtocol.req_send_to_make_team_idea, (event) => {
                if (event.state) {
                    Sys_state._currentTeamIdea = event.data;
                    TeamAgreeGoForTaskDialog.GetInstance()?.updateAgreeInfo();
                }
                else {
                    TipsHelper.showTips('本轮已投票',RootPanel.instance);
                }
            }, System_Avalon);
            // 监听组队 投票结果
            NetHelper.ListenOnLua(GameEnum.CustomProtocol.req_send_to_make_team_idea_result, (event) => {
                if (event.state && event.data) {
                    let data: { success: boolean, agreeCount: number, disagreeCount: number } = event.data;
                    MainPanel.GetInstance()?.showTeamResult(data);
                }
            }, System_Avalon);
            // 监听服务器推送任务记录
            NetHelper.ListenOnLua(GameEnum.CustomProtocol.req_send_to_sync_task_record, (event) => {
                if (event.state && event.data) {
                    Sys_state._allTaskRecord = event.data;
                    // 刷新顶部条
                    TopBarPanel.GetInstance()?.updateUI()
                }
                else {
                    TipsHelper.showTips('发言顺序设置失败',RootPanel.instance);
                }
            }, System_Avalon);
            // 监听服务器任务投票意见
            NetHelper.ListenOnLua(GameEnum.CustomProtocol.req_send_to_finish_task_idea, (event) => {
                LogHelper.print(event.data, event.state)
                if (event.state && event.data) {
                    Sys_state._currentTaskIdea = Sys_state._currentTaskIdea || {};
                    Sys_state._currentTaskIdea.info = Object.values(event.data);
                    MainPanel.GetInstance()?.showTaskResult()
                }
                else {
                    TipsHelper.showTips('本轮已投票',RootPanel.instance);
                }
            }, System_Avalon);
            // 监听服务器任务投票结果
            NetHelper.ListenOnLua(GameEnum.CustomProtocol.req_send_to_finish_task_idea_result, (event) => {
                if (event.state && event.data) {
                    Sys_state._currentTaskIdea = Sys_state._currentTaskIdea || {};
                    Sys_state._currentTaskIdea.success = event.data.success;
                    Sys_state._currentTaskIdea.agreeCount = event.data.agreeCount;
                    Sys_state._currentTaskIdea.disagreeCount = event.data.disagreeCount;
                    MainPanel.GetInstance()?.showTaskResult()
                }
                else {
                    TipsHelper.showTips('本轮已投票',RootPanel.instance);
                }
            }, System_Avalon);
            // 游戏结果
            NetHelper.ListenOnLua(GameEnum.CustomProtocol.req_send_to_game_result, (event) => {
                if (event.state && event.data) {
                    Sys_state._otherRoleInfo.CampInfo = event.data.campInfo;
                    Sys_state._otherRoleInfo.RoleType = event.data.roleInfo;
                    MainPanel.GetInstance()?.showGameOver(event.data);

                }
                else {
                }
            }, System_Avalon);
        }
    }
    export namespace Sys_config {
        /**玩家人数 */
        export enum Avalon_PlayerCount {
            Count_5 = 5,
            Count_6,
            Count_7,
            Count_8,
            Count_9,
            Count_10,
            Count_11,
            Count_12,
        }
        /**玩家角色类型 */
        export enum Avalon_RoleType {
            MEI_LIN,
            PAI_XI_WEI_ER,
            ZHONG_CHEN,
            LAN_SI_LUO_TE_BLUE,
            MO_GAN_NA,
            CI_KE,
            AO_BO_LUN,
            MO_DE_LEI_DE,
            ZHUA_YA,
            LAN_SI_LUO_TE_Red,
        }
        /**角色名称 */
        export const Avalon_RoleName = {
            MEI_LIN: '梅琳',
            PAI_XI_WEI_ER: '派西维尔',
            ZHONG_CHEN: '忠臣',
            LAN_SI_LUO_TE_BLUE: '兰彻斯特-蓝',
            MO_GAN_NA: '莫甘娜',
            CI_KE: '刺客',
            AO_BO_LUN: '奥伯伦',
            MO_DE_LEI_DE: '莫德雷德',
            ZHUA_YA: '爪牙',
            LAN_SI_LUO_TE_Red: '兰彻斯特-红',
        };

        /**玩家职业类型 */
        export enum Avalon_JobType {
            None,
            FA_SHI,
            QI_SHI,
            YAO_JING,
            HUANG_JIE,
            SHUI_LAN,
            CI_KE,

        }
        /**玩家阵营 */
        export enum Avalon_CampType {
            Blue,
            Red
        }
        export const CampRole: Array<Sys_config.Avalon_CampType> = [
            Sys_config.Avalon_CampType.Blue,
            Sys_config.Avalon_CampType.Blue,
            Sys_config.Avalon_CampType.Blue,
            Sys_config.Avalon_CampType.Blue,
            Sys_config.Avalon_CampType.Red,
            Sys_config.Avalon_CampType.Red,
            Sys_config.Avalon_CampType.Red,
            Sys_config.Avalon_CampType.Red,
            Sys_config.Avalon_CampType.Red,
            Sys_config.Avalon_CampType.Red,
        ]
        /**游戏阶段 */
        export enum Avalon_GameStage {
            /**组队阶段 */
            stage_maketeam,
            /**发言顺序 */
            stage_chatTurn,
            /**发言阶段 */
            stage_chat,
            /**投票组队 */
            stage_agreeteam,
            /**投票任务阶段 */
            stage_task,
            /**刺杀阶段 */
            stage_cisha,
        }
        /**任务状态 */
        export enum Avalon_TaskStage {
            taskstage_ing,
            taskstage_lock,
            taskstage_success,
            taskstage_fail,
        }
        /**完成任务同意人数配置 */
        export const FinishTaskNeedAgreeConfig = {
            5: [2, 3, 2, 3, 3],
            6: [2, 3, 4, 3, 3],
            7: [2, 3, 3, 4, 4],
            8: [3, 4, 4, 5, 5],
            9: [3, 4, 4, 5, 5],
            10: [3, 4, 4, 5, 5],
            11: [3, 4, 4, 5, 5],
            12: [3, 4, 4, 5, 5],
        }

    }
    /**获取数据对外接口 */
    export namespace Sys_GetData {


        /**获取身份卡图片 */
        export function GetPath_ShenFenCard(r: Sys_config.Avalon_RoleType) {
            return `url(\"file://{images}/card/card_shenfen_${r}.png\")`
        }
        /**获取角色图片路径 */
        export function Get_ShenFenCardSmallPath(r: Sys_config.Avalon_RoleType) {
            if (r == null) {
                return null
            }
            return `url(\"file://{images}/card_icon/card_small_${r}.png\")`
        }
        export function Get_CampName(r: Sys_config.Avalon_RoleType) {
            let camp_ = Sys_config.CampRole[r]
            return ["蓝方", '红方'][camp_];
        }

        /**获取身份卡名字 */
        export function Get_ShenFenName(r: Sys_config.Avalon_RoleType) {
            return (Sys_config.Avalon_RoleName as any)[Sys_config.Avalon_RoleType[r]];
        }
        /**获取阵营颜色 */
        export function Get_ShenFenNameColor(r: Sys_config.Avalon_CampType) {
            if (r == null) {
                return '#ffffff'
            }
            return ['#05e9fd', '#f30c08'][r];
        }
        /**获取阵营图片路径 */
        export function Get_ShenFenCampPath(r: Sys_config.Avalon_CampType) {
            if (r == null) {
                return null
            }
            return `url(\"file://{images}/camp/camp_${r}.png\")`
        }
        /**获取任务状态图片路径 */
        export function Get_TaskStatePath(r: Sys_config.Avalon_TaskStage) {
            if (r == null) {
                return null
            }
            let p = ''
            switch (r) {
                case System_Avalon.Sys_config.Avalon_TaskStage.taskstage_ing:
                    p = 'task_ising'
                    break
                case System_Avalon.Sys_config.Avalon_TaskStage.taskstage_lock:
                    p = 'lock'

                    break
                case System_Avalon.Sys_config.Avalon_TaskStage.taskstage_success:
                    p = 'agree'

                    break
                case System_Avalon.Sys_config.Avalon_TaskStage.taskstage_fail:
                    p = 'disagree'
                    break
            }
            return `url(\"file://{images}/common/${p}.png\")`
        }
        /**获取角色图片路径 */
        export function Get_ShenFenCardiconPath(r: Sys_config.Avalon_RoleType) {
            if (r == null) {
                return null
            }
            return `url(\"file://{images}/card_icon/cardicon_${r}.png\")`
        }
        /**判断是不是队长 */
        export function CheckPlayerIsTeamLeader(playerid: any = null) {
            if (Sys_state._currentRoundInfo) {
                if (playerid == null) {
                    return Players.GetLocalPlayer() == Sys_state._currentRoundInfo.TeamLeaderid
                }
                else {
                    return playerid == Sys_state._currentRoundInfo.TeamLeaderid
                }
            }
            return false;
        }
        /**判断是不是队长 */
        export function CheckPlayerIsCiKe() {
            if (Sys_state._selfRoleInfo) {
                return Sys_state._selfRoleInfo.RoleType == Sys_config.Avalon_RoleType.CI_KE
            }
            return false;
        }
        /**判断在不在队伍内 */
        export function CheckPlayerInTeam(playerid: any = null) {
            if (Sys_state._currentTeamInfo) {
                if (playerid == null) {
                    playerid = Players.GetLocalPlayer()
                }
                return Object.values(Sys_state._currentTeamInfo).indexOf(playerid) > -1
            }
            return false;
        }


        /**获取自己的身份信息 */
        export function GetSelfRoleInfo() {
            if (Sys_state._selfRoleInfo) {
                return Sys_state._selfRoleInfo as Readonly<Avalon_RoleConfig>
            }
        }
        /**获取他人的身份信息 */
        export function GetOtherRoleInfo() {
            if (Sys_state._otherRoleInfo) {
                return Sys_state._otherRoleInfo as Readonly<OtherRoleInfo>
            }
        }
        /**获取任务历史记录*/
        export function Get_allTaskRecord() {
            if (Sys_state._allTaskRecord) {
                return Sys_state._allTaskRecord as Readonly<TaskRecord>
            }
        }
        /**获取当前回合信息 */
        export function GetCurrentRoundInfo() {
            if (Sys_state._currentRoundInfo) {
                return Sys_state._currentRoundInfo as Readonly<RoundInfo>
            }
        }
        /**获取当前队伍信息 */
        export function GetCurrentTeamInfo() {
            if (Sys_state._currentTeamInfo) {
                return Sys_state._currentTeamInfo as Readonly<TeamInfo>
            }
        }
        /**获取当前队伍的发言顺序 */
        export function GetCurrentChatTurn() {
            if (Sys_state._currentChatTurn) {
                return Sys_state._currentChatTurn as Readonly<ChatTurnInfo>
            }
        }
        /**获取当前队伍投票 */
        export function GetCurrentTeamIdea() {
            if (Sys_state._currentTeamIdea) {
                return Sys_state._currentTeamIdea as Readonly<TeamIdea>
            }
        }
        /**获取当前任务投票 */
        export function GetCurrentTaskIdea() {
            if (Sys_state._currentTaskIdea) {
                return Sys_state._currentTaskIdea as Readonly<TaskInfo>
            }
        }


    }
    /**是否工作 */
    export const IsWorking: boolean = true;
    /**初始化 */
    export function Init() {
        IsWorking && Sys_netEvent.startListen()
    }
    /**英雄创建完成 */
    export function OnAwake() {
        IsWorking && Sys_state.Init()
    }
    /**系统准备好 */
    export function IsReady() {
        if (IsWorking) {
            return Sys_GetData.GetSelfRoleInfo() && Sys_GetData.GetOtherRoleInfo() && Sys_GetData.GetCurrentRoundInfo()
        }
    }


}