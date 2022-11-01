import React, { createRef } from "react";
import { PanelAttributes, render } from "@demon673/react-panorama";
import { AllEntity } from "../game/Index";
import { PlayerScene } from "../game/components/Player/PlayerScene";
import { DebugHelper } from "../helper/DebugHelper";
import { DotaUIHelper } from "../helper/DotaUIHelper";
import { EventHelper } from "../helper/EventHelper";
import { LogHelper } from "../helper/LogHelper";
import { PrecacheHelper } from "../helper/PrecacheHelper";
import { TimerHelper } from "../helper/TimerHelper";
import { GameEnum } from "../libs/GameEnum";
import { Minimap_plus } from "./alldota2/minimap_plus/Minimap_plus";
import { EntityOverHeadPanel } from "./Common/EntityOverHeadPanel";
import { HeroDebugItem } from "./Hero/HeroDebugItem";
import { MainPanel } from "./MainPanel/MainPanel";
import { CCMenuNavigation } from "./allCustomUIElement/CCNavigation/CCMenuNavigation";
import { CCLabel } from "./allCustomUIElement/CCLabel/CCLabel";
import { CCAvatar } from "./allCustomUIElement/CCAvatar/CCAvatar";
import { CCMainPanel } from "./MainPanel/CCMainPanel";
import { CCPanel } from "./allCustomUIElement/CCPanel/CCPanel";

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
                <Panel ref={this.__root__} className="CC_root" {...this.initRootAttrs()}>
                    {/* <EntityOverHeadPanel /> */}
                    <CCMainPanel />
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
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_PREGAME_STRATEGYUI, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_GAME_NAME, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_TEAMS, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_CLOCK, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_QUICK_STATS, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_PANEL, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_MINIMAP, false);

    /**初始化系统 */
    AllEntity.Init();
    TimerHelper.Init();
    DebugHelper.Init();
    EventHelper.Init();
    DotaUIHelper.Init();
    PlayerScene.Init();
    PlayerScene.Local.Init();
    render(<RootPanel />, $.GetContextPanel());
}
LogHelper.print("StartRenderGameUI started");
StartRenderGameUI();
// $.Msg(DOTAHUDHeroViewClicked==null)

