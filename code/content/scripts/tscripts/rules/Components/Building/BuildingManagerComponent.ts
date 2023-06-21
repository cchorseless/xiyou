import { KVHelper } from "../../../helper/KVHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_building } from "../../../npc/modifier/building/modifier_building";
import { modifier_spawn_fall } from "../../../npc/modifier/spawn/modifier_spawn_fall";
import { BuildingConfig } from "../../../shared/BuildingConfig";
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { GameProtocol } from "../../../shared/GameProtocol";
import { EEnum } from "../../../shared/Gen/Types";
import { ET } from "../../../shared/lib/Entity";
import { GEventHelper } from "../../../shared/lib/GEventHelper";
import { TBattleTeamRecord } from "../../../shared/service/battleteam/TBattleTeamRecord";
import { ChessVector } from "../ChessControl/ChessVector";
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
            GNotificationSystem.ErrorMessage(BuildingConfig.ErrorCode.dota_hud_error_has_same_tower, playerID);
            return;
        }
        //  人口判断
        let iPopulationAdd = GBuildingSystem.GetInstance().GetBuildingPopulation(towerID);
        let PlayerDataComp = playerroot.PlayerDataComp();
        let freePopulation = PlayerDataComp.getFreePopulation();
        if (iPopulationAdd > freePopulation) {
            GNotificationSystem.ErrorMessage(BuildingConfig.ErrorCode.dota_hud_error_population_limit);
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
        // 卡片返还
        for (let i = 0; i < target.iStar; i++) {
            GDrawSystem.GetInstance().RegUseCard(target.ConfigID, false);
        }
        target.Dispose();
    }
    /**
     * 获取下一个添加建筑的位置
     * @param towerID 
     * @returns 
     */
    public getNextAddBuildingPos(towerID: string): Vector {
        let playerroot = GGameScene.GetPlayer(this.BelongPlayerid);
        let hero = playerroot.Hero;
        if (!hero.IsAlive()) return;
        // 相同的塔 合成
        // 暂时改成2格升1星
        let buildings = this.getBuilding(towerID);
        let buildcount = buildings.length;
        if (buildcount >= 2) {
            buildings.sort((a, b) => {
                let r = b.iStar - a.iStar;
                if (r == 0) {
                    if (a.ChessComp().isPosInBattle()) {
                        r = -1;
                    }
                    else if (b.ChessComp().isPosInBattle()) {
                        r = 1;
                    }
                }
                return r;
            })
            for (let i = 0; i < buildcount - 1; i++) {
                // 升级目标
                let build1 = buildings[i];
                // 消耗目标
                let build2 = buildings[i + 1];
                if (build1.checkCanStarUp() && build2.iStar == 1) {
                    return build1.GetDomain<IBaseNpc_Plus>().GetAbsOrigin();
                }
            }
        }
        let pos = this.findEmptyStandbyChessVector();
        if (pos == null) {
            return;
        }
        return pos.getVector3();
    }

    public addBuilding(towerID: string, showfaileffect = false, goldcostpect = 100) {
        let playerroot = GGameScene.GetPlayer(this.BelongPlayerid);
        let hero = playerroot.Hero;
        let playerID = playerroot.BelongPlayerid;
        if (!hero.IsAlive()) return;
        let itemName = KVHelper.GetUnitData(towerID, "CardName") as string;
        let iGoldCost = 0;
        if (itemName) {
            iGoldCost = GToNumber(KVHelper.GetItemData(itemName, "ItemCost"));
        }
        let playerdata = playerroot.PlayerDataComp();
        if (goldcostpect > 0) {
            iGoldCost = iGoldCost * goldcostpect * 0.01;
            if (!playerdata.isEnoughItem(EEnum.EMoneyType.Gold, iGoldCost)) {
                GNotificationSystem.ErrorMessage(BuildingConfig.ErrorCode.dota_hud_error_gold_limit, playerID);
                return;
            }
        }
        // 相同的塔 合成
        // 暂时改成2格升1星
        let buildings = this.getBuilding(towerID);
        let buildcount = buildings.length;
        if (buildcount >= 2) {
            buildings.sort((a, b) => {
                let r = b.iStar - a.iStar;
                if (r == 0) {
                    if (a.ChessComp().isPosInBattle()) {
                        r = -1;
                    }
                    else if (b.ChessComp().isPosInBattle()) {
                        r = 1;
                    }
                }
                return r;
            })
            for (let i = 0; i < buildcount - 1; i++) {
                // 升级目标
                let build1 = buildings[i];
                // 消耗目标
                let build2 = buildings[i + 1];
                if (build1.checkCanStarUp() && build2.iStar == 1) {
                    build1.AddStar(1);
                    let build2_index = this.allBuilding.indexOf(build2.Id);
                    this.allBuilding.splice(build2_index, 1);
                    if (build2.ChessComp().isPosInBattle()) {
                        GEventHelper.FireEvent(ChessControlConfig.Event.ChessControl_LeaveBattle, null, build2.BelongPlayerid, build2);
                    }
                    build2.Dispose();
                    playerdata.ModifyGold(-iGoldCost);
                    return build1;
                }
            }
        }
        let pos = this.findEmptyStandbyChessVector();
        if (pos == null) {
            GNotificationSystem.ErrorMessage(BuildingConfig.ErrorCode.dota_hud_error_cant_build_at_location, playerID);
            return;
        }
        let location = pos.getVector3();
        let angle: number = BuildingConfig.BUILDING_ANGLE;
        let building = BaseNpc_Plus.CreateUnitByName(towerID, location, hero, false) as IBaseNpc_Plus;
        if (!building) {
            return;
        }
        building.SetTeam(DOTATeam_t.DOTA_TEAM_GOODGUYS);
        /**互相绑定 */
        building.SetControllableByPlayer(playerID, true);
        modifier_building.applyOnly(building, building);
        BuildingEntityRoot.Active(building, playerID, towerID);
        let buildingroot = building.ETRoot.As<IBuildingEntityRoot>();
        buildingroot.SetGoldCost(iGoldCost);
        if (goldcostpect > 0) {
            playerdata.ModifyGold(-iGoldCost);
        }
        playerroot.AddDomainChild(buildingroot);
        this.allBuilding.push(buildingroot.Id)
        if (showfaileffect) {
            modifier_spawn_fall.applyOnly(building, building);
        }
        else {
            ResHelper.CreateParticle(new ResHelper.ParticleInfo()
                .set_resPath("particles/econ/items/antimage/antimage_ti7/antimage_blink_start_ti7_ribbon_bright.vpcf")
                .set_owner(building)
                .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                .set_validtime(5)
            );
        }
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
        let player = GGameScene.GetPlayer(this.BelongPlayerid);
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
        // let currentround = playerRoot.RoundManagerComp().getCurrentBoardRound();
        // if (currentround.roundState != RoundConfig.ERoundBoardState.start && !boardVec.isY(0)
        // ) {
        //     r = [false, "move chess only in round start"];
        // }
        if (target.ChessComp().ChessVector.isSame(boardVec)) {
            r = [false, "same vector"];
        }
        if (!r[0]) {
            EmitSoundOn("General.CastFail_NoMana", GGameScene.GetPlayer(this.BelongPlayerid).Hero);
            return r;
        }
        let targetPos = ChessControlSystem.GetBoardGirdVector3(boardVec);
        // 不能移动到蛋的位置
        let egg = playerRoot.CourierRoot().CourierEggComp().EggUnit;
        if (IsValid(egg) && GFuncVector.CalculateDistance(egg.GetAbsOrigin(), targetPos) <= 50) {
            return [false, "cant move to egg position"];
        }
        // 回合
        let oldNpcarr = ChessControlSystem.FindBoardInGirdChess(boardVec);
        //  人口判断
        let iPopulationAdd = 0;
        if (!target.ChessComp().isPosInBattle() && !boardVec.isY(0)) {
            iPopulationAdd = GBuildingSystem.GetInstance().GetBuildingPopulation(target.ConfigID);
        }
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
        let chessVector = new ChessVector(0, 0, this.BelongPlayerid);
        for (let i = 0; i < ChessControlConfig.Gird_Max_X; i++) {
            chessVector.x = i;
            if (GChessControlSystem.GetInstance().IsBoardEmptyGird(chessVector)) {
                return chessVector;
            }
        }
        return null;
    }

    /**
     * @param isbeforeBattle 是否在战斗前
     * @param includeSelfHelper 包括自己外派的
     * @param includeOtherHelper 包括他人外派的
     * @returns
     */
    public getAllBattleBuilding(isbeforeBattle: boolean, includeSelfHelper: boolean = false, includeOtherHelper: boolean = true) {
        let r: IBuildingEntityRoot[] = [];
        // if (includeSelfHelper) {
        //     r = this.getAllBuilding().filter((b) => {
        //         return b.RuntimeBuilding != null;
        //     });
        // } else {
        //     r = this.getAllBuilding().filter((b) => {
        //         return b.ChessComp().isInBoardAndBattle();
        //     });
        // }
        // if (includeOtherHelper) {
        //     r = r.concat(this.allBuildingHelper.filter((b) => {
        //         return b.ChessComp().isInBattle;
        //     }));
        // }
        if (isbeforeBattle) {
            r = this.getAllBuilding().filter((b) => {
                return b.ChessComp().isInBoardAndBattle();
            });
        } else {
            r = this.getAllBuilding().filter((b) => {
                return b.RuntimeBuilding != null;
            });
        }
        return r;
    }

    OnRound_Start(round: ERoundBoard) {
        this.getAllBattleBuilding(true).forEach((b) => {
            b.OnRound_Start();
        });
    }

    OnRound_Battle(round: ERoundBoard) {
        this.UploadBuildingData();
        // 上传阵容数据
        this.getAllBattleBuilding(true).forEach((b) => {
            b.OnRound_Battle(round);
        });
        // 先战吼技能再激活羁绊
        let player = GGameScene.GetPlayer(this.BelongPlayerid);
        player.CombinationManager().OnRound_Battle(round);

    }

    OnRound_Prize(round: ERoundBoard) {
        let player = GGameScene.GetPlayer(this.BelongPlayerid);
        player.BattleUnitManagerComp().ClearSummonIllusion(DOTATeam_t.DOTA_TEAM_GOODGUYS);
        this.getAllBattleBuilding(false).forEach((b) => {
            if (b.RuntimeBuilding && b.RuntimeBuilding.isAlive && !b.RuntimeBuilding.IsDisposed()) {
                if (b.RuntimeBuilding.ChessComp().isInBattle) {
                    b.RuntimeBuilding.OnRound_Prize(round);
                }
            }
        });
        player.CombinationManager().OnRound_Prize(round);

    }

    OnRound_WaitingEnd() {
        this.getAllBattleBuilding(false).forEach((b) => {
            b.OnRound_WaitingEnd();
        });
        // 防止由于售卖棋子导致的漏掉的
        let player = GGameScene.GetPlayer(this.BelongPlayerid);
        player.BattleUnitManagerComp().ClearBuildingRuntime();

    }


    OnGame_End(iswin: boolean) {
        if (iswin) {

        }
        else {
            this.OnRound_WaitingEnd();
            BuildingEntityRoot.GetGroupInstance(this.BelongPlayerid).forEach((b) => {
                b.Dispose();
            });
        }
    }

    /**
     * 上传阵容数据
     */
    UploadBuildingData() {
        let playeroot = GGameScene.GetPlayer(this.BelongPlayerid);
        const UnitInfoDes: IBattleUnitInfoItem[] = [];
        this.getAllBattleBuilding(true).forEach((b) => {
            const npc = b.GetDomain<IBaseNpc_Plus>();
            const ChessComp = b.ChessComp();
            const equips: string[] = [];
            for (let i = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1; i <= DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_6; i++) {
                let item = npc.GetItemInSlot(i) as IBaseItem_Plus;
                if (item && item.IsValidItem()) {
                    equips.push(item.GetAbilityName())
                }
            }
            UnitInfoDes.push({
                UnitName: b.ConfigID,
                Level: npc.GetLevel(),
                Star: b.iStar,
                PosX: ChessComp.ChessVector.x,
                PosY: ChessComp.ChessVector.y,
                WearBundleId: b.WearableComp().WearBundleId,
                EquipInfo: equips.length > 0 ? equips : null,
                Buffs: b.BuffManagerComp().getCloneBuffInfo(),

            })
        });
        if (UnitInfoDes.length == 0) { return }
        const round = playeroot.RoundManagerComp().getCurrentBoardRound();
        const roundIndex = round.config.roundIndex;
        const RoundCharpter = GGameServiceSystem.GetInstance().getDifficultyNumberDes();
        const accoutid = PlayerResource.GetSteamAccountID(this.BelongPlayerid) + "";
        const playername = PlayerResource.GetPlayerName(this.BelongPlayerid);
        const allcomb = playeroot.CombinationManager().getAllActiveCombination();
        const SectInfo: { [k: string]: number } = {};
        allcomb.forEach(v => {
            SectInfo[v.SectName] = v.uniqueConfigList.length;
        })
        const SectInfoDes: string[] = [];
        for (let k in SectInfo) {
            SectInfoDes.push(`${k}|${SectInfo[k]}`)
        }
        const child1: TBattleTeamRecord = {} as any;
        child1.SteamAccountId = accoutid;
        child1.SteamAccountName = playername;
        child1.RoundIndex = roundIndex;
        child1.RoundCharpter = RoundCharpter;
        child1.Score = this.GetBuildingTeamScore();
        child1.SectInfo = SectInfoDes;
        child1.UnitInfo = UnitInfoDes;
        playeroot.PlayerHttpComp().Post(GameProtocol.Protocol.DrawEnemy_UploadEnemyInfo, {
            SteamAccountId: accoutid,
            SteamAccountName: playername,
            TeamInfo: [child1],
        })
    }





    /**
     * 获得战力
     */
    GetBuildingTeamScore() {
        let score = 0;
        this.getAllBattleBuilding(true).forEach((b) => {
            score += b.GetScore();
        });
        let player = GGameScene.GetPlayer(this.BelongPlayerid);
        score += player.CombinationManager().GetSectScore();
        return score;
    }

}

