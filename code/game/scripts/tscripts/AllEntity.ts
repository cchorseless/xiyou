import { LogHelper } from "./helper/LogHelper";
import { BuildingManagerComponent } from "./rules/Components/Building/BuildingManagerComponent";
import { DrawComponent } from "./rules/Components/Draw/DrawComponent";
import { PlayerHttpComponent } from "./rules/Components/Player/PlayerHttpComponent";
import { RoundManagerComponent } from "./rules/Components/Round/RoundManagerComponent";

PlayerHttpComponent;
DrawComponent;
RoundManagerComponent;
BuildingManagerComponent

export class AllEntity {
    static init() {
        LogHelper.print("register all entity");
    }
}
