import { ClassHelper } from "../../../helper/ClassHelper";
import { ET } from "../../Entity/Entity";
import { PlayerComponent } from "./PlayerComponent";
import { PlayerHttpComponent } from "./PlayerHttpComponent";

export class PlayerEntityRoot extends ET.EntityRoot {
    PlayerComp() {
        return this.GetComponent(ClassHelper.getRegClass<typeof PlayerComponent>("PlayerComponent"));
    }
    PlayerHttpComp() {
        return this.GetComponent(ClassHelper.getRegClass<typeof PlayerHttpComponent>("PlayerHttpComponent"));
    }
}
