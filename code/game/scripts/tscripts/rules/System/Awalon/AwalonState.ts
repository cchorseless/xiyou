import { GameEnum } from "../../../GameEnum";
import { GameFunc } from "../../../GameFunc";
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_respawn } from "../../../npc/modifier/modifier_respawn";
import { AwalonConfig } from "./AwalonConfig";

export class AwalonState {

    /**计时器IDD */
    public static timerID: string;
    /**本局玩家数量 */
    public static PlayerCount: AwalonConfig.Avalon_PlayerCount;
    /**所有塔实体 */
    public static allTowerEntity: BaseNpc_Plus[];
    /**生成的角色信息配置 */
    public static createdRoleConfig: Array<AwalonConfig.Avalon_RoleConfig>;
    /**所有的角色类型配置 */
    public static AllRoleList: AwalonConfig.Avalon_RoleType[];
    /**所有玩家的角色类型配置 */
    public static AllPlayerRoleConfig: { [playerid: string]: AwalonConfig.Avalon_RoleConfig };
    /**初始的队长参数 */
    public static randomTeamLeaderArg: number;
    /**当前回合数 */
    public static currentRound: number;
    /**自增的所有的回合数 */
    public static allRoundindex: number;
    /**当前任务ID */
    public static currentTaskID: number;
    /**当前游戏阶段 */
    public static currentStage: AwalonConfig.Avalon_GameStage;
    /**当前回合相关 */
    public static currentRoundInfo: AwalonConfig.RoundInfo;
    /**当前队伍信息 */
    public static currentTeamInfo: AwalonConfig.TeamInfo;
    /**当前发言顺序 */
    public static currentChatTurn: AwalonConfig.ChatTurnInfo;
    /**当前组队投票意见 */
    public static currentTeamIdea: AwalonConfig.VoteInfo;
    /**当前任务投票意见 */
    public static currentTaskIdea: AwalonConfig.VoteInfo;
    /**所有的任务记录 */
    public static allTaskRecord: AwalonConfig.TaskRecord;
    /**是否可以结束发言,用于标记最小发言间隔 */
    public static canEndChat: boolean;
    /**根据角色类型创建角色配置 */
    public static CreateRoleConfig(r: AwalonConfig.Avalon_RoleType) {
        if (AwalonConfig.Avalon_RoleType[r] == null) { return }
        let data: AwalonConfig.Avalon_RoleConfig = {} as AwalonConfig.Avalon_RoleConfig;
        data.RoleType = r;
        data.Name = "";
        data.Know_Player_BelongCampType = {};
        data.Know_Player_BelongRoleType = {};
        switch (r) {
            case AwalonConfig.Avalon_RoleType.MEI_LIN:
                data.CampType = AwalonConfig.Avalon_CampType.Blue;
                data.Job = AwalonConfig.Avalon_JobType.FA_SHI;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.MO_GAN_NA] = AwalonConfig.Avalon_CampType.Red;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.CI_KE] = AwalonConfig.Avalon_CampType.Red;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.AO_BO_LUN] = AwalonConfig.Avalon_CampType.Red;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.ZHUA_YA] = AwalonConfig.Avalon_CampType.Red;
                break;
            case AwalonConfig.Avalon_RoleType.PAI_XI_WEI_ER:
                data.CampType = AwalonConfig.Avalon_CampType.Blue;
                data.Job = AwalonConfig.Avalon_JobType.QI_SHI;
                data.Know_Player_BelongRoleType[AwalonConfig.Avalon_RoleType.MEI_LIN] = [AwalonConfig.Avalon_RoleType.MEI_LIN, AwalonConfig.Avalon_RoleType.MO_GAN_NA];
                data.Know_Player_BelongRoleType[AwalonConfig.Avalon_RoleType.MO_GAN_NA] = [AwalonConfig.Avalon_RoleType.MEI_LIN, AwalonConfig.Avalon_RoleType.MO_GAN_NA];
                break;
            case AwalonConfig.Avalon_RoleType.ZHONG_CHEN:
                data.CampType = AwalonConfig.Avalon_CampType.Blue;
                data.Job = AwalonConfig.Avalon_JobType.SHUI_LAN;
                break;
            case AwalonConfig.Avalon_RoleType.LAN_SI_LUO_TE_BLUE:
                data.CampType = AwalonConfig.Avalon_CampType.Blue;
                data.Job = AwalonConfig.Avalon_JobType.None;
                break;
            case AwalonConfig.Avalon_RoleType.MO_GAN_NA:
                data.CampType = AwalonConfig.Avalon_CampType.Red;
                data.Job = AwalonConfig.Avalon_JobType.HUANG_JIE;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.MO_DE_LEI_DE] = AwalonConfig.Avalon_CampType.Red;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.CI_KE] = AwalonConfig.Avalon_CampType.Red;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.ZHUA_YA] = AwalonConfig.Avalon_CampType.Red;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.LAN_SI_LUO_TE_Red] = AwalonConfig.Avalon_CampType.Red;
                break;
            case AwalonConfig.Avalon_RoleType.CI_KE:
                data.CampType = AwalonConfig.Avalon_CampType.Red;
                data.Job = AwalonConfig.Avalon_JobType.CI_KE;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.MO_GAN_NA] = AwalonConfig.Avalon_CampType.Red;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.MO_DE_LEI_DE] = AwalonConfig.Avalon_CampType.Red;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.ZHUA_YA] = AwalonConfig.Avalon_CampType.Red;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.LAN_SI_LUO_TE_Red] = AwalonConfig.Avalon_CampType.Red;
                break;
            case AwalonConfig.Avalon_RoleType.AO_BO_LUN:
                data.CampType = AwalonConfig.Avalon_CampType.Red;
                data.Job = AwalonConfig.Avalon_JobType.YAO_JING;
                break;
            case AwalonConfig.Avalon_RoleType.MO_DE_LEI_DE:
                data.CampType = AwalonConfig.Avalon_CampType.Red;
                data.Job = AwalonConfig.Avalon_JobType.None;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.MO_GAN_NA] = AwalonConfig.Avalon_CampType.Red;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.CI_KE] = AwalonConfig.Avalon_CampType.Red;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.ZHUA_YA] = AwalonConfig.Avalon_CampType.Red;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.LAN_SI_LUO_TE_Red] = AwalonConfig.Avalon_CampType.Red;
                break;
            case AwalonConfig.Avalon_RoleType.ZHUA_YA:
                data.CampType = AwalonConfig.Avalon_CampType.Red;
                data.Job = AwalonConfig.Avalon_JobType.None;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.MEI_LIN] = AwalonConfig.Avalon_CampType.Blue;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.MO_GAN_NA] = AwalonConfig.Avalon_CampType.Red;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.CI_KE] = AwalonConfig.Avalon_CampType.Red;
                data.Know_Player_BelongCampType[AwalonConfig.Avalon_RoleType.LAN_SI_LUO_TE_Red] = AwalonConfig.Avalon_CampType.Red;
                break;
            case AwalonConfig.Avalon_RoleType.LAN_SI_LUO_TE_Red:
                data.CampType = AwalonConfig.Avalon_CampType.Red;
                data.Job = AwalonConfig.Avalon_JobType.None;
                break;
        }
        return data;
    }
    /**根据玩家数量创建角色队列 */
    public static CreateRoleList(PlayerCount: AwalonConfig.Avalon_PlayerCount) {
        let _roleList: Array<AwalonConfig.Avalon_RoleType> = [
            AwalonConfig.Avalon_RoleType.MEI_LIN,
            AwalonConfig.Avalon_RoleType.ZHONG_CHEN,
            AwalonConfig.Avalon_RoleType.PAI_XI_WEI_ER,
            AwalonConfig.Avalon_RoleType.MO_GAN_NA,
            AwalonConfig.Avalon_RoleType.CI_KE,
        ];
        switch (PlayerCount) {
            case AwalonConfig.Avalon_PlayerCount.Count_5:
                break;
            case AwalonConfig.Avalon_PlayerCount.Count_6:
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHONG_CHEN);
                break;
            case AwalonConfig.Avalon_PlayerCount.Count_7:
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHONG_CHEN);
                _roleList.push(AwalonConfig.Avalon_RoleType.AO_BO_LUN);
                break;
            case AwalonConfig.Avalon_PlayerCount.Count_8:
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHONG_CHEN);
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHONG_CHEN);
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHUA_YA);
                break;
            case AwalonConfig.Avalon_PlayerCount.Count_9:
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHONG_CHEN);
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHONG_CHEN);
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHONG_CHEN);
                _roleList.push(AwalonConfig.Avalon_RoleType.MO_DE_LEI_DE);
                break;
            case AwalonConfig.Avalon_PlayerCount.Count_10:
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHONG_CHEN);
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHONG_CHEN);
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHONG_CHEN);
                _roleList.push(AwalonConfig.Avalon_RoleType.MO_DE_LEI_DE);
                _roleList.push(AwalonConfig.Avalon_RoleType.AO_BO_LUN);
                break;
            case AwalonConfig.Avalon_PlayerCount.Count_11:
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHONG_CHEN);
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHONG_CHEN);
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHONG_CHEN);
                _roleList.push(AwalonConfig.Avalon_RoleType.LAN_SI_LUO_TE_BLUE);
                _roleList.push(AwalonConfig.Avalon_RoleType.MO_DE_LEI_DE);
                _roleList.push(AwalonConfig.Avalon_RoleType.LAN_SI_LUO_TE_Red);
                break;
            case AwalonConfig.Avalon_PlayerCount.Count_12:
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHONG_CHEN);
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHONG_CHEN);
                _roleList.push(AwalonConfig.Avalon_RoleType.ZHONG_CHEN);
                _roleList.push(AwalonConfig.Avalon_RoleType.LAN_SI_LUO_TE_BLUE);
                _roleList.push(AwalonConfig.Avalon_RoleType.MO_DE_LEI_DE);
                _roleList.push(AwalonConfig.Avalon_RoleType.LAN_SI_LUO_TE_Red);
                _roleList.push(AwalonConfig.Avalon_RoleType.AO_BO_LUN);
                break;
        }
        return _roleList
    }
    /**更新玩家数量获取任务完成数量 */
    public static CreateTaskFinish(PlayerCount: AwalonConfig.Avalon_PlayerCount) {
        let _config = AwalonConfig.FinishTaskNeedAgreeConfig[PlayerCount];
        let r = {} as AwalonConfig.TaskRecord;
        for (let i = 0; i < _config.length; i++) {
            r[i + 1] = {} as any;
            r[i + 1].needPlayerCount = _config[i]
            r[i + 1].state = AwalonConfig.Avalon_TaskStage.taskstage_lock;
        }
        return r
    }
    /**初始化配置 */
    public static Init(_PlayerCount: AwalonConfig.Avalon_PlayerCount) {
        AwalonState.PlayerCount = _PlayerCount;
        AwalonState.createdRoleConfig = [];
        AwalonState.AllRoleList = AwalonState.CreateRoleList(_PlayerCount);
        AwalonState.AllRoleList.forEach(
            (RoleType) => {
                let _config = AwalonState.CreateRoleConfig(RoleType);
                _config && (AwalonState.createdRoleConfig.push(_config));
            }
        );
        // 随机第一个队长参数
        AwalonState.randomTeamLeaderArg = AwalonState.randomTeamLeaderArg || RandomInt(1, _PlayerCount - 1);
        AwalonState.randomTeamLeaderArg = 0;
        // 首个任务ID
        AwalonState.currentTaskID = 1
        // 首个回合数
        AwalonState.currentRound = 0
        // 首个游戏阶段
        AwalonState.currentStage = AwalonConfig.Avalon_GameStage.stage_maketeam;
        // 当前回合数据
        AwalonState.currentRoundInfo = {};
        // 所有的任务记录
        AwalonState.allTaskRecord = AwalonState.CreateTaskFinish(_PlayerCount);
        AwalonState.canEndChat = true;
        // 所有塔实体
        AwalonState.allTowerEntity = Entities.FindAllByClassname(GameEnum.Unit.UnitClass.npc_dota_tower) as BaseNpc_Plus[];

        // 天辉泉水
        let quanshui_1 = Entities.FindAllByName('radiant_fountain') as BaseNpc_Plus[];
        quanshui_1.forEach(m => {
            m.RemoveModifierByName(GameEnum.Dota2.modifierName.modifier_invulnerable)
        })
        AwalonState.allTowerEntity = AwalonState.allTowerEntity.concat(quanshui_1)
        // 夜宴泉水
        let quanshui_2 = Entities.FindAllByName('dire_fountain') as BaseNpc_Plus[];
        quanshui_2.forEach(m => {
            m.RemoveModifierByName(GameEnum.Dota2.modifierName.modifier_invulnerable)
        })
        AwalonState.allTowerEntity = AwalonState.allTowerEntity.concat(quanshui_2)
        AwalonState.allTowerEntity.forEach(
            t => {
                LogHelper.print(t.GetUnitName(), 111)
                let m = modifier_respawn.apply(t, t, null, { respawnTime: 1 })
                m.respawnHandler = () => {
                    let p = m.GetParentPlus();
                    p.RemoveModifierByName(GameEnum.Dota2.modifierName.modifier_invulnerable);
                    if (p.GetTeamNumber() == DOTATeam_t.DOTA_TEAM_GOODGUYS) {
                        p.SetTeam(DOTATeam_t.DOTA_TEAM_BADGUYS)
                    }
                    else if (p.GetTeamNumber() == DOTATeam_t.DOTA_TEAM_BADGUYS) {
                        p.SetTeam(DOTATeam_t.DOTA_TEAM_GOODGUYS)
                    }
                }
            }
        );

    }



    /**获取所有角色列表 */
    public static GetRoleConfig(playerid: PlayerID) {
        return AwalonState.AllPlayerRoleConfig[playerid] as Readonly<AwalonConfig.Avalon_RoleConfig>
    }
    /**
     * 获取角色信息
     * @returns
     */
    public static CreateOneRoleConfig(playerid: PlayerID) {
        AwalonState.AllPlayerRoleConfig = AwalonState.AllPlayerRoleConfig || {};
        if (AwalonState.AllPlayerRoleConfig[playerid]) {
            throw new Error('get role Config repeat')
        }
        if (AwalonState.createdRoleConfig && AwalonState.createdRoleConfig.length > 0) {
            let len = AwalonState.createdRoleConfig.length;
            let index = RandomInt(0, len - 1);
            let config = AwalonState.createdRoleConfig.splice(index, 1)[0]
            AwalonState.AllPlayerRoleConfig[playerid] = config
            return config;
        }
    }
    /**
     * 获取当前队长ID
     * @param currentRound
     * @returns
     */
    public static GetCurrentTeamLeader(allRoundindex: number): PlayerID {
        if (AwalonState.PlayerCount) {
            let mod = (allRoundindex + AwalonState.randomTeamLeaderArg) % AwalonState.PlayerCount
            if (mod == 0) {
                mod = AwalonState.PlayerCount;
            }
            if (PlayerResource.IsValidPlayer(mod - 1)) {
                return mod - 1 as PlayerID
            }
        }
        return 0
    }
    /**
     * 获取当前回合队伍人数
     * @param PlayerCount
     * @param currentTaskID
     * @returns
     */
    public static GetCurrentMaxTeamCount(PlayerCount: AwalonConfig.Avalon_PlayerCount, currentTaskID: number): number {
        let _info = AwalonConfig.MaxTeamCountConfig[PlayerCount];
        if (_info) {
            return _info[currentTaskID - 1]
        }
    }
    /**
     * 随机当前组队人员
     */
    public static CreateCurrentTeamInfo(): AwalonConfig.TeamInfo {
        let max_count = AwalonState.GetCurrentMaxTeamCount(AwalonState.PlayerCount, AwalonState.currentTaskID)
        let currentTeamInfo = AwalonState.GetcurrentTeamInfo();
        if (!currentTeamInfo) {
            let t = GameFunc.ArrayFunc.RandomArray(Object.keys(AwalonState.AllPlayerRoleConfig), max_count, false);
            let r = {} as any;
            for (let i = 0; i < max_count; i++) {
                r[i + 1] = t[i]
            }
            return r
        }

    }

    public static GetAllPlayerID() {
        let arr: PlayerID[] = [];
        Object.keys(AwalonState.AllPlayerRoleConfig).forEach(p =>
            arr.push(tonumber(p) as PlayerID)
        )
        return arr;
    }


    /**
     * 获取任务成功需要同意的人数
     * @param PlayerCount
     * @param currentTaskID
     * @returns
     */
    public static GetCurrentFinishTaskNeedAgree(PlayerCount: AwalonConfig.Avalon_PlayerCount, currentTaskID: number): number {
        let _info = AwalonConfig.FinishTaskNeedAgreeConfig[PlayerCount];
        if (_info) {
            return _info[currentTaskID - 1] + 4
        }
    }
    /**
     * 获取当前时间限制
     * @param PlayerCount
     * @param currentTaskID
     * @returns
     */
    public static GetCurrentDuration(currentStage: AwalonConfig.Avalon_GameStage): number {
        return AwalonConfig.StageDuration[currentStage] || 10
    }
    /**判断在不在队伍内 */
    public static CheckPlayerInTeam(playerid: number | string) {
        if (AwalonState.currentTeamInfo && playerid != null) {
            playerid = tonumber(playerid) as PlayerID;
            return Object.values(AwalonState.currentTeamInfo).indexOf(playerid as PlayerID) > -1
        }
        return false;
    }
    /**判断是不是队长 */
    public static CheckPlayerIsTeamLeader(playerid: any) {
        if (AwalonState.currentRoundInfo) {
            return playerid == AwalonState.currentRoundInfo.TeamLeaderid
        }
        return false;
    }
    /**判断游戏是否结束 */
    public static CheckGameOver() {
        let success = 0
        let fail = 0
        for (let k in AwalonState.allTaskRecord) {
            let info = AwalonState.allTaskRecord[k];
            switch (info.state) {
                // 失败
                case AwalonConfig.Avalon_TaskStage.taskstage_fail:
                    fail += 1
                    break;
                // 胜利
                case AwalonConfig.Avalon_TaskStage.taskstage_success:
                    success += 1
                    break;
            }
        }
        let successPlayer = [];
        let failPlayer = [];
        for (let playerid in AwalonState.AllPlayerRoleConfig) {
            let info = AwalonState.AllPlayerRoleConfig[playerid];
            if (info.CampType == AwalonConfig.Avalon_CampType.Blue) {
                successPlayer.push(tonumber(playerid))
            }
            else if (info.CampType == AwalonConfig.Avalon_CampType.Red) {
                failPlayer.push(tonumber(playerid))
            }
        }
        // 同步对局任务数据
        EventHelper.fireServerEvent(GameEnum.Event.CustomServer.onserver_update_game_task_jindu,
            null, {
            data: {
                success: success,
                fail: fail,
                successPlayer: successPlayer,
                failPlayer: failPlayer
            },
        })

        // 胜利，进入暗杀
        if (success == AwalonConfig.MaxTaskFinishTime) {
            return AwalonConfig.Avalon_CampType.Blue;
        }
        // 失败,红方胜利
        if (fail == AwalonConfig.MaxTaskFinishTime) {
            return AwalonConfig.Avalon_CampType.Red;
        }
    }
    /**
     * 获取当前队伍投票是否成功
     * @param PlayerCount
     * @param currentTaskID
     */
    public static GetTeamIdeaIsSuccess() {
        let _agreeCount = 0;
        let _disagreeCount = 0;
        if (AwalonState.currentTeamIdea == null) { return }
        for (let k in AwalonState.currentTeamIdea) {
            switch (AwalonState.currentTeamIdea[k]) {
                case 0:
                    _disagreeCount += 1;
                    break
                case 1:
                    _agreeCount += 1;
                    break
            }
        }
        return [_agreeCount, _disagreeCount]
    }
    /**
     * 获取当前队伍任务投票是否成功
     * @param PlayerCount
     * @param currentTaskID
     */
    public static GetTaskIdeaIsSuccess() {
        let _agreeCount = 0;
        let _disagreeCount = 0;
        if (AwalonState.currentTaskIdea == null) { return }
        for (let k in AwalonState.currentTaskIdea) {
            switch (AwalonState.currentTaskIdea[k]) {
                case 0:
                    _disagreeCount += 1;
                    break
                case 1:
                    _agreeCount += 1;
                    break
            }
        }
        return [_agreeCount, _disagreeCount]
    }
    /**获取当前回合信息 */
    public static GetcurrentRoundInfo() {
        if (AwalonState.currentRoundInfo) {
            return AwalonState.currentRoundInfo as Readonly<AwalonConfig.RoundInfo>
        }
    }
    /**获取当前队伍信息信息 */
    public static GetcurrentTeamInfo() {
        if (AwalonState.currentTeamInfo) {
            return AwalonState.currentTeamInfo as Readonly<AwalonConfig.TeamInfo>
        }
    }
    /**获取当前发言顺序信息 */
    public static GetcurrentChatTurn() {
        if (AwalonState.currentChatTurn) {
            return AwalonState.currentChatTurn as Readonly<AwalonConfig.ChatTurnInfo>
        }
    }
    /**获取当前投票信息 */
    public static GetcurrentTeamIdea() {
        if (AwalonState.currentTeamIdea) {
            return AwalonState.currentTeamIdea as Readonly<AwalonConfig.VoteInfo>
        }
    }
    /**获取当前投票信息 */
    public static GetcurrentTaskIdea() {
        if (AwalonState.currentTaskIdea) {
            return AwalonState.currentTaskIdea as Readonly<AwalonConfig.VoteInfo>
        }
    }
    /**
     * 获取随机传送点
     * @param camp
     */
    public static GetTpPoint(camp: AwalonConfig.Avalon_CampType, count: number) {
        let r: string[];
        switch (camp) {
            case AwalonConfig.Avalon_CampType.Blue:
                r = KVHelper.FindAllNPCByName(GameEnum.Unit.UnitNames.unit_blue_tp)
                break
            case AwalonConfig.Avalon_CampType.Red:
                r = KVHelper.FindAllNPCByName(GameEnum.Unit.UnitNames.unit_red_tp)
                break
        }
        if (r) {
            let r_arr: any[] = [];
            for (let k of r) {
                // let info = KVHelper.KvServerConfig.npc_position_config[k as '1001']
                // r_arr.push(Vector(
                //     tonumber(info.position_x),
                //     tonumber(info.position_y),
                //     tonumber(info.position_z))
                // );
            };
            let fini_r: Vector[] = [];
            while (fini_r.length < count) {
                fini_r = fini_r.concat(GameFunc.ArrayFunc.RandomArray(r_arr, count))
            }
            return fini_r
        }
    }

    public static CheckTaskIsFinished() {

    }



}