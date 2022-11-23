export class MapState {
    static readonly PlayerTpDoorPoint: Vector[] = [];
    static readonly BaseTpDoorPoint: Vector[] = [];
    static readonly BaseBaoXiangPoint: Vector[] = [];
    static readonly BaseBaoXiangBossPoint: Vector;
    // 基地房间最小点
    static readonly BaseRoomMinPoint: Vector;
    static readonly BaseRoomMaxPoint: Vector;

    static readonly BaseVForwardPoint: Vector[] = [Vector(0, 1, 0), Vector(1, 1, 0), Vector(-1, 1, 0), Vector(1, 0, 0), Vector(-1, 0, 0)];
    static readonly FakerHeroSpawnPoint: Vector[] = [];

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

        // 敵方出生點
        this.PlayerTpDoorPoint.forEach(s => {
            this.FakerHeroSpawnPoint.push(Vector(s.x + 500, s.y, s.z - 200))
        });
        (this as any).BaseBaoXiangBossPoint = Entities.FindByName(null, "base_baoxiang_boss").GetAbsOrigin();
        let door1 = this.BaseTpDoorPoint[1];
        (this as any).BaseRoomMinPoint = Vector(door1.x - 400, door1.y - 300, door1.z);
        let door4 = this.BaseTpDoorPoint[4];
        (this as any).BaseRoomMaxPoint = Vector(door4.x + 400, door4.y * 2, door4.z);

        this.InitPrizeUnitRefreshZone();
    }

    static readonly BaseRoomPrizeUnitRefreshZone: [number, number, number, number];
    private static InitPrizeUnitRefreshZone() {
        let minx = 0;
        let miny = 0;
        let maxx = 0;
        let maxy = 0;
        for (let pos of MapState.BaseTpDoorPoint) {
            minx = math.min(minx, pos.x);
            miny = math.min(miny, pos.y);
            maxx = math.max(maxx, pos.x);
            maxy = math.max(maxy, pos.y);
        }
        minx += 128;
        miny += 128;
        maxx -= 128;
        maxy -= 128;
        (this as any).BaseRoomPrizeUnitRefreshZone = [minx, miny, maxx, maxy];
    }
}
