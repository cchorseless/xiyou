import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, serializeETProps } from "../../Entity/Entity";

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
    public Dispose(): void {
        if (this.IsDisposed()) { return };
        let npc = this.GetDomain<BaseNpc_Plus>();
        NetTablesHelper.DelETEntity(this, this.Playerid);
        super.Dispose();
        if (npc && !npc.__safedestroyed__) {
            npc.StartGesture(GameActivity_t.ACT_DOTA_DIE);
            TimerHelper.addTimer(
                3,
                () => {
                    npc.SafeDestroy();
                },
                this
            );
        }
    }

    public GetDistance2Player() {
        let playerorgin = this.GetPlayer().Hero.GetAbsOrigin();
        let selfv = this.GetDomain<BaseNpc_Plus>().GetAbsOrigin();
        return ((playerorgin - selfv) as Vector).Length2D();
    }
}
