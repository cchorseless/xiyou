import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class CharacterBattleTeamComponent extends ET.Component {


    private _BattleTeams = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get BattleTeams() {
        return this._BattleTeams;
    }
    public set BattleTeams(data) {
        this._BattleTeams.copy(data);

    }

    private _SeasonBattleScore = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get SeasonBattleScore() {
        return this._SeasonBattleScore;
    }
    public set SeasonBattleScore(data) {
        this._SeasonBattleScore.copy(data);

    }
    /**天梯积分 */
    public BattleScore: number = 1000;

    onSerializeToEntity() {

        this.onReload();
    }
    onReload() {
        this.SyncClient();
    }
}