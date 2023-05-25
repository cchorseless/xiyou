import { ET, ETGameSceneRoot } from "../../../scripts/tscripts/shared/lib/Entity";
import { GameServiceSystemComponent } from "./system/GameServiceSystemComponent";
import { NotificationSystemComponent } from "./system/NotificationSystemComponent";
import { PublicBagSystemComponent } from "./system/PublicBagSystemComponent";

export class GameScene {
    /**当前是否是英雄选择阶段 */
    static readonly IsHeroSelect = false;
    /**
     * @abstract Construct
     */
    static SyncClientEntity(obj: ET.Entity, ignoreChild: boolean = false): void { }

    /**组件 */
    static get Scene() {
        return ETGameSceneRoot.GetInstance();
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

    static get NotificationSystem() {
        return NotificationSystemComponent.GetInstance()!;
    }

    static get TServerZone() {
        return this.Scene.GetComponentByName<ITServerZone>("TServerZone")!;
    }

    static Init(IsHeroSelect = false) {
        (GameScene.IsHeroSelect as any) = IsHeroSelect;
        this.Scene.AddComponent(NotificationSystemComponent);
        let maxPlayers = Players.GetMaxPlayers();
        for (let i = 0; i < maxPlayers; i++) {
            let playerid = i as PlayerID;
            if (Players.IsValidPlayerID(playerid)) {
                GameScene.Scene.AddChild(GPlayerEntityRoot, playerid)
            }
        }
        this.NotificationSystem.LoadNetTableData();
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