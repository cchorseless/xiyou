import { GameDebugger } from "../../GameDebugger";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { BaseNpc_Hero_Plus } from "../entityPlus/BaseNpc_Hero_Plus";
import { registerUnit } from "../entityPlus/Base_Plus";
import { courier_challenge_wood } from "../abilities/courier/courier_challenge_wood";
import { courier_challenge_gold } from "../abilities/courier/courier_challenge_gold";
import { courier_challenge_equip } from "../abilities/courier/courier_challenge_equip";
import { courier_challenge_artifact } from "../abilities/courier/courier_challenge_artifact";

@registerUnit()
export class courier_base extends BaseNpc_Hero_Plus {
    Spawn(entityKeyValues: CScriptKeyValues) {
        if (!IsServer()) {
            return;
        }
        // 开局会创建多个英雄，系统一会删除掉
        if (!this.IsValidHero()) {
            return;
        }
        LogHelper.print("ADD PLAYER => PLAYERID :" + this.GetPlayerOwnerID());
        // 设置技能点数
        this.SetAbilityPoints(0);
        let len = this.GetAbilityCount();
        for (let i = 0; i < len; i++) {
            let ability = this.GetAbilityByIndex(i);
            if (ability) ability.UpgradeAbility(true);
        }
        let ability1 = this.addAbilityPlus(courier_challenge_gold.name);
        let ability2 = this.addAbilityPlus(courier_challenge_wood.name);
        let ability3 = this.addAbilityPlus(courier_challenge_equip.name);
        let ability4 = this.addAbilityPlus(courier_challenge_artifact.name);
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
        GPlayerSystem.GetInstance().GetPlayer(this.GetPlayerID()).BindHero(this);
        // 延遲1帧
        TimerHelper.addFrameTimer(1, () => {
            let playerid = this.GetPlayerID();
            // 设置出生点
            let startPoint = GPlayerSystem.GetInstance().HeroSpawnPoint[playerid];
            let a = GetGroundPosition(startPoint, this);
            this.SetAbsOrigin(a);
            CenterCameraOnUnit(playerid, this);
        });
        // TimerHelper.addTimer(2, () => {
        // MiniMapHelper.updatePlayerOnMiniForPlayer(this.GetPlayerID(), this.GetPlayerID())
        // }, this)
    }

    Activate() {
        if (!IsServer()) {
            return;
        }
        LogHelper.print("courier_base :=>", this.GetPlayerID());
    }

    IsValidHero() {
        return GPlayerSystem.GetInstance().GetPlayer(this.GetPlayerID()).Hero == null;
    }




}
