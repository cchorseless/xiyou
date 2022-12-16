import { GetRegClass } from "../../../GameCache";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { BaseEntityRoot } from "../../Entity/BaseEntityRoot";
import { ERoundBoard } from "../Round/ERoundBoard";
import { FakerHeroDataComponent } from "./FakerHeroDataComponent";
import { FHeroCombinationManagerComponent } from "./FHeroCombinationManagerComponent";

export class FakerHeroEntityRoot extends BaseEntityRoot {
    public readonly IsSerializeEntity: boolean = true;

    onAwake(playerid: PlayerID, conf: string) {
        let npc = this.GetDomain<BaseNpc_Plus>();
        (this as any).Playerid = playerid;
        (this as any).ConfigID = conf;
        (this as any).EntityId = npc.GetEntityIndex();
        this.SyncClientEntity(this, true);
        this.AddComponent(GetRegClass<typeof FakerHeroDataComponent>("FakerHeroDataComponent"));
        this.AddComponent(GetRegClass<typeof FHeroCombinationManagerComponent>("FHeroCombinationManagerComponent"));
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
            TimerHelper.addTimer(
                delay_time,
                () => {
                    player.EnemyManagerComp().ApplyDamageHero(damage, ProjectileInfo);
                },
                this,
                true
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