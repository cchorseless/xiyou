
import { AoiHelper } from "../../helper/AoiHelper";
import { EventHelper } from "../../helper/EventHelper";
import { ChessControlConfig } from "../../shared/ChessControlConfig";
import { GameServiceConfig } from "../../shared/GameServiceConfig";
import { ET } from "../../shared/lib/Entity";
import { ChessVector } from "../Components/ChessControl/ChessVector";

@GReloadable
export class ChessControlSystemComponent extends ET.SingletonComponent {
    public onAwake(...args: any[]): void {
        this.addEvent();
    }

    private addEvent() {
        /**移动棋子 */
        EventHelper.addProtocolEvent(ChessControlConfig.EProtocol.pick_chess_position, GHandler.create(this, (event: CLIENT_DATA<ChessControlConfig.I.pick_chess_position>) => {
            let playersys = GPlayerEntityRoot.GetOneInstance(event.PlayerID);
            let v = Vector(event.data.x, event.data.y, event.data.z);
            let entity = EntIndexToHScript(event.data.entityid as EntityIndex) as IBaseNpc_Plus;
            if (!IsValid(entity) || entity.ETRoot == null || !entity.ETRoot.AsValid<IBuildingEntityRoot>("BuildingEntityRoot")) {
                [event.state, event.message] = [false, "cant find entity"];
            } else {
                [event.state, event.message] = playersys.BuildingManager().moveBuilding(entity.ETRoot.As<IBuildingEntityRoot>(), v);
            }
            if (!event.state) {
                EventHelper.ErrorMessage(event.message, event.PlayerID)
            }
        }));
    }

    public BoardMaxVector3: { [playerid: string]: Vector } = {};
    public BoardMinVector3: { [playerid: string]: Vector } = {};
    public Board8x10MaxVector3: { [playerid: string]: Vector } = {};
    public Board8x10MinVector3: { [playerid: string]: Vector } = {};
    public BoardStandbyMaxVector3: { [playerid: string]: Vector } = {};
    public BoardStandbyMinVector3: { [playerid: string]: Vector } = {};

    public GetPlayerfirstSpawnPoint(playerid: PlayerID) {
        return GPlayerEntityRoot.HeroSpawnPoint[playerid];
    }

    public GetBoardMaxVector3(playerid: PlayerID) {
        if (this.BoardMaxVector3[playerid + ""]) {
            return this.BoardMaxVector3[playerid + ""];
        }
        let spawn = this.GetPlayerfirstSpawnPoint(playerid);
        let max_x = ChessControlConfig.Gird_Width * (ChessControlConfig.Gird_Max_X + 1.5);
        let max_y = ChessControlConfig.Gird_Height * (ChessControlConfig.Gird_Max_Y + 4.5);
        this.BoardMaxVector3[playerid + ""] = Vector(spawn.x + max_x, spawn.y + max_y, 128);
        return this.BoardMaxVector3[playerid + ""];
    }
    public GetBoardMinVector3(playerid: PlayerID) {
        if (this.BoardMinVector3[playerid + ""]) {
            return this.BoardMinVector3[playerid + ""];
        }
        let spawn = this.GetPlayerfirstSpawnPoint(playerid);
        let min_x = ChessControlConfig.Gird_Width * 2.5;
        let min_y = ChessControlConfig.Gird_Height * 1.5;
        this.BoardMinVector3[playerid + ""] = Vector(spawn.x - min_x, spawn.y - min_y, 128);
        return this.BoardMinVector3[playerid + ""];
    }
    public GetBoard8x10MaxVector3(playerid: PlayerID) {
        if (this.Board8x10MaxVector3[playerid + ""]) {
            return this.Board8x10MaxVector3[playerid + ""];
        }
        let spawn = this.GetPlayerfirstSpawnPoint(playerid);
        let max_x = ChessControlConfig.Gird_Width * (ChessControlConfig.Gird_Max_X - 1 + 0.5);
        let max_y = ChessControlConfig.Gird_Height * (ChessControlConfig.Gird_Max_Y - 1 + 0.5);
        this.Board8x10MaxVector3[playerid + ""] = Vector(spawn.x + max_x, spawn.y + 1600 - 1152 + max_y, 128);
        return this.Board8x10MaxVector3[playerid + ""];
    }
    public GetBoard8x10MinVector3(playerid: PlayerID) {
        if (this.Board8x10MinVector3[playerid + ""]) {
            return this.Board8x10MinVector3[playerid + ""];
        }
        let spawn = this.GetPlayerfirstSpawnPoint(playerid);
        let min_x = ChessControlConfig.Gird_Width * 0.5;
        let min_y = ChessControlConfig.Gird_Height * 0.5;
        this.Board8x10MinVector3[playerid + ""] = Vector(spawn.x - min_x, spawn.y + 1600 - 1152 - min_y, 128);
        return this.Board8x10MinVector3[playerid + ""];
    }

