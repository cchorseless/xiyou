import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { PlayerSystem } from "../../System/Player/PlayerSystem";

export class PlayerCreateUnitEntityRoot extends ET.EntityRoot {
    readonly Playerid: PlayerID;
    readonly ConfigID: string;
    public GetPlayer() {
        return PlayerSystem.GetPlayer(this.Playerid);
    }
    public Dispose(): void {
        let npc = this.GetDomain<BaseNpc_Plus>();
        super.Dispose();
        npc.SafeDestroy();
    }

    public GetDistance2Player() {
        let playerorgin = this.GetPlayer().GetDomain<BaseNpc_Hero_Plus>().GetAbsOrigin();
        let selfv = this.GetDomain<BaseNpc_Hero_Plus>().GetAbsOrigin();
        return ((playerorgin - selfv) as Vector).Length2D();
    }
}
