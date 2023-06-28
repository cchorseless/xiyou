import { ChessControlConfig } from "../../../../scripts/tscripts/shared/ChessControlConfig";
import { GameEnum } from "../../../../scripts/tscripts/shared/GameEnum";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { ET } from "../../../../scripts/tscripts/shared/lib/Entity";
import { EventHelper } from "../../helper/EventHelper";
import { NetHelper } from "../../helper/NetHelper";
import { CCUnitChessMoveIcon } from "../../view/Unit/CCUnitChessMoveIcon";
@GReloadable
export class ChessControlSystemComponent extends ET.SingletonComponent {
    onAwake() {
        this.addEvent();
        this.InitGird()
    }
    isCursorHeroIconShowing = false;
    movingPcfid: ParticleID = -1 as ParticleID;
    portraitUnit: EntityIndex;
    addEvent() {
        this.onMouseCallback();
        EventHelper.addGameEvent(GameEnum.GameEvent.dota_player_update_query_unit, GHandler.create(this, (e) => {
            this.OnPlayerQueryUnit(e);
        }));
        EventHelper.addGameEvent(GameEnum.GameEvent.dota_player_update_selected_unit, GHandler.create(this, (e) => {
            this.OnPlayerQueryUnit(e);
        }));
        NetHelper.ListenOnLua(GameProtocol.Protocol.push_Camera_Yaw_Change, GHandler.create(this, (e) => {
            if (e.data) {
                GLogHelper.print("push_Camera_Yaw_Change", e.data)
                GameUI.SetCameraYaw(e.data);
            }
        }));
        GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
            if (this.IsDisposed()) {
                this.hideCursorHero();
                return;
            }
            this.UpdateHeroIcon();
            return 1
        }));
    }

    onDestroy(): void {
        EventHelper.removeGameEventCaller(this);
        GTimerHelper.ClearAll(this);
        this.hideCursorHero();
    }
    onMouseCallback() {
        const CONSUME_EVENT = true;
        const CONTINUE_EVENT = false;
        const LEFT_BUTTON = 0;
        const RIGHT_BUTTON = 1;
        GameUI.SetMouseCallback((eventName, mouseButton) => {
            if (Game.IsGamePaused()) { return CONSUME_EVENT; }
            // GLogHelper.print("OnMouseCallback", this.IsDisposed(), mouseButton);
            // if (this.IsDisposed()) { return CONTINUE_EVENT; }
            if (GameUI.GetClickBehaviors() != CLICK_BEHAVIORS.DOTA_CLICK_BEHAVIOR_NONE) return CONTINUE_EVENT;
            if (eventName === "pressed") {
                if (mouseButton === LEFT_BUTTON) {
                    // 左键点击
                    // if (!this.isCursorHeroIconShowing) {
                    //     // 当前不显示英雄小图标
                    //     this.portraitUnit = Players.GetLocalPlayerPortraitUnit();
                    //     $.Schedule(0.01, () => {
                    //         // this.OnPlayerSelectUnit();
                    //     });
                    //     return CONTINUE_EVENT;
                    if (this.isCursorHeroIconShowing) {
                        this.jumpCursorHero();
                        return CONSUME_EVENT;
                    }
                    return CONTINUE_EVENT;
                }
                if (mouseButton === RIGHT_BUTTON && this.isCursorHeroIconShowing) {
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

    OnPlayerQueryUnit(keys: any) {
        // if (keys.splitscreenplayer == Game.GetLocalPlayerID()) {
        let localPlayer = Players.GetLocalPlayer();
        let portraitUnit = Players.GetLocalPlayerPortraitUnit();
        // 选中自己信使
        if (portraitUnit == Players.GetPlayerHeroEntityIndex(localPlayer)) {
            this.OnShowCursorHeroIcon(false);
            // if (FindDotaHudElement("emotion_button")) {
            //     FindDotaHudElement("emotion_button").visible = true;
            // }
            // if (FindDotaHudElement("inventory_tpscroll_container")) {
            //     FindDotaHudElement("inventory_tpscroll_container").visible = true;
            // }
            // ShowDrodoCourierBuffContainer(Entities.GetTeamNumber(portraitUnit));
            // UpdatePortraitCourierName(portraitUnit);
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
        if (Entities.GetTeamNumber(portraitUnit) == Players.GetTeam(localPlayer)) {
            let building = GBuildingEntityRoot.GetEntity(portraitUnit)
            // 选中友方棋子
            if (building && building.BelongPlayerid == localPlayer) {
                this.portraitUnit = portraitUnit;
                this.OnShowCursorHeroIcon(true);
                return
            }
            // 选中友方其他玩家信使
            if (Entities.IsHero(portraitUnit)) {
                if (GCourierEntityRoot.GetEntity(portraitUnit)) {
                    return
                }
            }

        }
        else {
            // 选中敌人
            if (GFakerHeroEntityRoot.GetEntity(portraitUnit)) {
                return
            }
        }
        this.OnShowCursorHeroIcon(false);
    }

    UpdateHeroIcon() {
        let currentUnit = Players.GetLocalPlayerPortraitUnit();
        if (currentUnit != this.portraitUnit) {
            this.portraitUnit = currentUnit;
            // this.OnPlayerSelectUnit();
        }
        if (this.isCursorHeroIconShowing) {
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
            const origin = Entities.GetAbsOrigin(this.portraitUnit);
            Particles.SetParticleControl(this.movingPcfid, 5, [gamePosition[0], gamePosition[1], gamePosition[2]]);
            Particles.SetParticleControl(this.movingPcfid, 2, [128, 128, 128]);
        }
    }

    OnShowCursorHeroIcon(isshow: boolean) {
        if (isshow) {
            this.ShowMovingChess();
            let unitName = Entities.GetUnitName(this.portraitUnit);
            this.showCursorHero(unitName);

        } else {
            this.hideCursorHero();
        }
    }
    ShowMovingChess() {
        // if (movingPcfid){
        Particles.DestroyParticleEffect(this.movingPcfid, true);
        // }
        // 拖拽特效
        this.movingPcfid = Particles.CreateParticle("particles/ui/selection/selection_grid_drag.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.portraitUnit);
        const origin = Entities.GetAbsOrigin(this.portraitUnit);
        origin[2] += 50;
        Particles.SetParticleControl(this.movingPcfid, 4, origin);
        Particles.SetParticleAlwaysSimulate(this.movingPcfid);
        this.isCursorHeroIconShowing = true;
        this.ShowAttackRange();
    }

    CastRangeParticleID: ParticleID;
    ShowAttackRange(isshow = true) {
        // 施法范围
        if (this.CastRangeParticleID) {
            Particles.DestroyParticleEffect(this.CastRangeParticleID, false);
            this.CastRangeParticleID = null as any;
        }
        if (isshow) {
            let fCastRange = Entities.GetAttackRange(this.portraitUnit) + ChessControlConfig.Gird_Width / 2;
            if (fCastRange > 0) {
                this.CastRangeParticleID = Particles.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, -1 as EntityIndex);
                Particles.SetParticleControlEnt(this.CastRangeParticleID, 0, this.portraitUnit, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "", Entities.GetAbsOrigin(this.portraitUnit), true);
                Particles.SetParticleControl(this.CastRangeParticleID, 1, [fCastRange, 1, 1]);
            }
        }
    }
    showCursorHero(unit_name: string) {
        // CCMainPanel.GetInstance()!.addOnlyPanel(CCUnitChessMoveIcon, { itemname: unit_name });
        this.isCursorHeroIconShowing = true;
    }
    hideCursorHero() {
        // CCUnitChessMoveIcon.GetInstance()?.close();
        this.isCursorHeroIconShowing = false;
        if (this.movingPcfid > -1) {
            Particles.DestroyParticleEffect(this.movingPcfid, true);
            Particles.ReleaseParticleIndex(this.movingPcfid);
        }
        this.movingPcfid = -1 as ParticleID;
        this.ShowAttackRange(false);
    }


    IsShowHeroIcon() {
        return CCUnitChessMoveIcon.GetInstance() != null;
    }

    jumpCursorHero() {
        // 当前显示英雄小图标
        let position = Game.ScreenXYToWorld(GameUI.GetCursorPosition()[0], GameUI.GetCursorPosition()[1]);
        NetHelper.SendToLua(ChessControlConfig.EProtocol.pick_chess_position,
            { entityid: this.portraitUnit, x: position[0], y: position[1], z: position[2] },
            GHandler.create(this, (event: JS_TO_LUA_DATA) => {
                if (event.state) {

                }
            }));
        let par = Particles.CreateParticle("particles/ui_mouseactions/clicked_basemove.vpcf", 0, 0 as any);
        Particles.SetParticleControl(par, 0, position);
        Particles.SetParticleControl(par, 1, [0, 255, 0]);
        GameUI.SelectUnit(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()), false);
        this.OnShowCursorHeroIcon(false);
    }


    // 网格处理
    BuildingImage: ImagePanel;
    state = 'disabled';
    readonly iUnitLength = 64;
    size = 3; // 单个建筑占用几个格子
    overlay_size = this.size * 9; // 显示格子的距离
    grid_alpha = 150;
    overlay_alpha = 125;
    model_alpha = 75;
    recolor_ghost = true;
    rangeParticle: ParticleID;
    modelParticle: ParticleID;
    gridParticles: ParticleID[] = [];
    overlayParticles: ParticleID[] = [];
    builderIndex: EntityIndex;
    blockers: [EntityIndex, [number, number, number][]][] = [];
    allowBlockers: [number, number, number][][] = [];
    InitGird() {
        if (!this.BuildingImage) {
            this.BuildingImage = $.CreatePanel("Image", $.GetContextPanel(), "BuildingImage");

        }
    }



    StartBuildingHelper(params?: { state: string, builderIndex: EntityIndex, attack_range: number, unit_name?: string, model_alpha?: string; }) {
        if (params !== undefined) {
            // Set the parameters passed by AddBuilding
            this.state = params.state;
            this.model_alpha = Number(params.model_alpha);
            this.builderIndex = params.builderIndex;
            let attack_range = params.attack_range;

            // If we chose to not recolor the ghost model, set it white
            let ghost_color = [0, 255, 0];
            if (!this.recolor_ghost)
                ghost_color = [255, 255, 255];

            let localHeroIndex = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer());

            // if (modelParticle !== undefined) {
            // 	Particles.DestroyParticleEffect(modelParticle, true)
            // }
            if (this.gridParticles !== undefined) {
                this.gridParticles.forEach(iParticleID => {
                    Particles.DestroyParticleEffect(iParticleID, false);
                });
            }

            // Range
            this.rangeParticle = Particles.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, -1 as EntityIndex);
            Particles.SetParticleControl(this.rangeParticle, 1, [attack_range, attack_range, attack_range]);

            // Building Ghost
            // modelParticle = Particles.CreateParticle("particles/chessgird/ghost_model.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, localHeroIndex);
            // Particles.SetParticleControlEnt(modelParticle, 1, entindex, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "", Entities.GetAbsOrigin(entindex), true)
            // Particles.SetParticleControl(modelParticle, 2, ghost_color)
            // Particles.SetParticleControl(modelParticle, 3, [model_alpha,0,0])
            // Particles.SetParticleControl(modelParticle, 4, [scale,0,0])

            // Grid squares
            this.gridParticles = [];
            for (let x = 0; x < this.size * this.size; x++) {
                let particle = Particles.CreateParticle("particles/chessgird/square_sprite.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, 0 as EntityIndex);
                Particles.SetParticleControl(particle, 1, [this.iUnitLength / 2, 0, 0]);
                Particles.SetParticleControl(particle, 3, [this.grid_alpha, 0, 0]);
                this.gridParticles.push(particle);
            };

            this.overlayParticles = [];
            for (let y = 0; y < this.overlay_size * this.overlay_size; y++) {
                let particle = Particles.CreateParticle("particles/chessgird/square_overlay.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, 0 as EntityIndex);
                Particles.SetParticleControl(particle, 1, [this.iUnitLength / 2, 0, 0]);
                Particles.SetParticleControl(particle, 3, [0, 0, 0]);
                this.overlayParticles.push(particle);
            };

            if (params.unit_name) {
                // this.BuildingImage.SetImage(TowerUtils.GetTowerIcon(params.unit_name as TowerName));
                this.BuildingImage.RemoveClass("Hidden");
            }
        }

        if (this.state == 'active') {
            $.Schedule(Game.GetGameFrameTime(), this.StartBuildingHelper);

            let mPos = GameUI.GetCursorPosition();
            let GamePos = GameUI.GetScreenWorldPosition(mPos);;

            if (GamePos !== null) {
                this.SnapToGrid(GamePos, this.size);
                this.BuildingImage.SetPositionInPixels(
                    Game.WorldToScreenX(GamePos[0], GamePos[1], GamePos[2]) / this.BuildingImage.actualuiscale_x - this.BuildingImage.actuallayoutwidth / 2,
                    Game.WorldToScreenY(GamePos[0], GamePos[1], GamePos[2]) / this.BuildingImage.actualuiscale_y - this.BuildingImage.actuallayoutheight / 2,
                    0
                );

                let invalid = false;
                let color: [number, number, number] = [0, 255, 0];
                let part = 0;
                let halfSide = (this.size / 2) * this.iUnitLength;
                let boundingRect: { leftBorderX: number, rightBorderX: number, topBorderY: number, bottomBorderY: number, } = {} as any;
                boundingRect.leftBorderX = GamePos[0] - halfSide;
                boundingRect.rightBorderX = GamePos[0] + halfSide;
                boundingRect.topBorderY = GamePos[1] + halfSide;
                boundingRect.bottomBorderY = GamePos[1] - halfSide;

                if (GamePos[0] > 10000000) return 0;

                // Building Base Grid

                for (let x = boundingRect.leftBorderX + this.iUnitLength / 2; x <= boundingRect.rightBorderX - this.iUnitLength / 2; x += this.iUnitLength) {
                    for (let y = boundingRect.topBorderY - this.iUnitLength / 2; y >= boundingRect.bottomBorderY + this.iUnitLength / 2; y -= this.iUnitLength) {
                        let pos: [number, number, number] = [x, y, GamePos[2]];
                        if (part > this.size * this.size)
                            return 0;

                        let gridParticle = this.gridParticles[part];
                        Particles.SetParticleControl(gridParticle, 0, pos);
                        part++;

                        // Grid color turns red when over invalid positions
                        // Until we get a good way perform clientside FindUnitsInRadius & Gridnav Check, the prevention will stay serverside

                        let t = this.IsPositionBuildable(this.builderIndex, pos);
                        switch (t) {
                            case 1:
                                color = [255, 0, 0];
                                invalid = true;
                                break;
                            case 2:
                                color = [255, 0, 0];
                                invalid = true;
                                break;
                            case 3:
                                color = [120, 255, 120];
                                break;
                            default:
                                color = [0, 255, 0];
                                break;
                        }

                        Particles.SetParticleControl(gridParticle, 2, color);
                    }
                }

                // Overlay Grid, visible with Alt pressed
                // Keep in mind that a particle with 0 alpha does still eat frame rate.
                //overlay_alpha = GameUI.IsAltDown() ? 90 : 0;

                //color = [255,255,255]
                let part2 = 0;
                let halfSide2 = (this.overlay_size / 2) * this.iUnitLength;
                let boundingRect2: { leftBorderX: number, rightBorderX: number, topBorderY: number, bottomBorderY: number, } = {} as any;
                boundingRect2.leftBorderX = GamePos[0] - halfSide2;
                boundingRect2.rightBorderX = GamePos[0] + halfSide2;
                boundingRect2.topBorderY = GamePos[1] + halfSide2;
                boundingRect2.bottomBorderY = GamePos[1] - halfSide2;

                for (let x2 = boundingRect2.leftBorderX + this.iUnitLength / 2; x2 <= boundingRect2.rightBorderX - this.iUnitLength / 2; x2 += this.iUnitLength) {
                    for (let y2 = boundingRect2.topBorderY - this.iUnitLength / 2; y2 >= boundingRect2.bottomBorderY + this.iUnitLength / 2; y2 -= this.iUnitLength) {
                        let pos2: [number, number, number] = [x2, y2, GamePos[2]];
                        if (part2 >= this.overlay_size * this.overlay_size)
                            return 0;

                        let overlayParticle = this.overlayParticles[part2];
                        Particles.SetParticleControl(overlayParticle, 0, pos2);
                        part2++;

                        // Grid color turns red when over invalid positions
                        // Until we get a good way perform clientside FindUnitsInRadius & Gridnav Check, the prevention will stay serverside
                        let t = this.IsPositionBuildable(this.builderIndex, pos2);
                        switch (t) {
                            case 1:
                                color = [255, 0, 0];
                                invalid = true;
                                break;
                            case 2:
                                color = [255, 100, 0];
                                invalid = true;
                                break;
                            case 3:
                                color = [120, 255, 120];
                                break;
                            default:
                                let iPlayerID = Players.GetLocalPlayer();
                                if (iPlayerID == 0 && (x2 + 1) % 3 == 0 && (y2 - 1) % 3 == 0) {
                                    color = [0, 255, 0];
                                } else if (iPlayerID == 1 && (x2 - 1) % 3 == 0 && (y2 - 1) % 3 == 0) {
                                    color = [0, 255, 0];
                                } else if (iPlayerID == 2 && (x2 - 1) % 3 == 0 && (y2 + 1) % 3 == 0) {
                                    color = [0, 255, 0];
                                } else if (iPlayerID == 3 && (x2 + 1) % 3 == 0 && (y2 + 1) % 3 == 0) {
                                    color = [0, 255, 0];
                                } else {
                                    color = [255, 255, 255];
                                }
                                break;
                        }
                        Particles.SetParticleControl(overlayParticle, 2, color);
                        Particles.SetParticleControl(overlayParticle, 3, [this.overlay_alpha, 0, 0]);
                    }
                }

                // Update the range particle
                Particles.SetParticleControl(this.rangeParticle, 0, GamePos);

                // Update the model particle
                // Particles.SetParticleControl(modelParticle, 0, GamePos)

                // Turn the model red if we can't build there
                // if (recolor_ghost){
                // 	if (invalid)
                // 		Particles.SetParticleControl(modelParticle, 2, [255,0,0])
                // 	else
                // 		Particles.SetParticleControl(modelParticle, 2, [255,255,255])
                // }
            }

            return 0;
        }
    }

    // 关闭之前的建造特效
    EndBuildingHelper() {
        this.state = 'disabled';
        if (this.rangeParticle !== undefined) {
            Particles.DestroyParticleEffect(this.rangeParticle, false);
        }
        // if (modelParticle !== undefined) {
        // 	Particles.DestroyParticleEffect(modelParticle, false);
        // }
        this.gridParticles.forEach(iParticleID => {
            Particles.DestroyParticleEffect(iParticleID, false);
        });
        this.overlayParticles.forEach(iParticleID => {
            Particles.DestroyParticleEffect(iParticleID, false);
        });
        this.BuildingImage.AddClass("Hidden");
    }


    // 判断是否正在建造
    ActiveAbility = -1; //上个技能
    CheckBuildingHelper() {
        // $.Schedule(Game.GetGameFrameTime(), this.CheckBuildingHelper);
        // let ability = Abilities.GetLocalPlayerActiveAbility();
        // if (ability != -1) {
        //     let unitEntIndex = Abilities.GetCaster(ability);
        //     if (this.ActiveAbility != ability) {
        //         this.EndBuildingHelper();
        //         let bShowHelper = false;
        //         let sTowerName = "" as TowerName;

        //         if ((Abilities.GetBehavior(ability) & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT) {
        //             let sAbilityName = Abilities.GetAbilityName(ability);
        //             sTowerName = TowerUtils.Card2TowerName(sAbilityName as CardName);
        //             if (Abilities.ShowGrid(ability) == 1) {
        //                 sTowerName = sTowerName ?? ((sAbilityName == "builder_debug" || sAbilityName == "item_builder_debug2") ? (Abilities.GetAbilityTextureName(ability) as TowerName) : Entities.GetUnitName(unitEntIndex));
        //                 bShowHelper = true;
        //             } else {
        //                 if (sTowerName) {
        //                     bShowHelper = true;
        //                 }
        //             }
        //         }
        //         if (bShowHelper) {
        //             this.StartBuildingHelper({
        //                 state: "active",
        //                 unit_name: sTowerName,
        //                 builderIndex: unitEntIndex,
        //                 attack_range: TowerUtils.GetTowerAttackRange(sTowerName),
        //             });
        //         }
        //     }
        //     if (Abilities.GetAbilityName(this.ActiveAbility as AbilityEntityIndex) == "t03_3") {
        //         let aCursorEntIndexs = CustomUIConfig.GetCursorEntities();
        //         let bCheck = false;
        //         for (let i = 0; i < aCursorEntIndexs.length; i++) {
        //             const iCursorEntIndex = aCursorEntIndexs[i];
        //             if (Abilities.CastFilterResultTarget(this.ActiveAbility as AbilityEntityIndex, iCursorEntIndex) == UnitFilterResult.UF_SUCCESS) {
        //                 bCheck = true;
        //                 break;
        //             }
        //         }
        //         if (bCheck) {
        //             if (this.state == "active") {
        //                 this.EndBuildingHelper();
        //             }
        //         } else if (this.state == "disabled") {
        //             let sTowerName = Entities.GetUnitName(unitEntIndex) as TowerName;
        //             this.StartBuildingHelper({
        //                 state: "active",
        //                 unit_name: sTowerName,
        //                 builderIndex: unitEntIndex,
        //                 attack_range: TowerUtils.GetTowerAttackRange(sTowerName),
        //             });
        //         }
        //     }
        // } else {
        //     this.EndBuildingHelper();
        // }
        // this.ActiveAbility = ability;
    }
    //-----------------------------------

    SnapToGrid(vec: number[], size: number) {
        // Buildings are centered differently when the size is odd.
        if (size % 2 != 0) {
            vec[0] = this.SnapToGrid32(vec[0]);
            vec[1] = this.SnapToGrid32(vec[1]);
        }
        else {
            vec[0] = this.SnapToGrid64(vec[0]);
            vec[1] = this.SnapToGrid64(vec[1]);
        }
    }

    SnapToGrid64(coord: number) {
        return this.iUnitLength * Math.floor(0.5 + coord / this.iUnitLength);
    }

    SnapToGrid32(coord: number) {
        return this.iUnitLength / 2 + this.iUnitLength * Math.floor(coord / this.iUnitLength);
    }

    IsPositionBuildable(iCaster: EntityIndex, point: [number, number, number]) {
        // 允许建造区域
        let inAllow = false;
        if (this.allowBlockers.length == 0) {
            let playerid = Game.GetLocalPlayerID();
            let _startPoint = GGameScene.GameServiceSystem.tPlayerStartPoint[playerid + ""];
            const startPoint = _startPoint.split("|").map((value) => GToNumber(value))
            GLogHelper.print(startPoint, typeof startPoint);
            const x1 = startPoint[0];
            const y1 = startPoint[1] + ChessControlConfig.Gird_OffSet_Y * ChessControlConfig.Gird_Height;
            const x2 = startPoint[0] + ChessControlConfig.Gird_Max_X * ChessControlConfig.Gird_Width;
            const y2 = startPoint[1] + (ChessControlConfig.Gird_OffSet_Y + ChessControlConfig.ChessValid_Max_Y) * ChessControlConfig.Gird_Height;
            const z = startPoint[2];
            let leftbottom = [x1, y1, z];
            let rightbottom = [x2, y1, z];
            let righttop = [x2, y2, z];
            let lefttop = [x1, y2, z];
            this.allowBlockers.push([leftbottom, rightbottom, righttop, lefttop] as any)
        }
        for (let index = 0; index < this.allowBlockers.length; index++) {
            if (this.IsPointInPolygon(point, this.allowBlockers[index])) {
                inAllow = true;
                break;
            }
        }
        if (!inAllow) {
            return 1;
        }
        // 禁止建造区域
        for (let index = 0; index < this.blockers.length; index++) {
            let [iUnit, blockInfo] = this.blockers[index];
            if (this.IsPointInPolygon(point, blockInfo)) {
                if (iUnit == iCaster) {
                    return 3;
                }
                return 2;
            }
        }
        return 0;
    }

    /**
     * 判断点是否在点集形成的多边形区域内
     * @param p 
     * @param polygon 顶点位置集，按顶点位置顺序划线，线之间不能交叉
     * @returns 返回点是否在区域内
     */
    IsPointInPolygon(p: [number, number, number], polygon: [number, number, number][]) {
        let j = polygon.length - 1;
        let bool = 0;
        for (let i = 0; i < polygon.length; i++) {
            let p1 = polygon[i];
            let p2 = polygon[j];
            if (((p2[1] < p[1] && p1[1] >= p[1]) || (p1[1] < p[1] && p2[1] >= p[1])) && (p2[0] <= p[0] || p1[0] <= p[0])) {
                bool = bool ^ (((p2[0] + (p[1] - p2[1]) / (p1[1] - p2[1]) * (p1[0] - p2[0])) < p[0]) ? 1 : 0);
            }
            j = i;
        }
        return bool == 1;
    }
}
