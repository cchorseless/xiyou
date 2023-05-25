import { LogHelper } from "../../helper/LogHelper";
import { courier_challenge_artifact, courier_challenge_equip, courier_challenge_gold, courier_challenge_wood } from "../abilities/courier/courier_challenge_enemy";
import { BaseNpc_Hero_Plus } from "../entityPlus/BaseNpc_Hero_Plus";
import { registerUnit } from "../entityPlus/Base_Plus";

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
        LogHelper.print("ADD PLAYER => PLAYERID :" + this.GetPlayerID());
        // 设置技能点数
        this.SetAbilityPoints(0);
        let len = this.GetAbilityCount();
        for (let i = 0; i < len; i++) {
            let ability = this.GetAbilityByIndex(i);
            if (ability) ability.UpgradeAbility(true);
        }
        this.addAbilityPlus(courier_challenge_gold.name);
        this.addAbilityPlus(courier_challenge_wood.name);
        this.addAbilityPlus(courier_challenge_equip.name);
        this.addAbilityPlus(courier_challenge_artifact.name);
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
        GPlayerEntityRoot.GetOneInstance(this.GetPlayerID()).BindHero(this);
        // 延遲1帧
        GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
            let playerid = this.GetPlayerID();
            // 设置出生点
            let offset = Vector(500, 500, 0)
            let startPoint = GPlayerEntityRoot.HeroSpawnPoint[playerid] + offset as Vector;
            let a = GetGroundPosition(startPoint, this);
            this.SetAbsOrigin(a);
            CenterCameraOnUnit(playerid, this);
            this.SetMana(100);
            this.SetBaseManaRegen(0);
            // let unit = BaseNpc_Plus.CreateUnitByName("unit_npc_eon_cart", this.GetAbsOrigin(), this)
            // unit.FollowEntity(this, false);
            // unit.SetLocalOrigin(this.GetLeftVector() * 150 as Vector)
            // let unit2 = BaseNpc_Plus.CreateUnitByName("unit_npc_eon_cart", this.GetAbsOrigin(), this)
            // unit2.FollowEntity(this, false);
            // unit2.SetLocalOrigin(this.GetLeftVector() * 400 as Vector)
            // let unit3 = BaseNpc_Plus.CreateUnitByName("unit_npc_eon_cart", this.GetAbsOrigin(), this)
            // unit3.FollowEntity(this, false);
            // unit3.SetLocalOrigin(this.GetLeftVector() * 650 as Vector)
        }));
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
        return GPlayerEntityRoot.GetOneInstance(this.GetPlayerID()).Hero == null;
    }





}
