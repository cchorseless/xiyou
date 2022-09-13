import { GameEnum } from "../../../GameEnum";
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { ET, registerET, serializeETProps } from "../../Entity/Entity";
import { DifficultyState } from "../../System/Difficulty/DifficultyState";
import { PlayerConfig } from "../../System/Player/PlayerConfig";
import { ERoundBoard } from "../Round/ERoundBoard";

@registerET()
export class PlayerDataComponent extends ET.Component {
    @serializeETProps()
    startTime: string;
    @serializeETProps()
    populationRoof: number = 100;
    @serializeETProps()
    population: number = 0;
    @serializeETProps()
    gold: number = 0;
    @serializeETProps()
    food: number = 0;
    @serializeETProps()
    wood: number = 0;
    @serializeETProps()
    difficulty: string;

    @serializeETProps()
    popuLevel: number = 0;
    @serializeETProps()
    popuLevelUpCostGold: number = 0;
    @serializeETProps()
    popuLevelUpCostWood: number = 0;
    @serializeETProps()
    techLevel: number = 0;
    @serializeETProps()
    techLevelUpCostGold: number = 0;
    @serializeETProps()
    popuLevelMax: number = 10;
    @serializeETProps()
    techLevelMax: number = 10;
    @serializeETProps()
    perIntervalGold: number = 0;
    @serializeETProps()
    perIntervalWood: number = 0;

    onAwake(...args: any[]): void {
        this.addEvent();
        this.startTime = TimerHelper.now();
        this.difficulty = DifficultyState.getDifficultyDes();
        this.applyPopuLevelUp(0);
        this.applyTechLevelUp(0);
        this.perIntervalGold += 5;
        this.addMoneyPerInterval();
        this.updateNetTable();
    }

    isEnoughItem(type: number, count: number) {
        switch (type) {
            case GameEnum.Item.EItemIndex.Gold:
                return this.gold + count >= 0;
            case GameEnum.Item.EItemIndex.Wood:
                return this.wood + count >= 0;
            case GameEnum.Item.EItemIndex.Food:
                return this.food + count >= 0;
        }
        return false;
    }

    changeItem(type: number, count: number) {
        switch (type) {
            case GameEnum.Item.EItemIndex.Gold:
                this.gold += count;
                break;
            case GameEnum.Item.EItemIndex.Wood:
                this.wood += count;
                break;
            case GameEnum.Item.EItemIndex.Food:
                this.food += count;
                break;
        }
    }

    changePopulation(count: number) {
        if (this.population + count > this.populationRoof) {
            return;
        }
        this.population += count;
    }

    addMoneyRoundStart(gold: number, wood: number) {
        this.changeItem(GameEnum.Item.EItemIndex.Gold, gold);
        this.changeItem(GameEnum.Item.EItemIndex.Wood, wood);
        this.updateNetTable();
    }

    updateNetTable() {
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this);
    }

    timePerInterval: string;
    addMoneyPerInterval() {
        if (this.timePerInterval != null) {
            TimerHelper.removeTimer(this.timePerInterval);
            this.timePerInterval = null;
        }
        this.timePerInterval = TimerHelper.addTimer(
            15,
            () => {
                this.changeItem(GameEnum.Item.EItemIndex.Gold, this.perIntervalGold);
                this.changeItem(GameEnum.Item.EItemIndex.Wood, this.perIntervalWood);
                this.updateNetTable();
                return 15;
            },
            this,
            true
        );
    }

    addEvent() {
        let playerroot = this.Domain.ETRoot.AsPlayer();
        EventHelper.addServerEvent(this, GameEnum.Event.CustomServer.onserver_roundboard_onstart,
            playerroot.Playerid,
            (round: ERoundBoard) => {
                if (round.IsBelongPlayer(this.Domain.ETRoot.AsPlayer().Playerid)) {
                    this.addMoneyRoundStart(tonumber(round.config.roundprize_gold), tonumber(round.config.roundprize_wood));
                }
            });
        EventHelper.addProtocolEvent(this, PlayerConfig.EProtocol.reqApplyPopuLevelUp, (e) => {
            e.state = true;
            let playerid = this.Domain.ETRoot.AsPlayer().Playerid;
            if (this.popuLevel >= this.popuLevelMax) {
                EventHelper.ErrorMessage("level max", playerid);
                return;
            }
            if (this.gold < this.popuLevelUpCostGold) {
                EventHelper.ErrorMessage("gold not enough", playerid);
                return;
            }
            if (this.wood < this.popuLevelUpCostWood) {
                EventHelper.ErrorMessage("wood not enough", playerid);
                return;
            }
            this.changeItem(GameEnum.Item.EItemIndex.Gold, -this.popuLevelUpCostGold);
            this.changeItem(GameEnum.Item.EItemIndex.Wood, -this.popuLevelUpCostWood);
            this.applyPopuLevelUp(1);
            this.updateNetTable();
        });
        EventHelper.addProtocolEvent(this, PlayerConfig.EProtocol.reqApplyTechLevelUp, (e) => {
            e.state = true;
            let playerid = this.Domain.ETRoot.AsPlayer().Playerid;
            if (this.techLevel >= this.techLevelMax) {
                EventHelper.ErrorMessage("tech level max", playerid);
                return;
            }
            if (this.gold < this.techLevelUpCostGold) {
                EventHelper.ErrorMessage("gold not enough", playerid);
                return;
            }
            this.changeItem(GameEnum.Item.EItemIndex.Gold, -this.techLevelUpCostGold);
            this.applyTechLevelUp(1);
            this.updateNetTable();
        });
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
}
