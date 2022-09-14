import { GameEnum } from "../../../GameEnum";
import { EntityHelper } from "../../../helper/EntityHelper";
import { EventHelper } from "../../../helper/EventHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../../npc/entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_no_health_bar } from "../../../npc/modifier/modifier_no_health_bar";
import { ET, registerET } from "../../Entity/Entity";
import { BuildingConfig } from "../../System/Building/BuildingConfig";
import { BuildingState } from "../../System/Building/BuildingState";
import { ChessControlConfig } from "../../System/ChessControl/ChessControlConfig";
import { RoundConfig } from "../../System/Round/RoundConfig";
import { AbilityManagerComponent } from "../Ability/AbilityManagerComponent";
import { ChessComponent } from "../ChessControl/ChessComponent";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { PlayerScene } from "../Player/PlayerScene";
import { ERoundBoard } from "../Round/ERoundBoard";
import { RoundBuildingComponent } from "../Round/RoundBuildingComponent";
import { WearableComponent } from "../Wearable/WearableComponent";
import { BuildingComponent } from "./BuildingComponent";
import { BuildingEntityRoot } from "./BuildingEntityRoot";

/**塔防组件 */
@registerET()
export class BuildingManagerComponent extends ET.Component {

    onAwake() {
        this.addEvent();
    }

    /**
     * 放置建築
     * @param hero
     * @param name
     * @param location
     * @param angle
     */
    public placeBuilding(towerID: string, location: Vector, angle: number = BuildingConfig.BUILDING_ANGLE) {
        let playerroot = this.GetDomain<PlayerScene>().ETRoot;
        let hero = playerroot.Hero;
        let playerID = playerroot.Playerid;
        if (!hero.IsAlive()) return;
        // 相同的塔
        let bHasCount = this.getBuilding(towerID).length;
        if (bHasCount >= BuildingConfig.MAX_SAME_TOWER) {
            EventHelper.ErrorMessage(BuildingConfig.ErrorCode.dota_hud_error_has_same_tower, playerID);
            return;
        }
        //  人口判断
        let iPopulationAdd = GameRules.Addon.ETRoot.BuildingSystem().GetBuildingPopulation(towerID);
        let PlayerDataComp = playerroot.PlayerDataComp();
        let freePopulation = PlayerDataComp.getFreePopulation();
        if (iPopulationAdd > freePopulation) {
            EventHelper.ErrorMessage(BuildingConfig.ErrorCode.dota_hud_error_population_limit);
            return;
        }
        let building = EntityHelper.CreateEntityByName(towerID, location, hero.GetTeamNumber(), false, hero, hero) as BaseNpc_Plus;
        if (!building) {
            return;
        }
        ResHelper.CreateParticle(
            new ResHelper.ParticleInfo()
                .set_resPath("particles/econ/items/antimage/antimage_ti7/antimage_blink_start_ti7_ribbon_bright.vpcf")
                .set_owner(building)
                .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                .set_validtime(5)
        );
        building.SetTeam(DOTATeam_t.DOTA_TEAM_GOODGUYS);
        BuildingEntityRoot.Active(building, playerID, towerID, location, angle);
        let buildingroot = building.ETRoot.As<BuildingEntityRoot>();
        playerroot.AddDomainChild(buildingroot);
        /**互相绑定 */
        building.SetControllableByPlayer(playerID, true);
        building.addSpawnedHandler(
            ET.Handler.create(this, () => {
                modifier_no_health_bar.applyOnly(building, building);
                // modifier_building.apply(this.createUnit, domain)
            })
        );
        // 改变人口
        // if (buildingroot.ChessComp().isInBattle()) {
        //     PlayerDataComp.changePopulation(iPopulationAdd);
        //     PlayerDataComp.updateNetTable();
        // }
        return building;
    }

    /**
     *
     * @param playerID
     * @param target
     * @param fGoldReturn 金币返还比例
     * @returns
     */
    public sellBuilding(target: BuildingEntityRoot, fGoldReturn = 0.5) {
        let domain = this.GetDomain<PlayerScene>();
        if (target.DomainParent && target.DomainParent != domain.ETRoot) {
            return;
        }
        let building = target.BuildingComp();
        if (building == null) {
            return;
        }
        EventHelper.fireServerEvent(ChessControlConfig.Event.ChessControl_LeaveBattle,
            target.Playerid, building);
        let iGoldCost = building.GetGoldCost();
        let iGoldReturn = math.floor(iGoldCost * fGoldReturn);
        target.Dispose();
    }

