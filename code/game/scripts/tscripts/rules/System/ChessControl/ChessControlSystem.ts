import { GameSetting } from "../../../GameSetting";
import { AoiHelper } from "../../../helper/AoiHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BuildingEntityRoot } from "../../Components/Building/BuildingEntityRoot";
import { PlayerState } from "../Player/PlayerState";
import { PlayerSystem } from "../Player/PlayerSystem";
import { ChessControlConfig } from "./ChessControlConfig";
import { ChessControlEventHandler } from "./ChessControlEventHandler";

export class ChessControlSystem {
    public static init() {
        ChessControlEventHandler.startListen(ChessControlSystem);
    }

    public static BoardMaxVector3: { [playerid: string]: Vector } = {};
    public static BoardMinVector3: { [playerid: string]: Vector } = {};
    public static Board8x10MaxVector3: { [playerid: string]: Vector } = {};
    public static Board8x10MinVector3: { [playerid: string]: Vector } = {};
    public static BoardStandbyMaxVector3: { [playerid: string]: Vector } = {};
    public static BoardStandbyMinVector3: { [playerid: string]: Vector } = {};

    public static GetPlayerfirstSpawnPoint(playerid: PlayerID) {
        return PlayerState.HeroSpawnPoint[playerid];
    }

    public static GetBoardMaxVector3(playerid: PlayerID) {
        if (this.BoardMaxVector3[playerid + ""]) {
            return this.BoardMaxVector3[playerid + ""];
        }
        let spawn = this.GetPlayerfirstSpawnPoint(playerid);
        let max_x = ChessControlConfig.Gird_Width * (ChessControlConfig.Gird_Max_X + 1.5);
        let max_y = ChessControlConfig.Gird_Height * (ChessControlConfig.Gird_Max_Y + 4.5);
        this.BoardMaxVector3[playerid + ""] = Vector(spawn.x + max_x, spawn.y + max_y, 128);
        return this.BoardMaxVector3[playerid + ""];
    }
    public static GetBoardMinVector3(playerid: PlayerID) {
        if (this.BoardMinVector3[playerid + ""]) {
            return this.BoardMinVector3[playerid + ""];
        }
        let spawn = this.GetPlayerfirstSpawnPoint(playerid);
        let min_x = ChessControlConfig.Gird_Width * 2.5;
        let min_y = ChessControlConfig.Gird_Height * 1.5;
        this.BoardMinVector3[playerid + ""] = Vector(spawn.x - min_x, spawn.y - min_y, 128);
        return this.BoardMinVector3[playerid + ""];
    }
    public static GetBoard8x10MaxVector3(playerid: PlayerID) {
        if (this.Board8x10MaxVector3[playerid + ""]) {
            return this.Board8x10MaxVector3[playerid + ""];
        }
        let spawn = this.GetPlayerfirstSpawnPoint(playerid);
        let max_x = ChessControlConfig.Gird_Width * (ChessControlConfig.Gird_Max_X - 1 + 0.5);
        let max_y = ChessControlConfig.Gird_Height * (ChessControlConfig.Gird_Max_Y - 1 + 0.5);
        this.Board8x10MaxVector3[playerid + ""] = Vector(spawn.x + max_x, spawn.y + 1600 - 1152 + max_y, 128);
        return this.Board8x10MaxVector3[playerid + ""];
    }
    public static GetBoard8x10MinVector3(playerid: PlayerID) {
        if (this.Board8x10MinVector3[playerid + ""]) {
            return this.Board8x10MinVector3[playerid + ""];
        }
        let spawn = this.GetPlayerfirstSpawnPoint(playerid);
        let min_x = ChessControlConfig.Gird_Width * 0.5;
        let min_y = ChessControlConfig.Gird_Height * 0.5;
        this.Board8x10MinVector3[playerid + ""] = Vector(spawn.x - min_x, spawn.y + 1600 - 1152 - min_y, 128);
        return this.Board8x10MinVector3[playerid + ""];
    }

