import { GameEnum } from "../../../GameEnum";
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { EntityHelper } from "../../../helper/EntityHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BuildingRuntimeEntityRoot } from "../../../rules/Components/Building/BuildingRuntimeEntityRoot";
import { RoundPrizeUnitEntityRoot } from "../../../rules/Components/Round/RoundPrizeUnitEntityRoot";
import { MapState } from "../../../rules/System/Map/MapState";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_remnant } from "../../modifier/battle/modifier_remnant";
import { modifier_tp } from "../../modifier/modifier_tp";

// 自动寻宝
@registerAbility()
export class building_auto_findtreasure extends BaseAbility_Plus {
    GetBehavior() {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE;
    }
    public IsAutoCast: boolean = true;
    GetCooldown(iLevel: number) {
        return 1;
    }
    StartFindTreasure() {
        let owner = this.GetOwnerPlus();
        modifier_auto_findtreasure.applyOnly(owner, owner, this);
    }

    IsFinding() {
        let hParent = this.GetOwnerPlus();
        return modifier_auto_findtreasure.exist(hParent);
    }

    GoBackBoard() {
        let hParent = this.GetOwnerPlus();
        let modifier = modifier_auto_findtreasure.findIn(hParent);
        modifier.StopFindTreasure();
        let building = hParent.ETRoot.As<BuildingRuntimeEntityRoot>();
        let boardV = building.ChessComp().ChessVector;
        let t_p = GameRules.Addon.ETRoot.ChessControlSystem().GetBoardGirdCenterVector3(boardV);
        modifier_tp.TeleportToPoint(hParent, null, GetGroundPosition(t_p, hParent));
        modifier_remnant.remove(hParent);
        modifier.Destroy();
        TimerHelper.addTimer(
            1.1,
            () => {
                building.OnBackBoardFromBaseRoom();
            },
            building
        );
    }
}

@registerModifier()
export class modifier_auto_findtreasure extends BaseModifier_Plus {
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }

    // CheckState() {
    //     let state = {
    //         [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
    //         [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
    //         [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
    //         [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
    //     };
    //     return state;
    // }
    public Init(params: ModifierTable) {
        if (IsServer() && params.IsOnCreated) {
            this.SetStackCount(3);
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
    findTimer: string;
    attackTarget: RoundPrizeUnitEntityRoot;
    AutoFindTreasure() {
        if (this.isWorking) {
            return;
        }
        this.isWorking = true;
        if (this.findTimer != null) {
            TimerHelper.removeTimer(this.findTimer);
            this.findTimer == null;
        }
        let hParent = this.GetParentPlus();
        let ability = this.GetAbilityPlus() as building_auto_findtreasure;
        let building = hParent.ETRoot.As<BuildingRuntimeEntityRoot>();
        let playerid = building.Playerid;
        let moveto = MapState.PlayerTpDoorPoint[playerid];
        this.findTimer = TimerHelper.addTimer(
            0.5,
            () => {
                if (building.ChessComp().isInBoard()) {
                    if (GameFunc.AsVector(moveto - hParent.GetAbsOrigin()).Length2D() > 60) {
                        hParent.MoveToPosition(moveto);
                    }
                } else if (building.ChessComp().isInBaseRoom()) {
                    if (this.attackTarget != null && !this.attackTarget.IsDisposed()) {
                    } else {
                        let targetnpc = this.FindOneTarget();
                        this.attackTarget = targetnpc;
                        if (targetnpc == null) {
                            ability.GoBackBoard();
                            return;
                        } else {
                            GameFunc.ExecuteOrder(hParent, dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET, targetnpc.GetDomain<BaseNpc_Plus>(), null);
                        }
                    }
                }
                return 3;
            },
            this
        );
    }
    FindOneTarget() {
        let hParent = this.GetParentPlus();
        let targets = AoiHelper.FindEntityInRadius(DOTATeam_t.DOTA_TEAM_BADGUYS, hParent.GetAbsOrigin(), 1000, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY);
        targets = targets.filter((e) => {
            return e.ETRoot && e.ETRoot.AsValid<RoundPrizeUnitEntityRoot>("RoundPrizeUnitEntityRoot");
        });
        let targetnpc: RoundPrizeUnitEntityRoot = null;
        if (targets.length == 0) {
            let prizeUnits = GameRules.Addon.ETRoot.RoundSystem().randomRoundPrizeUnit();
            if (prizeUnits.length == 0) {
                return;
            } else {
                targetnpc = prizeUnits[0];
            }
        } else {
            targetnpc = GameFunc.ArrayFunc.RandomArray(targets)[0].ETRoot.As<RoundPrizeUnitEntityRoot>();
        }
        return targetnpc;
    }
    FinishOneTarget() {
        let count = this.GetStackCount();
        if (count > 1) {
            this.DecrementStackCount();
        } else {
            let ability = this.GetAbilityPlus() as building_auto_findtreasure;
            ability.GoBackBoard();
        }
    }

    StopFindTreasure() {
        if (!this.isWorking) {
            return;
        }
        this.isWorking = false;
        if (this.findTimer != null) {
            TimerHelper.removeTimer(this.findTimer);
            this.findTimer == null;
        }
        let hParent = this.GetParentPlus();
        hParent.Hold();
    }
}
