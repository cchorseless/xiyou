import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../../service/account/TCharacter";
import { PlayerConfig } from "../../system/Player/PlayerConfig";
import { ChessControlComponent } from "../ChessControlComponent";
import { DrawComponent } from "../DrawComponent";
import { RoundManagerComponent } from "../Round/RoundManagerComponent";
import { PlayerDataComponent } from "./PlayerDataComponent";
import { PlayerHeroComponent } from "./PlayerHeroComponent";
import { PlayerScene } from "./PlayerScene";

@registerET()
export class PlayerEntityRoot extends ET.Entity {
    readonly Playerid: PlayerID;

    onAwake(playerid: PlayerID): void {
        (this.Playerid as any) = playerid;
        if (this.IsLocalPlayer) {
            this.AddComponent(PrecacheHelper.GetRegClass<typeof PlayerHeroComponent>("PlayerHeroComponent"));
            this.AddComponent(PrecacheHelper.GetRegClass<typeof ChessControlComponent>("ChessControlComponent"));
            // 添加移动组件
            //  PlayerScene.Scene.AddComponent(ControlComponent);
            //  PlayerScene.Scene.AddComponent(CameraComponent);
        }
    }
    get IsLocalPlayer() {
        return Players.GetLocalPlayer() == this.Playerid
    }

    get DrawComp() {
        return this.GetComponentByName<DrawComponent>("DrawComponent")!;
    }
    get PlayerHeroComp() {
        return this.GetComponentByName<PlayerHeroComponent>("PlayerHeroComponent")!;
    }
    get PlayerDataComp() {
        return this.GetComponentByName<PlayerDataComponent>("PlayerDataComponent")!;
    }

    get ChessControlComp() {
        return this.GetComponentByName<ChessControlComponent>("ChessControlComponent")!;
    }

    get RoundManagerComp() {
        return this.GetComponentByName<RoundManagerComponent>("RoundManagerComponent")!;
    }
    get TCharacter() {
        return this.GetComponentByName<TCharacter>("TCharacter")!;
    }
}
