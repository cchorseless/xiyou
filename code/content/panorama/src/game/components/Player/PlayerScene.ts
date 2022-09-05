import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { ET } from "../../../libs/Entity";
import { TCharacter } from "../../service/account/TCharacter";
import { BuildingManagerComponent } from "../Building/BuildingManagerComponent";
import { ChessControlComponent } from "../ChessControlComponent";
import { DrawComponent } from "../DrawComponent";
import { RoundManagerComponent } from "../Round/RoundManagerComponent";
import { PlayerHeroComponent } from "./PlayerHeroComponent";
import { PlayerDataComponent } from "./PlayerDataComponent";
import { PlayerEntityRootComponent } from "./PlayerEntityRootComponent";

export class PlayerScene {
    /**组件 */
    static get Scene() {
        return ET.SceneRoot.GetInstance();
    }
    static get DrawComp() {
        return this.Scene.GetComponentByName<DrawComponent>("DrawComponent")!;
    }

    static get PlayerComp() {
        return this.Scene.GetComponentByName<PlayerHeroComponent>("PlayerHeroComponent")!;
    }
    static get PlayerDataComp() {
        return this.Scene.GetComponentByName<PlayerDataComponent>("PlayerDataComponent")!;
    }
    static get PlayerEntityRootComp() {
        return this.Scene.GetComponentByName<PlayerEntityRootComponent>("PlayerEntityRootComponent")!;
    }

    static get ChessControlComp() {
        return this.Scene.GetComponentByName<ChessControlComponent>("ChessControlComponent")!;
    }

    static get RoundManagerComp() {
        return this.Scene.GetComponentByName<RoundManagerComponent>("RoundManagerComponent")!;
    }
    static get TCharacter() {
        return this.Scene.GetComponentByName<TCharacter>("TCharacter")!;
    }


    static Init() {
        // this.Scene.AddComponent(PrecacheHelper.GetRegClass<typeof DrawComponent>("DrawComponent"));
        this.Scene.AddComponent(PrecacheHelper.GetRegClass<typeof ChessControlComponent>("ChessControlComponent"));
        this.Scene.AddComponent(PrecacheHelper.GetRegClass<typeof PlayerEntityRootComponent>("PlayerEntityRootComponent"));
        this.Scene.AddComponent(PrecacheHelper.GetRegClass<typeof PlayerHeroComponent>("PlayerHeroComponent"));
        // 添加移动组件
        //  PlayerScene.Scene.AddComponent(ControlComponent);
        //  PlayerScene.Scene.AddComponent(CameraComponent);
    }
}
