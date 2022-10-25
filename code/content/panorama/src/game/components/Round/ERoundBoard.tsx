import { building_round_board } from "../../../config/building/building_round_board";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TopBarPanel } from "../../../view/TopBarPanel/TopBarPanel";
import { RoundConfig } from "../../system/Round/RoundConfig";
import { PlayerScene } from "../Player/PlayerScene";
import { ERound } from "./ERound";
@registerET()
export class ERoundBoard extends ERound {
    roundStartTime: string;
    configID: string;
    unitSpawned: number = 0;
    tTotalDamage: number = 0; // 回合总伤害
    tTowerDamage: { [entityIndex: string]: number } = {}; // 回合伤害
    config: building_round_board.OBJ_2_1;

    private _roundState: RoundConfig.ERoundBoardState;
    set roundState(v: RoundConfig.ERoundBoardState) {
        if (this._roundState === RoundConfig.ERoundBoardState.start
            && v === RoundConfig.ERoundBoardState.battle) {
            PlayerScene.Local.SelectHero();
        }
        this._roundState = v;
    }
    get roundState() {
        return this._roundState;
    }


    async onSerializeToEntity() {
        let KV_DATA = KVHelper.KVData();
        this.config = KV_DATA.building_round_board["" + this.configID];
        if (PlayerScene.Local.RoundManagerComp == null) {
            await TimerHelper.DelayTime(0.1);
        }
        PlayerScene.Local.RoundManagerComp.addRound(this);
        this.onReload();
    }
    onReload(): void {
        if (this.isCurrentRound()) {
            TopBarPanel.GetInstance()!.updateRound();
        }
    }

    isCurrentRound() {
        if (PlayerScene.Local.RoundManagerComp && PlayerScene.Local.RoundManagerComp.curRoundBoard && PlayerScene.Local.RoundManagerComp.getCurrentBoardRound()) {
            return this.configID == PlayerScene.Local.RoundManagerComp.curRoundBoard;
        }
        return false;
    }

    getCurStateDes() {
        LogHelper.print(this.roundState);
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
