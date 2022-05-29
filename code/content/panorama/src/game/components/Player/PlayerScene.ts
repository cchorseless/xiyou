import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { ET } from "../../../libs/Entity";
import { ChessControlComponent } from "../ChessControlComponent";
import { DrawComponent } from "../DrawComponent";
import { RoundManagerComponent } from "../Round/RoundManagerComponent";
import { PlayerComponent } from "./PlayerComponent";
import { PlayerDataComponent } from "./PlayerDataComponent";

export class PlayerScene {
    /**组件 */
    static get Scene() {
        return ET.SceneRoot.GetInstance();
    }

    static get DrawComp() {
        return this.Scene.GetComponentByName<typeof DrawComponent>("DrawComponent")!;
    }

    static get PlayerComp() {
        return this.Scene.GetComponentByName<typeof PlayerComponent>("PlayerComponent")!;
    }
    static get PlayerDataComp() {
        return this.Scene.GetComponentByName<typeof PlayerDataComponent>("PlayerDataComponent")!;
    }
    static get ChessControlComp() {
        return this.Scene.GetComponentByName<typeof ChessControlComponent>("ChessControlComponent")!;
    }

    static get RoundManagerComp() {
        return this.Scene.GetComponentByName<typeof RoundManagerComponent>("RoundManagerComponent")!;
    }

    static Init() {
        this.Scene.AddComponent(PrecacheHelper.GetRegClass<typeof DrawComponent>("DrawComponent"));
        this.Scene.AddComponent(PrecacheHelper.GetRegClass<typeof PlayerComponent>("PlayerComponent"));
        this.Scene.AddComponent(PrecacheHelper.GetRegClass<typeof ChessControlComponent>("ChessControlComponent"));
        // 添加移动组件
        //  PlayerScene.Scene.AddComponent(ControlComponent);
        //  PlayerScene.Scene.AddComponent(CameraComponent);
    }
}
