import { render } from "@demon673/react-panorama";
import React from "react";
import { AllShared } from "../../../../../scripts/tscripts/shared/AllShared";
import { GameEnum } from "../../../../../scripts/tscripts/shared/GameEnum";
import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { CCPanel } from "../../AllUIElement/CCPanel/CCPanel";
import "./loading.less";

/**只用loading一个节点作为开局界面，其他全部作为子节点添加。 */
export class CCLoading extends CCPanel<NodePropsData> {
    // 初始化数据
    onInitUI() {
        Game.SetAutoLaunchEnabled(false);
        this.onGameStateChange()
        this.addEvent()
    }
    onDestroy() {
        TimerHelper.Stop();
        LogHelper.print("----------------loading close----------------")
    }

    addEvent() {
        this.addGameEvent(GameEnum.GameEvent.game_rules_state_change, (e) => {
            this.onGameStateChange()
        })
    }

    onGameStateChange() {
        const state = Game.GetState();
        if (!$.GetContextPanel().layoutfile.includes("custom_loading_screen")) {
            this.close()
            return;
        }
        if (state >= DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME) {
            this.close()
            return;
        }
        if (state == DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP) {
            this.LoginServer();
            let playerID = Game.GetLocalPlayerID();
            let ishost = false;
            if (Players.IsValidPlayerID(playerID)) {
                ishost = Boolean(Game.GetPlayerInfo(playerID).player_has_host_privileges);
            }
            // 主机结束队伍选择阶段
            if (ishost) {
                Game.SetAutoLaunchEnabled(false);
                Game.AutoAssignPlayersToTeams();
                Game.SetRemainingSetupTime(0);
            }
        }
        this.UpdateState({ gamestate: state })
    }
    LoginServer() {
        LogHelper.print("---------------LoginServer---------------");
        NetHelper.SendToLua(GameEnum.CustomProtocol.req_LoginGame, null, GHandler.create(this, (e) => {
            this.UpdateState({ login: e.state })
        }));
    }
    render() {
        const gamestate = this.GetState<number>("gamestate");
        const login = this.GetState<boolean>("login", false);
        return (
            <Panel className="CC_Loading" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPanel id="loadingBg" />
                {/* 队伍选择界面 */}
                {/* {login && gamestate == DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP &&
                    <CCBefore_Game />
                } */}
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    }
}
AllShared.Init();
TimerHelper.Init();
render(<CCLoading />, $.GetContextPanel());