    public GetBoardStandbyMaxVector3(playerid: PlayerID) {
        if (this.BoardStandbyMaxVector3[playerid + ""]) {
            return this.BoardStandbyMaxVector3[playerid + ""];
        }
        let spawn = this.GetPlayerfirstSpawnPoint(playerid);
        let max_x = ChessControlConfig.Gird_Width * (ChessControlConfig.Gird_Max_X - 1 + 0.5);
        let max_y = ChessControlConfig.Gird_Height * 0.5;
        this.BoardStandbyMaxVector3[playerid + ""] = Vector(spawn.x + max_x, spawn.y + max_y, 128);
        return this.BoardStandbyMaxVector3[playerid + ""];
    }
    public GetBoardStandbyMinVector3(playerid: PlayerID) {
        if (this.BoardStandbyMinVector3[playerid + ""]) {
            return this.BoardStandbyMinVector3[playerid + ""];
        }
        let spawn = this.GetPlayerfirstSpawnPoint(playerid);
        let min_x = ChessControlConfig.Gird_Width * 0.5;
        let min_y = ChessControlConfig.Gird_Height * 0.5;
        this.BoardStandbyMinVector3[playerid + ""] = Vector(spawn.x - min_x, spawn.y - min_y, 128);
        return this.BoardStandbyMinVector3[playerid + ""];
    }

    public GetBoardEmptyGirdRandomAround(v: ChessVector) {
        let distance = 1;
        while (distance <= 10) {
            let circle = this.GetBoardGirdAroundCircle(v, ChessControlConfig.Gird_Width * distance);
            for (let k of circle) {
                if (this.IsBoardEmptyGird(k) && !this.IsBlinkTargetGird(k)) {
                    return k;
                }
            }
            distance++;
        }
    }
    public GetBoardEmptyGirdRandom(playerid: PlayerID, isincludeEnemy: boolean, isincludeplayer: boolean) {
        let max_y = ChessControlConfig.Gird_Max_Y;
        if (!isincludeEnemy) {
            max_y = ChessControlConfig.ChessValid_Max_Y;
        }
        let min_y = 1;
        if (!isincludeplayer) {
            min_y = ChessControlConfig.ChessValid_Max_Y;
        }
        let x = RandomInt(0, ChessControlConfig.Gird_Max_X);
        let y = RandomInt(min_y, max_y);
        let v = new ChessVector(x, y, playerid);
        let distance = 1;
        while (distance <= 10) {
            let circle = this.GetBoardGirdAroundCircle(v, ChessControlConfig.Gird_Width * distance);
            for (let k of circle) {
                if (this.IsBoardEmptyGird(k) && !this.IsBlinkTargetGird(k)) {
                    return k;
                }
            }
            distance++;
        }
    }

    public GetBoardGirdAroundCircle(v: ChessVector, distance: number) {
        let r: ChessVector[] = [];
        let centerX = math.floor(v.x);
        let centerY = math.floor(v.y);
        let playerid = v.playerid;
        let circle = math.floor(distance / ChessControlConfig.Gird_Width);
        if (circle < 1) { circle = 1 }
        while (circle > 0) {
            if (centerX - circle > 0) {
                if (centerY - circle >= 1) {
                    r.push(new ChessVector(centerX - circle, centerY - circle, playerid));
                }
                r.push(new ChessVector(centerX - circle, centerY, playerid));
                if (centerY + circle < ChessControlConfig.Gird_Max_Y) {
                    r.push(new ChessVector(centerX - circle, centerY + circle, playerid));
                }
            }
            if (centerY - circle >= 1) {
                r.push(new ChessVector(centerX, centerY - circle, playerid));
            }
            if (centerY + circle < ChessControlConfig.Gird_Max_Y) {
                r.push(new ChessVector(centerX, centerY + circle, playerid));
            }
            if (centerX + circle < ChessControlConfig.Gird_Max_X) {
                if (centerY - circle >= 1) {
                    r.push(new ChessVector(centerX + circle, centerY - circle, playerid));
                }
                r.push(new ChessVector(centerX + circle, centerY, playerid));
                if (centerY + circle < ChessControlConfig.Gird_Max_Y) {
                    r.push(new ChessVector(centerX + circle, centerY + circle, playerid));
                }
            }
            circle--;
        }
        return r;
    }
    // x ,y playerid
    public GetBoardGirdCenterVector3(v: ChessVector) {
        let playerid = v.playerid as PlayerID;
        let minv: Vector;
        let x: number;
        let y: number;
        if (v.y < 1 && v.y >= 0) {
            minv = this.GetBoardStandbyMinVector3(playerid);
            x = minv.x + ChessControlConfig.Gird_Width * (v.x + 0.5);
            y = minv.y + ChessControlConfig.Gird_Height * 0.5;
        } else {
            minv = this.GetBoard8x10MinVector3(playerid);
            x = minv.x + ChessControlConfig.Gird_Width * (v.x + 0.5);
            y = minv.y + ChessControlConfig.Gird_Height * (v.y - 1 + 0.5);
        }
        return Vector(x, y, 128);
    }

