import { Assert_ProjectileEffect, IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { Assert_SpawnEffect, ISpawnEffectInfo } from "../../../assert/Assert_SpawnEffect";
import { ET } from "../../../shared/lib/Entity";
import { GEventHelper } from "../../../shared/lib/GEventHelper";
import { RoundConfig } from "../../../shared/RoundConfig";
import { ERoundBoard } from "../Round/ERoundBoard";

@GReloadable
export class FakerHeroDataComponent extends ET.Component {
    onAwake(...args: any[]): void {
        this.addEvent();
    }
    public RefreshFakerHero() {

    }

    ProjectileInfo: IProjectileEffectInfo = Assert_ProjectileEffect.p000;
    SpawnEffect: ISpawnEffectInfo = Assert_SpawnEffect.Effect.Spawn_fall;
    public addEvent() {
        let fakerhero = this.Domain.ETRoot.As<IFakerHeroEntityRoot>()
        let player = fakerhero.GetPlayer();

        GEventHelper.AddEvent(RoundConfig.Event.roundboard_onwaitingend,
            GHandler.create(this, (round: ERoundBoard) => {
                player.EnemyManagerComp().getAllAliveEnemy()
                    .forEach((b) => {
                        b.RoundStateComp().OnBoardRound_WaitingEnd();
                    });
            }),
            player.BelongPlayerid,
        );
    }

}
