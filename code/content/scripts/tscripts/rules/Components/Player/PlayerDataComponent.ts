
import { EventHelper } from "../../../helper/EventHelper";
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { EEnum } from "../../../shared/Gen/Types";
import { GEventHelper } from "../../../shared/lib/GEventHelper";
import { PlayerConfig } from "../../../shared/PlayerConfig";
import { PlayerData } from "../../../shared/rules/Player/PlayerData";
import { ERoundBoard } from "../Round/ERoundBoard";

@GReloadable
export class PlayerDataComponent extends PlayerData {

    onAwake(...args: any[]): void {
        this.addEvent();
        this.applyPopuLevelUp(0);
        this.applyTechLevelUp(0);
        this.perIntervalGold += 5;
        this.SyncClient();
    }

    isEnoughItem(type: number, count: number) {
        switch (type) {
            case EEnum.EMoneyType.Gold:
                return this.gold + count >= 0;
            case EEnum.EMoneyType.Wood:
                return this.wood + count >= 0;
            case EEnum.EMoneyType.SoulCrystal:
                return this.soulcrystal + count >= 0;
        }
        return false;
    }

    StartGame() {
        this.addMoneyPerInterval();
    }


    changeItem(type: number, count: number) {
        switch (type) {
            case EEnum.EMoneyType.Gold:
                this.gold += count;
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
    }

    addMoneyRoundStart(gold: number, wood: number) {
        this.changeItem(EEnum.EMoneyType.Gold, gold);
        this.changeItem(EEnum.EMoneyType.Wood, wood);
        this.SyncClient();
    }

    timePerInterval: ITimerTask;
    addMoneyPerInterval() {
        if (this.timePerInterval != null) {
            this.timePerInterval.Clear()
            this.timePerInterval = null;
        }
        this.timePerInterval = GTimerHelper.AddTimer(15, GHandler.create(this, () => {
            this.changeItem(EEnum.EMoneyType.Gold, this.perIntervalGold);
            this.changeItem(EEnum.EMoneyType.Wood, this.perIntervalWood);
            this.SyncClient();
            return 15
        }))
    }

    addEvent() {
        GEventHelper.AddEvent(ChessControlConfig.Event.ChessControl_JoinBattle,
            GHandler.create(this, (building: IBuildingEntityRoot) => {
                let popu = building.GetPopulation();
                this.changePopulation(popu);
            }),
            this.BelongPlayerid
        );
        GEventHelper.AddEvent(ChessControlConfig.Event.ChessControl_LeaveBattle,
            GHandler.create(this, (building: IBuildingEntityRoot) => {
                let popu = building.GetPopulation();
                this.changePopulation(-popu);
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

    OnRoundStartBegin(round: ERoundBoard) {
        if (round.BelongPlayerid == (this.BelongPlayerid)) {
            this.addMoneyRoundStart(tonumber(round.config.roundprize_gold), tonumber(round.config.roundprize_wood));
        }
    }

    SpendGold(gold: number, reason: EDOTA_ModifyGold_Reason = 0) {
        this.gold -= gold;
    }

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
                SendOverheadEventMessage(PlayerResource.GetPlayer(this.BelongPlayerid), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, hHero, iGold, null)
            }))
        }
        else {
            this.ModifyGold(iGold, reliable, reason);
            SendOverheadEventMessage(PlayerResource.GetPlayer(this.BelongPlayerid), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, hHero, iGold, null)
        }
    }

    ModifyGold(goldChange: number, reliable: boolean = true, reason: EDOTA_ModifyGold_Reason = 0) {
        this.gold += goldChange;
    }


}

