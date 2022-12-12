import { useState } from "react";
import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { ET, registerET } from "../../../libs/Entity";
import { PlayerScene } from "./PlayerScene";

@registerET()
export class PlayerDataComponent extends ET.Component {
    onSerializeToEntity() {
        PlayerScene.GetPlayer(this.BelongPlayerid)?.AddOneComponent(this);
    }
    onReload(): void {
    }
    startTime: string;
    difficulty: string;
    popuLevel: number = 0;
    popuLevelUpCostGold: number = 0;
    popuLevelUpCostWood: number = 0;
    techLevel: number = 0;
    techLevelUpCostGold: number = 0;
    popuLevelMax: number = 10;
    techLevelMax: number = 10;
    perIntervalGold: number = 0;
    perIntervalWood: number = 0;

    populationRoof: number = 0;
    population: number = 0;
    gold: number = 0;
    food: number = 0;
    wood: number = 0;

}
