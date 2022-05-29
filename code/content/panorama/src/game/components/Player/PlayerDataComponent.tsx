import { ET, registerET } from "../../../libs/Entity";
import { TopBarPanel } from "../../../view/TopBarPanel/TopBarPanel";
import { PlayerScene } from "./PlayerScene";

@registerET()
export class PlayerDataComponent extends ET.Component {
    onSerializeToEntity() {
        PlayerScene.Scene.AddOneComponent(this);
    }
    private _populationRoof: number = 0;
    private _population: number = 0;
    private _gold: number = 0;
    private _food: number = 0;
    private _wood: number = 0;

    private _difficulty: string;
    get difficulty() {
        return this._difficulty;
    }
    set difficulty(v: string) {
        this._difficulty = v;
        TopBarPanel.GetInstance()?.setdifficulty();
    }
    
    get populationRoof() {
        return this._populationRoof;
    }
    set populationRoof(v: number) {
        this._populationRoof = v;
        TopBarPanel.GetInstance()?.setPopulation();
    }
    get population() {
        return this._population;
    }
    set population(v: number) {
        this._population = v;
        TopBarPanel.GetInstance()?.setPopulation();
    }
    get gold() {
        return this._gold;
    }
    set gold(v: number) {
        this._gold = v;
        TopBarPanel.GetInstance()?.setGold();
    }
    get food() {
        return this._food;
    }
    set food(v: number) {
        this._food = v;
        TopBarPanel.GetInstance()?.setFood();
    }
    get wood() {
        return this._wood;
    }
    set wood(v: number) {
        this._wood = v;
        TopBarPanel.GetInstance()?.setWood();
    }
}
