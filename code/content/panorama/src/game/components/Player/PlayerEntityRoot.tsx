import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";
import { BuildingManagerComponent } from "../Building/BuildingManagerComponent";
import { ChessControlComponent } from "../ChessControl/ChessControlComponent";
import { CourierBagComponent } from "../Courier/CourierBagComponent";
import { CourierShopComponent } from "../Courier/CourierShopComponent";
import { DrawComponent } from "../Draw/DrawComponent";
import { PublicShopComponent } from "../Public/PublicShopComponent";
import { RoundManagerComponent } from "../Round/RoundManagerComponent";
import { PlayerDataComponent } from "./PlayerDataComponent";

@GReloadable
export class PlayerEntityRoot extends ET.Entity {
    /**
     * @abstract Construct
     */
    public SyncClientEntity(obj: ET.Entity, ignoreChild: boolean = false, isShare: boolean = false): void { }
    onAwake(playerid: PlayerID): void {
        (this.BelongPlayerid as any) = playerid;
        if (this.IsLocalPlayer) {
            (GGameScene.Local as any) = this;
            this.AddComponent(GGetRegClass<typeof ChessControlComponent>("ChessControlComponent"));
            // 添加移动组件
            //  PlayerScene.Scene.AddComponent(ControlComponent);
            //  PlayerScene.Scene.AddComponent(CameraComponent);
        }
    }

    IsEntitySelected(iEntIndex: EntityIndex) {
        let aSelectedEntities = Players.GetSelectedEntities(this.BelongPlayerid);
        for (let index = aSelectedEntities.length - 1; index >= 0; index--) {
            let _iEntIndex = aSelectedEntities[index];
            if (iEntIndex == _iEntIndex) {
                return true;
            }
        }
        return false;
    };

    GetHeroEntityIndex() {
        return Players.GetPlayerHeroEntityIndex(this.BelongPlayerid);
    }

    SelectHero(isCameraCenter: boolean = false) {
        let iEntIndex = Players.GetPlayerHeroEntityIndex(this.BelongPlayerid);
        if (Entities.IsValidEntity(iEntIndex) && Entities.GetPlayerOwnerID(iEntIndex) == Players.GetLocalPlayer()) {
            if (this.IsEntitySelected(iEntIndex)) {
                if (isCameraCenter) GameUI.MoveCameraToEntity(iEntIndex);
            } else {
                GameUI.SelectUnit(iEntIndex, false);
            }
        }
    }


    get IsLocalPlayer() {
        return Players.GetLocalPlayer() == this.BelongPlayerid
    }

    get DrawComp() {
        return DrawComponent.GetOneInstance(this.BelongPlayerid);
    }

    get PlayerDataComp() {
        return PlayerDataComponent.GetOneInstance(this.BelongPlayerid);
    }
    get PublicShopComp() {
        return PublicShopComponent.GetOneInstance(this.BelongPlayerid);
    }
    get ChessControlComp() {
        return this.GetComponentByName<ChessControlComponent>("ChessControlComponent")!;
    }

    get BuildingManager() {
        return BuildingManagerComponent.GetOneInstance(this.BelongPlayerid);
    }
    get RoundManagerComp() {
        return RoundManagerComponent.GetOneInstance(this.BelongPlayerid);
    }
    get CourierComp() {
        return GCourierEntityRoot.GetOneInstance(this.BelongPlayerid);
    }
    get CourierBagComp() {
        return CourierBagComponent.GetOneInstance(this.BelongPlayerid);
    }
    get CourierShopComp() {
        return CourierShopComponent.GetOneInstance(this.BelongPlayerid);
    }
    get TCharacter() {
        return this.GetComponentByName<ITCharacter>("TCharacter")!;
    }
}

declare global {
    type IPlayerEntityRoot = PlayerEntityRoot;
    var GPlayerEntityRoot: typeof PlayerEntityRoot;
}
if (_G.GPlayerEntityRoot == null) {
    _G.GPlayerEntityRoot = PlayerEntityRoot;
}