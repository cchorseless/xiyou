
import { EventHelper } from "../../../helper/EventHelper";
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { EEnum } from "../../../shared/Gen/Types";
import { GEventHelper } from "../../../shared/lib/GEventHelper";
import { PlayerConfig } from "../../../shared/PlayerConfig";
import { PlayerData } from "../../../shared/rules/Player/PlayerData";
import { ERoundBoard } from "../Round/ERoundBoard";

@GReloadable
export class PlayerDataComponent extends PlayerData implements IRoundStateCallback {

    onAwake(...args: any[]): void {
        this.addEvent();
        this.applyPopuLevelUp(0);
        this.applyTechLevelUp(0);
        this.SyncClient();
    }

    isEnoughItem(type: number, count: number) {
        count = math.abs(count);
        switch (type) {
            case EEnum.EMoneyType.Gold:
                return this.gold - count >= 0;
            case EEnum.EMoneyType.Wood:
                return this.wood - count >= 0;
            case EEnum.EMoneyType.SoulCrystal:
                return this.soulcrystal - count >= 0;
        }
        return false;
    }

    StartGame() {
        this.addCoinPerInterval();
    }


    changeItem(type: number, count: number) {
        switch (type) {
            case EEnum.EMoneyType.Gold:
                this.gold += count;
                let offset = this.gold - PlayerResource.GetGold(this.BelongPlayerid);
                PlayerResource.ModifyGold(this.BelongPlayerid, offset, true, EDOTA_ModifyGold_Reason.DOTA_ModifyGold_Unspecified)
                break;
            case EEnum.EMoneyType.Wood:
                this.wood += count;
                break;
            case EEnum.EMoneyType.SoulCrystal:
                this.soulcrystal += count;
                break;
        }
    }

    changePopulation(count: number) {
        this.population += count;
        this.SyncClient();
    }

    addMoneyRoundStart(gold: number, wood: number) {
        this.ModifyGold(gold);
        this.ModifyWood(wood);
    }

    timePerInterval: ITimerTask;
    addCoinPerInterval() {
        if (this.timePerInterval != null) {
            this.timePerInterval.Clear()
            this.timePerInterval = null;
        }
        this.timePerInterval = GTimerHelper.AddTimer(15, GHandler.create(this, () => {
            this.ModifyGold(this.perIntervalGold);
            this.ModifyWood(this.perIntervalWood);
            return 15
        }))
    }

