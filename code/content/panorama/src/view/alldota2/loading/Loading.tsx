/** Create By Editor*/
import React, { createRef, useState } from "react";
import { render } from "react-panorama-eom";
import { AllEntity } from "../../../game/AllEntity";
import { PlayerScene } from "../../../game/components/Player/PlayerScene";
import { DotaUIHelper } from "../../../helper/DotaUIHelper";
import { FuncHelper } from "../../../helper/FuncHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
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
    }
}
const eventid = GameEvents.Subscribe(GameEnum.GameEvent.game_rules_state_change, async (e: any) => {
    if (!$.GetContextPanel().layoutfile.includes("custom_loading_screen")) {
        GameEvents.Unsubscribe(eventid);
        return;
    }
    let state = Game.GetState();
    LogHelper.print("current state :", state);
    LogHelper.print("panel file :", $.GetContextPanel().layoutfile);
    switch (state) {
        // 创建
        case DOTA_GameState.DOTA_GAMERULES_STATE_INIT:
            AllEntity.Init();
            render(<Loading />, $.GetContextPanel());
            break;
        // 队伍选择界面
        case DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP:
            PlayerScene.LoginServer();
            while (Loading.GetInstance() == null) {
                await TimerHelper.DelayTime(0.1, true);
            }
            let load = Loading.GetInstance()!;
            load.addNodeChildAsyncAt(load.NODENAME.__root__, Team_select, {
                isActive: true,
            });
            break;
        /**英雄选择 */
        case DOTA_GameState.DOTA_GAMERULES_STATE_HERO_SELECTION:
            // this.showOnlyNodeComponent(this.NODENAME.__root__, Hero_select, {
            //     isActive: true
            // });
            // this.updateSelf()
            break;
        // 销毁
        case DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME:
            Loading.GetInstance()!.close(true);
            GameEvents.Unsubscribe(eventid);
            render(<></>, $.GetContextPanel());
            break;
    }
});
