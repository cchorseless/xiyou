import { ClassHelper } from "../helper/ClassHelper";
import { LogHelper } from "../helper/LogHelper";
import { PlayerHttpComponent } from "./Components/Player/PlayerHttpComponent";

ClassHelper.regShortClassName([PlayerHttpComponent]);

export class AllEntity {
    static init() {
        LogHelper.print("register all entity");
    }
}
