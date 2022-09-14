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
import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { GameEnum } from "../../../libs/GameEnum";
import { TServerZone } from "../../service/serverzone/TServerZone";

export class PlayerScene {
    /**组件 */
    static get Scene() {
        return ET.SceneRoot.GetInstance();
    }
    static get DrawComp() {
        return this.Scene.GetComponentByName<DrawComponent>("DrawComponent")!;
    }
    static get PlayerHeroComp() {
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
    static get TServerZone() {
        return this.Scene.GetComponentByName<TServerZone>("TServerZone")!;
    }


    static LoginServer() {
        LogHelper.print("---------------LoginServer---------------");
        NetHelper.SendToLua(GameEnum.CustomProtocol.req_LoginGame, null, (e) => {
            LogHelper.print(e);
        });
    }

    static Init() {
        this.Scene.AddComponent(PrecacheHelper.GetRegClass<typeof PlayerEntityRootComponent>("PlayerEntityRootComponent"));
        this.Scene.AddComponent(PrecacheHelper.GetRegClass<typeof PlayerHeroComponent>("PlayerHeroComponent"));
        this.Scene.AddComponent(PrecacheHelper.GetRegClass<typeof ChessControlComponent>("ChessControlComponent"));
        // 添加移动组件
        //  PlayerScene.Scene.AddComponent(ControlComponent);
        //  PlayerScene.Scene.AddComponent(CameraComponent);
    }
}
