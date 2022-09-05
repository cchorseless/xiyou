import { Assert_ProjectileEffect, IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_jiaoxie_wudi } from "../../../npc/modifier/modifier_jiaoxie_wudi";
import { ET, registerET } from "../../Entity/Entity";
import { RoundConfig } from "../../System/Round/RoundConfig";
import { EnemyUnitEntityRoot } from "../Enemy/EnemyUnitEntityRoot";
import { KVConfigComponment } from "../KVConfig/KVConfigComponment";
import { PlayerCreateUnitEntityRoot } from "../Player/PlayerCreateUnitEntityRoot";
/**回合控制 */
@registerET()
export class RoundEnemyComponent extends ET.Component {
    onAwake(...args: any[]): void {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let currentround = domain.ETRoot.As<PlayerCreateUnitEntityRoot>().GetPlayer().RoundManagerComp().getCurrentBoardRound();
        switch (currentround.roundState) {
            case RoundConfig.ERoundBoardState.start:
                this.OnBoardRound_Start();
                break;
            case RoundConfig.ERoundBoardState.battle:
                this.OnBoardRound_Battle();
                break;
        }
    }
    OnBoardRound_Start() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.addSpawnedHandler(
            ET.Handler.create(this, () => {
                modifier_jiaoxie_wudi.applyOnly(domain, domain);
            })
        );
    }

    OnBoardRound_Battle() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        modifier_jiaoxie_wudi.remove(domain);
    }

    OnBoardRound_Prize(ProjectileInfo: IProjectileEffectInfo = null) {
        let domain = this.GetDomain<BaseNpc_Plus>();
        modifier_jiaoxie_wudi.applyOnly(domain, domain);
        this.playDamageHeroAni(ProjectileInfo);
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
