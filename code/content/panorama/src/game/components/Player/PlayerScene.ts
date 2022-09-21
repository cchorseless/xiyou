import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { ET } from "../../../libs/Entity";
import { TCharacter } from "../../service/account/TCharacter";
import { ChessControlComponent } from "../ChessControlComponent";
import { DrawComponent } from "../DrawComponent";
import { RoundManagerComponent } from "../Round/RoundManagerComponent";
import { PlayerHeroComponent } from "./PlayerHeroComponent";
import { PlayerDataComponent } from "./PlayerDataComponent";
import { EntityRootManagerComponent } from "./EntityRootManagerComponent";
import { NetHelper } from "../../../helper/NetHelper";
import { GameEnum } from "../../../libs/GameEnum";
import { TServerZone } from "../../service/serverzone/TServerZone";
import { PlayerEntityRoot } from "./PlayerEntityRoot";
import { LogHelper } from "../../../helper/LogHelper";

export class PlayerScene {
    /**组件 */
    static get Scene() {
        return ET.SceneRoot.GetInstance();
    }
    static get Local(): PlayerEntityRoot {
        return this.EntityRootManage.getPlayer(Players.GetLocalPlayer())!
    }

    static get EntityRootManage() {
        return this.Scene.GetComponentByName<EntityRootManagerComponent>("EntityRootManagerComponent")!;
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
        this.Scene.AddComponent(PrecacheHelper.GetRegClass<typeof EntityRootManagerComponent>("EntityRootManagerComponent"));
    }
}
