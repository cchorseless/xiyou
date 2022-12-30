import { GameServiceConfig } from "../../../../scripts/tscripts/shared/GameServiceConfig";
import { GameServiceSystem } from "../../../../scripts/tscripts/shared/rules/System/GameServiceSystem";

@GReloadable
export class GameServiceSystemComponent extends GameServiceSystem {
    onSerializeToEntity(): void {
        GGameScene.Scene.AddOneComponent(this);
    }

    SelectDifficultyChapter(difficulty: GameServiceConfig.EDifficultyChapter) {

    }

    SelectDifficultyEndlessLevel(level: number) {

    }

    SelectCourier(name: string) {

    }
}