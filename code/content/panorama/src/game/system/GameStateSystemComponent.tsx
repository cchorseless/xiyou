import { GameStateConfig } from "../../../../../game/scripts/tscripts/shared/GameStateConfig";
import { ET, registerET } from "../../libs/Entity";
import { PlayerScene } from "../components/Player/PlayerScene";

@registerET()
export class GameStateSystemComponent extends ET.Component {
    onSerializeToEntity(): void {
        PlayerScene.Scene.AddOneComponent(this);
    }

    IsAllPlayerBindHero: boolean = false;
    BindHeroPlayer: number[] = [];
    DifficultyChapter: GameStateConfig.EDifficultyChapter = GameStateConfig.EDifficultyChapter.n1;
    DifficultyLevel: number = 0;

    SelectDifficultyChapter(difficulty: number) {

    }

    SelectDifficultyLevel(difficulty: number) {

    }
}