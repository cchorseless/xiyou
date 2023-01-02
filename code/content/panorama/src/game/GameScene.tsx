import { ET } from "../../../scripts/tscripts/shared/lib/Entity";
import { GameServiceSystemComponent } from "./system/GameStateSystemComponent";
import { PublicBagSystemComponent } from "./system/PublicBagSystemComponent";

export class GameScene {
    /**组件 */
    static get Scene() {
        return ET.GameSceneRoot.GetInstance();
    }
    static readonly Local: IPlayerEntityRoot;

    static GetPlayer(playerid: PlayerID | number) {
        if (playerid < 0) { playerid = Players.GetLocalPlayer() }
        return GPlayerEntityRoot.GetOneInstance(playerid as PlayerID)
    }

    static get PublicBagSystemComp() {
        return PublicBagSystemComponent.GetInstance()!;
    }

    static get GameServiceSystem() {
        return GameServiceSystemComponent.GetInstance()!;
    }
    static get TServerZone() {
        return this.Scene.GetComponentByName<ITServerZone>("TServerZone")!;
    }

    static Init() {
        let maxPlayers = Players.GetMaxPlayers();
        for (let i = 0; i < maxPlayers; i++) {
            let playerid = i as PlayerID;
            if (Players.IsValidPlayerID(playerid)) {
                GameScene.Scene.AddChild(GPlayerEntityRoot, playerid)
            }
        }
    }
}
declare global {
    /**
     * @ClientOnly
     */
    var GGameScene: typeof GameScene;
}
if (_G.GGameScene == undefined) {
    _G.GGameScene = GameScene;
}