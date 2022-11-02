import { reloadable } from "../../../GameCache";
import { LogHelper } from "../../../helper/LogHelper";
import { ET, serializeETProps } from "../../Entity/Entity";

@reloadable
export class GameStateSystemComponent extends ET.Component {

    @serializeETProps()
    IsAllPlayerBindHero: boolean = false;
    @serializeETProps()
    BindHeroPlayer: number[] = [];

    OnBindHeroFinish(playerID: PlayerID) {
        this.BindHeroPlayer.push(playerID);
        this.IsAllPlayerBindHero = GameRules.Addon.ETRoot.PlayerSystem().IsAllBindHeroFinish();
        GameRules.Addon.ETRoot.SyncClientEntity(this);
        LogHelper.print("OnBindHeroFinish", this.IsAllPlayerBindHero)
        if (this.IsAllPlayerBindHero) {
            GameRules.Addon.ETRoot.StartGame();
        }
    }

}