    public FindBoardInGirdChess(v: ChessVector) {
        let playerid = v.playerid as PlayerID;
        if (!GPlayerEntityRoot.IsValidPlayer(playerid)) {
            return;
        }
        let v3 = this.GetBoardGirdCenterVector3(v);
        let npcarr = AoiHelper.FindEntityInRadius(
            DOTATeam_t.DOTA_TEAM_GOODGUYS,
            v3,
            ChessControlConfig.Gird_Width / 2,
            null,
            DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH
            // DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            // DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
        );
        let r: IBuildingEntityRoot[] = [];
        npcarr.forEach((npc) => {
            if (npc.ETRoot != null && npc.ETRoot.AsValid<IBuildingEntityRoot>("BuildingEntityRoot")) {
                r.push(npc.ETRoot.As<IBuildingEntityRoot>());
            }
        });
        return r;
    }

    private BlinkTargetGird: ChessVector[] = [];
    public IsBlinkTargetGird(v: ChessVector) {
        for (let k of this.BlinkTargetGird) {
            if (k.isSame(v)) {
                return true;
            }
        }
        return false;
    }
    public RegistBlinkTargetGird(v: ChessVector, isadd: boolean) {
        if (isadd) {
            if (!this.IsBlinkTargetGird(v)) {
                this.BlinkTargetGird.push(v);
            }
        } else {
            for (let i = 0; i < this.BlinkTargetGird.length; i++) {
                if (this.BlinkTargetGird[i].isSame(v)) {
                    this.BlinkTargetGird.splice(i, 1);
                    i--;
                }
            }
        }
    }

    public IsBoardEmptyGird(v: ChessVector) {
        return this.FindBoardInGirdChess(v).length === 0;
    }
    public IsInBaseRoom(v: Vector) {
        let minv = GMapSystem.GetInstance().BaseRoomMinPoint;
        let maxv = GMapSystem.GetInstance().BaseRoomMaxPoint;
        return v.x >= minv.x && v.x <= maxv.x && v.y >= minv.y && v.y <= maxv.y;
    }

    public IsInBoard(playerid: PlayerID, v: Vector) {
        let minv = this.GetBoardMinVector3(playerid);
        let maxv = this.GetBoardMaxVector3(playerid);
        return v.x >= minv.x && v.x <= maxv.x && v.y >= minv.y && v.y <= maxv.y;
    }

    public IsInBoard8x10(playerid: PlayerID, v: Vector) {
        let minv = this.GetBoard8x10MinVector3(playerid);
        let maxv = this.GetBoard8x10MaxVector3(playerid);
        return v.x >= minv.x && v.x <= maxv.x && v.y >= minv.y && v.y <= maxv.y;
    }

    public IsInBoardStandby(playerid: PlayerID, v: Vector) {
        let minv = this.GetBoardStandbyMinVector3(playerid);
        let maxv = this.GetBoardStandbyMaxVector3(playerid);
        return v.x >= minv.x && v.x <= maxv.x && v.y >= minv.y && v.y <= maxv.y;
    }

    public GetBoardLocalVector2(v: Vector, IsValidPlayer: boolean = true) {
        let playerlist: PlayerID[] = [];
        if (IsValidPlayer) {
            playerlist = GPlayerEntityRoot.GetAllPlayerid();
        } else {
            for (let i = 0; i < GameServiceConfig.GAME_MAX_PLAYER; i++) {
                playerlist.push(i as PlayerID);
            }
        }
        let playerid = -1;
        let x = -1;
        let y = -1;
        for (let _player of playerlist) {
            if (this.IsInBoard(_player, v)) {
                playerid = _player;
                if (this.IsInBoard8x10(_player, v)) {
                    let minv = this.GetBoard8x10MinVector3(_player);
                    x = math.floor((v.x - minv.x) / ChessControlConfig.Gird_Width);
                    y = math.floor((v.y - minv.y) / ChessControlConfig.Gird_Height) + 1;
                } else if (this.IsInBoardStandby(_player, v)) {
                    let minv = this.GetBoardStandbyMinVector3(_player);
                    x = math.floor((v.x - minv.x) / ChessControlConfig.Gird_Width);
                    y = 0;
                }
                return new ChessVector(x, y, playerid);
            }
        }
        return new ChessVector(x, y, playerid);
    }
}

declare global {
    /**
     * @ServerOnly
     */
    var GChessControlSystem: typeof ChessControlSystemComponent;
}
if (_G.GChessControlSystem == undefined) {
    _G.GChessControlSystem = ChessControlSystemComponent;
}