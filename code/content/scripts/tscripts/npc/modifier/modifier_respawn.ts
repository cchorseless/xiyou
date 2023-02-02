import { BaseModifier_Plus } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../propertystat/modifier_event";

@registerModifier()
export class modifier_respawn extends BaseModifier_Plus {
    IsHidden() { return false }
    IsDebuff() { return true }
    IsPurgable() { return false }
    IsPurgeException() { return true }
    IsStunDebuff() { return false }
    AllowIllusionDuplicate() { return false }

    IsPermanent() { return true }

    /**复活时间 */
    respawnTime: number = 3;
    /**复活handler */
    respawnHandler: () => void;
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.respawnTime = params.respawnTime || this.respawnTime;
            this.GetParentPlus().SetUnitCanRespawn(true);
        }

    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    onSelfDeath(event: ModifierInstanceEvent) {
        if (this.GetParentPlus().UnitCanRespawn()) {
            let parent = this.GetParentPlus();
            let time = this.respawnTime
            GTimerHelper.AddTimer(time, GHandler.create(this, () => {
                parent.RespawnUnit();
                if (this.respawnHandler) {
                    this.respawnHandler()
                }
            }))
        }
    }

}

