
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
        EventHelper.addProtocolEvent(ChessControlConfig.EProtocol.pick_chess_position, GHandler.create(this, (event: CLIENT_DATA<IChessControlConfig.IPickChessPosition>) => {
            let playersys = GPlayerEntityRoot.GetOneInstance(event.PlayerID);
            let v = Vector(event.data.x, event.data.y, event.data.z);
            let entity = EntIndexToHScript(event.data.entityid as EntityIndex) as IBaseNpc_Plus;
            if (!IsValid(entity) || entity.ETRoot == null || !entity.ETRoot.AsValid<IBuildingEntityRoot>("BuildingEntityRoot")) {
                [event.state, event.message] = [false, "cant find entity"];
            } else {
                [event.state, event.message] = playersys.BuildingManager().moveBuilding(entity.ETRoot.As<IBuildingEntityRoot>(), v);
            }
            if (!event.state) {
                GNotificationSystem.ErrorMessage(event.message, event.PlayerID)
            }
        }));
    }

    public BoardMaxVector3: { [playerid: string]: Vector } = {};
    public BoardMinVector3: { [playerid: string]: Vector } = {};
    public Board8x10MaxVector3: { [playerid: string]: Vector } = {};
    public Board8x10MinVector3: { [playerid: string]: Vector } = {};
    public BoardStandbyMaxVector3: { [playerid: string]: Vector } = {};
    public BoardStandbyMinVector3: { [playerid: string]: Vector } = {};

    public changeToEndBossPos(v: ChessVector, isCourier = false): { pos: Vector, forward: Vector, angle: number } {
        const playerid = v.playerid + 1;
        const BaseBaoXiangBossPoint = GMapSystem.GetInstance().BaseBaoXiangBossPoint;
        const offVector = Vector(0, -1500, 0);
        const centerPos = BaseBaoXiangBossPoint + offVector as Vector;
        let pos = Vector(0, 0, 0);
        let forward = Vector(0, 1, 0);
        if (isCourier) {
            pos = centerPos + RandomVector(200) as Vector;
        }
        else {
            const centerX = (ChessControlConfig.Gird_Max_X - 1) / 2;
            const centerY = 1;
            const posX = ChessControlConfig.Gird_Width * (v.x - centerX) + centerPos.x;
            const posY = ChessControlConfig.Gird_Height * (v.y - centerY) + centerPos.y;
            const posZ = BaseBaoXiangBossPoint.z;
            pos = Vector(posX, posY, posZ);
        }
        const offsetAngle = [0, 90, 180, 270];
        if (playerid > 0) {
            pos = GFuncVector.Rotation2D(pos, offsetAngle[playerid], true, BaseBaoXiangBossPoint);
            forward = GFuncVector.Rotation2D(forward, offsetAngle[playerid], true);
        }
        return { pos: pos, forward: forward, angle: offsetAngle[playerid] };

    }
    // public GetPlayerfirstSpawnPoint(playerid: PlayerID) {
    //     return GPlayerEntityRoot.HeroSpawnPoint[playerid];
    // }
    public GetBoardZeroPoint(playerid: PlayerID) {
        let offset = Vector(ChessControlConfig.Gird_Width / 2, ChessControlConfig.Gird_Height / 2, 0)
        return GMapSystem.GetInstance().PlayerStartPoint[playerid] - offset as Vector;
    }
    public GetBoardMaxVector3(playerid: PlayerID) {
        if (this.BoardMaxVector3[playerid + ""]) {
            return this.BoardMaxVector3[playerid + ""];
        }
        let spawn = this.GetBoardZeroPoint(playerid);
        let extraoffx = 0;
        let extraoffy = 0;
        let max_x = ChessControlConfig.Gird_Width * (ChessControlConfig.Gird_Max_X + extraoffx);
        let max_y = ChessControlConfig.Gird_Height * (ChessControlConfig.Gird_Max_Y + extraoffy + ChessControlConfig.Gird_OffSet_Y + 1);
        this.BoardMaxVector3[playerid + ""] = Vector(spawn.x + max_x, spawn.y + max_y, 0);
        return this.BoardMaxVector3[playerid + ""];
    }
    public GetBoardMinVector3(playerid: PlayerID) {
        if (this.BoardMinVector3[playerid + ""]) {
            return this.BoardMinVector3[playerid + ""];
        }
        let spawn = this.GetBoardZeroPoint(playerid);
        let extraoffx = 0;
        let extraoffy = 0;
        let min_x = ChessControlConfig.Gird_Width * extraoffx;
        let min_y = ChessControlConfig.Gird_Height * extraoffy;
        this.BoardMinVector3[playerid + ""] = Vector(spawn.x - min_x, spawn.y - min_y, 0);
        return this.BoardMinVector3[playerid + ""];
    }
    public GetBoard8x10MaxVector3(playerid: PlayerID) {
        if (this.Board8x10MaxVector3[playerid + ""]) {
            return this.Board8x10MaxVector3[playerid + ""];
        }
        let spawn = this.GetBoardZeroPoint(playerid);
        let max_x = ChessControlConfig.Gird_Width * (ChessControlConfig.Gird_Max_X);
        let max_y = ChessControlConfig.Gird_Height * (ChessControlConfig.Gird_Max_Y + ChessControlConfig.Gird_OffSet_Y + 1);
        this.Board8x10MaxVector3[playerid + ""] = Vector(spawn.x + max_x, spawn.y + max_y, 0);
        return this.Board8x10MaxVector3[playerid + ""];
    }
    public GetBoard8x10MinVector3(playerid: PlayerID) {
        if (this.Board8x10MinVector3[playerid + ""]) {
            return this.Board8x10MinVector3[playerid + ""];
        }
        let spawn = this.GetBoardZeroPoint(playerid);
        let min_x = ChessControlConfig.Gird_Width * 0;
        let min_y = ChessControlConfig.Gird_Height * (ChessControlConfig.Gird_OffSet_Y + 1);
        this.Board8x10MinVector3[playerid + ""] = Vector(spawn.x - min_x, spawn.y + min_y, 0);
        return this.Board8x10MinVector3[playerid + ""];
    }

    public GetBoardStandbyMaxVector3(playerid: PlayerID) {
        if (this.BoardStandbyMaxVector3[playerid + ""]) {
            return this.BoardStandbyMaxVector3[playerid + ""];
        }
        let spawn = this.GetBoardZeroPoint(playerid);
        let max_x = ChessControlConfig.Gird_Width * (ChessControlConfig.Gird_Max_X);
        let max_y = ChessControlConfig.Gird_Height * 1;
        this.BoardStandbyMaxVector3[playerid + ""] = Vector(spawn.x + max_x, spawn.y + max_y, 0);
        return this.BoardStandbyMaxVector3[playerid + ""];
    }
    public GetBoardStandbyMinVector3(playerid: PlayerID) {
        if (this.BoardStandbyMinVector3[playerid + ""]) {
            return this.BoardStandbyMinVector3[playerid + ""];
        }
        let spawn = this.GetBoardZeroPoint(playerid);
        let min_x = ChessControlConfig.Gird_Width * 0;
        let min_y = ChessControlConfig.Gird_Height * 0;
        this.BoardStandbyMinVector3[playerid + ""] = Vector(spawn.x - min_x, spawn.y - min_y, 0);
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
    public GetBoardGirdVector3Plus(v: Vector) {
        return this.GetBoardGirdVector3(new ChessVector(v.x, v.y, v.z));
    }
    public GetBoardGirdVector3(v: ChessVector) {
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
            y = minv.y + ChessControlConfig.Gird_Height * (v.y - 0.5);
        }
        return Vector(x, y, 0);
    }
    public FindBoardInGirdChess(v: ChessVector) {
        let playerid = v.playerid as PlayerID;
        let playerroot = GGameScene.GetPlayer(playerid)
        if (!playerroot) {
            return;
        }
        let pos = this.GetBoardGirdVector3(v);
        let r: IBuildingEntityRoot[] = [];
        let allbuilding = playerroot.BuildingManager().getAllBuilding();
        for (let building of allbuilding) {
            let npcpos = building.GetDomain<IBaseNpc_Plus>().GetAbsOrigin();
            if (GFuncVector.CalculateDistance(npcpos, pos) <= ChessControlConfig.Gird_Width * 0.5) {
                r.push(building)
            }
        };
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
    public IsBoardEmptyGirdByVector(playerid: PlayerID, v: Vector) {
        let playerroot = GGameScene.GetPlayer(playerid)
        let allbuilding = playerroot.BuildingManager().getAllBuilding();
        for (let building of allbuilding) {
            let npcpos = building.GetDomain<IBaseNpc_Plus>().GetAbsOrigin();
            if (GFuncVector.CalculateDistance(npcpos, v) <= ChessControlConfig.Gird_Width * 0.5) {
                return false
            }
        };
        return true
    }
    public IsBoardEmptyGird(v: ChessVector) {
        return this.FindBoardInGirdChess(v).length == 0;
    }
    public IsInBaseRoom(v: Vector) {
        let minv = GMapSystem.GetInstance().BaseRoomMinPoint;
        let maxv = GMapSystem.GetInstance().BaseRoomMaxPoint;
        return v.x >= minv.x && v.x <= maxv.x && v.y >= minv.y && v.y <= maxv.y;
    }
    /**
     * 在棋盘内
     * @param playerid 
     * @param v 
     * @returns 
     */
    public IsInBoard(playerid: PlayerID, v: Vector) {
        let minv = this.GetBoardMinVector3(playerid);
        let maxv = this.GetBoardMaxVector3(playerid);
        return v.x >= minv.x && v.x <= maxv.x && v.y >= minv.y && v.y <= maxv.y;
    }
    /**
     * 在战斗区
     * @param playerid 
     * @param v 
     * @returns 
     */
    public IsInBoard8x10(playerid: PlayerID, v: Vector) {
        let minv = this.GetBoard8x10MinVector3(playerid);
        let maxv = this.GetBoard8x10MaxVector3(playerid);
        return v.x >= minv.x && v.x <= maxv.x && v.y >= minv.y && v.y <= maxv.y;
    }
    /**
     * 在等待区
     * @param playerid 
     * @param v 
     * @returns 
     */
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