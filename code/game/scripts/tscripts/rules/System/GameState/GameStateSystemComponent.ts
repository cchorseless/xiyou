import { reloadable } from "../../../GameCache";
import { LogHelper } from "../../../helper/LogHelper";
import { GameStateConfig } from "../../../shared/GameStateConfig";
import { ET, serializeETProps } from "../../Entity/Entity";

@reloadable
export class GameStateSystemComponent extends ET.Component {

    @serializeETProps()
    IsAllPlayerBindHero: boolean = false;
    @serializeETProps()
    BindHeroPlayer: number[] = [];

    /**章节难度*/
    @serializeETProps()
    DifficultyChapter: GameStateConfig.EDifficultyChapter = GameStateConfig.EDifficultyChapter.n1;
    /**难度关卡 */
    @serializeETProps()
    DifficultyLevel: number = 0;

    getDifficultyDes() {
        if (this.DifficultyLevel > 0) {
            return this.DifficultyChapter + "[" + this.DifficultyLevel + "]";
        }
        return this.DifficultyChapter;
    }



    private getDifficultyConfig(arr: { [k: string]: number }) {
        if (this.DifficultyLevel == 0) {
            return 0;
        }
        let kArr: number[] = [];
        Object.keys(arr).forEach((k) => {
            kArr.push(tonumber(k));
        });
        kArr.sort();
        while (kArr.length > 0) {
            let k = kArr.shift();
            if (this.DifficultyLevel >= k) {
                return arr[("" + k) as "1"];
            }
        }
        return 0;
    }

    getEnemyHPMult() {
        return this.getDifficultyConfig(GameStateConfig.ENDLESS_ENEMEY_fHPMult);
    }
    getEnemyArmorPhyMult() {
        return this.getDifficultyConfig(GameStateConfig.ENDLESS_ENEMEY_fArmorPhyMult);
    }
    getEnemyArmorMagMult() {
        return this.getDifficultyConfig(GameStateConfig.ENDLESS_ENEMEY_fArmorMagMult);
    }
    getEnemyHPAdd() {
        return this.getDifficultyConfig(GameStateConfig.ENDLESS_ENEMEY_fHPAdd);
    }
    getEnemyArmorPhyAdd() {
        return this.getDifficultyConfig(GameStateConfig.ENDLESS_ENEMEY_fArmorPhyAdd);
    }
    getEnemyArmorMagAdd() {
        return this.getDifficultyConfig(GameStateConfig.ENDLESS_ENEMEY_fArmorMagAdd);
    }

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