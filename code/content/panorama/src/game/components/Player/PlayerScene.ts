import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { ET } from "../../../libs/Entity";
import { TCharacter } from "../../service/account/TCharacter";
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
    // static get PlayerETEntityComp() {
    //     return this.Scene.GetComponentByName<typeof PlayerETEntityComponent>("PlayerETEntityComponent")!;
    // }
    
    static get ChessControlComp() {
        return this.Scene.GetComponentByName<typeof ChessControlComponent>("ChessControlComponent")!;
    }

    static get RoundManagerComp() {
        return this.Scene.GetComponentByName<typeof RoundManagerComponent>("RoundManagerComponent")!;
    }
    static get TCharacter() {
        return this.Scene.GetComponentByName<typeof TCharacter>("TCharacter")!;
    }
    

    static Init() {
        // this.Scene.AddComponent(PrecacheHelper.GetRegClass<typeof DrawComponent>("DrawComponent"));
        this.Scene.AddComponent(PrecacheHelper.GetRegClass<typeof PlayerComponent>("PlayerComponent"));
        this.Scene.AddComponent(PrecacheHelper.GetRegClass<typeof ChessControlComponent>("ChessControlComponent"));
        // this.Scene.AddComponent(PrecacheHelper.GetRegClass<typeof PlayerETEntityComponent>("PlayerETEntityComponent"));
        // 添加移动组件
        //  PlayerScene.Scene.AddComponent(ControlComponent);
        //  PlayerScene.Scene.AddComponent(CameraComponent);
    }
}
