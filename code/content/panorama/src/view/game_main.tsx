// LogHelper必须放第一行先导入
import { render } from "@demon673/react-panorama";
import React from "react";
import { AllShared } from "../../../scripts/tscripts/shared/AllShared";
import { AllEntity } from "../game/AllEntity";
import { GameScene } from "../game/GameScene";
import { DebugHelper } from "../helper/DebugHelper";
import { DotaUIHelper } from "../helper/DotaUIHelper";
import { EventHelper } from "../helper/EventHelper";
import { LogHelper } from "../helper/LogHelper";
import { TimerHelper } from "../helper/TimerHelper";
import { CCPanel } from "./AllUIElement/CCPanel/CCPanel";
import { CCPausePanel } from "./AllUIElement/CCPause/CCPausePanel";
import { CCDebugPanel } from "./DebugTool/CCDebugPanel";
import { CCMainPanel } from "./MainPanel/CCMainPanel";

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
        GameUI.SetCameraDistance(1200);
        // GameUI.SetCameraPitchMax(55);
    }
    onDestroy() {
        (RootPanel.instance as any) = null;
    }

    render() {
        return (
            this.__root___isValid && (
                <Panel ref={this.__root__} className="CC_root" hittest={false} {...this.initRootAttrs()}>
                    {/* <EntityOverHeadPanel /> */}
                    <CCMainPanel />
                    <CCDebugPanel direction="left" hittest={false} />
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
    TimerHelper.Init();
    DebugHelper.Init();
    EventHelper.Init();
    DotaUIHelper.Init();
    GameScene.Init();
    GameScene.Local.Init();
    render(<RootPanel />, $.GetContextPanel());
}
LogHelper.print("StartRenderGameUI started -----------------------------------");
StartRenderGameUI();

