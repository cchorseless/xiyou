
import { Assert_ProjectileEffect, IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { Assert_SpawnEffect, ISpawnEffectInfo } from "../../../assert/Assert_SpawnEffect";
import { KVHelper } from "../../../helper/KVHelper";
import { modifier_faker_courier } from "../../../npc/courier/modifier_faker_courier";
import { BaseEntityRoot } from "../../Entity/BaseEntityRoot";
import { ERoundBoard } from "../Round/ERoundBoard";
import { FHeroAIComponent } from "./FHeroAIComponent";
import { FHeroCombinationManagerComponent } from "./FHeroCombinationManagerComponent";

export class FakerHeroEntityRoot extends BaseEntityRoot implements IRoundStateCallback {
    ProjectileInfo: IProjectileEffectInfo = Assert_ProjectileEffect.p000;
    SpawnEffect: ISpawnEffectInfo = Assert_SpawnEffect.Effect.Spawn_fall;

    onAwake(playerid: PlayerID, conf: string) {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        (this.BelongPlayerid as any) = playerid;
        (this.ConfigID as any) = conf;
        (this.EntityId as any) = npc.GetEntityIndex();
        this.AddComponent(GGetRegClass<typeof FHeroCombinationManagerComponent>("FHeroCombinationManagerComponent"));
        this.AddComponent(GGetRegClass<typeof FHeroAIComponent>("FHeroAIComponent"));
        this.SyncClient(true);
    }
    public RefreshFakerHero() {
        let hHero = this.GetDomain<IBaseNpc_Hero_Plus>();
        if (!IsValid(hHero) || !hHero.IsAlive()) {
            return
        }
        let sCurrentCourierName = this.GetCourierName()
        let sCourierName = KVHelper.CourierUnits.GetRandomCourier();
        if (sCurrentCourierName == sCourierName && modifier_faker_courier.findIn(hHero)) {
            return
        }
        modifier_faker_courier.remove(hHero);
        modifier_faker_courier.applyOnly(hHero, hHero, null, { courier_name: sCourierName });

    }
    GetCourierName() {
        let hero = this.GetDomain<IBaseNpc_Hero_Plus>();
        let hModifier = modifier_faker_courier.findIn(hero);
        if (IsValid(hModifier)) {
            return hModifier.GetCourierName();
        }
        return KVHelper.CourierUnits.GetRandomCourier();
    }
    OnRound_Start(round: ERoundBoard) {
        let player = this.GetPlayer();
        player.EnemyManagerComp().removeAllEnemy();
        this.FHeroCombinationManager().removeAllCombination();
        this.RefreshFakerHero();
        round.CreateAllRoundBasicEnemy(this.SpawnEffect);
    }
    OnRound_Battle() {
        let player = this.GetPlayer();
        player.BattleUnitManagerComp().GetAllBattleUnitAlive(DOTATeam_t.DOTA_TEAM_BADGUYS).forEach(b => {
            b.OnRound_Battle();
        })
        this.FHeroCombinationManager().getAllActiveCombination().forEach(comb => {
            comb.OnRound_Battle();
        })
    }
    OnRound_Prize(round: ERoundBoard) {
        this.FHeroCombinationManager().getAllActiveCombination().forEach(comb => {
            if (comb) {
                comb.OnRound_Prize(round);
            }
        })
        const player = this.GetPlayer();
        player.EnemyManagerComp().ForceFlyPrizeToHero();
        if (!round.isWin) {
            let damage = 0;
            let delay_time = 0.5;
            let aliveEnemy = player.BattleUnitManagerComp().GetAllBattleUnitAlive(DOTATeam_t.DOTA_TEAM_BADGUYS);
            aliveEnemy.forEach((b) => {
                b.OnRound_Prize(round);
                if (b.IsEnemy()) {
                    damage += b.GetRoundHeroDamage();
                }
                else if (b.IsIllusion() || b.IsSummon()) {
                    damage += 1;
                }
                delay_time = math.min(delay_time, b.GetDistance2Player() / 1000);
            });
            GTimerHelper.AddTimer(delay_time, GHandler.create(this, () => {
                player.EnemyManagerComp().ApplyDamageHero(damage, this.ProjectileInfo);
            }));
        }
    }

    OnRound_WaitingEnd() {
        let player = this.GetPlayer();
        player.BattleUnitManagerComp().GetAllBattleUnitAlive(DOTATeam_t.DOTA_TEAM_BADGUYS)
            .forEach((b) => {
                b.OnRound_WaitingEnd();
            });
    }
    FHeroCombinationManager() {
        return this.GetComponentByName<FHeroCombinationManagerComponent>("FHeroCombinationManagerComponent");
    }
    FHeroAIComp() {
        return this.GetComponentByName<FHeroAIComponent>("FHeroAIComponent");
    }
}
declare global {
    type IFakerHeroEntityRoot = FakerHeroEntityRoot;
}