    addEvent() {
        GEventHelper.AddEvent(ChessControlConfig.Event.ChessControl_JoinBattle,
            GHandler.create(this, (building: IBuildingEntityRoot) => {
                if (building.IsBuilding()) {
                    let popu = building.GetPopulation();
                    this.changePopulation(popu);
                }
            }), this.BelongPlayerid
        );
        GEventHelper.AddEvent(ChessControlConfig.Event.ChessControl_LeaveBattle,
            GHandler.create(this, (building: IBuildingEntityRoot) => {
                if (building.IsBuilding()) {
                    let popu = building.GetPopulation();
                    this.changePopulation(-popu);
                }
            }),
            this.BelongPlayerid);

        EventHelper.addProtocolEvent(PlayerConfig.EProtocol.reqApplyPopuLevelUp, GHandler.create(this, (e) => {
            e.state = true;
            if (this.popuLevel >= this.popuLevelMax) {
                EventHelper.ErrorMessage("level max", this.BelongPlayerid);
                return;
            }
            if (this.gold < this.popuLevelUpCostGold) {
                EventHelper.ErrorMessage("gold not enough", this.BelongPlayerid);
                return;
            }
            if (this.wood < this.popuLevelUpCostWood) {
                EventHelper.ErrorMessage("wood not enough", this.BelongPlayerid);
                return;
            }
            this.changeItem(EEnum.EMoneyType.Gold, -this.popuLevelUpCostGold);
            this.changeItem(EEnum.EMoneyType.Wood, -this.popuLevelUpCostWood);
            this.applyPopuLevelUp(1);
            this.SyncClient();
        }));
        EventHelper.addProtocolEvent(PlayerConfig.EProtocol.reqApplyTechLevelUp, GHandler.create(this, (e) => {
            e.state = true;
            if (this.techLevel >= this.techLevelMax) {
                EventHelper.ErrorMessage("tech level max", this.BelongPlayerid);
                return;
            }
            if (this.gold < this.techLevelUpCostGold) {
                EventHelper.ErrorMessage("gold not enough", this.BelongPlayerid);
                return;
            }
            this.changeItem(EEnum.EMoneyType.Gold, -this.techLevelUpCostGold);
            this.applyTechLevelUp(1);
            this.SyncClient();
        }));
    }
    /**
     * 获取空闲人口数量
     * @param playerID
     * @returns
     */
    getFreePopulation() {
        return this.populationRoof - this.population;
    }
    applyPopuLevelUp(addlevel: number) {
        this.popuLevel += addlevel;
        const config = GJSONConfig.PopulationConfig.get(this.popuLevel + "");
        this.populationRoof += config.PopulationRoof;
        this.popuLevelUpCostGold += config.goldcost;
        this.popuLevelUpCostWood += config.woodcost;
    }
    applyTechLevelUp(addlevel: number) {
        this.techLevel += addlevel;
        const config = GJSONConfig.TechConfig.get(this.popuLevel + "");
        this.perIntervalWood += config.ExtraWood;
        this.techLevelUpCostGold += config.goldcost;
    }

    OnRound_Start(round: ERoundBoard) {
        if (round.BelongPlayerid == this.BelongPlayerid) {
            this.addMoneyRoundStart(round.config.roundprizeGold, round.config.roundprizeWood);
        }
    }
    OnRound_Battle(): void { }
    OnRound_Prize(round?: ERoundBoard): void { }
    OnRound_WaitingEnd(): void { }


    GetGold() {
        return this.gold;
    }

    FlyGoldEffect(vStart: Vector, iGold: number, reliable: boolean = true, reason: EDOTA_ModifyGold_Reason = 0) {
        let hHero = GGameScene.GetPlayer(this.BelongPlayerid).Hero;
        if (hHero != null && !hHero.IsNull()) {
            let iParticleID = ParticleManager.CreateParticle("particles/econ/courier/courier_beetlejaw/courier_beetlejaw_ambient_gold.vpcf", ParticleAttachment_t.PATTACH_POINT, hHero)
            ParticleManager.SetParticleControl(iParticleID, 0, vStart)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hHero, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hHero.GetAbsOrigin(), false)
            ParticleManager.ReleaseParticleIndex(iParticleID)
            GTimerHelper.AddTimer(1, GHandler.create(this, () => {
                this.ModifyGold(iGold, reliable, reason);
            }))
        }
        else {
            this.ModifyGold(iGold, reliable, reason);
        }
    }

    ModifyGold(goldChange: number, reliable: boolean = true, reason: EDOTA_ModifyGold_Reason = 0) {
        this.changeItem(EEnum.EMoneyType.Gold, goldChange);
        if (goldChange > 0) {
            let hHero = GGameScene.GetPlayer(this.BelongPlayerid).Hero;
            SendOverheadEventMessage(PlayerResource.GetPlayer(this.BelongPlayerid), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, hHero, goldChange, null)
        }
        this.SyncClient();
    }

    ModifyWood(woodChange: number, reliable: boolean = true, reason: EDOTA_ModifyGold_Reason = 0) {
        this.changeItem(EEnum.EMoneyType.Wood, woodChange);
        if (woodChange > 0) {
            let hHero = GGameScene.GetPlayer(this.BelongPlayerid).Hero;
            SendOverheadEventMessage(PlayerResource.GetPlayer(this.BelongPlayerid), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_XP, hHero, woodChange, null)
        }
        this.SyncClient();
    }
}

