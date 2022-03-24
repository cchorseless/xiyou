export module AwalonConfig {

    export interface Avalon_RoleConfig {
        /**角色类型 */
        RoleType: Avalon_RoleType,
        /**阵营 */
        CampType: Avalon_CampType,
        /**名字 */
        Name?: string,
        /**职业 */
        Job: Avalon_JobType,
        /**知道其他玩家所属的阵营 */
        Know_Player_BelongCampType: { [k: string]: Avalon_CampType },
        /**知道其他玩家所属的具体角色列表 */
        Know_Player_BelongRoleType: { [k: string]: Array<Avalon_RoleType> },
    }
    /**回合信息 */
    export interface RoundInfo {
        /**回合数 */
        currentRound?: number;
        /**当前任务ID */
        currentTaskID?: number;
        /**队长id */
        TeamLeaderid?: PlayerID;
        /**游戏阶段 */
        stage?: Avalon_GameStage;
        /**时间 */
        duration?: number
        /**团队最大人数 */
        maxTeamCount?: number;
        /**完成任务需要赞同数量 */
        finishTaskNeedAgree?: number;
    }
    export interface OtherRoleInfo {
        CampInfo: { [playerid: string]: Avalon_CampType },
        RoleType: { [playerid: string]: Array<Avalon_RoleType> }
    }
    export interface TeamInfo {
        [k: string]: PlayerID
    }
    export interface ChatTurnInfo {
        chatTurn: 0 | 1,
        nowPlayerID: PlayerID,
        endPlayerID?: PlayerID
    }
    /**投票信息 */
    export interface VoteInfo {
        [playerid: string]: 0 | 1
    }
    /**任务记录 */
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
            },
        } & {
            /**任务状态 */
            state: Avalon_TaskStage,
            /**需要的玩家数量 */
            needPlayerCount: number,
            // 任务同意票数
            agreeCount: number,
            // 任务不同意票数
            disagreeCount: number,
        };
    }

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
    /**游戏阶段限制时间 */
    export const StageDuration = [60, 20, 60, 60, 60, 60];
    export const CampRole: Array<Avalon_CampType> = [
        Avalon_CampType.Blue,
        Avalon_CampType.Blue,
        Avalon_CampType.Blue,
        Avalon_CampType.Blue,
        Avalon_CampType.Red,
        Avalon_CampType.Red,
        Avalon_CampType.Red,
        Avalon_CampType.Red,
        Avalon_CampType.Red,
        Avalon_CampType.Red,
    ]
    /**队伍人数配置 */
    export const MaxTeamCountConfig = {
        5: [2, 3, 2, 3, 3],
        6: [2, 3, 4, 3, 3],
        7: [2, 3, 3, 4, 4],
        8: [3, 4, 4, 5, 5],
        9: [3, 4, 4, 5, 5],
        10: [3, 4, 4, 5, 5],
        11: [3, 4, 4, 5, 5],
        12: [3, 4, 4, 5, 5],
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
    /**角色名称 */
    export const Avalon_RoleName = [
        "MEI_LIN",
        "PAI_XI_WEI_ER",
        "ZHONG_CHEN",
        "LAN_SI_LUO_TE_BLUE",
        "MO_GAN_NA",
        "CI_KE",
        "AO_BO_LUN",
        "MO_DE_LEI_DE",
        "ZHUA_YA",
        "LAN_SI_LUO_TE_Red",
    ]
    /**最小发言时间 */
    export const MinChatDuration = 1;
    /**强制流局round */
    export const MaxRound = 5;
    /**最大任务结果，用于判定胜负 */
    export const MaxTaskFinishTime = 3;
}