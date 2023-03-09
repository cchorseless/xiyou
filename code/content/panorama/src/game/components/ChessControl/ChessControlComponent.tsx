import { ChessControlConfig } from "../../../../../scripts/tscripts/shared/ChessControlConfig";
import { GameEnum } from "../../../../../scripts/tscripts/shared/GameEnum";
import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";
import { EventHelper } from "../../../helper/EventHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { CCMainPanel } from "../../../view/MainPanel/CCMainPanel";
import { CCUnitChessMoveIcon } from "../../../view/Unit/CCUnitChessMoveIcon";
@GReloadable
export class ChessControlComponent extends ET.Component {
    onAwake() {
        this.addEvent();
    }
    IS_CURSOR_HERO_ICON_SHOWING = false;
    MOVING_PCF: ParticleID = -1 as ParticleID;
    PORTRAIT_UNIT: EntityIndex;
    IS_SEASON_AWARD_AVAILABLE = true;
    addEvent() {
        this.OnMouseCallback();
        EventHelper.addGameEvent(GameEnum.GameEvent.dota_player_update_query_unit, GHandler.create(this, async (e) => {
            await this.OnPlayerQueryUnit(e);
        }));
        EventHelper.addGameEvent(GameEnum.GameEvent.dota_player_update_selected_unit, GHandler.create(this, async (e) => {
            await this.OnPlayerQueryUnit(e);
        }));
        GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
            this.UpdateHeroIcon();
            return 1
        }));
    }

    onDestroy(): void {
        EventHelper.removeGameEventCaller(this);
        GTimerHelper.ClearAll(this);
    }
    OnMouseCallback() {
        const CONSUME_EVENT = true;
        const CONTINUE_EVENT = false;
        const LEFT_BUTTON = 0;
        const RIGHT_BUTTON = 1;
        GameUI.SetMouseCallback((eventName, mouseButton) => {
            if (Game.IsGamePaused()) { return CONSUME_EVENT; }
            if (this.IsDisposed()) { return CONSUME_EVENT; }
            if (GameUI.GetClickBehaviors() !== CLICK_BEHAVIORS.DOTA_CLICK_BEHAVIOR_NONE) return CONTINUE_EVENT;
            if (eventName === "pressed") {
                if (mouseButton === LEFT_BUTTON) {
                    // 左键点击
                    // if (!this.IS_CURSOR_HERO_ICON_SHOWING) {
                    //     // 当前不显示英雄小图标
                    //     this.PORTRAIT_UNIT = Players.GetLocalPlayerPortraitUnit();
                    //     $.Schedule(0.01, () => {
                    //         // this.OnPlayerSelectUnit();
                    //     });
                    //     return CONTINUE_EVENT;
                    if (this.IS_CURSOR_HERO_ICON_SHOWING) {
                        this.Jump_cursor_hero();
                        return CONSUME_EVENT;
                    }
                    return CONTINUE_EVENT;
                }
                if (mouseButton === RIGHT_BUTTON && this.IS_CURSOR_HERO_ICON_SHOWING) {
                    // 右键点击，隐藏当前英雄小图标
                    this.OnShowCursorHeroIcon(false);
                    return CONSUME_EVENT;
                }
            }
            if (eventName == "doublepressed") {
                return CONTINUE_EVENT;
            }
            if (eventName === "wheeled") {
                // g_targetDistance += mouseButton * -100;
                return CONTINUE_EVENT;
            }
            return CONTINUE_EVENT;
        });
    }

    async OnPlayerQueryUnit(keys: any) {
        // if (keys.splitscreenplayer == Game.GetLocalPlayerID()) {
        let localPlayer = Players.GetLocalPlayer();
        let portrait_unit = Players.GetLocalPlayerPortraitUnit();
        // 选中自己信使
        if (portrait_unit == Players.GetPlayerHeroEntityIndex(localPlayer)) {
            await this.OnShowCursorHeroIcon(false);
            // if (FindDotaHudElement("emotion_button")) {
            //     FindDotaHudElement("emotion_button").visible = true;
            // }
            // if (FindDotaHudElement("inventory_tpscroll_container")) {
            //     FindDotaHudElement("inventory_tpscroll_container").visible = true;
            // }
            // ShowDrodoCourierBuffContainer(Entities.GetTeamNumber(portrait_unit));
            // UpdatePortraitCourierName(portrait_unit);
            // if (FindDotaHudElement("HealthProgress_Left")) {
            //     // 生命条颜色变黄
            //     FindDotaHudElement("HealthProgress_Left").style["background-color"] =
            //         "gradient( linear, 0.0% 0.0%, 100.0% 0.0%, color-stop( 0.0, #79F27988 ), color-stop( 0.850, #79F279DD ), color-stop( 1.0, #79F279FF ) )";
            // }
            return
        }
        // 选中的不是自己信使
        // if (FindDotaHudElement("HealthProgress_Left")) {
        //     // 生命条颜色变绿
        //     FindDotaHudElement("HealthProgress_Left").style["background-color"] =
        //         "gradient( linear, 0.0% 0.0%, 100.0% 0.0%, color-stop( 0.0, #2DA02788 ), color-stop( 0.850, #2DA027DD ), color-stop( 1.0, #2DA027FF ) )";
        // }

        // if (FindDotaHudElement("emotion_button")) {
        //     FindDotaHudElement("emotion_button").visible = false;
        // }
        if (Entities.GetTeamNumber(portrait_unit) == Players.GetTeam(localPlayer)) {
            let building = GBuildingEntityRoot.GetEntity(portrait_unit)
            // 选中友方棋子
            if (building && building.BelongPlayerid == localPlayer) {
                this.PORTRAIT_UNIT = portrait_unit;
                await this.OnShowCursorHeroIcon(true);
                return
            }
            // 选中友方其他玩家信使
            if (Entities.IsHero(portrait_unit)) {
                if (GCourierEntityRoot.GetEntity(portrait_unit)) {
                    return
                }
            }

        }
        else {
            // 选中敌人
            if (GFakerHeroEntityRoot.GetEntity(portrait_unit)) {
                return
            }
        }
        await this.OnShowCursorHeroIcon(false);
    }

    UpdateHeroIcon() {
        let currentUnit = Players.GetLocalPlayerPortraitUnit();
        if (currentUnit != this.PORTRAIT_UNIT) {
            this.PORTRAIT_UNIT = currentUnit;
            // this.OnPlayerSelectUnit();
        }
        if (this.IS_CURSOR_HERO_ICON_SHOWING) {
            // 显示英雄小图标
            const cursorPosition = GameUI.GetCursorPosition();
            let w = Game.GetScreenWidth();
            let h = Game.GetScreenHeight();
            let maxwidth = (w / h) * 1080;
            let midwidth = maxwidth / 2;
            let maxheight = 1080; //1920 * h / w;
            let midheight = maxheight / 2;
            let newX = (cursorPosition[0] / w) * maxwidth;
            let newY = (cursorPosition[1] / h) * maxheight;
            // if (newX > midwidth) {
            //     newX += ((newX - midwidth) / midwidth) * 125;
            // }
            // else {
            //     newX -= ((midwidth - newX) / midwidth) * 125;
            // }
            newX -= 30;
            newY -= 30;
            CCUnitChessMoveIcon.GetInstance()?.changePos(newX, newY);
            const gamePosition = Game.ScreenXYToWorld(cursorPosition[0], cursorPosition[1]);
            const origin = Entities.GetAbsOrigin(this.PORTRAIT_UNIT);
            Particles.SetParticleControl(this.MOVING_PCF, 5, [gamePosition[0], gamePosition[1], gamePosition[2]]);
            Particles.SetParticleControl(this.MOVING_PCF, 2, [128, 128, 128]);
        }
    }

    async OnShowCursorHeroIcon(isshow: boolean) {
        if (isshow) {
            this.ShowMovingChess();
            let unitName = Entities.GetUnitName(this.PORTRAIT_UNIT);
            await this.show_cursor_hero(unitName);
        } else {
            this.hide_cursor_hero();
        }
    }
    ShowMovingChess() {
        // if (MOVING_PCF){
        Particles.DestroyParticleEffect(this.MOVING_PCF, true);
        // }
        // 拖拽特效
        this.MOVING_PCF = Particles.CreateParticle("particles/ui/selection/selection_grid_drag.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.PORTRAIT_UNIT);
        const origin = Entities.GetAbsOrigin(this.PORTRAIT_UNIT);
        origin[2] += 50;
        Particles.SetParticleControl(this.MOVING_PCF, 4, origin);
        Particles.SetParticleAlwaysSimulate(this.MOVING_PCF);
        // IS_CURSOR_HERO_ICON_SHOWING = true;
    }
    async show_cursor_hero(unit_name: string) {
        await CCMainPanel.GetInstance()!.addOnlyPanel(CCUnitChessMoveIcon, { itemname: unit_name });
        this.IS_CURSOR_HERO_ICON_SHOWING = true;
    }
    hide_cursor_hero() {
        CCUnitChessMoveIcon.GetInstance()?.close();
        this.IS_CURSOR_HERO_ICON_SHOWING = false;
        Particles.DestroyParticleEffect(this.MOVING_PCF, true);
        Particles.ReleaseParticleIndex(this.MOVING_PCF);
    }

    Jump_cursor_hero() {
        // 当前显示英雄小图标
        let position = Game.ScreenXYToWorld(GameUI.GetCursorPosition()[0], GameUI.GetCursorPosition()[1]);
        NetHelper.SendToLua(ChessControlConfig.EProtocol.pick_chess_position, { entityid: this.PORTRAIT_UNIT, x: position[0], y: position[1], z: position[2] }, GHandler.create(this, (event) => {
            LogHelper.print(event);
        }));
        let par = Particles.CreateParticle("particles/ui_mouseactions/clicked_basemove.vpcf", 0, 0 as any);
        Particles.SetParticleControl(par, 0, position);
        Particles.SetParticleControl(par, 1, [0, 255, 0]);
        GameUI.SelectUnit(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()), false);
        this.OnShowCursorHeroIcon(false);
    }
}
