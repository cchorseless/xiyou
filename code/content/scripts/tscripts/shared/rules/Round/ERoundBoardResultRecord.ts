import { ET, serializeETProps } from "../../lib/Entity";

@GReloadable
export class ERoundBoardResultRecord extends ET.Entity {
    @serializeETProps()
    configID: string;
    @serializeETProps()
    isWin: -1 | 0 | 1 = 0;
    @serializeETProps()
    iBattleScoreChange: number = 0; // 回合总伤害
    @serializeETProps()
    accountid: string;
    @serializeETProps()
    enemyBattleScore = 0;
    @serializeETProps()
    enemyid: string;
    @serializeETProps()
    heroExps: { [unitname: string]: number };

    @serializeETProps()
    prizeItems: { [itemconfigid: string]: number };

    GetConfig() {
        return GJSONConfig.RoundBoardConfig.get("" + this.configID)!;
    }
}