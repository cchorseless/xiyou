import { TimerHelper } from "../../../helper/TimerHelper";
import { ET, registerET, serializeETProps } from "../../Entity/Entity";
import { DifficultyState } from "../../System/Difficulty/DifficultyState";

@registerET()
export class PlayerDataComponent extends ET.Component {
    @serializeETProps()
    startTime: string;
    @serializeETProps()
    populationRoof: number = 0;
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

    onAwake(...args: any[]): void {
        this.startTime = TimerHelper.now();
        this.difficulty = DifficultyState.getDifficultyDes();
    }
}
