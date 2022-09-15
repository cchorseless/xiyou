import { KVHelper } from "../../../helper/KVHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { EnemyManagerComponent } from "../../Components/Enemy/EnemyManagerComponent";
import { ET, registerET } from "../../Entity/Entity";
import { RoundState } from "../Round/RoundState";
import { EnemyState } from "./EnemyState";

@registerET()
export class EnemySystemComponent extends ET.Component {
    /**初始化 */
    public onAwake() {
        EnemyState.init();
    }
    public GetEnemyCounts() {
        let index = 0;
        GameRules.Addon.ETRoot.PlayerSystem()
            .GetAllPlayer()
            .forEach((player) => {
                index += player.EnemyManagerComp().tAllEnemy.length;
            });
        return index;
    }
    public GetMaxEnemy() {
        let index = 0;
        let allplayer = GameRules.Addon.ETRoot.PlayerSystem().GetAllPlayer();
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

    private warnTimer: string;
    public SetWarnState(b: boolean) {
        if (b) {
            if (this.warnTimer == null) {
                let fWarningDefeatTime = GameRules.GetGameTime() + tonumber(KVHelper.KvServerConfig.building_config.WARNING_TIME.configValue);
                this.warnTimer = TimerHelper.addTimer(
                    1,
                    () => {
                        if (GameRules.GetGameTime() > fWarningDefeatTime) {
                            if (RoundState.IsEndlessRound()) {
                                GameRules.Addon.Victory();
                            } else {
                                GameRules.Addon.Defeat();
                            }
                            return;
                        }
                    },
                    this,
                    true
                );
            }
        } else {
            if (this.warnTimer != null) {
                TimerHelper.removeTimer(this.warnTimer);
                this.warnTimer = null;
            }
        }
    }
}
