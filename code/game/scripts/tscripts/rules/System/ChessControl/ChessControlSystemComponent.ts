import { GameFunc } from "../../../GameFunc";
import { GameSetting } from "../../../GameSetting";
import { AoiHelper } from "../../../helper/AoiHelper";
import { EventHelper } from "../../../helper/EventHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { BuildingEntityRoot } from "../../Components/Building/BuildingEntityRoot";
import { ET, registerET } from "../../Entity/Entity";
import { MapState } from "../Map/MapState";
import { PlayerState } from "../Player/PlayerState";
import { ChessControlConfig } from "./ChessControlConfig";

@registerET()
export class ChessControlSystemComponent extends ET.Component {
    public onAwake(...args: any[]): void {
        this.addEvent();
    }

    private addEvent() {
        /**移动棋子 */
        EventHelper.addProtocolEvent(this, ChessControlConfig.EProtocol.pick_chess_position, (event: CLIENT_DATA<ChessControlConfig.I.pick_chess_position>) => {
            let v = Vector(event.data.x, event.data.y, event.data.z);
            let entity = EntIndexToHScript(event.data.entityid as EntityIndex) as BaseNpc_Plus;
            if (!GameFunc.IsValid(entity) || entity.ETRoot == null || !entity.ETRoot.AsValid<BuildingEntityRoot>("BuildingEntityRoot")) {
                [event.state, event.message] = [false, "cant find entity"];
            } else {
                [event.state, event.message] = GameRules.Addon.ETRoot.PlayerSystem().GetPlayer(event.PlayerID).ChessControlComp().moveChess(entity.ETRoot.As<BuildingEntityRoot>(), v);
            }
        });
    }

    public BoardMaxVector3: { [playerid: string]: Vector } = {};
    public BoardMinVector3: { [playerid: string]: Vector } = {};
    public Board8x10MaxVector3: { [playerid: string]: Vector } = {};
    public Board8x10MinVector3: { [playerid: string]: Vector } = {};
    public BoardStandbyMaxVector3: { [playerid: string]: Vector } = {};
    public BoardStandbyMinVector3: { [playerid: string]: Vector } = {};

    public GetPlayerfirstSpawnPoint(playerid: PlayerID) {
        return PlayerState.HeroSpawnPoint[playerid];
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
    public GetBoardGirdVector3(v: ChessControlConfig.ChessVector) {
        let playerid = v.playerid as PlayerID;
        let minv: Vector;
        let x: number;
        let y: number;
        if (v.y < 1 && v.y >= 0) {
            minv = this.GetBoardStandbyMinVector3(playerid);
            x = minv.x + ChessControlConfig.Gird_Width * (v.x + 0.5);
            y = minv.y + ChessControlConfig.Gird_Height * (v.y + 0.5);
        } else {
            minv = this.GetBoard8x10MinVector3(playerid);
            x = minv.x + ChessControlConfig.Gird_Width * (v.x + 0.5);
            y = minv.y + ChessControlConfig.Gird_Height * (v.y - 1 + 0.5);
        }
        return Vector(x, y, 128);
    }

    public GetBoardEmptyGirdRandom(v: ChessControlConfig.ChessVector) {
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

    public GetBoardGirdAroundCircle(v: ChessControlConfig.ChessVector, distance: number) {
        let r: ChessControlConfig.ChessVector[] = [];
        let centerX = math.floor(v.x);
        let centerY = math.floor(v.y);
        let playerid = v.playerid;
        let circle = math.floor(distance / ChessControlConfig.Gird_Width);
        while (circle > 0) {
            if (centerX - circle > 0) {
                if (centerY - circle >= 1) {
                    r.push(new ChessControlConfig.ChessVector(centerX - circle, centerY - circle, playerid));
                }
                r.push(new ChessControlConfig.ChessVector(centerX - circle, centerY, playerid));
                if (centerY + circle < ChessControlConfig.Gird_Max_Y) {
                    r.push(new ChessControlConfig.ChessVector(centerX - circle, centerY + circle, playerid));
                }
            }
            if (centerY - circle >= 1) {
                r.push(new ChessControlConfig.ChessVector(centerX, centerY - circle, playerid));
            }
            if (centerY + circle < ChessControlConfig.Gird_Max_Y) {
                r.push(new ChessControlConfig.ChessVector(centerX, centerY + circle, playerid));
            }
            if (centerX + circle < ChessControlConfig.Gird_Max_X) {
                if (centerY - circle >= 1) {
                    r.push(new ChessControlConfig.ChessVector(centerX + circle, centerY - circle, playerid));
                }
                r.push(new ChessControlConfig.ChessVector(centerX + circle, centerY, playerid));
                if (centerY + circle < ChessControlConfig.Gird_Max_Y) {
                    r.push(new ChessControlConfig.ChessVector(centerX + circle, centerY + circle, playerid));
                }
            }
            circle--;
        }
        return r;
    }
    // x ,y playerid
    public GetBoardGirdCenterVector3(v: ChessControlConfig.ChessVector) {
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

    public FindBoardInGirdChess(v: ChessControlConfig.ChessVector) {
        let playerid = v.playerid as PlayerID;
        if (!GameRules.Addon.ETRoot.PlayerSystem().IsValidPlayer(playerid)) {
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
        let r: BuildingEntityRoot[] = [];
        npcarr.forEach((npc) => {
            if (npc.ETRoot != null && npc.ETRoot.AsValid<BuildingEntityRoot>("BuildingEntityRoot")) {
                r.push(npc.ETRoot.As<BuildingEntityRoot>());
            }
        });
        return r;
    }

    private BlinkTargetGird: ChessControlConfig.ChessVector[] = [];
    public IsBlinkTargetGird(v: ChessControlConfig.ChessVector) {
        for (let k of this.BlinkTargetGird) {
            if (k.isSame(v)) {
                return true;
            }
        }
        return false;
    }
    public RegistBlinkTargetGird(v: ChessControlConfig.ChessVector, isadd: boolean) {
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

    public IsBoardEmptyGird(v: ChessControlConfig.ChessVector) {
        return this.FindBoardInGirdChess(v).length === 0;
    }
    public IsInBaseRoom(v: Vector) {
        let minv = MapState.BaseRoomMinPoint;
        let maxv = MapState.BaseRoomMaxPoint;
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
            playerlist = GameRules.Addon.ETRoot.PlayerSystem().GetAllPlayerid();
        } else {
            for (let i = 0; i < GameSetting.GAME_MAX_PLAYER; i++) {
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
                return new ChessControlConfig.ChessVector(x, y, playerid);
            }
        }
        return new ChessControlConfig.ChessVector(x, y, playerid);
    }
}
