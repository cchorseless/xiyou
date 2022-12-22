/** Create By Editor*/
import React, { createRef, useState } from "react";
import { FuncHelper } from "../../../helper/FuncHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { GameEnum } from "../../../../../../game/scripts/tscripts/shared/GameEnum";
import { CCLoading } from "../loading/loading";
import { PlayerInTeamItem } from "./PlayerInTeamItem";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { CCPanel } from "../../AllUIElement/CCPanel/CCPanel";
import "./team_select.less";
import { CCButton } from "../../AllUIElement/CCButton/CCButton";

interface IProps extends NodePropsData {
}

export class CCTeam_select extends CCPanel<IProps> {

    onInitUI() {
        Game.SetAutoLaunchEnabled(false);
        Game.AutoAssignPlayersToTeams();
        this.addEvent();
        let playerID = Game.GetLocalPlayerID();
        let ishost = false;
        if (Players.IsValidPlayerID(playerID)) {
            ishost = Boolean(Game.GetPlayerInfo(playerID).player_has_host_privileges);
        }
        this.UpdateState({ isHost: Boolean(ishost) })
    }


    onbtn_startgame() {
        this.OnLockAndStartPressed();
    };

    addEvent() {
        NetHelper.ListenOnLua(
            this,
            GameEnum.CustomProtocol.req_addBot,
            (e) => {
                if (e.state) {
                    Game.AutoAssignPlayersToTeams();
                    this.updateSelf();
                    this.isAdding = false;
                }
            }
        );
    };

    isAdding = false;
    onbtn_addbot() {
        // let len = Game.GetAllPlayerIDs().length;
        // if (len >= 10) {
        //     TipsHelper.showTips('最多10人', this)
        //     return
        // }
        // if (this.isAdding) {
        //     TipsHelper.showTips('操作太快了', this)
        //     return
        // }
        // this.isAdding = true
        // NetHelper.SendToLua(GameEnum.CustomProtocol.req_addBot)
    };

    OnLockAndStartPressed() {
        // Don't allow a forced start if there are unassigned players
        if (Game.GetUnassignedPlayerIDs().length > 0) {
            return;
        }
        // Lock the team selection so that no more team changes can be made
        Game.SetTeamSelectionLocked(true);
        // Disable the auto start count down
        Game.SetAutoLaunchEnabled(false);
        // Set the remaining time before the game starts
        Game.SetRemainingSetupTime(0);
        TimerHelper.AddTimer(
            3,
            FuncHelper.Handler.create(this, () => {
                let loading = CCLoading.GetInstance();
                if (loading) {
                    loading!.destroy();
                }
            })
        );
    };

    //--------------------------------------------------------------------------------------------------
    // Handler for when the Cancel and Unlock button is pressed
    //--------------------------------------------------------------------------------------------------
    OnCancelAndUnlockPressed() {
        // Unlock the team selection, allowing the players to change teams again
        Game.SetTeamSelectionLocked(false);
        // Stop the countdown timer
        Game.SetRemainingSetupTime(-1);
    }

    render() {
        const isHost = this.GetState<boolean>("isHost");
        const allPlayerList = Game.GetAllPlayerIDs();
        return (
            <Panel className="CC_Team_select" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <Label id="Logo" localizedText="#xiyou" />
                <CCPanel id="PlayerList">
                    {
                        // allPlayerList.map((playerid, indeex) => {
                        //     return
                        // })
                    }
                </CCPanel>
                <CCPanel id="Actiondiv" flowChildren="right" visible={isHost}>
                    <CCButton type="Style1" color="Blue" width="200px" height="60px" onactivate={() => this.onbtn_addbot()}  >
                        <Label className="btn_lbl" text="添加机器人" />
                    </CCButton>
                    <CCButton type="Style1" color="Green" width="200px" height="60px" onactivate={() => this.onbtn_startgame()} >
                        <Label className="btn_lbl" text="开始游戏" />
                    </CCButton>
                </CCPanel>
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    }
}