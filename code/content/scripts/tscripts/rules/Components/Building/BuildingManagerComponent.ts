import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { BuildingConfig } from "../../../shared/BuildingConfig";
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { EEnum } from "../../../shared/Gen/Types";
import { RoundConfig } from "../../../shared/RoundConfig";
import { ET } from "../../../shared/lib/Entity";
import { GEventHelper } from "../../../shared/lib/GEventHelper";
import { ChessVector } from "../ChessControl/ChessVector";
import { PlayerScene } from "../Player/PlayerScene";
import { ERoundBoard } from "../Round/ERoundBoard";
import { BuildingEntityRoot } from "./BuildingEntityRoot";

/**塔防组件 */
@GReloadable
export class BuildingManagerComponent extends ET.Component implements IRoundStateCallback {

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
        let building = BaseNpc_Plus.CreateUnitByName(towerID, location, hero, false) as IBaseNpc_Plus;
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
        if (target == null || !target.IsBuilding()) {
            return;
        }
        if (!this.allBuilding.includes(target.Id)) {
            return;
        }
        let index = this.allBuilding.indexOf(target.Id);
        this.allBuilding.splice(index, 1);
        if (target.ChessComp().isPosInBattle()) {
            GEventHelper.FireEvent(ChessControlConfig.Event.ChessControl_LeaveBattle, null, target.BelongPlayerid, target);
        }
        let iGoldCost = target.GetGoldCost();
        let iGoldReturn = math.floor(iGoldCost * fGoldReturn);
        let playerroot = GPlayerEntityRoot.GetOneInstance(target.BelongPlayerid);
        playerroot.PlayerDataComp().ModifyGold(iGoldReturn);
        target.Dispose();
    }

    public addBuilding(towerID: string, goldcostpect = 100) {
        let playerroot = this.GetDomain<PlayerScene>().ETRoot;
        let hero = playerroot.Hero;
        let playerID = playerroot.BelongPlayerid;
        if (!hero.IsAlive()) return;
        let itemName = KVHelper.GetUnitData(towerID, "CardName") as string;
        let iGoldCost = 0;
        if (itemName) {
            GLogHelper.print("itemName", towerID, itemName)
            iGoldCost = GToNumber(KVHelper.GetItemData(itemName, "ItemCost"));
        }
        iGoldCost = iGoldCost * goldcostpect * 0.01;
        let playerdata = playerroot.PlayerDataComp();
        if (!playerdata.isEnoughItem(EEnum.EMoneyType.Gold, iGoldCost)) {
            EventHelper.ErrorMessage(BuildingConfig.ErrorCode.dota_hud_error_gold_limit, playerID);
            return;
        }
        // 相同的塔 合成
        let buildings = this.getBuilding(towerID);
        if (buildings.length >= 1) {
            for (let build of buildings) {
                if (build.checkCanStarUp()) {
                    build.AddStar(1);
                    playerdata.ModifyGold(-iGoldCost);
                    return build;
                }
            }
        }
        let pos = this.findEmptyStandbyChessVector();
        if (pos == null) {
            EventHelper.ErrorMessage(BuildingConfig.ErrorCode.dota_hud_error_cant_build_at_location, playerID);
            return;
        }
        let location = pos.getVector3();
        let angle: number = BuildingConfig.BUILDING_ANGLE;
        let building = BaseNpc_Plus.CreateUnitByName(towerID, location, hero, false) as IBaseNpc_Plus;
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
        BuildingEntityRoot.Active(building, playerID, towerID);
        let buildingroot = building.ETRoot.As<IBuildingEntityRoot>();
        buildingroot.SetGoldCost(iGoldCost);
        playerdata.ModifyGold(-iGoldCost);
        playerroot.AddDomainChild(buildingroot);
        this.allBuilding.push(buildingroot.Id)
        return building;
    }

    public addEvent() {

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


    public moveBuilding(target: IBuildingEntityRoot, v: Vector): [boolean, string] {
        let r: [boolean, string] = [true, ""];
        let playerRoot = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
        if (!playerRoot.CheckIsAlive()) {
            r = [false, "hero is death"];
        }
        if (target == null) {
            r = [false, "EntityRoot is null"];
        }
        if (playerRoot.GetDomainChild(target.Id) == null) {
            r = [false, "EntityRoot is not my"];
        }
        let ChessControlSystem = GChessControlSystem.GetInstance();
        let boardVec = ChessControlSystem.GetBoardLocalVector2(v);
        if (boardVec.playerid != playerRoot.BelongPlayerid ||
            boardVec.x < 0 || boardVec.y < 0 ||
            boardVec.y > ChessControlConfig.ChessValid_Max_Y) {
            r = [false, "not  vaild vector"];
        }
        let currentround = playerRoot.RoundManagerComp().getCurrentBoardRound();
        if (currentround.roundState != RoundConfig.ERoundBoardState.start
            && !boardVec.isY(0)
        ) {
            r = [false, "move chess only in round start"];
        }
        if (target.ChessComp().ChessVector.isSame(boardVec)) {
            r = [false, "same vector"];
        }
        if (!r[0]) {
            EmitSoundOn("General.CastFail_NoMana", this.GetDomain<PlayerScene>().ETRoot.Hero);
            return r;
        }
        let targetPos = ChessControlSystem.GetBoardGirdCenterVector3(boardVec);
        let oldNpcarr = ChessControlSystem.FindBoardInGirdChess(boardVec);
        //  人口判断
        let iPopulationAdd = GBuildingSystem.GetInstance().GetBuildingPopulation(target.ConfigID);
        let PlayerDataComp = playerRoot.PlayerDataComp();
        let freePopulation = PlayerDataComp.getFreePopulation();
        if (oldNpcarr.length > 0) {
            let oldNpc = oldNpcarr[0];
            iPopulationAdd -= GBuildingSystem.GetInstance().GetBuildingPopulation(oldNpc.ConfigID);
        }
        if (iPopulationAdd > freePopulation) {
            return [false, BuildingConfig.ErrorCode.dota_hud_error_population_limit];
        }
        // 交换位置
        if (oldNpcarr.length > 0) {
            let oldNpc = oldNpcarr[0];
            let curpos = target.GetDomain<IBaseNpc_Plus>().GetAbsOrigin();
            oldNpc.ChessComp().blinkChessX(curpos);
        }
        target.ChessComp().blinkChessX(targetPos);
        return [true, ""];
    }

    public findEmptyStandbyChessVector() {
        let playerid = this.GetDomain<PlayerScene>().ETRoot.BelongPlayerid;
        let chessVector = new ChessVector(0, 0, playerid);
        for (let i = 0; i < ChessControlConfig.Gird_Max_X; i++) {
            chessVector.x = i;
            if (GChessControlSystem.GetInstance().IsBoardEmptyGird(chessVector)) {
                return chessVector;
            }
        }
        return null;
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
                return b.ChessComp().isInBattle;
            });
        } else {
            r = this.getAllBuilding().filter((b) => {
                return b.ChessComp().isInBoardAndBattle();
            });
        }
        if (includeOtherHelper) {
            r = r.concat(this.allBuildingHelper.filter((b) => {
                return b.ChessComp().isInBattle;
            }));
        }
        return r;
    }

    OnRound_Start(round: ERoundBoard) {
        this.getAllBattleBuilding().forEach((b) => {
            b.OnRound_Start();
        });
    }

    OnRound_Battle() {
        this.getAllBattleBuilding().forEach((b) => {
            b.OnRound_Battle();
        });
        // 先战吼技能再激活羁绊
        let player = this.GetDomain<PlayerScene>().ETRoot;
        player.CombinationManager().OnRound_Battle();

    }

    OnRound_Prize(round: ERoundBoard) {
        let player = this.GetDomain<PlayerScene>().ETRoot;
        player.BattleUnitManagerComp().ClearSummonIllusion(DOTATeam_t.DOTA_TEAM_GOODGUYS);
        this.getAllBattleBuilding().forEach((b) => {
            if (b.RuntimeBuilding && b.RuntimeBuilding.isAlive && !b.RuntimeBuilding.IsDisposed()) {
                if (b.RuntimeBuilding.ChessComp().isInBattle) {
                    b.RuntimeBuilding.OnRound_Prize(round);
                }
            }
        });
        player.CombinationManager().OnRound_Prize(round);

    }

    OnRound_WaitingEnd() {
        this.getAllBattleBuilding().forEach((b) => {
            b.OnRound_WaitingEnd();
        });
    }

}

