import { Assert_ProjectileEffect, IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { KVHelper } from "../../../helper/KVHelper";
import { modifier_jiaoxie_wudi } from "../../../npc/modifier/battle/modifier_jiaoxie_wudi";
import { modifier_mana_control } from "../../../npc/modifier/battle/modifier_mana_control";
import { modifier_round_enemy } from "../../../npc/modifier/battle/modifier_round_enemy";
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
        this.SetStar(1);
        this.SetUIOverHead(true, false);
        this.InitSyncClientInfo();
        if (onlyKey != null) {
            modifier_round_enemy.applyOnly(domain, domain, null, {
                roundid: roundid,
                onlyKey: onlyKey
            })
        }
        this.JoinInRound();
    }
    OnRound_Start() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        modifier_jiaoxie_wudi.applyOnly(npc, npc);
        if (this.IsEnemyTower()) {
            npc.StartGesture(GameActivity_t.ACT_DOTA_CUSTOM_TOWER_IDLE);
        }
        else {
            npc.StartGesture(GameActivity_t.ACT_DOTA_IDLE);
        }
        GGameScene.GetPlayer(this.BelongPlayerid).FakerHeroRoot().FHeroCombinationManager().addEnemyUnit(this);
    }
    OnRound_Battle() {
        this.SetUIOverHead(false, true);
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (!this.IsEnemyTower()) {
            npc.RemoveGesture(GameActivity_t.ACT_DOTA_IDLE);
        }
        modifier_jiaoxie_wudi.remove(npc);
        modifier_mana_control.applyOnly(npc, npc);
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
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1,
        });
    }
    OnRound_WaitingEnd() {

    }

    IsWave() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        return npc.GetUnitLabel() == EnemyConfig.EEnemyUnitType.wave;
    }
    IsBoss() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        return npc.GetUnitLabel() == EnemyConfig.EEnemyUnitType.BOSS;
    }
    IsGOLD_BOSS() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        return npc.GetUnitLabel() == EnemyConfig.EEnemyUnitType.GOLD_BOSS;
    }
    IsCANDY_BOSS() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        return npc.GetUnitLabel() == EnemyConfig.EEnemyUnitType.CANDY_BOSS;
    }
    IsEnemyTower() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        return npc.GetUnitLabel() == EnemyConfig.EEnemyUnitType.Tower;
    }

    onDestroy(): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (IsValid(npc)) {
            SafeDestroyUnit(npc);
        }
    }


    onKilled(events: EntityKilledEvent): void {
        this.changeAliveState(false);
        this.AiAttackComp().endFindToAttack();
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (this.IsEnemyTower()) {
            npc.StartGesture(GameActivity_t.ACT_DOTA_CUSTOM_TOWER_DIE);
        }
        else {
            npc.StartGesture(GameActivity_t.ACT_DOTA_DIE);
            // npc.add
        }
        this.GiveKillReward();
        GTimerHelper.AddTimer(RandomFloat(1, 3), GHandler.create(this, () => {
            if (IsValid(npc)) {
                npc.AddNoDraw()
            }
        }));
        // this.GetPlayer().EnemyManagerComp().killEnemy(this);
    }

    GiveKillReward() {
        let roundconfig = this.GetRoundBasicUnitConfig();
        if (roundconfig) {
            let player = this.GetPlayer();
            let npc = this.GetDomain<IBaseNpc_Plus>();
            if (this.IsEnemyTower()) {
                for (let i = 0; i < 3; i++) {
                    let item = npc.CreateOneItem("item_imba_aeon_disk");
                    item.CreateItemOnPositionRandom(npc.GetAbsOrigin(), 300);
                }
            }
            else {
                let goldMin = roundconfig.goldMin || 0;
                let goldMax = roundconfig.goldMax || 0;
                if (goldMin > 0 && goldMax > 0) {
                    let gold = RandomInt(goldMin, goldMax);
                    let cast_sound = "DOTA_Item.Hand_Of_Midas";
                    npc.EmitSound(cast_sound);
                    SendOverheadEventMessage(null, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, npc, gold, undefined);
                    player.PlayerDataComp().ModifyGold(RandomInt(goldMin, goldMax));
                }
            }
        }
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
    /**
     * 
     * @returns 返回当前怪物的伤害
     */
    GetRoundHeroDamage() {
        if (this.IsEnemyTower()) {
            return 10;
        }
        return this.iStar;
    }



}
declare global {
    type IEnemyUnitEntityRoot = EnemyUnitEntityRoot;
    var GEnemyUnitEntityRoot: typeof EnemyUnitEntityRoot;
}