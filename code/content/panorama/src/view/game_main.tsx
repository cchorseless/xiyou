import React, { createRef } from 'react';
import { PanelAttributes, render } from 'react-panorama-eom';
import { AwalonComponent } from '../game/components/AwalonComponent';
import { CameraComponent } from '../game/components/CameraComponent';
import { ControlComponent } from '../game/components/ControlComponent';
import { System_Avalon } from '../game/system/System_Avalon';
import { System_Task } from '../game/system/System_Task';
import { DebugHelper } from '../helper/DebugHelper';
import { DotaUIHelper } from '../helper/DotaUIHelper';
import { EventHelper } from '../helper/EventHelper';
import { LogHelper } from '../helper/LogHelper';
import { TimerHelper } from '../helper/TimerHelper';
import { BasePureComponent } from '../libs/BasePureComponent';
import { GameEnum } from '../libs/GameEnum';
import { Minimap_plus } from './alldota2/minimap_plus/Minimap_plus';
import { HeroDebugItem } from './HeroPanel/HeroDebugItem';
import { MainPanel } from './MainPanel/MainPanel';

export class RootPanel extends BasePureComponent {
    __root__: React.RefObject<Panel>;
    /**全局根节点实例 */
    static instance: RootPanel;
    constructor(props: any) {
        super(props);
        this.__root__ = createRef<Panel>();
    };
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        RootPanel.instance = this;
        // 添加移动组件
        // RootPanel.instance.ETRoot?.AddComponent(ControlComponent);
        // RootPanel.instance.ETRoot?.AddComponent(CameraComponent);
        // 小地图
        // RootPanel.instance.showOnlyNodeComponent(this.NODENAME.__root__, Minimap_plus)
        // if (Game.IsInToolsMode()) {
        //     RootPanel.instance.showOnlyNodeComponent(this.NODENAME.__root__, HeroDebugItem, {
        //         horizontalAlign: 'middle',
        //         verticalAlign: 'middle',
        //         y: '120px'
        //     })
        // }
        // GameUI.SetCameraPitchMax(55);
        // 摄像机高度
        GameUI.SetCameraDistance(1500);
        this.updateSelf()
    };
    componentWillUnmount() {
        super.componentWillUnmount();
        (RootPanel.instance as any) = null;
    }
    __root___isValid: boolean = true;
    __root___attrs: PanelAttributes = {};
    __root___childs: Array<JSX.Element> = [];
    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} key="compId_1" className="root"  {...this.__root___attrs} >
                <MainPanel />
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    }
};


function StartRenderGameUI() {
    // 设置默认UI显示
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_KILLCAM, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_PREGAME_STRATEGYUI, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_CUSTOMUI_BEHIND_HUD_ELEMENTS, true);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_FLYOUT_SCOREBOARD, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_PREGAME_STRATEGYUI, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_GAME_NAME, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_TEAMS, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_CLOCK, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_PANEL, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_QUICK_STATS, false);
    /**初始化系统 */

    DebugHelper.Init();
    EventHelper.Init();

    let state = Game.GetState();
    $.Msg(11111, '----', state)

    let playerInfo = Game.GetLocalPlayerInfo()
    if (playerInfo && playerInfo.player_selected_hero_entity_index > 0) {
    }
    else {
        /**玩家英雄创建绑定 */
        let eventid2 = GameEvents.Subscribe(GameEnum.GameEvent.dota_player_update_assigned_hero, (event: DotaPlayerUpdateAssignedHeroEvent) => {
            let playerInfo = Game.GetLocalPlayerInfo()
            if (playerInfo) {
                if (playerInfo.player_id == event.playerid) {
                    GameEvents.Unsubscribe(eventid2);
                }
            }
        })

    }

    render(<RootPanel />, $.GetContextPanel());

}

StartRenderGameUI();

