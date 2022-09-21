import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseAbility_Plus } from "../../../npc/entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, serializeETProps } from "../../Entity/Entity";

export enum PlayerCreateUnitType {
    BaseNpc = "BaseNpc",
    BaseItem = "BaseItem",
    BaseAbility = "BaseAbility",
}
export class PlayerCreateUnitEntityRoot extends ET.EntityRoot {
    @serializeETProps()
    readonly Playerid: PlayerID;
    @serializeETProps()
    readonly ConfigID: string;
    @serializeETProps()
    readonly EntityId: EntityIndex;
    public GetPlayer() {
        return GameRules.Addon.ETRoot.PlayerSystem().GetPlayer(this.Playerid);
    }
    public SyncClientEntity(obj: ET.Entity, ignoreChild: boolean = false): void {
        this.GetPlayer().SyncClientEntity(obj, ignoreChild);
    }
    public DelClientEntity(obj: ET.Entity): void {
        NetTablesHelper.DelETEntity(obj, this.Playerid);
    }
    public Dispose(): void {
        if (this.IsDisposed()) { return };
        NetTablesHelper.DelETEntity(this, this.Playerid);
        super.Dispose();
    }

    public GetDistance2Player() {
        let playerorgin = this.GetPlayer().Hero.GetAbsOrigin();
        let selfv = this.GetDomain<BaseNpc_Plus>().GetAbsOrigin();
        return ((playerorgin - selfv) as Vector).Length2D();
    }
}
