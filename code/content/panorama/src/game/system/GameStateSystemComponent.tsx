import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { GameServiceConfig } from "../../../../scripts/tscripts/shared/GameServiceConfig";
import { GameServiceSystem } from "../../../../scripts/tscripts/shared/rules/System/GameServiceSystem";
import { NetHelper } from "../../helper/NetHelper";

@GReloadable
export class GameServiceSystemComponent extends GameServiceSystem {

    get LocalPlayerGameSelection() {
        return this.tPlayerGameSelection[Players.GetLocalPlayer()];
    }

    SelectDifficultyChapter(difficulty: GameServiceConfig.EDifficultyChapter) {
        if (this.LocalPlayerGameSelection.Difficulty.Chapter == difficulty) {
            return
        }
        NetHelper.SendToLua(GameProtocol.Protocol.SelectDifficultyChapter, difficulty);
    }

    SelectDifficultyEndlessLevel(level: number) {
        if (this.LocalPlayerGameSelection.Difficulty.Level == level) {
            return
        }
        NetHelper.SendToLua(GameProtocol.Protocol.SelectDifficultyEndlessLevel, level);
    }

    SelectCourier(name: string) {
        if (this.LocalPlayerGameSelection.Courier == name) {
            return
        }
        NetHelper.SendToLua(GameProtocol.Protocol.SelectCourier, name);
    }

    SelectReady() {
        if (this.LocalPlayerGameSelection.IsReady) {
            return
        }
        NetHelper.SendToLua(GameProtocol.Protocol.SelectReady, true);
    }

}