
import { KVHelper } from "../../helper/KVHelper";
import { ET } from "../../shared/lib/Entity";

@GReloadable
export class EnemySystemComponent extends ET.SingletonComponent {

    public readonly SpawnEnemyPoint: Vector[] = [];
    private readonly EnemyWayPoint: { [k: string]: Vector } = {};

    public init() {
        // this.SpawnEnemyPoint.push(this.getEnemyWayPos("player_0_start"));
        // this.SpawnEnemyPoint.push(this.getEnemyWayPos("player_1_start"));
        // this.SpawnEnemyPoint.push(this.getEnemyWayPos("player_2_start"));
        // this.SpawnEnemyPoint.push(this.getEnemyWayPos("player_3_start"));
    }

    public getEnemyWayPos(pointName: string) {
        if (this.EnemyWayPoint[pointName] == null) {
            this.EnemyWayPoint[pointName] = Entities.FindByName(null, pointName).GetAbsOrigin()
        }
        return this.EnemyWayPoint[pointName];
    }

    /**初始化 */
    public onAwake() {
    }
    public GetEnemyCounts() {
        let index = 0;
        GPlayerEntityRoot.GetAllInstance()
            .forEach((player) => {
                index += player.EnemyManagerComp().tAllEnemy.length;
            });
        return index;
    }
    public GetMaxEnemy() {
        let index = 0;
        let allplayer = GPlayerEntityRoot.GetAllInstance();
        let playerCount = allplayer.length;
        allplayer.forEach((player) => {
            index += player.EnemyManagerComp().iMaxEnemyBonus + player.EnemyManagerComp().iMaxEnemyBonusEach * playerCount;
        });
        return index;
    }

    public CheckEnemyIsFull() {
        if (GameRules.State_Get() < DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS) {
            return;
        }
        let iCurrentEnemy = this.GetEnemyCounts();
        let iMaxEnemy = this.GetMaxEnemy();
        this.SetWarnState(iCurrentEnemy >= iMaxEnemy);
        // CustomNetTables.SetTableValue("common", "spawner", {
        //     iCurrentEnemy = iCurrentEnemy,
        //     iMaxEnemy = iMaxEnemy,
        //     bIsWarning = this.bIsWarning,
        //     fWarningDefeatTime = this.fWarningDefeatTime,
        // })

        // CustomNetTables.SetTableValue("common", "player_kill", this.tPlayerKills)
        // CustomNetTables.SetTableValue("common", "player_missing", this.tPlayerMissing)
    }

    private warnTimer: ITimerTask;
    public SetWarnState(b: boolean) {
        if (b) {
            if (this.warnTimer == null) {
                let fWarningDefeatTime = GameRules.GetGameTime() + tonumber(KVHelper.KvServerConfig.building_config.WARNING_TIME.configValue);
                this.warnTimer = GTimerHelper.AddTimer(1, GHandler.create(this, () => {
                    if (GameRules.GetGameTime() > fWarningDefeatTime) {
                        if (GRoundSystem.GetInstance().IsEndlessRound()) {
                            GGameScene.Victory();
                        } else {
                            GGameScene.Defeat();
                        }
                        return;
                    }
                }));
            }
        } else {
            if (this.warnTimer != null) {
                this.warnTimer.Clear()
                this.warnTimer = null;
            }
        }
    }
}
declare global {
    /**
     * @ServerOnly
     */
    var GEnemySystem: typeof EnemySystemComponent;
}
if (_G.GEnemySystem == undefined) {
    _G.GEnemySystem = EnemySystemComponent;
}