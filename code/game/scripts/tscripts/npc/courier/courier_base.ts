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
import { RoundManagerComponent } from "../../rules/Components/Round/RoundManagerComponent";
import { CombinationManagerComponent } from "../../rules/Components/Combination/CombinationManagerComponent";
import { PlayerState } from "../../rules/System/Player/PlayerState";
import { BuildingManagerComponent } from "../../rules/Components/Building/BuildingManagerComponent";
import { DrawComponent } from "../../rules/Components/Draw/DrawComponent";
import { ChessControlComponent } from "../../rules/Components/ChessControl/ChessControlComponent";
import { courier_challenge_wood } from "../abilities/courier/courier_base/courier_challenge_wood";
import { courier_challenge_gold } from "../abilities/courier/courier_base/courier_challenge_gold";
import { courier_challenge_equip } from "../abilities/courier/courier_base/courier_challenge_equip";
import { courier_challenge_artifact } from "../abilities/courier/courier_base/courier_challenge_artifact";
import { BaseAbility_Plus } from "../entityPlus/BaseAbility_Plus";
@registerUnit()
export class courier_base extends BaseNpc_Hero_Plus {
    Spawn(entityKeyValues: CScriptKeyValues) {
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
        let ability1 = this.AddAbility(courier_challenge_gold.name);
        let ability2 = this.AddAbility(courier_challenge_wood.name);
        let ability3 = this.AddAbility(courier_challenge_equip.name);
        let ability4 = this.AddAbility(courier_challenge_artifact.name);
        this.ActiveHiddenAbility(ability1);
        this.ActiveHiddenAbility(ability2);
        this.ActiveHiddenAbility(ability3);
        this.ActiveHiddenAbility(ability4);
        this.SetIdleAcquire(false);
    }

    ActiveHiddenAbility(ability: CDOTABaseAbility) {
        ability.SetActivated(true);
        ability.SetLevel(1);
    }

    onSpawned() {
        if (!IsServer()) {
            return;
        }
        // 开局会创建多个英雄，系统一会删除掉
        if (!this.IsValidHero()) {
            return;
        }
        GameRules.Addon.ETRoot.PlayerSystem().GetPlayer(this.GetPlayerID()).BindHero(this);
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
        LogHelper.print("courier_base :=>", this.GetPlayerID());
    }

    IsValidHero() {
        return GameRules.Addon.ETRoot.PlayerSystem().GetPlayer(this.GetPlayerID()).Hero == null;
    }
}
