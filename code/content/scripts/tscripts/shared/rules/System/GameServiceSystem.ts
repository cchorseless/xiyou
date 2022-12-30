import { GameServiceConfig } from "../../GameServiceConfig";
import { ET, serializeETProps } from "../../lib/Entity";


export class GameServiceSystem extends ET.SingletonComponent {

    @serializeETProps()
    IsAllPlayerBindHero: boolean = false;
    @serializeETProps()
    BindHeroPlayer: number[] = [];

    /**章节难度*/
    @serializeETProps()
    DifficultyChapter: GameServiceConfig.EDifficultyChapter = GameServiceConfig.EDifficultyChapter.n1;
    /**难度关卡 */
    @serializeETProps()
    DifficultyLevel: number = 1;
    /**难度选择结束时间 */
    @serializeETProps()
    BeforeGameEndTime: number = 0;

    @serializeETProps()
    tPlayerGameSelection: { [playerid: string]: IPlayerGameSelection } = {}

    getDifficultyChapterDes() {
        return GameServiceConfig.EDifficultyChapter[this.DifficultyLevel] as string;
    }
}