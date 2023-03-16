import { LogHelper } from "../../helper/LogHelper";
import { BaseNpc_Hero_Plus } from "../entityPlus/BaseNpc_Hero_Plus";
import { registerUnit } from "../entityPlus/Base_Plus";
@registerUnit()
export class bot_base extends BaseNpc_Hero_Plus {
    Spawn(entityKeyValues: CScriptKeyValues) {
        this.GetPlayerOwner().SetAssignedHeroEntity(this);
        let startPoint = GPlayerEntityRoot.HeroSpawnPoint[this.GetPlayerID() as number] || Vector(0, 0, 284);
        let a = GetGroundPosition(startPoint, this);
        LogHelper.print("ADD BOT => PLAYERID :" + this.GetPlayerID(), this.GetPlayerOwner().GetModelName(), a);
        this.SetAbsOrigin(a);
    }

    onSpawned() {
        if (!IsServer()) {
            return;
        }

        GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
            if (GameRules.State_Get() > DOTA_GameState.DOTA_GAMERULES_STATE_STRATEGY_TIME) {
                GPlayerEntityRoot.GetOneInstance(this.GetPlayerID()).BindHero(this);
            } else {
                return 5;
            }
        }));
    }
}
