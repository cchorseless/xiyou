import { NetTablesHelper } from "../../helper/NetTablesHelper";
import { ET, serializeETProps } from "../../shared/lib/Entity";


export class BaseEntityRoot extends ET.EntityRoot {
    @serializeETProps()
    readonly ConfigID: string;
    @serializeETProps()
    readonly EntityId: EntityIndex;
    public GetPlayer() {
        return GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
    }

    public DelClientEntity(obj: ET.Entity): void {
        NetTablesHelper.DelETEntity(obj, this.BelongPlayerid);
    }

    public Dispose(): void {
        if (this.IsDisposed()) { return };
        NetTablesHelper.DelETEntity(this, this.BelongPlayerid);
        super.Dispose();
    }

    public GetDistance2Player() {
        let playerorgin = this.GetPlayer().Hero.GetAbsOrigin();
        let selfv = this.GetDomain<IBaseNpc_Plus>().GetAbsOrigin();
        return ((playerorgin - selfv) as Vector).Length2D();
    }
}
