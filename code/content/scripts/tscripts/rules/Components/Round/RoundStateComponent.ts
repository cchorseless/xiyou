import { Assert_ProjectileEffect, IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { modifier_jiaoxie_wudi } from "../../../npc/modifier/battle/modifier_jiaoxie_wudi";
import { ET } from "../../../shared/lib/Entity";
import { RoundConfig } from "../../../shared/RoundConfig";
import { BuildingRuntimeEntityRoot } from "../Building/BuildingRuntimeEntityRoot";

import { ERoundBoard } from "./ERoundBoard";
/**回合控制 */
@GReloadable
export class RoundStateComponent extends ET.Component {
    onAwake(...args: any[]): void {
        this.addEvent();
        let domain = this.GetDomain<IBaseNpc_Plus>();
        let currentround = domain.ETRoot.As<IBattleUnitEntityRoot>().GetPlayer().RoundManagerComp().getCurrentBoardRound();
        switch (currentround.roundState) {
            case RoundConfig.ERoundBoardState.start:
                this.OnBoardRound_Start();
                break;
            case RoundConfig.ERoundBoardState.battle:
                this.OnBoardRound_Battle();
                break;
        }
    }



    BattleUnit() {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        return domain.ETRoot.As<IBattleUnitEntityRoot>();
    }

    addEvent() {
    }

    OnBoardRound_Start() {
        let battleunit = this.BattleUnit();
        if (battleunit.IsRuntimeBuilding()) {
            return
        }
        let domain = this.GetDomain<IBaseNpc_Plus>();
        domain.addSpawnedHandler(
            GHandler.create(this, () => {
                modifier_jiaoxie_wudi.applyOnly(domain, domain);
            })
        );
        if (battleunit.IsBuilding()) {
            let building = battleunit as IBuildingEntityRoot;
            building.RemoveCloneRuntimeBuilding();
        }
    }


    OnBoardRound_Battle() {
        let battleunit = this.BattleUnit();
        let domain = this.GetDomain<IBaseNpc_Plus>();
        if (battleunit.IsBuilding()) {
            modifier_jiaoxie_wudi.applyOnly(domain, domain);
        }
        else {
            modifier_jiaoxie_wudi.remove(domain);
            battleunit.AbilityManagerComp().OnBoardRound_Battle();
            battleunit.InventoryComp().OnBoardRound_Battle();
            GTimerHelper.AddTimer(1, GHandler.create(this, () => {
                battleunit.AiAttackComp().startFindEnemyAttack();
            }))
        }
        if (battleunit.IsEnemy()) {
            (battleunit as IEnemyUnitEntityRoot).SetUIOverHead(false, true);
        }
    }

    OnBoardRound_Prize_RuntimeBuilding(round: ERoundBoard) {
        let battleunit = this.BattleUnit() as BuildingRuntimeEntityRoot;
        battleunit.AiAttackComp().endFindToAttack();
        battleunit.AbilityManagerComp().OnBoardRound_Prize(round);
        battleunit.InventoryComp().OnBoardRound_Prize(round);
        if (round.isWin) {
            battleunit.StartFindTreasure();
        } else {
        }
    }

    OnBoardRound_Prize_Enemy(round: ERoundBoard) {
        let battleunit = this.BattleUnit() as IEnemyUnitEntityRoot;
        let domain = this.GetDomain<IBaseNpc_Plus>();
        battleunit.AiAttackComp().endFindToAttack();
        battleunit.onVictory();
        battleunit.AbilityManagerComp().OnBoardRound_Prize(round);
        battleunit.InventoryComp().OnBoardRound_Prize(round);
        modifier_jiaoxie_wudi.applyOnly(domain, domain);
        let ProjectileInfo = battleunit.GetPlayer().FakerHeroRoot().ProjectileInfo;
        this.playDamageHeroAni(ProjectileInfo);
    }

    OnBoardRound_WaitingEnd() {
        let battleunit = this.BattleUnit() as BuildingRuntimeEntityRoot;
        if (battleunit.IsRuntimeBuilding()) {
            battleunit.StopFindTreasure();
        }
    }

    playDamageHeroAni(ProjectileInfo: IProjectileEffectInfo = null) {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        let hero = GPlayerEntityRoot.GetOneInstance(this.Domain.ETRoot.As<IEnemyUnitEntityRoot>().BelongPlayerid).Hero;
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
}
