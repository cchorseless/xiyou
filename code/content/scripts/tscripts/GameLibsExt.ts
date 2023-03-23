import { GameMode } from "./GameMode";
import { NetTablesHelper } from "./helper/NetTablesHelper";


declare global {
    interface CDOTAGameRules {
        /**
         * @Server
         */
        Addon: GameMode;
        /**
         * @Both
         */
        IsDaytimePlus(): boolean;
    }
}

GameRules.IsDaytimePlus = () => {
    if (IsServer()) {
        return GameRules.IsDaytime();
    } else {
        let is_day = NetTablesHelper.GetDotaEntityData("isdaytime") || {};
        return GToBoolean(is_day.is_day);
    }
}




declare global {
    interface CScriptParticleManager {

        /**
         * @Both
         * 清理粒子
         */
        ClearParticle(p: ParticleID): void;
    }
}

ParticleManager.ClearParticle = (p: ParticleID) => {
    ParticleManager.ReleaseParticleIndex(p);
    ParticleManager.DestroyParticle(p, false);
}





export class GameLibsExt {
    static Init() {
    }

    static StartGame() {
        if (IsServer) {
            GTimerHelper.AddTimer(1, GHandler.create(this, () => {
                let is_day = GameRules.IsDaytime && GameRules.IsDaytime() || true;
                NetTablesHelper.SetDotaEntityData("isdaytime", {
                    is_day: is_day
                });
                return 0.5;
            }));
        }
    }

}