import { unit_base_baoxiang } from "../../npc/units/common/unit_base_baoxiang";
import { unit_portal } from "../../npc/units/common/unit_portal";
import { GameServiceConfig } from "../../shared/GameServiceConfig";
import { ET } from "../../shared/lib/Entity";

@GReloadable
export class MapSystemComponent extends ET.SingletonComponent {

    readonly PlayerTpDoorPoint: Vector[] = [];
    readonly BaseTpDoorPoint: Vector[] = [];
    readonly BaseBaoXiangPoint: Vector[] = [];
    readonly BaseBaoXiangBossPoint: Vector;
    // 基地房间最小点
    readonly BaseRoomMinPoint: Vector;
    readonly BaseRoomMaxPoint: Vector;

    readonly BaseVForwardPoint: Vector[] = [Vector(0, 1, 0), Vector(1, 1, 0), Vector(-1, 1, 0), Vector(1, 0, 0), Vector(-1, 0, 0)];
    readonly FakerHeroSpawnPoint: Vector[] = [];

    init() {
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
        (this.BaseBaoXiangBossPoint as any) = Entities.FindByName(null, "base_baoxiang_boss").GetAbsOrigin();
        let door1 = this.BaseTpDoorPoint[1];
        (this.BaseRoomMinPoint as any) = Vector(door1.x - 400, door1.y - 300, door1.z);
        let door4 = this.BaseTpDoorPoint[4];
        (this.BaseRoomMaxPoint as any) = Vector(door4.x + 400, door4.y * 2, door4.z);

        this.InitPrizeUnitRefreshZone();
    }

    readonly BaseRoomPrizeUnitRefreshZone: [number, number, number, number];
    private InitPrizeUnitRefreshZone() {
        let minx = 0;
        let miny = 0;
        let maxx = 0;
        let maxy = 0;
        for (let pos of this.BaseTpDoorPoint) {
            minx = math.min(minx, pos.x);
            miny = math.min(miny, pos.y);
            maxx = math.max(maxx, pos.x);
            maxy = math.max(maxy, pos.y);
        }
        minx += 128;
        miny += 128;
        maxx -= 128;
        maxy -= 128;
        (this.BaseRoomPrizeUnitRefreshZone as any) = [minx, miny, maxx, maxy];
    }


    public onAwake(...args: any[]): void {
        this.init();
        this.addEvent();
    }

    public addEvent() { }

    public getFakerHeroSpawnPoint(player: PlayerID) {
        return this.FakerHeroSpawnPoint[player];
    }


    public StartGame() {
        this.CreateAllMapUnit();
    }

    public CreateAllMapUnit() {
        for (let i = 0; i < GameServiceConfig.GAME_MAX_PLAYER; i++) {
            let f_v = this.PlayerTpDoorPoint[i];
            let t_v = this.BaseTpDoorPoint[i];
            let forvard = this.BaseVForwardPoint[i];
            unit_portal.CreatePortal(f_v, t_v, Vector(0, -1, 0), "player_" + i);
            unit_portal.CreatePortal(t_v, f_v, this.BaseVForwardPoint[i], "base_" + i, DOTATeam_t.DOTA_TEAM_BADGUYS);
            let baoxiang = unit_base_baoxiang.CreateOne(this.BaseBaoXiangPoint[i], DOTATeam_t.DOTA_TEAM_GOODGUYS, true, null, null);
            baoxiang.SetForwardVector(forvard);
        }
    }
}
declare global {
    /**
     * @ServerOnly
     */
    var GMapSystem: typeof MapSystemComponent;
}
if (_G.GMapSystem == undefined) {
    _G.GMapSystem = MapSystemComponent;
}