/** Create By Editor*/
import React, { createRef, useState } from "react";
import { render } from "react-panorama-eom";
import { DotaUIHelper } from "../../../helper/DotaUIHelper";
import { FuncHelper } from "../../../helper/FuncHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { GameEnum } from "../../../libs/GameEnum";
import { Hero_select } from "../hero_select/hero_select";
import { Team_select } from "../team_select/team_select";
import { Loading_UI } from "./Loading_UI";

/**只用loading一个节点作为开局界面，其他全部作为子节点添加。 */
export class Loading extends Loading_UI {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        Game.SetAutoLaunchEnabled(false);
        this.addGameEvent(GameEnum.GameEvent.game_rules_state_change, async (e: any) => {
            let state = Game.GetState();
            LogHelper.print("current state :", state);
            switch (Number(state)) {
                // 队伍选择界面
                case DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP:
                    LogHelper.print("1111 :");
                    await this.addNodeChildAsyacAt(this.NODENAME.__root__, Team_select, {
                        isActive: true
                    });
                    LogHelper.print("2222 :");
                    break
                /**英雄选择 */
                case DOTA_GameState.DOTA_GAMERULES_STATE_HERO_SELECTION:
                    // this.showOnlyNodeComponent(this.NODENAME.__root__, Hero_select, {
                    //     isActive: true
                    // });
                    // this.updateSelf()
                    break
            }
        })
    };

};

const eventid = GameEvents.Subscribe(GameEnum.GameEvent.game_rules_state_change, (e: any) => {
    let state = Game.GetState();
    switch (state) {
        // 创建
        case DOTA_GameState.DOTA_GAMERULES_STATE_INIT:
            render(<Loading />, $.GetContextPanel());
            break
        // 销毁
        case DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME:
            render(<></>, $.GetContextPanel());
            GameEvents.Unsubscribe(eventid);
            break;
    }
})

