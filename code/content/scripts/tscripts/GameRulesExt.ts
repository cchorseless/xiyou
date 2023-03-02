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


export class GameRulesExt {
    static Init() {
        if (IsServer) {
            GTimerHelper.AddTimer(1, GHandler.create(this, () => {
                let is_day = GameRules.IsDaytime();
                NetTablesHelper.SetDotaEntityData("isdaytime", {
                    is_day: is_day
                });
                return 0.5;
            }));
        }
    }


}