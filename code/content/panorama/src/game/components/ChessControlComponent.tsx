import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { ET } from "../../libs/Entity";
import { GameEnum } from "../../libs/GameEnum";
import { CardSamllIconItem } from "../../view/Card/CardSamllIconItem";
import { MainPanel } from "../../view/MainPanel/MainPanel";
import { ChessControlConfig } from "../system/ChessControl/ChessControlConfig";

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
        GameEvents.Subscribe(GameEnum.GameEvent.dota_player_update_query_unit, async (e) => {
            await this.OnPlayerQueryUnit(e);
        });
        GameEvents.Subscribe(GameEnum.GameEvent.dota_player_update_selected_unit, async (e) => {
            await this.OnPlayerQueryUnit(e);
        });
        TimerHelper.addTimer(
            0.02,
            () => {
                this.UpdateHeroIcon();
                return 0.02;
            },
            this,
            true
        );
    }

    OnMouseCallback() {
        GameUI.SetMouseCallback((eventName, mouseButton) => {
            const CONSUME_EVENT = true;
            const CONTINUE_EVENT = false;
            const LEFT_BUTTON = 0;
            const RIGHT_BUTTON = 1;
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
                    // 右键点击，当前显示英雄小图标
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
        let portrait_unit = Players.GetLocalPlayerPortraitUnit();
        if (portrait_unit == Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())) {
            await this.OnShowCursorHeroIcon(false);
            // 选中自己信使
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
        } else {
            // 选中的不是自己信使
            // if (FindDotaHudElement("HealthProgress_Left")) {
            //     // 生命条颜色变绿
            //     FindDotaHudElement("HealthProgress_Left").style["background-color"] =
            //         "gradient( linear, 0.0% 0.0%, 100.0% 0.0%, color-stop( 0.0, #2DA02788 ), color-stop( 0.850, #2DA027DD ), color-stop( 1.0, #2DA027FF ) )";
            // }

            // if (FindDotaHudElement("emotion_button")) {
            //     FindDotaHudElement("emotion_button").visible = false;
            // }
            if (Entities.GetTeamNumber(portrait_unit) == Players.GetTeam(Players.GetLocalPlayer())) {
                // 选中友方棋子
                this.PORTRAIT_UNIT = portrait_unit;
                await this.OnShowCursorHeroIcon(true);
            } else {
                // // 选中敌人
                await this.OnShowCursorHeroIcon(false);
                // if (Entities.IsHero(portrait_unit)) {
                //     // 是信使，展示它的信使名字
                //     UpdatePortraitCourierName(portrait_unit);
                //     ShowDrodoCourierBuffContainer(Entities.GetTeamNumber(portrait_unit));
                // } else {
                //     HideDrodoCourierBuffContainer();
                //     if (Entities.GetUnitName(portrait_unit) == "egg") {
                //         UpdatePortraitEggName(portrait_unit);
                //     }
                // }
            }
        }
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
            var w = Game.GetScreenWidth();
            var h = Game.GetScreenHeight();
            var maxwidth = (w / h) * 1080;
            var midwidth = maxwidth / 2;
            var maxheight = 1080; //1920 * h / w;
            var midheight = maxheight / 2;
            var newX = (cursorPosition[0] / w) * maxwidth;
            var newY = (cursorPosition[1] / h) * maxheight;
            // if (newX > midwidth) {
            //     newX += ((newX - midwidth) / midwidth) * 125;
            // }
            // else {
            //     newX -= ((midwidth - newX) / midwidth) * 125;
            // }
            newX -= 30;
            newY -= 30;
            CardSamllIconItem.GetInstance()!.changePos(newX, newY);
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
        unit_name = unit_name.replace("building_hero_", "");
        await MainPanel.GetInstance()!.addOnlyDialog(CardSamllIconItem, { itemname: unit_name });
        this.IS_CURSOR_HERO_ICON_SHOWING = true;
    }
    hide_cursor_hero() {
        CardSamllIconItem.GetInstance()?.close(false);
        this.IS_CURSOR_HERO_ICON_SHOWING = false;
        Particles.DestroyParticleEffect(this.MOVING_PCF, true);
        Particles.ReleaseParticleIndex(this.MOVING_PCF);
    }

    Jump_cursor_hero() {
        // 当前显示英雄小图标
        let position = Game.ScreenXYToWorld(GameUI.GetCursorPosition()[0], GameUI.GetCursorPosition()[1]);
        NetHelper.SendToLua(ChessControlConfig.EProtocol.pick_chess_position, { entityid: this.PORTRAIT_UNIT, x: position[0], y: position[1], z: position[2] }, (event) => {
            LogHelper.print(event);
        });
        let par = Particles.CreateParticle("particles/ui_mouseactions/clicked_basemove.vpcf", 0, 0 as any);
        Particles.SetParticleControl(par, 0, position);
        Particles.SetParticleControl(par, 1, [0, 255, 0]);
        // GameUI.SelectUnit(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()), false);
        // GameUI.SelectUnit( -1, false );
        this.OnShowCursorHeroIcon(false);
    }
}
