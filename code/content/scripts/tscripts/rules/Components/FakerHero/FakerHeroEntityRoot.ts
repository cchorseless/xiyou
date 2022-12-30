
import { BaseEntityRoot } from "../../Entity/BaseEntityRoot";
import { ERoundBoard } from "../Round/ERoundBoard";
import { FakerHeroDataComponent } from "./FakerHeroDataComponent";
import { FHeroCombinationManagerComponent } from "./FHeroCombinationManagerComponent";

export class FakerHeroEntityRoot extends BaseEntityRoot {
    public readonly IsSerializeEntity: boolean = true;

    onAwake(playerid: PlayerID, conf: string) {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        (this.BelongPlayerid as any) = playerid;
        (this.ConfigID as any) = conf;
        (this.EntityId as any) = npc.GetEntityIndex();
        this.SyncClient(true);
        this.AddComponent(GGetRegClass<typeof FakerHeroDataComponent>("FakerHeroDataComponent"));
        this.AddComponent(GGetRegClass<typeof FHeroCombinationManagerComponent>("FHeroCombinationManagerComponent"));
    }
    OnRoundStartBegin(round: ERoundBoard) {
        let player = this.GetPlayer();
        player.EnemyManagerComp().removeAllEnemy();
        this.FHeroCombinationManager().getAllActiveCombination().forEach(comb => {
            comb.removeAllCombination();
        })
        this.FakerHeroDataComp().RefreshFakerHero();
        round.CreateAllRoundBasicEnemy(this.FakerHeroDataComp().SpawnEffect);
    }

    OnRoundStartBattle() {
        let player = this.GetPlayer();
        player.EnemyManagerComp().getAllBattleUnitAlive().forEach(b => {
            b.RoundStateComp().OnBoardRound_Battle();
        })
        this.FHeroCombinationManager().getAllActiveCombination().forEach(comb => {
            comb.CombEffectComp().OnRoundStartBattle();
        })
    }
    OnRoundStartPrize(round: ERoundBoard) {
        this.FHeroCombinationManager().getAllActiveCombination().forEach(comb => {
            if (comb.CombEffectComp()) {
                comb.CombEffectComp().OnRoundStartPrize(round);
            }
        })
        let player = this.GetPlayer();
        if (!round.isWin) {
            let damage = 0;
            let delay_time = 0.5;
            let aliveEnemy = player.EnemyManagerComp().getAllAliveEnemy();
            let ProjectileInfo = this.FakerHeroDataComp().ProjectileInfo;
            aliveEnemy.forEach((b) => {
                b.RoundStateComp().OnBoardRound_Prize_Enemy(round);
                damage += Number(b.GetRoundBasicUnitConfig().failure_count || "0");
                delay_time = math.min(delay_time, b.GetDistance2Player() / 1000);
            });
            GTimerHelper.AddTimer(
                delay_time, GHandler.create(this, () => {
                    player.EnemyManagerComp().ApplyDamageHero(damage, ProjectileInfo);
                })
            );
        }
    }
    FHeroCombinationManager() {
        return this.GetComponentByName<FHeroCombinationManagerComponent>("FHeroCombinationManagerComponent");
    }
    FakerHeroDataComp() {
        return this.GetComponentByName<FakerHeroDataComponent>("FakerHeroDataComponent");
    }
}
declare global {
    type IFakerHeroEntityRoot = FakerHeroEntityRoot;
}