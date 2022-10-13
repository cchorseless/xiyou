import { Assert_ProjectileEffect, IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { Assert_SpawnEffect, ISpawnEffectInfo } from "../../../assert/Assert_SpawnEffect";
import { EventHelper } from "../../../helper/EventHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { ET, registerET } from "../../Entity/Entity";
import { RoundConfig } from "../../System/Round/RoundConfig";
import { ERoundBoard } from "../Round/ERoundBoard";
import { FakerHeroEntityRoot } from "./FakerHeroEntityRoot";

@registerET()
export class FakerHeroDataComponent extends ET.Component {
    onAwake(...args: any[]): void {
        this.addEvent();
    }
    public RefreshFakerHero(round: ERoundBoard) {

    }

    ProjectileInfo: IProjectileEffectInfo = Assert_ProjectileEffect.p000;
    SpawnEffect: ISpawnEffectInfo = Assert_SpawnEffect.Effect.Spawn_fall;
    public addEvent() {
        let player = this.Domain.ETRoot.AsPlayer();
        EventHelper.addServerEvent(this, RoundConfig.Event.roundboard_onstart,
            player.Playerid,
            (round: ERoundBoard) => {
                player.EnemyManagerComp().removeAllEnemy();
                this.Domain.ETRoot.As<FakerHeroEntityRoot>().FHeroCombinationManager().activeECombination(false);
                this.RefreshFakerHero(round);
                round.CreateAllRoundBasicEnemy(this.SpawnEffect);
            });
        EventHelper.addServerEvent(this, RoundConfig.Event.roundboard_onbattle,
            player.Playerid,
            (round: ERoundBoard) => {
                this.Domain.ETRoot.As<FakerHeroEntityRoot>().FHeroCombinationManager().activeECombination(true);
                player.EnemyManagerComp().getAllEnemy()
                    .forEach((b) => {
                        b.RoundStateComp().OnBoardRound_Battle();
                    });
            });
        EventHelper.addServerEvent(this, RoundConfig.Event.roundboard_onprize,
            player.Playerid,
            (iswin: boolean) => {
                if (!iswin) {
                    let damage = 0;
                    let delay_time = 0.5;
                    let aliveEnemy = player.EnemyManagerComp().getAllAliveEnemy();
                    aliveEnemy.forEach((b) => {
                        b.RoundStateComp().OnBoardRound_Prize_Enemy(this.ProjectileInfo);
                        damage += Number(b.GetRoundBasicUnitConfig().failure_count || "0");
                        delay_time = math.min(delay_time, b.GetDistance2Player() / 1000);
                    });
                    TimerHelper.addTimer(
                        delay_time,
                        () => {
                            player.EnemyManagerComp().ApplyDamageHero(damage, this.ProjectileInfo);
                        },
                        this,
                        true
                    );
                }
            });
        EventHelper.addServerEvent(this, RoundConfig.Event.roundboard_onwaitingend,
            player.Playerid,
            (round: ERoundBoard) => {
                player.EnemyManagerComp().getAllAliveEnemy()
                    .forEach((b) => {
                        b.RoundStateComp().OnBoardRound_WaitingEnd();
                    });
            });
    }

}
