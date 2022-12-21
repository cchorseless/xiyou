import React from "react";
import { render } from "@demon673/react-panorama";
import { AllEntity } from "../../../game/Index";
import { PlayerScene } from "../../../game/components/Player/PlayerScene";
import { LogHelper } from "../../../helper/LogHelper";
import { CCTeam_select } from "../team_select/team_select";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { GameEnum } from "../../../../../../game/scripts/tscripts/shared/GameEnum";
import { CCPanel } from "../../AllUIElement/CCPanel/CCPanel";
import { CCHero_Select } from "../hero_select/hero_select";
import { NetHelper } from "../../../helper/NetHelper";

import "./loading.less";

/**只用loading一个节点作为开局界面，其他全部作为子节点添加。 */
export class CCLoading extends CCPanel<NodePropsData> {
    // 初始化数据
    onInitUI() {
        Game.SetAutoLaunchEnabled(false);
        this.UpdateState({ gamestate: Game.GetState() })
        this.addEvent()
    }
    onDestroy() {
        LogHelper.print("----------------loading close----------------")
    }

    addEvent() {
        this.addGameEvent(GameEnum.GameEvent.game_rules_state_change, (e) => {
            const state = Game.GetState();
            if (!$.GetContextPanel().layoutfile.includes("custom_loading_screen")) {
                this.close()
                return;
            }
            if (state == DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME) {
                this.close()
                return;
            }
            if (state == DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP) {
                this.LoginServer();
            }
            LogHelper.print("current state :", state);
            this.UpdateState({ gamestate: state })
        })
    }

    LoginServer(cb = () => { }) {
        LogHelper.print("---------------LoginServer---------------");
        NetHelper.SendToLua(GameEnum.CustomProtocol.req_LoginGame, null, (e) => {
            this.UpdateState({ login: e.state })
        });
    }
    render() {
        const gamestate = this.GetState<number>("gamestate");
        const login = this.GetState<boolean>("login", false);
        return (
            <Panel className="CC_Loading" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPanel id="loadingBg" />
                {/* 队伍选择界面 */}
                {gamestate == DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP &&
                    <CCTeam_select />
                }
                {/* 英雄选择 */}
                {login && gamestate == DOTA_GameState.DOTA_GAMERULES_STATE_HERO_SELECTION &&
                    <CCHero_Select />
                }
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    }
}
AllEntity.Init();
render(<CCLoading />, $.GetContextPanel());
