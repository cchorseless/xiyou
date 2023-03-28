import { LogHelper } from "../../helper/LogHelper";
import { BaseNpc_Hero_Plus } from "../entityPlus/BaseNpc_Hero_Plus";
import { registerUnit } from "../entityPlus/Base_Plus";

@registerUnit()
export class enemy_courier extends BaseNpc_Hero_Plus {
    Spawn(entityKeyValues: CScriptKeyValues) {
        if (!IsServer()) {
            return;
        }
        // 开局会创建多个英雄，系统一会删除掉
        if (!this.IsValidHero()) {
            return;
        }
        LogHelper.print("ADD PLAYER => PLAYERID :" + this.GetPlayerID());
        // 设置技能点数
        this.SetAbilityPoints(0);
        this.SetIdleAcquire(false);
    }

    onSpawned() {
        if (!IsServer()) {
            return;
        }
        // 开局会创建多个英雄，系统一会删除掉
        if (!this.IsValidHero()) {
            return;
        }
        // TimerHelper.addTimer(2, () => {
        // MiniMapHelper.updatePlayerOnMiniForPlayer(this.GetPlayerID(), this.GetPlayerID())
        // }, this)
    }

    Activate() {
        if (!IsServer()) {
            return;
        }
        LogHelper.print("enemy_courier :=>", this.GetPlayerID());
    }

    IsValidHero() {
        return GPlayerEntityRoot.GetOneInstance(this.GetPlayerID()).Hero == null;
    }




}
