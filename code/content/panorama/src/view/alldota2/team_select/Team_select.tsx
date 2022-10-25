/** Create By Editor*/
import React, { createRef, useState } from "react";
import { render } from "@demon673/react-panorama";
import { PlayerScene } from "../../../game/components/Player/PlayerScene";
import { DotaUIHelper } from "../../../helper/DotaUIHelper";
import { FuncHelper } from "../../../helper/FuncHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { TipsHelper } from "../../../helper/TipsHelper";
import { GameEnum } from "../../../libs/GameEnum";
import { Loading } from "../loading/loading";
import { PlayerInTeamItem } from "./PlayerInTeamItem";
import { Team_select_UI } from "./Team_select_UI";
import { NodePropsData } from "../../../libs/BasePureComponent";
export class Team_select extends Team_select_UI<NodePropsData> {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        if (this.props.isActive) {
            this.allplayer.current!.style.flowChildren = "right-wrap";
            this.updatePlayerInfo();
        }
        this.btn_addbot.current!.visible = false;
        this.btn_startgame.current!.visible = false;
        let playerID = Game.GetLocalPlayerID();
        if (Players.IsValidPlayerID(playerID)) {
            let ishost = Game.GetPlayerInfo(playerID).player_has_host_privileges;
            this.btn_addbot.current!.visible = ishost;
            this.btn_startgame.current!.visible = ishost;
        }
        Game.SetAutoLaunchEnabled(false);
        this.addEvent();
    }

    updatePlayerInfo() {
        this.closeNode(this.NODENAME.allplayer);
        let allplayer = Game.GetAllPlayerIDs();
        allplayer.forEach((playerID) => {
            this.addNodeChildAt(this.NODENAME.allplayer, PlayerInTeamItem, {
                playerID: playerID,
            });
        });
        Game.AutoAssignPlayersToTeams();
        this.updateSelf();
    }

    // 销毁
    componentWillUnmount() {
        super.componentWillUnmount();
    }

    onbtn_startgame = () => {
        this.OnLockAndStartPressed();
    };

    addEvent = () => {
        NetHelper.ListenOnLua(
            this,
            GameEnum.CustomProtocol.req_addBot,
            (e) => {
                if (e.state) {
                    this.updatePlayerInfo();
                    this.isAdding = false;
                }
            }
        );
    };

    isAdding = false;
    onbtn_addbot = () => {
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

    OnLockAndStartPressed = () => {
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
                let loading = Loading.GetInstance();
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
}