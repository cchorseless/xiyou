import { ClassHelper } from "../helper/ClassHelper";
import { LogHelper } from "../helper/LogHelper";
import { DrawComponent } from "./Components/Draw/DrawComponent";
import { PlayerHttpComponent } from "./Components/Player/PlayerHttpComponent";
import { RoundManagerComponent } from "./Components/Round/RoundManagerComponent";

ClassHelper.regShortClassName([PlayerHttpComponent]);
ClassHelper.regShortClassName([DrawComponent]);
ClassHelper.regShortClassName([RoundManagerComponent]);

export class AllEntity {
    static init() {
        LogHelper.print("register all entity");
    }
}
