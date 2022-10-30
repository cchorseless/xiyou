/** Create By Editor*/
import React, { createRef, useState } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { ERoundBoard } from "../../game/components/Round/ERoundBoard";
import { RoundConfig } from "../../game/system/Round/RoundConfig";
import { CSSHelper } from "../../helper/CSSHelper";
import { EventHelper } from "../../helper/EventHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { KVHelper } from "../../helper/KVHelper";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { CombinationInfoDialog } from "../Combination/CombinationInfoDialog";
import { MainPanel } from "../MainPanel/MainPanel";
import { TopBarPanel_UI } from "./TopBarPanel_UI";
import { NodePropsData } from "../../libs/BasePureComponent";

export class TopBarPanel extends TopBarPanel_UI<NodePropsData> {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        // this.panel_0.current!.style.flowChildren = 'right'
        // for (let i = 0; i < 5; i++) {
        // 	this.addNodeChildAt(this.NODENAME.panel_0, TeamNeedInfoItem, { marginLeft: '20px', uiScale: '40%', index: i })
        // }
        MainPanel.GetInstance()!.AddCustomToolTip(this.btn_drawcard.current!, CombinationInfoDialog, () => { return { title: "1111", tip: "2222" } })
        MainPanel.GetInstance()!.AddCustomToolTip(this.lbl_food.current!, CombinationInfoDialog, () => { return { title: "1111", tip: "2222" } })

        let KV_DATA = KVHelper.KVData();
        CSSHelper.setLocalText(this.lbl_foodDes, KV_DATA.lang_config.food.Des);
        CSSHelper.setLocalText(this.lbl_goldDes, KV_DATA.lang_config.gold.Des);
        CSSHelper.setLocalText(this.lbl_populationDes, KV_DATA.lang_config.population.Des);
    }
    onStartUI() {
        this.onRefreshUI();
        EventHelper.AddClientEvent(
            PlayerScene.Local.PlayerDataComp.updateEventName,
            FuncHelper.Handler.create(this, () => {
                this.setdifficulty();
                this.setPopulation();
                this.setGold();
                this.setFood();
                this.setWood();
                this.updateSelf();
            })
        );
    }
    onRefreshUI() {
        this.setdifficulty();
        this.setPopulation();
        this.setGold();
        this.setFood();
        this.setWood();
        this.setroundlabel();
        this.setroundState();
        this.setstartTime();
        this.updateSelf();
    }

    updateRound() {
        this.setroundlabel();
        this.setroundState();
        this.setstartTime();
        this.updateSelf();
    }

    setroundlabel() {
        this.lbl_round.current!.text = PlayerScene.Local.RoundManagerComp.getCurrentBoardRound().config.round_show;
    }

    setdifficulty() {
        let KV_DATA = KVHelper.KVData();
        CSSHelper.setLocalText(this.lbl_roundDes, KV_DATA.lang_config.turn.Des);
        this.lbl_roundDes.current!.text += `[${PlayerScene.Local.PlayerDataComp.difficulty}]`;
    }
    timerid: any;
    setstartTime() {
        if (this.timerid != null) {
            return;
        }
        this.lbl_gametime.current!.text = "00:00:00";
        this.timerid = TimerHelper.AddIntervalTimer(
            1,
            1,
            FuncHelper.Handler.create(this, () => {
                let gametime = Math.floor(Game.GetDOTATime(false, true) * 1000);
                let date = new Date(gametime + TimerHelper.Offtime);
                this.lbl_gametime.current!.text = date.toTimeString().substring(0, 8);
                this.updateSelf();
            }),
            -1,
            false
        );
    }

    setPopulation() {
        this.lbl_population.current!.text = `${PlayerScene.Local.PlayerDataComp.population}/${PlayerScene.Local.PlayerDataComp.populationRoof}`;
    }

    setGold() {
        this.lbl_gold.current!.text = `${PlayerScene.Local.PlayerDataComp.gold}(+${PlayerScene.Local.PlayerDataComp.perIntervalGold})`;
    }
    setFood() {
        this.lbl_food.current!.text = `${PlayerScene.Local.PlayerDataComp.food}(+${PlayerScene.Local.PlayerDataComp.perIntervalWood})`;
    }
    setWood() {
        this.lbl_wood.current!.text = `${PlayerScene.Local.PlayerDataComp.wood}(+${PlayerScene.Local.PlayerDataComp.perIntervalWood})`;
    }

    lefttimeTask: TimerHelper.TimerTask | null;
    setroundState() {
        // let currentround = PlayerScene.Local.RoundManagerComp.getCurrentBoardRound();
        // this.lbl_roundstagedes.current!.text = "" + currentround.getCurStateDes();
        // if (currentround.roundStartTime != null) {
        //     if (this.lefttimeTask != null) {
        //         this.lefttimeTask.Clear();
        //         this.lefttimeTask = null;
        //     }
        //     let lefttime = 0;
        //     switch (currentround.roundState) {
        //         case RoundConfig.ERoundBoardState.start:
        //             lefttime = Number(currentround.config.round_readytime);
        //             break;
        //         case RoundConfig.ERoundBoardState.battle:
        //             lefttime = Number(currentround.config.round_time);
        //             break;
        //         case RoundConfig.ERoundBoardState.prize:
        //         case RoundConfig.ERoundBoardState.waiting_next:
        //         case RoundConfig.ERoundBoardState.end:
        //             break;
        //     }
        //     if (lefttime == 0) {
        //         this.lbl_lefttime.current!.text = "";
        //     } else {
        //         this.lbl_lefttime.current!.text = "" + lefttime;
        //         this.lefttimeTask = TimerHelper.AddIntervalTimer(
        //             1,
        //             1,
        //             FuncHelper.Handler.create(this, () => {
        //                 lefttime -= 1;
        //                 if (lefttime <= 0) {
        //                     this.lbl_lefttime.current!.text = "";
        //                     this.lefttimeTask?.Clear();
        //                     this.lefttimeTask = null;
        //                 } else {
        //                     this.lbl_lefttime.current!.text = "" + lefttime;
        //                 }
        //                 this.updateSelf();
        //             }),
        //             -1,
        //             true
        //         );
        //     }
        // }
        // this.updateSelf();
    }
}
