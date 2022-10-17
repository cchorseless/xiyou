import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { PlayerCreateUnitEntityRoot } from "../Player/PlayerCreateUnitEntityRoot";
import { ERoundBoard } from "../Round/ERoundBoard";
import { FakerHeroDataComponent } from "./FakerHeroDataComponent";
import { FHeroCombinationManagerComponent } from "./FHeroCombinationManagerComponent";

export class FakerHeroEntityRoot extends PlayerCreateUnitEntityRoot {
    public readonly IsSerializeEntity: boolean = true;

    onAwake(playerid: PlayerID, conf: string) {
        let npc = this.GetDomain<BaseNpc_Plus>();
        (this as any).Playerid = playerid;
        (this as any).ConfigID = conf;
        (this as any).EntityId = npc.GetEntityIndex();
        this.SyncClientEntity(this, true);
        this.AddComponent(PrecacheHelper.GetRegClass<typeof FakerHeroDataComponent>("FakerHeroDataComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof FHeroCombinationManagerComponent>("FHeroCombinationManagerComponent"));
    }
    OnRoundStartBegin(round: ERoundBoard) {
        let player = this.GetPlayer();
        player.EnemyManagerComp().removeAllEnemy();
        this.FHeroCombinationManager().activeECombination(false);
        this.FakerHeroDataComp().RefreshFakerHero();
        round.CreateAllRoundBasicEnemy(this.FakerHeroDataComp().SpawnEffect);

    }
    OnRoundStartBattle() {
        this.FHeroCombinationManager().activeECombination(true);

    }
    OnRoundStartPrize(round: ERoundBoard, iswin: boolean) {
        let player = this.GetPlayer();
        if (!iswin) {
            let damage = 0;
            let delay_time = 0.5;
            let aliveEnemy = player.EnemyManagerComp().getAllAliveEnemy();
            let ProjectileInfo = this.FakerHeroDataComp().ProjectileInfo;
            aliveEnemy.forEach((b) => {
                b.RoundStateComp().OnBoardRound_Prize_Enemy(ProjectileInfo);
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