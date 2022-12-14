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
                PlayerScene.LoginServer();
            }
            LogHelper.print("current state :", state);
            this.UpdateState({ gamestate: state })
        })
    }

    render() {
        const gamestate = this.GetState<number>("gamestate")
        return (
            <Panel className="CC_Loading" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPanel id="loadingBg" />
                {gamestate == DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP &&
                    <CCTeam_select />
                }
                {gamestate == DOTA_GameState.DOTA_GAMERULES_STATE_HERO_SELECTION &&
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
// const eventid = GameEvents.Subscribe(GameEnum.GameEvent.game_rules_state_change, async (e: any) => {
//     if (!$.GetContextPanel().layoutfile.includes("custom_loading_screen")) {
//         GameEvents.Unsubscribe(eventid);
//         return;
//     }
//     let state = Game.GetState();
//     LogHelper.print("current state :", state);
//     LogHelper.print("panel file :", $.GetContextPanel().layoutfile);
//     switch (state) {
//         // 创建
//         case DOTA_GameState.DOTA_GAMERULES_STATE_INIT:
//             AllEntity.Init();
//             render(<CCLoading />, $.GetContextPanel());
//             break;
//         // 队伍选择界面
//         case DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP:
//             PlayerScene.LoginServer();
//             while (CCLoading.GetInstance() == null) {
//                 await TimerHelper.DelayTime(0.1, true);
//             }
//             let load = CCLoading.GetInstance()!;
//             load.addNodeChildAsyncAt(load.NODENAME.__root__, CCTeam_select);
//             break;
//         /**英雄选择 */
//         case DOTA_GameState.DOTA_GAMERULES_STATE_HERO_SELECTION:
//             // this.showOnlyNodeComponent(this.NODENAME.__root__, Hero_select, {
//             //     isActive: true
//             // });
//             // this.updateSelf()
//             break;
//         // 销毁
//         case DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME:
//             CCLoading.GetInstance()!.close(true);
//             GameEvents.Unsubscribe(eventid);
//             render(<></>, $.GetContextPanel());
//             break;
//     }
// });
