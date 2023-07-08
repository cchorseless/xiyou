// LogHelper必须放第一行先导入
import React from "react";
import { AllShared } from "../../../scripts/tscripts/shared/AllShared";
import { AllEntity } from "../game/AllEntity";
import { GameScene } from "../game/GameScene";
import { DebugHelper } from "../helper/DebugHelper";
import { DotaUIHelper } from "../helper/DotaUIHelper";
import { KVHelper } from "../helper/KVHelper";
import { LogHelper } from "../helper/LogHelper";
import { TimerHelper } from "../helper/TimerHelper";
import { BaseLibExt } from "../libs/BaseLibExt";
import { CCPanel } from "./AllUIElement/CCPanel/CCPanel";
import { CCPausePanel } from "./AllUIElement/CCPause/CCPausePanel";
import { CCMainPanel } from "./MainPanel/CCMainPanel";
import { CCOverHeadPanel } from "./OverHead/CCOverHeadPanel";

declare global {
    var _G: typeof globalThis;
}
export class RootPanel extends CCPanel {
    /**全局根节点实例 */
    static instance: RootPanel;

    // 初始化数据
    onStartUI() {
        RootPanel.instance = this;
        // 摄像机高度
        GameUI.SetCameraDistance(1600);
        // GameUI.SetCameraPitchMax(55);
    }
    onDestroy() {
        (RootPanel.instance as any) = null;
        TimerHelper.Stop();
        DotaUIHelper.Quit();
        GameScene.Scene.Dispose();
    }

    render() {
        return (
            this.__root___isValid && (
                <Panel ref={this.__root__} className="CC_root" hittest={false} {...this.initRootAttrs()}>
                    <CCOverHeadPanel />
                    <CCMainPanel />
                    <CCPausePanel tipQueue={["1", "2", "3"]} hittest={false} />
                    {this.props.children}
                    {this.__root___childs}
                </Panel>
            )
        );
    }
}

function StartRenderGameUI() {
    // 设置默认UI显示
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_KILLCAM, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_PREGAME_STRATEGYUI, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_FLYOUT_SCOREBOARD, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_SHOP, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_PREGAME_STRATEGYUI, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_GAME_NAME, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_TEAMS, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_CLOCK, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_QUICK_STATS, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_PANEL, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_MINIMAP, false);
    /**初始化系统 */
    AllShared.Init();
    AllEntity.Init();
    BaseLibExt.Init();
    TimerHelper.Init();
    DebugHelper.Init();
    DotaUIHelper.Init();
    KVHelper.Init();
    GameScene.Init();
    DotaUIHelper.ErrorRender(<RootPanel />, $.GetContextPanel());
}
LogHelper.print("StartRenderGameUI started --------------------------114");
StartRenderGameUI();
