import { GameDebugger } from "../../GameDebugger";
import { LogHelper } from "../../helper/LogHelper";
import { PrecacheHelper } from "../../helper/PrecacheHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { AvalonBotComponent } from "../../rules/Components/Awalon/AvalonBotComponent";
import { AvalonComponent } from "../../rules/Components/Awalon/AvalonComponent";
import { PlayerComponent } from "../../rules/Components/Player/PlayerComponent";
import { ET } from "../../rules/Entity/Entity";
import { PlayerState } from "../../rules/System/Player/PlayerState";
import { PlayerSystem } from "../../rules/System/Player/PlayerSystem";
import { BaseNpc_Hero_Plus } from "../entityPlus/BaseNpc_Hero_Plus";
import { registerUnit } from "../entityPlus/Base_Plus";
import { modifier_property } from "../modifier/modifier_property";
import { modifier_task } from "../modifier/modifier_task";
import { modifier_test } from "../modifier/modifier_test";
@registerUnit()
export class bot_base extends BaseNpc_Hero_Plus {
    Spawn(entityKeyValues: CScriptKeyValues) {
        this.GetPlayerOwner().SetAssignedHeroEntity(this);
        let startPoint = PlayerState.HeroSpawnPoint[this.GetPlayerID() as number] || Vector(0, 0, 284);
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
                PlayerSystem.GetPlayer(this.GetPlayerID()).Active(this);
                this.ETRoot.AddComponent(AvalonComponent);
                this.ETRoot.AddComponent(PlayerComponent);
                this.ETRoot.AddComponent(AvalonBotComponent);
                modifier_task.apply(this, this);
                modifier_test.apply(this, this);
            } else {
                return 5;
            }
        });
    }
}
