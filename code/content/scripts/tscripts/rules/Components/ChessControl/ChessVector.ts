import { ChessControlConfig } from "../../../shared/ChessControlConfig";

export class ChessVector {
    public x = -1;
    public y = -1;
    public playerid = -1;
    constructor(x: number, y: number, playerid: number) {
        this.x = x;
        this.y = y;
        this.playerid = playerid;
    }

    isX(x: number) {
        return this.x - x < 0.1 && this.x - x > -0.1;
    }

    isY(y: number) {
        return this.y - y < 0.1 && this.y - y > -0.1;
    }


    isSame(v: ChessVector) {
        return this.isSameX(v) && this.isSameY(v) && this.isSamePlayer(v);
    }
    isSameX(v: ChessVector) {
        return this.isX(v.x);
    }
    isSameY(v: ChessVector) {
        return this.isY(v.y);
    }
    isSamePlayer(v: ChessVector) {
        return this.playerid - v.playerid < 0.1 && this.playerid - v.playerid > -0.1;
    }
    distance(v: ChessVector) {
        return (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y);
    }
    getVector3() {
        let playerid = this.playerid as PlayerID;
        let minv: Vector;
        let x: number;
        let y: number;
        if (this.y < 1 && this.y >= 0) {
            minv = GChessControlSystem.GetInstance().GetBoardStandbyMinVector3(playerid);
            x = minv.x + ChessControlConfig.Gird_Width * (this.x + 0.5);
            y = minv.y + ChessControlConfig.Gird_Height * (this.y + 0.5);
        } else {
            minv = GChessControlSystem.GetInstance().GetBoard8x10MinVector3(playerid);
            x = minv.x + ChessControlConfig.Gird_Width * (this.x + 0.5);
            y = minv.y + ChessControlConfig.Gird_Height * (this.y - 1 + 0.5);
        }
        return Vector(x, y, 0);
    }
}