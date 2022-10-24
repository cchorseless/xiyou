import { reloadable } from "../../../GameCache";
import { GameEnum } from "../../../GameEnum";
import { EntityHelper } from "../../../helper/EntityHelper";
import { EventHelper } from "../../../helper/EventHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../../npc/entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_no_health_bar } from "../../../npc/modifier/modifier_no_health_bar";
import { ET, serializeETProps } from "../../Entity/Entity";
import { BuildingConfig } from "../../System/Building/BuildingConfig";
import { ChessControlConfig } from "../../System/ChessControl/ChessControlConfig";
import { RoundConfig } from "../../System/Round/RoundConfig";
import { FakerHeroEntityRoot } from "../FakerHero/FakerHeroEntityRoot";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { PlayerScene } from "../Player/PlayerScene";
import { ERoundBoard } from "../Round/ERoundBoard";
import { BuildingEntityRoot } from "./BuildingEntityRoot";

/**塔防组件 */
@reloadable
export class BuildingManagerComponent extends ET.Component {
    public IsSerializeEntity: boolean = true;

    @serializeETProps()
    buildingDamageInfo: { [k: string]: BuildingConfig.I.IBuildingDamageInfo } = {};

    allBuilding: string[] = [];
    allBuildingHelper: BuildingEntityRoot[] = [];

    onAwake() {
        this.addEvent();
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this, true);
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
                // modifier_no_health_bar.applyOnly(building, building);
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
        if (!this.allBuilding.includes(target.Id)) {
            return;
        }
        let building = target.BuildingComp();
        if (building == null) {
            return;
        }
        let index = this.allBuilding.indexOf(target.Id);
        this.allBuilding.splice(index, 1);
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
                // modifier_no_health_bar.applyOnly(building, building);
                // modifier_building.apply(this.createUnit, domain)
            })
        );
        BuildingEntityRoot.Active(building, playerID, towerID);
        let buildingroot = building.ETRoot.As<BuildingEntityRoot>();
        playerroot.AddDomainChild(buildingroot);
        this.allBuilding.push(buildingroot.Id)
        return building;
    }

    public addEvent() {
        let player = this.Domain.ETRoot.AsPlayer();


        EventHelper.addServerEvent(this, RoundConfig.Event.roundboard_onwaitingend,
            player.Playerid,
            (round: ERoundBoard) => {
                this.getAllBattleBuilding()
                    .forEach((b) => {
                        b.RoundStateComp().OnBoardRound_WaitingEnd();
                    });
            });

    }
    public getBuilding(towerID: string) {
        let buildings = this.getAllBuilding();
        let r: BuildingEntityRoot[] = [];
        buildings.forEach((c) => {
            if (c.ConfigID === towerID) {
                r.push(c)
            }
        });
        return r;
    }
    public getAllBuilding() {
        let r: BuildingEntityRoot[] = [];
        let player = this.GetDomain<PlayerScene>().ETRoot;
        this.allBuilding.forEach((b) => {
            let entity = player.GetDomainChild<BuildingEntityRoot>(b);
            if (entity) {
                r.push(entity);
            }
        })
        return r;
    }
    /**
     *
     * @param includeSelfHelper 包括自己外派的
     * @param includeOtherHelper 包括他人外派的
     * @returns
     */
    public getAllBattleBuilding(includeSelfHelper: boolean = false, includeOtherHelper: boolean = true) {
        let r: BuildingEntityRoot[] = [];
        if (includeSelfHelper) {
            r = this.getAllBuilding().filter((b) => {
                return b.ChessComp().isInBattle();
            });
        }
        else {
            r = this.getAllBuilding().filter((b) => {
                return b.ChessComp().isInBoardAndBattle();
            });
        }
        if (includeOtherHelper) {
            r = r.concat(this.allBuildingHelper.filter((b) => {
                return b.ChessComp().isInBattle();
            }));
        }
        return r;
    }

    public getAllBattleUnitAlive() {
        let allbuilding = this.getAllBattleBuilding();
        let r: PlayerCreateBattleUnitEntityRoot[] = [];
        allbuilding.forEach(b => {
            if (b.RuntimeBuilding) {
                r = r.concat(b.RuntimeBuilding.BattleUnitManager().GetAllBattleUnitAlive())
            }
        })
        return r
    }
    OnRoundStartBegin(round: ERoundBoard) {
        this.getAllBattleBuilding()
            .forEach((b) => {
                b.RoundStateComp().OnBoardRound_Start();
            });
    }

    OnRoundStartBattle() {
        this.getAllBattleBuilding()
            .forEach((b) => {
                //创建会逐个调用roundstate组件onawake
                b.CreateCloneRuntimeBuilding();
            });
        // 先战吼技能再激活羁绊
        let player = this.GetDomain<PlayerScene>().ETRoot;
        player.CombinationManager().OnRoundStartBattle();

    }

    OnRoundStartPrize(round: ERoundBoard) {
        this.getAllBattleBuilding()
            .forEach((b) => {
                if (b.RuntimeBuilding) {
                    b.RuntimeBuilding.BattleUnitManager().ClearRuntimeBattleUnit();
                    if (b.RuntimeBuilding.ChessComp().isInBattleAlive()) {
                        b.RuntimeBuilding.RoundStateComp().OnBoardRound_Prize_RuntimeBuilding(round);
                    }
                }

            });
        let player = this.GetDomain<PlayerScene>().ETRoot;
        player.CombinationManager().OnRoundStartPrize(round);

    }
}
