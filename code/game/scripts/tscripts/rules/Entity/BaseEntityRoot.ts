import { NetTablesHelper } from "../../helper/NetTablesHelper";
import { BaseNpc_Plus } from "../../npc/entityPlus/BaseNpc_Plus";
import { ET, serializeETProps } from "./Entity";


export class BaseEntityRoot extends ET.EntityRoot {
    @serializeETProps()
    readonly Playerid: PlayerID;
    @serializeETProps()
    readonly ConfigID: string;
    @serializeETProps()
    readonly EntityId: EntityIndex;
    public GetPlayer() {
        return GPlayerSystem.GetInstance().GetPlayer(this.Playerid);
    }

    static SyncClientEntity(obj: ET.Entity, ignoreChild: boolean = false): void {
        let etroot = obj.GetDomain().ETRoot;
        if (etroot) {
            etroot.As<BaseEntityRoot>().SyncClientEntity(obj, ignoreChild);
        }
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
