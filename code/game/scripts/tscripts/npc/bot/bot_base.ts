import { GameDebugger } from "../../GameDebugger";
import { LogHelper } from "../../helper/LogHelper";
import { PrecacheHelper } from "../../helper/PrecacheHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { ET } from "../../rules/Entity/Entity";
import { BaseNpc_Hero_Plus } from "../entityPlus/BaseNpc_Hero_Plus";
import { registerUnit } from "../entityPlus/Base_Plus";
@registerUnit()
export class bot_base extends BaseNpc_Hero_Plus {
    Spawn(entityKeyValues: CScriptKeyValues) {
        this.GetPlayerOwner().SetAssignedHeroEntity(this);
        let startPoint = GPlayerSystem.GetInstance().HeroSpawnPoint[this.GetPlayerID() as number] || Vector(0, 0, 284);
        let a = GetGroundPosition(startPoint, this);
        LogHelper.print("ADD BOT => PLAYERID :" + this.GetPlayerOwnerID(), this.GetPlayerOwner().GetModelName(), a);
        this.SetAbsOrigin(a);
    }

    onSpawned() {
        if (!IsServer()) {
            return;
        }

        TimerHelper.addFrameTimer(1, () => {
            if (GameRules.State_Get() > DOTA_GameState.DOTA_GAMERULES_STATE_STRATEGY_TIME) {
                GPlayerSystem.GetInstance().GetPlayer(this.GetPlayerID()).BindHero(this);
            } else {
                return 5;
            }
        });
    }
}
