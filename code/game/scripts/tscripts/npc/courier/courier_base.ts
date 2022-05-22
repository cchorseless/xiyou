import { GameDebugger } from "../../GameDebugger";
import { LogHelper } from "../../helper/LogHelper";
import { PrecacheHelper } from "../../helper/PrecacheHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { modifier_task } from "../modifier/modifier_task";
import { modifier_test } from "../modifier/modifier_test";
import { BaseNpc_Hero_Plus } from "../entityPlus/BaseNpc_Hero_Plus";
import { registerUnit } from "../entityPlus/Base_Plus";
import { MiniMapHelper } from "../../helper/MiniMapHelper";
import { ET } from "../../rules/Entity/Entity";
import { ControlComponent } from "../../rules/Components/Control/ControlComponent";
import { PlayerComponent } from "../../rules/Components/Player/PlayerComponent";
import { EnemyManagerComponent } from "../../rules/Components/Enemy/EnemyManagerComponent";
import { RoundManagerComponent } from "../../rules/Components/Round/RoundManagerComponent";
import { CombinationManagerComponent } from "../../rules/Components/Combination/CombinationManagerComponent";
import { PlayerState } from "../../rules/System/Player/PlayerState";
import { BuildingManagerComponent } from "../../rules/Components/Building/BuildingManagerComponent";
import { PlayerSystem } from "../../rules/System/Player/PlayerSystem";
import { DrawComponent } from "../../rules/Components/Draw/DrawComponent";
@registerUnit()
export class courier_base extends BaseNpc_Hero_Plus {
    Spawn(entityKeyValues: CScriptKeyValues) {
        LogHelper.print("ADD PLAYER => PLAYERID :" + this.GetPlayerOwnerID());
        // 设置技能点数
        this.SetAbilityPoints(0);
        let len = this.GetAbilityCount();
        for (let i = 0; i < len; i++) {
            let ability = this.GetAbilityByIndex(i);
            if (ability) ability.UpgradeAbility(true);
        }
        this.SetIdleAcquire(false);
    }

    onSpawned() {
        if (!IsServer()) {
            return;
        }
        PlayerSystem.GetPlayer(this.GetPlayerID()).Active(this);
        //#region  添加组件
        // 阿瓦隆组件
        // Component_Avalon.addComponent(this);
        // 移动组件
        this.ETRoot.AddComponent(PlayerComponent);
        this.ETRoot.AddComponent(DrawComponent);
        // this.ETRoot.AddComponent(RoundManagerComponent);
        this.ETRoot.AddComponent(CombinationManagerComponent);
        // this.ETRoot.AddComponent(EnemyManagerComponent);
        this.ETRoot.AddComponent(BuildingManagerComponent);
        // modifier_task.apply(this, this);
        // modifier_test.apply(this, this);

        // 延遲1帧
        TimerHelper.addFrameTimer(1, () => {
            let playerid = this.GetPlayerID();
            // 设置出生点
            let startPoint = PlayerState.HeroSpawnPoint[playerid];
            let a = GetGroundPosition(startPoint, this);
            this.SetAbsOrigin(a);
            CenterCameraOnUnit(playerid, this);
        });

        // TimerHelper.addTimer(2, () => {
        // MiniMapHelper.updatePlayerOnMiniForPlayer(this.GetPlayerID(), this.GetPlayerID())
        // }, this)
    }

    Activate() {
        LogHelper.print("courier_base");
    }
}
