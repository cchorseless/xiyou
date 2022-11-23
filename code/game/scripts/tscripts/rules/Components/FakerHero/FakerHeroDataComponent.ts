import { Assert_ProjectileEffect, IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { Assert_SpawnEffect, ISpawnEffectInfo } from "../../../assert/Assert_SpawnEffect";
import { reloadable } from "../../../GameCache";
import { EventHelper } from "../../../helper/EventHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { ET } from "../../Entity/Entity";
import { RoundConfig } from "../../../shared/RoundConfig";
import { ERoundBoard } from "../Round/ERoundBoard";
import { FakerHeroEntityRoot } from "./FakerHeroEntityRoot";

@reloadable
export class FakerHeroDataComponent extends ET.Component {
    onAwake(...args: any[]): void {
        this.addEvent();
    }
    public RefreshFakerHero() {

    }

    ProjectileInfo: IProjectileEffectInfo = Assert_ProjectileEffect.p000;
    SpawnEffect: ISpawnEffectInfo = Assert_SpawnEffect.Effect.Spawn_fall;
    public addEvent() {
        let fakerhero = this.Domain.ETRoot.As<FakerHeroEntityRoot>()
        let player = fakerhero.GetPlayer();


        EventHelper.addServerEvent(this, RoundConfig.Event.roundboard_onwaitingend,
            player.Playerid,
            (round: ERoundBoard) => {
                player.EnemyManagerComp().getAllAliveEnemy()
                    .forEach((b) => {
                        b.RoundStateComp().OnBoardRound_WaitingEnd();
                    });
            });
    }

}