    public addBuilding(towerID: string) {
        let playerroot = this.GetDomain<PlayerScene>().ETRoot;
        let hero = playerroot.Hero;
        let playerID = playerroot.Playerid;
        if (!hero.IsAlive()) return;
        // 相同的塔 合成
        let buildings = this.getBuilding(towerID);
        if (buildings.length >= 1) {
            for (let build of buildings) {
                if (build.BuildingComp().checkCanStarUp()) {
                    build.BuildingComp().AddStar(1);
                    return build;
                }
            }
        }
        let pos = playerroot.ChessControlComp().findEmptyStandbyChessVector();
        if (pos == null) {
            EventHelper.ErrorMessage(BuildingConfig.ErrorCode.dota_hud_error_cant_build_at_location, playerID);
            return;
        }
        let location = pos.getVector3();
        let angle: number = BuildingConfig.BUILDING_ANGLE;
        let building = EntityHelper.CreateEntityByName(towerID, location, hero.GetTeamNumber(), false, hero, hero) as BaseNpc_Plus;
        if (!building) {
            return;
        }
        ResHelper.CreateParticle(
            new ResHelper.ParticleInfo()
                .set_resPath("particles/econ/items/antimage/antimage_ti7/antimage_blink_start_ti7_ribbon_bright.vpcf")
                .set_owner(building)
                .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                .set_validtime(5)
        );
        building.SetTeam(DOTATeam_t.DOTA_TEAM_GOODGUYS);
        /**互相绑定 */
        building.SetControllableByPlayer(playerID, true);
        building.addSpawnedHandler(
            ET.Handler.create(this, () => {
                modifier_no_health_bar.applyOnly(building, building);
                // modifier_building.apply(this.createUnit, domain)
            })
        );
        BuildingEntityRoot.Active(building, playerID, towerID, location, angle);
        let buildingroot = building.ETRoot.As<BuildingEntityRoot>();
        playerroot.AddDomainChild(buildingroot);
        return building;
    }

    public addEvent() {
        let player = this.Domain.ETRoot.AsPlayer();
        EventHelper.addServerEvent(this, RoundConfig.Event.roundboard_onstart,
            player.Playerid,
            (round: ERoundBoard) => {
                this.getAllBattleBuilding()
                    .forEach((b) => {
                        b.RoundBuildingComp().OnBoardRound_Start();
                    });
            });
        EventHelper.addServerEvent(this, RoundConfig.Event.roundboard_onbattle,
            player.Playerid,
            (round: ERoundBoard) => {
                this.getAllBattleBuilding()
                    .forEach((b) => {
                        b.RoundBuildingComp().OnBoardRound_Battle();
                    });
            });
        EventHelper.addServerEvent(this, RoundConfig.Event.roundboard_onprize,
            player.Playerid,
            (iswin: boolean) => {
                this.getAllBattleBuilding()
                    .forEach((b) => {
                        b.RoundBuildingComp().OnBoardRound_Prize(iswin);
                    });
            });
        EventHelper.addServerEvent(this, RoundConfig.Event.roundboard_onwaitingend,
            player.Playerid,
            (round: ERoundBoard) => {
                this.getAllBattleBuilding()
                    .forEach((b) => {
                        b.RoundBuildingComp().OnBoardRound_WaitingEnd();
                    });
            });

    }
    public getAllBuilding() {
        return this.GetDomain<BaseNpc_Plus>().ETRoot.GetDomainChilds(BuildingEntityRoot);
    }
    public getAllBattleBuilding() {
        return this.GetDomain<BaseNpc_Plus>()
            .ETRoot.GetDomainChilds(BuildingEntityRoot)
            .filter((b) => {
                return b.ChessComp().isInBattle();
            });
    }

    public getBuilding(towerID: string) {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let buildings = domain.ETRoot.GetDomainChilds(BuildingEntityRoot);
        let r: BuildingEntityRoot[] = [];
        buildings.forEach((c) => {
            if (c.ConfigID === towerID) {
                r.push(c)
            }
        });
        return r;
    }

}
