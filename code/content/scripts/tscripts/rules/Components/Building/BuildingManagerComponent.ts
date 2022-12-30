
import { EventHelper } from "../../../helper/EventHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { BuildingConfig } from "../../../shared/BuildingConfig";
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { ET } from "../../../shared/lib/Entity";
import { GEventHelper } from "../../../shared/lib/GEventHelper";
import { RoundConfig } from "../../../shared/RoundConfig";
import { PlayerScene } from "../Player/PlayerScene";
import { ERoundBoard } from "../Round/ERoundBoard";
import { BuildingEntityRoot } from "./BuildingEntityRoot";

/**塔防组件 */
@GReloadable
export class BuildingManagerComponent extends ET.Component {
    public IsSerializeEntity: boolean = true;

    allBuilding: string[] = [];
    allBuildingHelper: IBuildingEntityRoot[] = [];

    onAwake() {
        this.addEvent();
        this.SyncClient(true);
    }

    /**
     * 放置建築
     * @param hero
     * @param name
     * @param location
     * @param angle
     */
    public placeBuilding(towerID: string, location: Vector, angle: number = BuildingConfig.BUILDING_ANGLE) {
        let playerroot = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid)
        let hero = playerroot.Hero;
        let playerID = playerroot.BelongPlayerid;
        if (!hero.IsAlive()) return;
        // 相同的塔
        let bHasCount = this.getBuilding(towerID).length;
        if (bHasCount >= BuildingConfig.MAX_SAME_TOWER) {
            EventHelper.ErrorMessage(BuildingConfig.ErrorCode.dota_hud_error_has_same_tower, playerID);
            return;
        }
        //  人口判断
        let iPopulationAdd = GBuildingSystem.GetInstance().GetBuildingPopulation(towerID);
        let PlayerDataComp = playerroot.PlayerDataComp();
        let freePopulation = PlayerDataComp.getFreePopulation();
        if (iPopulationAdd > freePopulation) {
            EventHelper.ErrorMessage(BuildingConfig.ErrorCode.dota_hud_error_population_limit);
            return;
        }
        let building = BaseNpc_Plus.CreateUnitByName(towerID, location, hero.GetTeamNumber(), false, hero, hero) as IBaseNpc_Plus;
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
        let buildingroot = building.ETRoot.As<IBuildingEntityRoot>();
        playerroot.AddDomainChild(buildingroot);
        /**互相绑定 */
        building.SetControllableByPlayer(playerID, true);
        building.addSpawnedHandler(
            GHandler.create(this, () => {
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
    public sellBuilding(target: IBuildingEntityRoot, fGoldReturn = 0.5) {
        if (!this.allBuilding.includes(target.Id)) {
            return;
        }
        let building = target.BuildingComp();
        if (building == null) {
            return;
        }
        let index = this.allBuilding.indexOf(target.Id);
        this.allBuilding.splice(index, 1);
        GEventHelper.FireEvent(ChessControlConfig.Event.ChessControl_LeaveBattle, null,
            target.BelongPlayerid, building);
        let iGoldCost = building.GetGoldCost();
        let iGoldReturn = math.floor(iGoldCost * fGoldReturn);
        target.Dispose();
    }

    public addBuilding(towerID: string) {
        let playerroot = this.GetDomain<PlayerScene>().ETRoot;
        let hero = playerroot.Hero;
        let playerID = playerroot.BelongPlayerid;
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
        let building = BaseNpc_Plus.CreateUnitByName(towerID, location, hero.GetTeamNumber(), false, hero, hero) as IBaseNpc_Plus;
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
            GHandler.create(this, () => {
                // modifier_no_health_bar.applyOnly(building, building);
                // modifier_building.apply(this.createUnit, domain)
            })
        );
        BuildingEntityRoot.Active(building, playerID, towerID);
        let buildingroot = building.ETRoot.As<IBuildingEntityRoot>();
        playerroot.AddDomainChild(buildingroot);
        this.allBuilding.push(buildingroot.Id)
        return building;
    }

    public addEvent() {
        GEventHelper.AddEvent(RoundConfig.Event.roundboard_onwaitingend,
            GHandler.create(this, (round: ERoundBoard) => {
                this.getAllBattleBuilding()
                    .forEach((b) => {
                        b.RoundStateComp().OnBoardRound_WaitingEnd();
                    });
            }),
            this.BelongPlayerid,
        );

    }
    public getBuilding(towerID: string) {
        let buildings = this.getAllBuilding();
        let r: IBuildingEntityRoot[] = [];
        buildings.forEach((c) => {
            if (c.ConfigID === towerID) {
                r.push(c)
            }
        });
        return r;
    }
    public getAllBuilding() {
        let r: IBuildingEntityRoot[] = [];
        let player = this.GetDomain<PlayerScene>().ETRoot;
        this.allBuilding.forEach((b) => {
            let entity = player.GetDomainChild<IBuildingEntityRoot>(b);
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
        let r: IBuildingEntityRoot[] = [];
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
        let r: IBattleUnitEntityRoot[] = [];
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
