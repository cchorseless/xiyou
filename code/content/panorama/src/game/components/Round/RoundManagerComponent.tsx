import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";
import { ERound } from "./ERound";
import { ERoundBoard } from "./ERoundBoard";

@GReloadable
export class RoundManagerComponent extends ET.Component {
    readonly RoundInfo: { [k: string]: ERound } = {};

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
