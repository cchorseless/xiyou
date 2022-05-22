
import { GameEnum } from "../../../GameEnum";
import { EventHelper } from "../../../helper/EventHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { ability6_courier_base } from "../../../npc/abilities/courier/courier_base/ability6_courier_base";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_vision } from "../../../npc/items/dota/item_ward_observer_custom";
import { ET } from "../../Entity/Entity";
import { AwalonConfig } from "../../System/Awalon/AwalonConfig";
import { AwalonState } from "../../System/Awalon/AwalonState";



/**阿瓦隆组件 */
export class AvalonComponent extends ET.Component {
    roleConfig: AwalonConfig.Avalon_RoleConfig;
    onAwake() {
        let playerid = this.GetDomain<BaseNpc_Plus>().GetPlayerOwnerID()
        if (this.roleConfig == null) {
            this.roleConfig = AwalonState.CreateOneRoleConfig(playerid);
        }
        if (GameRules.State_Get() >= DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS) {
            this.setTeamnumber()
        }
        else {
            this.addEvent()
        }
    }

    addEvent() {
        EventHelper.addGameEvent(
            this,
            GameEnum.Event.GameEvent.game_rules_state_change, () => {
            const nNewState = GameRules.State_Get();
            switch (nNewState) {
                // 设置玩家阵营
                // -- 游戏开始 --创建自己的英雄
                case DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS:
                    this.setTeamnumber()
                    break
            }
        });

    }

    setTeamnumber() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let playerid = domain.GetPlayerOwnerID()
        let _playerid = tonumber(playerid) as PlayerID
        let teamnumber: DOTATeam_t;
        switch (this.roleConfig.RoleType) {
            case AwalonConfig.Avalon_RoleType.MEI_LIN:
                teamnumber = DOTATeam_t.DOTA_TEAM_GOODGUYS
                break
            case AwalonConfig.Avalon_RoleType.PAI_XI_WEI_ER:
                teamnumber = DOTATeam_t.DOTA_TEAM_BADGUYS
                break
            case AwalonConfig.Avalon_RoleType.ZHONG_CHEN:
                teamnumber = DOTATeam_t.DOTA_TEAM_CUSTOM_1
                break
            case AwalonConfig.Avalon_RoleType.LAN_SI_LUO_TE_BLUE:
                teamnumber = DOTATeam_t.DOTA_TEAM_CUSTOM_2
                break
            case AwalonConfig.Avalon_RoleType.MO_GAN_NA:
                teamnumber = DOTATeam_t.DOTA_TEAM_CUSTOM_3
                break
            case AwalonConfig.Avalon_RoleType.CI_KE:
                teamnumber = DOTATeam_t.DOTA_TEAM_CUSTOM_4
                break
            case AwalonConfig.Avalon_RoleType.AO_BO_LUN:
                teamnumber = DOTATeam_t.DOTA_TEAM_CUSTOM_5
                break
            case AwalonConfig.Avalon_RoleType.MO_DE_LEI_DE:
                teamnumber = DOTATeam_t.DOTA_TEAM_CUSTOM_6
                break
            case AwalonConfig.Avalon_RoleType.ZHUA_YA:
                teamnumber = DOTATeam_t.DOTA_TEAM_CUSTOM_7
                break
            case AwalonConfig.Avalon_RoleType.LAN_SI_LUO_TE_Red:
                teamnumber = DOTATeam_t.DOTA_TEAM_CUSTOM_8
                break
        }
        if (PlayerResource.GetPlayer(_playerid).GetTeam() != teamnumber) {
            PlayerResource.GetPlayer(_playerid).SetTeam(teamnumber)
            domain.SetTeam(teamnumber)
        }
        modifier_vision.CreateVisionUnit(domain, Vector(0, 0, 400), teamnumber, null, 300)

    }

    onUpdate() {
    }

    autoMakeTeam() {

    }


}