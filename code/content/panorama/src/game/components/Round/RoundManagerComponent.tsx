import { NetHelper } from "../../../helper/NetHelper";
import { ET, registerET } from "../../../libs/Entity";
import { PlayerScene } from "../Player/PlayerScene";
import { ERound } from "./ERound";
import { ERoundBoard } from "./ERoundBoard";

@registerET()
export class RoundManagerComponent extends ET.Component {
    readonly RoundInfo: { [k: string]: ERound } = {};
    onSerializeToEntity() {
        PlayerScene.Scene.AddOneComponent(this);
    }
    curRoundBoard: string;
    onAwake() {
        this.startListen();
    }
    startListen() {
        
    }

    addRound(r: ERound) {
        this.RoundInfo[r.configID] = r;
        this.AddOneChild(r);
    }

    public getCurrentBoardRound() {
        return this.RoundInfo[this.curRoundBoard] as ERoundBoard;
    }
}
