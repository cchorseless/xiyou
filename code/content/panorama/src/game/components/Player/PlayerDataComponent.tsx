import { PlayerData } from "../../../../../scripts/tscripts/shared/rules/Player/PlayerData";

@GReloadable
export class PlayerDataComponent extends PlayerData {
    onSerializeToEntity() {
        GGameScene.GetPlayer(this.BelongPlayerid)?.AddOneComponent(this);
    }
    onReload(): void {
    }
}
