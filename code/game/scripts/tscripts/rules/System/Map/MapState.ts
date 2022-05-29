import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";

export class MapState {
    static readonly PlayerTpDoorPoint: Vector[] = [];
    static readonly BaseTpDoorPoint: Vector[] = [];
    static readonly BaseBaoXiangPoint: Vector[] = [];
    static readonly BaseBaoXiangBossPoint: Vector;

    static init() {
        // 传送门
        this.PlayerTpDoorPoint.push(Entities.FindByName(null, "player_tp_door00").GetAbsOrigin());
        this.PlayerTpDoorPoint.push(Entities.FindByName(null, "player_tp_door01").GetAbsOrigin());
        this.PlayerTpDoorPoint.push(Entities.FindByName(null, "player_tp_door02").GetAbsOrigin());
        this.PlayerTpDoorPoint.push(Entities.FindByName(null, "player_tp_door03").GetAbsOrigin());
        this.PlayerTpDoorPoint.push(Entities.FindByName(null, "player_tp_door04").GetAbsOrigin());

        this.BaseTpDoorPoint.push(Entities.FindByName(null, "base_tp_door00").GetAbsOrigin());
        this.BaseTpDoorPoint.push(Entities.FindByName(null, "base_tp_door01").GetAbsOrigin());
        this.BaseTpDoorPoint.push(Entities.FindByName(null, "base_tp_door02").GetAbsOrigin());
        this.BaseTpDoorPoint.push(Entities.FindByName(null, "base_tp_door03").GetAbsOrigin());
        this.BaseTpDoorPoint.push(Entities.FindByName(null, "base_tp_door04").GetAbsOrigin());

        this.BaseBaoXiangPoint.push(Entities.FindByName(null, "base_baoxiang00").GetAbsOrigin());
        this.BaseBaoXiangPoint.push(Entities.FindByName(null, "base_baoxiang01").GetAbsOrigin());
        this.BaseBaoXiangPoint.push(Entities.FindByName(null, "base_baoxiang02").GetAbsOrigin());
        this.BaseBaoXiangPoint.push(Entities.FindByName(null, "base_baoxiang03").GetAbsOrigin());
        this.BaseBaoXiangPoint.push(Entities.FindByName(null, "base_baoxiang04").GetAbsOrigin());

        (this as any).BaseBaoXiangBossPoint = Entities.FindByName(null, "base_baoxiang_boss").GetAbsOrigin();
    }

}
