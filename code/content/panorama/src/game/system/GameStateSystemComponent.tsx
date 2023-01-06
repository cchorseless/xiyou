import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { GameServiceConfig } from "../../../../scripts/tscripts/shared/GameServiceConfig";
import { GameServiceSystem } from "../../../../scripts/tscripts/shared/rules/System/GameServiceSystem";
import { NetHelper } from "../../helper/NetHelper";

@GReloadable
export class GameServiceSystemComponent extends GameServiceSystem {


    SelectDifficultyChapter(difficulty: GameServiceConfig.EDifficultyChapter) {
        NetHelper.SendToLua(GameProtocol.Protocol.SelectDifficultyChapter, difficulty);
    }

    SelectDifficultyEndlessLevel(level: number) {
        NetHelper.SendToLua(GameProtocol.Protocol.SelectDifficultyEndlessLevel, level);
    }

    SelectCourier(name: string) {
        NetHelper.SendToLua(GameProtocol.Protocol.SelectCourier, name);
    }

    SelectReady(isready: string) {
        NetHelper.SendToLua(GameProtocol.Protocol.SelectReady, isready);
    }

}