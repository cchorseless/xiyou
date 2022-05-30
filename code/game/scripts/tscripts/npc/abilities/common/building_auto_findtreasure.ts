import { GameEnum } from "../../../GameEnum";
import { GameFunc } from "../../../GameFunc";
import { EntityHelper } from "../../../helper/EntityHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BuildingEntityRoot } from "../../../rules/Components/Building/BuildingEntityRoot";
import { MapState } from "../../../rules/System/Map/MapState";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 自动寻宝
@registerAbility()
export class building_auto_findtreasure extends BaseAbility_Plus {
    GetBehavior() {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE;
    }
    public IsAutoCast: boolean = true;
    GetIntrinsicModifierName() {
        return modifier_auto_findtreasure.name;
    }
}

@registerModifier()
export class modifier_auto_findtreasure extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    public Init(params: ModifierTable) {
        if (IsServer() && params.IsOnCreated) {
            TimerHelper.addTimer(
                0.1,
                () => {
                    this.CheckIntervalThink();
                    return 0.1;
                },
                this,
                true
            );
        }
    }

    CheckIntervalThink() {
        let hParent = this.GetParentPlus();
        let hAbility = this.GetAbilityPlus();
        if (GameFunc.IsValid(hParent)) {
            if (GameFunc.IsValid(hAbility) && hAbility.IsCooldownReady()) {
                if (hAbility.GetAutoCastState()) {
                    this.AutoFindTreasure();
                } else {
                    this.StopFindTreasure();
                }
            }
        }
    }
    isWorking: boolean = false;
    AutoFindTreasure() {
        if (this.isWorking) {
            return;
        }
        this.isWorking = true;
        let hParent = this.GetParentPlus();
        let building = hParent.ETRoot.As<BuildingEntityRoot>();
        let playerid = building.Playerid;
        if (building.ChessComp().isInBoard()) {
            let moveto = MapState.PlayerTpDoorPoint[playerid];
            GameFunc.ExecuteOrder(hParent, dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION, null, null, moveto);
        } else if (building.ChessComp().isInBaseRoom()) {
        }
    }

    StopFindTreasure() {
        if (!this.isWorking) {
            return;
        }
        this.isWorking = false;
        let hParent = this.GetParentPlus();
        hParent.Hold();
    }
}
