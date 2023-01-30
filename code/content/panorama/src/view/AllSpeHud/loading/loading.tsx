import { render } from "@demon673/react-panorama";
import React from "react";
import { AllShared } from "../../../../../scripts/tscripts/shared/AllShared";
import { GameEnum } from "../../../../../scripts/tscripts/shared/GameEnum";
import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { CCIntervalTips } from "../../AllUIElement/CCIntervalTips/CCIntervalTips";
import { CCLinkLabel } from "../../AllUIElement/CCLabel/CCLinkLabel";
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
        const login = this.GetState<boolean>("login", false);
        const tips = ["111", "22222", "33333"];
        return (
            <Panel className="CC_Loading" ref={this.__root__} hittest={false} >
                <CCPanel id="loadingBg" />
                <Image id="Logo" />
                <CCIntervalTips id="LoadingCustomTip" tick={5} tipQueue={tips} />
                <Panel id="EOM" hittest={false}>
                    <Image id="EOM_Logo" />
                    <Label localizedText="#lang_FishManPublish" />
                </Panel>
                <Label id="BugEmail" localizedText="#lang_BugEmail" />
                <Panel id="QQGroups" hittest={false}>
                    <CCLinkLabel text="点击加入秘境奇兵玩家一群" url="https://jq.qq.com/?_wv=1027&k=HehiYlTP" />
                    <CCLinkLabel text="点击加入秘境奇兵玩家二群" url="https://jq.qq.com/?_wv=1027&k=RChzYOC9" />
                </Panel>
                <Panel id="Discord" hittest={false}>
                    <CCLinkLabel text={$.Localize("#lang_DiscordLink")} url="https://discord.gg/9GMEaq3re8" />
                    <Image id="DiscordImg" />
                </Panel>
                {/* <Panel id="DouyuActivity" hittest={false}>
                    <Image />
                    <QQGroup text="点击打开活动页面" url="https://yuba.douyu.com/p/276083141631946810" />
                    <QQGroup text="点击加入斗鱼滚滚滚的直播间" url="https://www.douyu.com/5102796" />
                    <QQGroup text="点击加入斗鱼杰尼茶的直播间" url="https://www.douyu.com/9445009" />
                    <QQGroup text="点击加入斗鱼欧萌老仙的直播间" url="https://www.douyu.com/7251523" />
                </Panel> */}
                {/* 队伍选择界面 */}
                {/* {login && gamestate == DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP &&
                    <CCBefore_Game />
                } */}
            </Panel>
        )
    }
}
AllShared.Init();
TimerHelper.Init();
render(<CCLoading />, $.GetContextPanel());