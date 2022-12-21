import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { ET } from "../../../libs/Entity";
import { EntityRootManagerComponent } from "./EntityRootManagerComponent";
import { NetHelper } from "../../../helper/NetHelper";
import { GameEnum } from "../../../../../../game/scripts/tscripts/shared/GameEnum";
import { TServerZone } from "../../service/serverzone/TServerZone";
import { PlayerEntityRoot } from "./PlayerEntityRoot";
import { LogHelper } from "../../../helper/LogHelper";
import { PublicBagSystemComponent } from "../../system/PublicBagSystemComponent";
import { GameStateSystemComponent } from "../../system/GameStateSystemComponent";

export class PlayerScene {
    /**组件 */
    static get Scene() {
        return ET.SceneRoot.GetInstance();
    }
    static readonly Local: PlayerEntityRoot;

    static GetPlayer(playerid: PlayerID | number) {
        if (playerid < 0) { playerid = Players.GetLocalPlayer() }
        return this.EntityRootManage?.getPlayer(playerid as PlayerID);
    }



    static get EntityRootManage() {
        return this.Scene.GetComponentByName<EntityRootManagerComponent>("EntityRootManagerComponent")!;
    }

    static get PublicBagSystemComp() {
        return this.Scene.GetComponentByName<PublicBagSystemComponent>("PublicBagSystemComponent")!;
    }

    static get GameStateSystem() {
        return this.Scene.GetComponentByName<GameStateSystemComponent>("GameStateSystemComponent")!;
    }
    static get TServerZone() {
        return this.Scene.GetComponentByName<TServerZone>("TServerZone")!;
    }



    static Init() {
        this.Scene.AddComponent(PrecacheHelper.GetRegClass<typeof EntityRootManagerComponent>("EntityRootManagerComponent"));
        this.EntityRootManage.loadAllPlayers();
    }
}
