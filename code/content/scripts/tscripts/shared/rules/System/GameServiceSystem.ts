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

    @serializeETProps()
    tPlayerCourierList: { [playerid: string]: string[] } = {}


    getDifficultyChapterDes() {
        return GameServiceConfig.EDifficultyChapter[this.DifficultyLevel] as string;
    }

    getDifficultyNumberDes() {
        if (this.DifficultyChapter == GameServiceConfig.EDifficultyChapter.endless) {
            return this.DifficultyChapter + this.DifficultyLevel;
        }
        return this.DifficultyChapter;
    }
    getPlayerGameSelection(playerid: PlayerID) {
        return this.tPlayerGameSelection[playerid + ""];
    }

    initPlayerGameSelection(playerid: PlayerID) {
        this.tPlayerGameSelection[playerid + ""] = this.tPlayerGameSelection[playerid + ""] || {
            Difficulty: {
                Chapter: 1,
                Level: 0,
                MaxChapter: 1,
                MaxLevel: 0
            },
            Courier: GameServiceConfig.DefaultCourier,
            Title: "",
            EndlessRank: 0,
            IsReady: false,
            bNewPlayer: false,
        };

        let bagcomp = GBagComponent.GetOneInstance(playerid);
        if (bagcomp) {
            this.tPlayerCourierList[playerid + ""] = bagcomp.getAllCourierNames();
        }
        else {
            this.tPlayerCourierList[playerid + ""] = [GameServiceConfig.DefaultCourier];
        }
    }
}

