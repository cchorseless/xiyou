import { building_round_board } from "../../../config/building/building_round_board";
import { KV_DATA } from "../../../config/KvAllInterface";
import { LogHelper } from "../../../helper/LogHelper";
import { ET, registerET } from "../../../libs/Entity";
import { MainPanel } from "../../../view/MainPanel/MainPanel";
import { TopBarPanel } from "../../../view/TopBarPanel/TopBarPanel";
import { RoundConfig } from "../../system/Round/RoundConfig";
import { PlayerScene } from "../Player/PlayerScene";
import { ERound } from "./ERound";
@registerET()
export class ERoundBoard extends ERound {
    private _roundState: RoundConfig.ERoundBoardState;
    get roundState() {
        return this._roundState;
    }
    set roundState(v: RoundConfig.ERoundBoardState) {
        this._roundState = v;
        if (this.isCurrentRound()) {
            TopBarPanel.GetInstance()?.setroundState();
        }
    }
    private _roundStartTime: string;
    get roundStartTime() {
        return this._roundStartTime;
    }
    set roundStartTime(v: string) {
        this._roundStartTime = v;
        // if (this.isCurrentRound()) {
        //     TopBarPanel.GetInstance()?.setroundState();
        // }
    }
    configID: string;
    unitSpawned: number = 0;
    tTotalDamage: number = 0; // 回合总伤害
    tTowerDamage: { [entityIndex: string]: number } = {}; // 回合伤害
    config: building_round_board.OBJ_2_1;

    onSerializeToEntity() {
        this.config = KV_DATA.building_round_board.building_round_board["" + this.configID];
        PlayerScene.RoundManagerComp.addRound(this);
        let panel = MainPanel.GetInstance();
        if (panel) {
            panel.addOrShowOnlyNodeChild(panel.NODENAME.__root__, TopBarPanel, { configID: this.configID });
        }
    }

    isCurrentRound() {
        if (PlayerScene.RoundManagerComp && PlayerScene.RoundManagerComp.curRoundBoard && PlayerScene.RoundManagerComp.getCurrentBoardRound()) {
            return this.configID == PlayerScene.RoundManagerComp.curRoundBoard;
        }
        return false;
    }

    getCurStateDes() {
        LogHelper.print(this.roundState);
        let str = "";
        switch (this.roundState) {
            case RoundConfig.ERoundBoardState.start:
                str = $.Localize("#" + KV_DATA.lang_config.lang_config.round_start.Des);
                break;
            case RoundConfig.ERoundBoardState.battle:
                str = $.Localize("#" + KV_DATA.lang_config.lang_config.round_battle.Des);
                break;
            case RoundConfig.ERoundBoardState.prize:
                str = $.Localize("#" + KV_DATA.lang_config.lang_config.round_prize.Des);
                break;
            case RoundConfig.ERoundBoardState.waiting_next:
                str = $.Localize("#" + KV_DATA.lang_config.lang_config.round_waiting_next.Des);
                break;
            case RoundConfig.ERoundBoardState.end:
                str = $.Localize("#" + KV_DATA.lang_config.lang_config.round_end.Des);
                break;
        }
        return str;
    }
}
