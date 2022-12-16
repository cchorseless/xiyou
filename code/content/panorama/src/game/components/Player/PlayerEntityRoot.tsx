import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../../service/account/TCharacter";
import { BuildingManagerComponent } from "../Building/BuildingManagerComponent";
import { ChessControlComponent } from "../ChessControl/ChessControlComponent";
import { CombinationManagerComponent } from "../Combination/CombinationManagerComponent";
import { CourierBagComponent } from "../Courier/CourierBagComponent";
import { CourierDataComponent } from "../Courier/CourierDataComponent";
import { CourierShopComponent } from "../Courier/CourierShopComponent";
import { DrawComponent } from "../Draw/DrawComponent";
import { PublicShopComponent } from "../Public/PublicShopComponent";
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
            (PlayerScene.Local as any) = this;
            this.AddComponent(PrecacheHelper.GetRegClass<typeof PlayerHeroComponent>("PlayerHeroComponent"));
            this.AddComponent(PrecacheHelper.GetRegClass<typeof ChessControlComponent>("ChessControlComponent"));
            // 添加移动组件
            //  PlayerScene.Scene.AddComponent(ControlComponent);
            //  PlayerScene.Scene.AddComponent(CameraComponent);
        }
    }

    IsEntitySelected(iEntIndex: EntityIndex) {
        let aSelectedEntities = Players.GetSelectedEntities(this.Playerid);
        for (let index = aSelectedEntities.length - 1; index >= 0; index--) {
            let _iEntIndex = aSelectedEntities[index];
            if (iEntIndex == _iEntIndex) {
                return true;
            }
        }
        return false;
    };

    GetHeroEntityIndex() {
        return Players.GetPlayerHeroEntityIndex(this.Playerid);
    }

    SelectHero(isCameraCenter: boolean = false) {
        let iEntIndex = Players.GetPlayerHeroEntityIndex(this.Playerid);
        if (Entities.IsValidEntity(iEntIndex) && Entities.GetPlayerOwnerID(iEntIndex) == Players.GetLocalPlayer()) {
            if (this.IsEntitySelected(iEntIndex)) {
                if (isCameraCenter) GameUI.MoveCameraToEntity(iEntIndex);
            } else {
                GameUI.SelectUnit(iEntIndex, false);
            }
        }
    }

    Init() {
        this.PlayerHeroComp.LoadNetTableData();
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
    get PublicShopComp() {
        return this.GetComponentByName<PublicShopComponent>("PublicShopComponent")!;
    }
    get ChessControlComp() {
        return this.GetComponentByName<ChessControlComponent>("ChessControlComponent")!;
    }
    get CombinationManager() {
        return this.GetComponentByName<CombinationManagerComponent>("CombinationManagerComponent")!;
    }
    get BuildingManager() {
        return this.GetComponentByName<BuildingManagerComponent>("BuildingManagerComponent")!;
    }
    get RoundManagerComp() {
        return this.GetComponentByName<RoundManagerComponent>("RoundManagerComponent")!;
    }
    get CourierDataComp() {
        return this.GetComponentByName<CourierDataComponent>("CourierDataComponent")!;
    }
    get CourierBagComp() {
        return this.GetComponentByName<CourierBagComponent>("CourierBagComponent")!;
    }
    get CourierShopComp() {
        return this.GetComponentByName<CourierShopComponent>("CourierShopComponent")!;
    }
    get TCharacter() {
        return this.GetComponentByName<TCharacter>("TCharacter")!;
    }
}
