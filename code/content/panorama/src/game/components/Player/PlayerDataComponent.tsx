import { ET, registerET } from "../../../libs/Entity";
import { TopBarPanel } from "../../../view/TopBarPanel/TopBarPanel";
import { PlayerScene } from "./PlayerScene";

@registerET()
export class PlayerDataComponent extends ET.Component {
    onSerializeToEntity() {
        PlayerScene.Scene.AddOneComponent(this);
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

    public populationRoof: number = 0;
    public population: number = 0;
    public gold: number = 0;
    public food: number = 0;
    public wood: number = 0;
  
}
