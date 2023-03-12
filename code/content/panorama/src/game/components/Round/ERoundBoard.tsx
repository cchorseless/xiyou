import { Dota } from "../../../../../scripts/tscripts/shared/Gen/Types";
import { GEventHelper } from "../../../../../scripts/tscripts/shared/lib/GEventHelper";
import { RoundConfig } from "../../../../../scripts/tscripts/shared/RoundConfig";
import { KVHelper } from "../../../helper/KVHelper";
import { ERound } from "./ERound";
@GReloadable
export class ERoundBoard extends ERound {
    static CurRoundBoard: ERoundBoard;
    roundLeftTime: number = -1;
    configID: string;
    unitSpawned: number = 0;
    config: Dota.RoundBoardConfigRecord;
    unitDamageInfo: { [k: string]: BuildingConfig.IBuildingDamageInfo } = {};

    private _roundState: RoundConfig.ERoundBoardState;
    set roundState(v: RoundConfig.ERoundBoardState) {
        if (this._roundState === RoundConfig.ERoundBoardState.start
            && v === RoundConfig.ERoundBoardState.battle) {
            GGameScene.Local.SelectHero();
        }
        this._roundState = v;
    }
    get roundState() {
        return this._roundState;
    }

    onSerializeToEntity() {
        this.config = GJSONConfig.RoundBoardConfig.get("" + this.configID)!;
        GGameScene.Local.RoundManagerComp.addRound(this);
        this.onReload();
    }
    onReload(): void {
        if (this.bRunning) {
            ERoundBoard.CurRoundBoard = this;
            GEventHelper.FireEvent(ERoundBoard.name, null, null, this);
        }
    }




    getCurStateDes() {
        let str = "";
        let KV_DATA = KVHelper.KVData();
        switch (this.roundState) {
            case RoundConfig.ERoundBoardState.start:
                str = $.Localize("#" + KV_DATA.lang_config.round_start.Des);
                break;
            case RoundConfig.ERoundBoardState.battle:
                str = $.Localize("#" + KV_DATA.lang_config.round_battle.Des);
                break;
            case RoundConfig.ERoundBoardState.prize:
                str = $.Localize("#" + KV_DATA.lang_config.round_prize.Des);
                break;
            case RoundConfig.ERoundBoardState.waiting_next:
                str = $.Localize("#" + KV_DATA.lang_config.round_waiting_next.Des);
                break;
            case RoundConfig.ERoundBoardState.end:
                str = $.Localize("#" + KV_DATA.lang_config.round_end.Des);
                break;
        }
        return str;
    }
}