    public static GetBoardStandbyMaxVector3(playerid: PlayerID) {
        if (this.BoardStandbyMaxVector3[playerid + ""]) {
            return this.BoardStandbyMaxVector3[playerid + ""];
        }
        let spawn = this.GetPlayerfirstSpawnPoint(playerid);
        let max_x = ChessControlConfig.Gird_Width * (ChessControlConfig.Gird_Max_X - 1 + 0.5);
        let max_y = ChessControlConfig.Gird_Height * 0.5;
        this.BoardStandbyMaxVector3[playerid + ""] = Vector(spawn.x + max_x, spawn.y + max_y, 128);
        return this.BoardStandbyMaxVector3[playerid + ""];
    }
    public static GetBoardStandbyMinVector3(playerid: PlayerID) {
        if (this.BoardStandbyMinVector3[playerid + ""]) {
            return this.BoardStandbyMinVector3[playerid + ""];
        }
        let spawn = this.GetPlayerfirstSpawnPoint(playerid);
        let min_x = ChessControlConfig.Gird_Width * 0.5;
        let min_y = ChessControlConfig.Gird_Height * 0.5;
        this.BoardStandbyMinVector3[playerid + ""] = Vector(spawn.x - min_x, spawn.y - min_y, 128);
        return this.BoardStandbyMinVector3[playerid + ""];
    }
    public static GetBoardGirdVector3(v: ChessControlConfig.ChessVector) {
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

    // x ,y playerid
    public static GetBoardGirdCenterVector3(v: ChessControlConfig.ChessVector) {
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

    public static FindBoardInGirdChess(v: ChessControlConfig.ChessVector) {
        let playerid = v.playerid as PlayerID;
        if (!PlayerSystem.IsValidPlayer(playerid)) {
            return;
        }
        let v3 = this.GetBoardGirdCenterVector3(v);
        let npcarr = AoiHelper.FindEntityInRadius(DOTATeam_t.DOTA_TEAM_GOODGUYS, v3, ChessControlConfig.Gird_Width / 2, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY);
        let r: BuildingEntityRoot[] = [];
        npcarr.forEach((npc) => {
            if (npc.ETRoot != null && npc.ETRoot.AsValid<BuildingEntityRoot>("BuildingEntityRoot")) {
                r.push(npc.ETRoot.As<BuildingEntityRoot>());
            }
        });
        return r;
    }

    public static IsBoardEmptyGird(v: ChessControlConfig.ChessVector) {
        return this.FindBoardInGirdChess(v).length === 0;
    }

    public static IsInBoard(playerid: PlayerID, v: Vector) {
        let minv = this.GetBoardMinVector3(playerid);
        let maxv = this.GetBoardMaxVector3(playerid);
        return v.x >= minv.x && v.x <= maxv.x && v.y >= minv.y && v.y <= maxv.y;
    }

    public static IsInBoard8x10(playerid: PlayerID, v: Vector) {
        let minv = this.GetBoard8x10MinVector3(playerid);
        let maxv = this.GetBoard8x10MaxVector3(playerid);
        return v.x >= minv.x && v.x <= maxv.x && v.y >= minv.y && v.y <= maxv.y;
    }

    public static IsInBoardStandby(playerid: PlayerID, v: Vector) {
        let minv = this.GetBoardStandbyMinVector3(playerid);
        let maxv = this.GetBoardStandbyMaxVector3(playerid);
        return v.x >= minv.x && v.x <= maxv.x && v.y >= minv.y && v.y <= maxv.y;
    }

    public static GetBoardLocalVector2(v: Vector, IsValidPlayer: boolean = true) {
        let playerlist: PlayerID[] = [];
        if (IsValidPlayer) {
            playerlist = PlayerSystem.GetAllPlayerid();
        } else {
            for (let i = 0; i < GameSetting.GAME_MAX_PLAYER; i++) {
                playerlist.push(i as PlayerID);
            }
        }
        let playerid = -1;
        let x = -1;
        let y = -1;
        for (let _player of playerlist) {
            if (ChessControlSystem.IsInBoard(_player, v)) {
                playerid = _player;
                if (ChessControlSystem.IsInBoard8x10(_player, v)) {
                    let minv = ChessControlSystem.GetBoard8x10MinVector3(_player);
                    x = math.floor((v.x - minv.x) / ChessControlConfig.Gird_Width);
                    y = math.floor((v.y - minv.y) / ChessControlConfig.Gird_Height) + 1;
                } else if (ChessControlSystem.IsInBoardStandby(_player, v)) {
                    let minv = ChessControlSystem.GetBoardStandbyMinVector3(_player);
                    x = math.floor((v.x - minv.x) / ChessControlConfig.Gird_Width);
                    y = 0;
                }
                return new ChessControlConfig.ChessVector(x, y, playerid);
            }
        }
        return new ChessControlConfig.ChessVector(x, y, playerid);
    }
}
