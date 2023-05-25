import { BaseNpc_Plus } from "../../npc/entityPlus/BaseNpc_Plus";
import { modifier_portal } from "../../npc/modifier/modifier_portal";
import { ChessControlConfig } from "../../shared/ChessControlConfig";
import { GameServiceConfig } from "../../shared/GameServiceConfig";
import { ET } from "../../shared/lib/Entity";
import { ChessVector } from "../Components/ChessControl/ChessVector";

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
    readonly AllChessGirdEntity: { [playerid: string]: { [x: string]: { [y: string]: CBaseModelEntity } } } = {};

    Init() {
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
        this.Init();
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
            if (!PlayerResource.IsValidPlayer(i)) {
                continue;
            }
            let playerroot = GGameScene.GetPlayer(i)
            let f_v = this.PlayerTpDoorPoint[i];
            let t_v = this.BaseTpDoorPoint[i];
            let forvard = this.BaseVForwardPoint[i];
            this.CreatePortal(f_v, t_v, Vector(0, -1, 0), "player_" + i);
            this.CreatePortal(t_v, f_v, this.BaseVForwardPoint[i], "base_" + i, DOTATeam_t.DOTA_TEAM_BADGUYS);
            // let baoxiang = BaseNpc_Plus.CreateUnitByName("unit_base_baoxiang", this.BaseBaoXiangPoint[i], null, true, DOTATeam_t.DOTA_TEAM_GOODGUYS);
            // baoxiang.SetForwardVector(forvard);
            this.AllChessGirdEntity[i + ""] = {};
            for (let x = 0; x < ChessControlConfig.Gird_Max_X; x++) {
                this.AllChessGirdEntity[i + ""][x + ""] = {};
                for (let y = 1; y <= ChessControlConfig.Gird_Max_Y; y++) {
                    let v = GChessControlSystem.GetInstance().GetBoardGirdVector3Plus(Vector(x, y, i));
                    let entity = SpawnEntityFromTableSynchronous("prop_dynamic", {
                        model: y <= 3 ? "maps/journey_assets/props/teams/logo_radiant_journey_small.vmdl" :
                            "maps/journey_assets/props/teams/logo_dire_journey_small.vmdl",
                    }) as CBaseModelEntity;
                    entity.SetModelScale(1.5)
                    entity.SetAbsOrigin(v + Vector(0, 0, 120) as Vector);
                    this.AllChessGirdEntity[i + ""][x + ""][y + ""] = entity;
                }

            }

            // "models/props_teams/logo_radiant_small.vmdl"
            // "maps/journey_assets/props/teams/logo_radiant_journey_small.vmdl"
            // "maps/journey_assets/props/teams/logo_dire_journey_small.vmdl"
        }
    }
    CreatePortal(vPortalPosition: Vector, vTargetPosition: Vector, vForward: Vector, sPortalName: string, team: DOTATeam_t = DOTATeam_t.DOTA_TEAM_GOODGUYS, bHasArrow: boolean = false) {
        let hPortal = BaseNpc_Plus.CreateUnitByName("unit_portal", vPortalPosition, null, true, team);
        hPortal.TempData().sPortalName = sPortalName;
        hPortal.SetForwardVector(vForward);
        hPortal.addSpawnedHandler(
            GHandler.create(this, () => {
                let sPosition = vTargetPosition.x + " " + vTargetPosition.y + " " + vTargetPosition.z;
                modifier_portal.applyOnly(hPortal, hPortal, null, { vPosition: sPosition });
            })
        );
        return hPortal;
    }

    /**
     * 修改到达目标点的路径
     * @param toPos 
     * @returns 
     */
    ChangeGirdPathToEgg(toPos: Vector) {
        const playerid = toPos.z;
        let startleftx = 0;
        let startlefty = 3;
        let vleftlist: ChessVector[] = [
            new ChessVector(2, ChessControlConfig.Gird_Max_Y, playerid),
            new ChessVector(1, ChessControlConfig.Gird_Max_Y, playerid),
        ];
        for (let y = ChessControlConfig.Gird_Max_Y; y >= startlefty; y--) {
            vleftlist.push(new ChessVector(startleftx, y, playerid));
        }

        while (startleftx != toPos.x || startlefty != toPos.y) {
            if (startleftx < toPos.x && (startlefty == toPos.y || RollPercentage(50))) {
                startleftx++;
                vleftlist.push(new ChessVector(startleftx, startlefty, playerid));
                continue;
            }
            if (startlefty > toPos.y) {
                startlefty--;
                vleftlist.push(new ChessVector(startleftx, startlefty, playerid));
            }
        }
        let startrightx = 7;
        let startrighty = 3;
        let vrightlist: ChessVector[] = [
            new ChessVector(5, ChessControlConfig.Gird_Max_Y, playerid),
            new ChessVector(6, ChessControlConfig.Gird_Max_Y, playerid),
        ];
        for (let y = ChessControlConfig.Gird_Max_Y; y >= startrighty; y--) {
            vrightlist.push(new ChessVector(startrightx, y, playerid));
        }
        while (startrightx != toPos.x || startrighty != toPos.y) {
            if (startrightx > toPos.x && (startrighty == toPos.y || RollPercentage(50))) {
                startrightx--;
                vrightlist.push(new ChessVector(startrightx, startrighty, playerid));
                continue;
            }
            if (startrighty > toPos.y) {
                startrighty--;
                vrightlist.push(new ChessVector(startrightx, startrighty, playerid));
            }
        }
        let allgird = this.AllChessGirdEntity[playerid + ""];
        for (let x in allgird) {
            for (let y of [1, 2, 3]) {
                let entity = allgird[x][y + ""];
                entity && entity.SetModel("maps/journey_assets/props/teams/logo_radiant_journey_small.vmdl");
                entity && entity.SetForwardVector(Vector(0, 1, 0));
            }
        }
        let vlist: ChessVector[] = [].concat(vleftlist, vrightlist);
        for (let i = 0; i < vlist.length; i++) {
            let v = vlist[i];
            let entity = allgird[v.x + ""][v.y + ""];
            if (entity) {
                if (v.x == toPos.x && v.y == toPos.y) {
                    entity.SetForwardVector(Vector(0, -1, 0));
                    entity.SetModel("models/props_teams/logo_radiant_newyear_small.vmdl");
                }
                else {
                    entity.SetModel("models/props_teams/logo_radiant_small.vmdl");
                }
            }
            if (i < vlist.length - 1) {
                if (v.x == toPos.x && v.y == toPos.y) { }
                else {
                    let v_next = vlist[i + 1];
                    if (v_next.x == v.x) {
                        if (v_next.y < v.y) {
                            entity.SetForwardVector(Vector(0, 1, 0));
                        }
                        else {
                            entity.SetForwardVector(Vector(0, -1, 0));
                        }
                    }
                    else if (v_next.y == v.y) {
                        if (v_next.x < v.x) {
                            entity.SetForwardVector(Vector(1, 0, 0));
                        }
                        else {
                            entity.SetForwardVector(Vector(-1, 0, 0));
                        }
                    }
                }

            }
        }
        return [vleftlist, vrightlist];

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