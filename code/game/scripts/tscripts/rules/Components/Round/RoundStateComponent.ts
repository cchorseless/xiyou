import { building_auto_findtreasure } from "../../../npc/abilities/common/building_auto_findtreasure";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_jiaoxie_wudi } from "../../../npc/modifier/battle/modifier_jiaoxie_wudi";
import { modifier_wait_portal } from "../../../npc/modifier/modifier_portal";
import { modifier_remnant } from "../../../npc/modifier/battle/modifier_remnant";
import { ET } from "../../Entity/Entity";
import { RoundConfig } from "../../../shared/RoundConfig";
import { EnemyUnitEntityRoot } from "../Enemy/EnemyUnitEntityRoot";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { Assert_ProjectileEffect, IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { BuildingRuntimeEntityRoot } from "../Building/BuildingRuntimeEntityRoot";
import { LogHelper } from "../../../helper/LogHelper";
import { reloadable } from "../../../GameCache";
import { ERoundBoard } from "./ERoundBoard";
import { TimerHelper } from "../../../helper/TimerHelper";
/**回合控制 */
@reloadable
export class RoundStateComponent extends ET.Component {
    onAwake(...args: any[]): void {
        this.addEvent();
        let domain = this.GetDomain<BaseNpc_Plus>();
        let currentround = domain.ETRoot.As<PlayerCreateBattleUnitEntityRoot>().GetPlayer().RoundManagerComp().getCurrentBoardRound();
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
        let domain = this.GetDomain<BaseNpc_Plus>();
        return domain.ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
    }

    addEvent() {
    }

    OnBoardRound_Start() {
        let battleunit = this.BattleUnit();
        if (battleunit.IsRuntimeBuilding()) {
            return
        }
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.addSpawnedHandler(
            ET.Handler.create(this, () => {
                modifier_jiaoxie_wudi.applyOnly(domain, domain);
            })
        );
        if (battleunit.IsBuilding()) {
            let building = battleunit as BuildingEntityRoot;
            building.RemoveCloneRuntimeBuilding();
        }
    }


    OnBoardRound_Battle() {
        let battleunit = this.BattleUnit();
        let domain = this.GetDomain<BaseNpc_Plus>();
        if (battleunit.IsBuilding()) {
            modifier_jiaoxie_wudi.applyOnly(domain, domain);
        }
        else {
            modifier_jiaoxie_wudi.remove(domain);
            battleunit.AbilityManagerComp().OnBoardRound_Battle();
            battleunit.InventoryComp().OnBoardRound_Battle();
            TimerHelper.addTimer(1, () => {
                battleunit.AiAttackComp().startFindEnemyAttack();
            })
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
        let battleunit = this.BattleUnit() as EnemyUnitEntityRoot;
        let domain = this.GetDomain<BaseNpc_Plus>();
        battleunit.AiAttackComp().endFindToAttack();
        battleunit.onVictory();
        battleunit.AbilityManagerComp().OnBoardRound_Prize(round);
        battleunit.InventoryComp().OnBoardRound_Prize(round);
        modifier_jiaoxie_wudi.applyOnly(domain, domain);
        let ProjectileInfo = battleunit.GetPlayer().FakerHeroRoot().FakerHeroDataComp().ProjectileInfo;
        this.playDamageHeroAni(ProjectileInfo);
    }

    OnBoardRound_WaitingEnd() {
        let battleunit = this.BattleUnit() as BuildingRuntimeEntityRoot;
        if (battleunit.IsRuntimeBuilding()) {
            battleunit.StopFindTreasure();
        }
    }

    playDamageHeroAni(ProjectileInfo: IProjectileEffectInfo = null) {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let hero = GameRules.Addon.ETRoot.PlayerSystem().GetPlayer(this.Domain.ETRoot.As<EnemyUnitEntityRoot>().Playerid).Hero;
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
