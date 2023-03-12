
import { Assert_ProjectileEffect, IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { Assert_SpawnEffect, ISpawnEffectInfo } from "../../../assert/Assert_SpawnEffect";
import { BaseEntityRoot } from "../../Entity/BaseEntityRoot";
import { ERoundBoard } from "../Round/ERoundBoard";
import { FHeroCombinationManagerComponent } from "./FHeroCombinationManagerComponent";

export class FakerHeroEntityRoot extends BaseEntityRoot {
    ProjectileInfo: IProjectileEffectInfo = Assert_ProjectileEffect.p000;
    SpawnEffect: ISpawnEffectInfo = Assert_SpawnEffect.Effect.Spawn_fall;

    onAwake(playerid: PlayerID, conf: string) {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        (this.BelongPlayerid as any) = playerid;
        (this.ConfigID as any) = conf;
        (this.EntityId as any) = npc.GetEntityIndex();
        this.AddComponent(GGetRegClass<typeof FHeroCombinationManagerComponent>("FHeroCombinationManagerComponent"));
        this.SyncClient(true);

    }
    public RefreshFakerHero() {

    }

    OnRoundStartBegin(round: ERoundBoard) {
        let player = this.GetPlayer();
        player.EnemyManagerComp().removeAllEnemy();
        this.FHeroCombinationManager().getAllActiveCombination().forEach(comb => {
            comb.removeAllCombination();
        })
        this.RefreshFakerHero();
        round.CreateAllRoundBasicEnemy(this.SpawnEffect);
    }
    OnRoundStartBattle() {
        let player = this.GetPlayer();
        player.EnemyManagerComp().getAllBattleUnitAlive().forEach(b => {
            b.RoundStateComp().OnBoardRound_Battle();
        })
        this.FHeroCombinationManager().getAllActiveCombination().forEach(comb => {
            comb.OnRoundStartBattle();
        })
    }
    OnRoundStartPrize(round: ERoundBoard) {
        this.FHeroCombinationManager().getAllActiveCombination().forEach(comb => {
            if (comb) {
                comb.OnRoundStartPrize(round);
            }
        })
        let player = this.GetPlayer();
        if (!round.isWin) {
            let damage = 0;
            let delay_time = 0.5;
            let aliveEnemy = player.EnemyManagerComp().getAllAliveEnemy();
            aliveEnemy.forEach((b) => {
                b.RoundStateComp().OnBoardRound_Prize_Enemy(round);
                damage += Number(b.GetRoundBasicUnitConfig().failureCount || "0");
                delay_time = math.min(delay_time, b.GetDistance2Player() / 1000);
            });
            GTimerHelper.AddTimer(delay_time, GHandler.create(this, () => {
                player.EnemyManagerComp().ApplyDamageHero(damage, this.ProjectileInfo);
            }));
        }
    }

    OnRoundWaitingEnd(round: ERoundBoard) {
        let player = this.GetPlayer();
        player.EnemyManagerComp().getAllAliveEnemy()
            .forEach((b) => {
                b.RoundStateComp().OnBoardRound_WaitingEnd();
            });
    }
    FHeroCombinationManager() {
        return this.GetComponentByName<FHeroCombinationManagerComponent>("FHeroCombinationManagerComponent");
    }
}
declare global {
    type IFakerHeroEntityRoot = FakerHeroEntityRoot;
}