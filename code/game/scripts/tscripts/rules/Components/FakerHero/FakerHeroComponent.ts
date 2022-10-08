import { Assert_ProjectileEffect, IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { Assert_SpawnEffect, ISpawnEffectInfo } from "../../../assert/Assert_SpawnEffect";
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { unit_base_baoxiang } from "../../../npc/units/common/unit_base_baoxiang";
import { ET, registerET } from "../../Entity/Entity";
import { ChessControlConfig } from "../../System/ChessControl/ChessControlConfig";
import { RoundConfig } from "../../System/Round/RoundConfig";
import { ERoundBoard } from "../Round/ERoundBoard";
import { FakerHeroEntityRoot } from "./FakerHeroEntityRoot";

@registerET()
export class FakerHeroComponent extends ET.Component {
    onAwake(...args: any[]): void {
        this.CreateFakerHero();
        this.addEvent();
    }
    readonly FakerHero: BaseNpc_Plus;
    public CreateFakerHero() {
        if (this.FakerHero == null) {
            let player = this.Domain.ETRoot.AsPlayer();
            let spawn = GameRules.Addon.ETRoot.MapSystem().getFakerHeroSpawnPoint(player.Playerid);
            (this as any).FakerHero = unit_base_baoxiang.CreateOne(spawn, DOTATeam_t.DOTA_TEAM_BADGUYS, true);
            FakerHeroEntityRoot.Active(this.FakerHero, player.Playerid, "unit_base_baoxiang");
        }
    }

    public RefreshFakerHero(round: ERoundBoard) {
        if (this.FakerHero == null) {
            this.CreateFakerHero();
        }
    }

    ProjectileInfo: IProjectileEffectInfo = Assert_ProjectileEffect.p000;
    SpawnEffect: ISpawnEffectInfo = Assert_SpawnEffect.Effect.Spawn_fall;
    public addEvent() {
        let player = this.Domain.ETRoot.AsPlayer();
        EventHelper.addServerEvent(this, RoundConfig.Event.roundboard_onstart,
            player.Playerid,
            (round: ERoundBoard) => {
                player.EnemyManagerComp().removeAllEnemy();
                this.FakerHero.ETRoot.As<FakerHeroEntityRoot>().FHeroCombinationManager().activeECombination(false);
                this.RefreshFakerHero(round);
                round.CreateAllRoundBasicEnemy(this.SpawnEffect);
            });
        EventHelper.addServerEvent(this, RoundConfig.Event.roundboard_onbattle,
            player.Playerid,
            (round: ERoundBoard) => {
                this.FakerHero.ETRoot.As<FakerHeroEntityRoot>().FHeroCombinationManager().activeECombination(true);
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
