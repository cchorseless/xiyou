import { ET, serializeETProps } from "../../shared/lib/Entity";


export class BaseEntityRoot extends ET.EntityRoot {
    @serializeETProps()
    readonly ConfigID: string;
    @serializeETProps()
    readonly EntityId: EntityIndex;
    public GetPlayer() {
        return GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
    }
    public GetDistance2Player() {
        let playerorgin = this.GetPlayer().Hero.GetAbsOrigin();
        let selfv = this.GetDomain<IBaseNpc_Plus>().GetAbsOrigin();
        return ((playerorgin - selfv) as Vector).Length2D();
    }

    IsCourierRoot() {
        return false;
    }
}
