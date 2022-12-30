
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
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
        this.startTime = TimerHelper.Now();
        this.applyPopuLevelUp(0);
        this.applyTechLevelUp(0);
        this.perIntervalGold += 5;
        this.addMoneyPerInterval();
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
                let popu = building.BuildingComp().GetPopulation();
                this.changePopulation(popu);
            }),
            this.BelongPlayerid
        );
        GEventHelper.AddEvent(ChessControlConfig.Event.ChessControl_LeaveBattle,
            GHandler.create(this, (building: IBuildingEntityRoot) => {
                let popu = building.BuildingComp().GetPopulation();
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
        let popu = KVHelper.KvServerConfig.population_config[this.popuLevel + ""].PopulationRoof;
        this.populationRoof += tonumber(popu);
        let popuLevelUpCostGold = KVHelper.KvServerConfig.population_config[this.popuLevel + ""].goldcost;
        let popuLevelUpCostWood = KVHelper.KvServerConfig.population_config[this.popuLevel + ""].woodcost;
        this.popuLevelUpCostGold += tonumber(popuLevelUpCostGold);
        this.popuLevelUpCostWood += tonumber(popuLevelUpCostWood);
    }
    applyTechLevelUp(addlevel: number) {
        this.techLevel += addlevel;
        let extraWood = KVHelper.KvServerConfig.tech_config[this.techLevel + ""].ExtraWood;
        this.perIntervalWood += tonumber(extraWood);
        let techLevelUpCostGold = KVHelper.KvServerConfig.tech_config[this.techLevel + ""].goldcost;
        this.techLevelUpCostGold += tonumber(techLevelUpCostGold);
    }

    OnRoundStartBegin(round: ERoundBoard) {
        if (round.BelongPlayerid == (this.BelongPlayerid)) {
            this.addMoneyRoundStart(tonumber(round.config.roundprize_gold), tonumber(round.config.roundprize_wood));
        }
    }
}

