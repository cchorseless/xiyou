import { ET, serializeETProps } from "../../lib/Entity";


export class PlayerData extends ET.Component {
    @serializeETProps()
    populationRoof: number = 0;
    @serializeETProps()
    population: number = 0;
    @serializeETProps()
    gold: number = 0;
    @serializeETProps()
    soulcrystal: number = 0;
    @serializeETProps()
    wood: number = 0;

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
    techLevelMax: number = 20;
    @serializeETProps()
    perIntervalGold: number = 0;
    @serializeETProps()
    perIntervalWood: number = 0;
    @serializeETProps()
    perIntervalSoulCrystal: number = 0;
}