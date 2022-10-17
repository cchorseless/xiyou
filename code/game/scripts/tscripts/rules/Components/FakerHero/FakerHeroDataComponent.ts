import { Assert_ProjectileEffect, IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { Assert_SpawnEffect, ISpawnEffectInfo } from "../../../assert/Assert_SpawnEffect";
import { EventHelper } from "../../../helper/EventHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { ET, registerET } from "../../Entity/Entity";
import { RoundConfig } from "../../System/Round/RoundConfig";
import { ERoundBoard } from "../Round/ERoundBoard";
import { FakerHeroEntityRoot } from "./FakerHeroEntityRoot";

@registerET()
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
