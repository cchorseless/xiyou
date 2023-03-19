import { Assert_ProjectileEffect, IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { KVHelper } from "../../../helper/KVHelper";
import { modifier_jiaoxie_wudi } from "../../../npc/modifier/battle/modifier_jiaoxie_wudi";
import { EnemyConfig } from "../../../shared/EnemyConfig";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { ERound } from "../Round/ERound";
import { ERoundBoard } from "../Round/ERoundBoard";

@GReloadable
export class EnemyUnitEntityRoot extends BattleUnitEntityRoot {
    readonly RoundID: string;
    readonly OnlyKey: string;

    onAwake(playerid: PlayerID, confid: string, roundid: string, onlyKey: string = null) {
        (this.BelongPlayerid as any) = playerid;
        (this.ConfigID as any) = confid;
        (this.RoundID as any) = roundid;
        (this.OnlyKey as any) = onlyKey;
        const domain = this.GetDomain<IBaseNpc_Plus>();
        (this.EntityId as any) = domain.GetEntityIndex();
        this.AddComponent(GGetRegClass<typeof CombinationComponent>("CombinationComponent"));
        this.addBattleComp();
        this.InitSyncClientInfo();
        this.JoinInRound();
    }
    OnRound_Start() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        modifier_jiaoxie_wudi.applyOnly(npc, npc);
    }
    OnRound_Battle() {
        this.SetUIOverHead(false, true);
        let npc = this.GetDomain<IBaseNpc_Plus>();
        modifier_jiaoxie_wudi.remove(npc);
        this.AbilityManagerComp().OnRound_Battle();
        this.InventoryComp().OnRound_Battle();
        GTimerHelper.AddTimer(1, GHandler.create(this, () => {
            this.AiAttackComp().startFindEnemyAttack();
        }))
    }
    OnRound_Prize(round: ERoundBoard) {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        this.AiAttackComp().endFindToAttack();
        this.onVictory();
        this.AbilityManagerComp().OnRound_Prize(round);
        this.InventoryComp().OnRound_Prize(round);
        modifier_jiaoxie_wudi.applyOnly(domain, domain);
        let ProjectileInfo = this.GetPlayer().FakerHeroRoot().ProjectileInfo;
        this.playDamageHeroAni(ProjectileInfo);
    }


    playDamageHeroAni(ProjectileInfo: IProjectileEffectInfo = null) {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        let hero = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).Hero;
        ProjectileInfo = ProjectileInfo || Assert_ProjectileEffect.p000;
        ProjectileManager.CreateTrackingProjectile({
            Target: hero,
            Source: domain,
            Ability: null,
            EffectName: ProjectileInfo.effect,
            bDodgeable: false,
            iMoveSpeed: 1000,
            bProvidesVision: false,
            iVisionRadius: 0,
            iVisionTeamNumber: hero.GetTeamNumber(),
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_NONE,
        });
    }
    OnRound_WaitingEnd() {

    }
    EnemyUnitType() {
        return this.Config().UnitLabel;
    }
    IsWave() {
        return this.EnemyUnitType() == EnemyConfig.EEnemyUnitType.wave;
    }
    IsBoss() {
        return this.EnemyUnitType() == EnemyConfig.EEnemyUnitType.BOSS;
    }
    IsGOLD_BOSS() {
        return this.EnemyUnitType() == EnemyConfig.EEnemyUnitType.GOLD_BOSS;
    }
    IsCANDY_BOSS() {
        return this.EnemyUnitType() == EnemyConfig.EEnemyUnitType.CANDY_BOSS;
    }
    IsCANDY_WAVE() {
        return this.EnemyUnitType() == EnemyConfig.EEnemyUnitType.CANDY_WAVE;
    }

    onDestroy(): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (GFuncEntity.IsValid(npc)) {
            GFuncEntity.SafeDestroyUnit(npc);
        }
    }


    onKilled(events: EntityKilledEvent): void {
        this.changeAliveState(false);
        this.AiAttackComp().endFindToAttack();
        let npc = this.GetDomain<IBaseNpc_Plus>();
        npc.StartGesture(GameActivity_t.ACT_DOTA_DIE);
        // this.GetPlayer().EnemyManagerComp().killEnemy(this);
    }

    Config() {
        return KVHelper.KvServerConfig.building_unit_enemy[this.ConfigID];
    }
    GetDotaHeroName() {
        return this.Config().DotaHeroName as string;
    }
    GetRound<T extends ERound>(): T {
        return this.GetPlayer().RoundManagerComp().RoundInfo[this.RoundID] as T;
    }

    GetRoundBasicUnitConfig() {
        if (this.OnlyKey != null) {
            return this.GetRound<ERoundBoard>().config.enemyinfo.find(v => { return v.id == this.OnlyKey })
        }
    }




}
declare global {
    type IEnemyUnitEntityRoot = EnemyUnitEntityRoot;
    var GEnemyUnitEntityRoot: typeof EnemyUnitEntityRoot;
}