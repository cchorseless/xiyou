/** Create By Editor*/
import React, { createRef, useState } from "react";
import { KV_DATA } from "../../config/KvAllInterface";
import { BuildingEntityRoot } from "../../game/components/Building/BuildingEntityRoot";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { CSSHelper } from "../../helper/CSSHelper";
import { EventHelper } from "../../helper/EventHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { EntityHpBarItem } from "../Common/EntityHpBarItem";
import { EntityHpMpBarItem } from "../Common/EntityHpMpBarItem";
import { BuildingTopBarItem_UI } from "./BuildingTopBarItem_UI";
export class BuildingTopBarItem extends BuildingTopBarItem_UI {
    entityid: EntityIndex;
    onStartUI() {
        this.entityid = this.props.entityid as EntityIndex;
        let building = PlayerScene.EntityRootManage.getBuilding(this.entityid);
        let ismy = Entities.IsControllableByPlayer(this.entityid, Game.GetLocalPlayerInfo().player_id);
        if (ismy) {
            this.addNodeChildAt(this.NODENAME.panel_hpbar, EntityHpMpBarItem, {
                entityid: this.entityid,
            });
        } else {
            this.addNodeChildAt(this.NODENAME.panel_hpbar, EntityHpBarItem, {
                entityid: this.entityid,
            });
        }
        let rare = building!.Config().Rarity.toUpperCase();
        CSSHelper.setBgImageUrl(this.img_nameng, `common/rarity/titlebg_${rare}.png`);
        CSSHelper.setBgImageUrl(this.img_rare, `common/rarity/rare_${rare}.png`);
        CSSHelper.setLocalText(this.lbl_name, building!.ConfigID);
        this.renderUI();
        EventHelper.AddClientEvent(
            building!.BuildingComp!.updateEventName,
            FuncHelper.Handler.create(this, () => {
                this.renderUI();
            })
        );
        this.__root__.current!.visible = false;
        TimerHelper.AddFrameTimer(
            10,
            FuncHelper.Handler.create(this, () => {
                this.__root__.current!.visible = true;
            })
        );
    }

    renderUI() {
        let building = PlayerScene.EntityRootManage.getBuilding(this.entityid);
        if (building) {
            for (let i = 1; i < 6; i++) {
                (this as any)["img_star" + i].current!.visible = building.BuildingComp!.iStar >= i;
            }
            CSSHelper.setBgImageUrl(this.img_prop, `common/icon_prop_${building.BuildingComp!.PrimaryAttribute}.png`);
        }
    }

    onRefreshUI(p: { entityid: number }, scale: number) {
        this.entityid = p.entityid as EntityIndex;
        if (!this.HasOverhead(this.entityid)) {
            this.close(false);
        } else {
            let vOrigin = Entities.GetAbsOrigin(this.entityid);
            let fScreenX = Game.WorldToScreenX(vOrigin[0], vOrigin[1], vOrigin[2]);
            let fScreenY = Game.WorldToScreenY(vOrigin[0], vOrigin[1], vOrigin[2]);
            if (fScreenX < 0 || fScreenX > Game.GetScreenWidth() || fScreenY < 0 || fScreenY > Game.GetScreenHeight()) {
                this.close(false);
            } else {
                this.__root__.current!.style.preTransformScale2d = "" + scale;
                let fOffset = Entities.GetHealthBarOffset(this.entityid);
                fOffset = fOffset == -1 ? 275 : fOffset;
                fOffset = fOffset + scale * 80 - 75;
                let fX = Game.WorldToScreenX(vOrigin[0], vOrigin[1], vOrigin[2] + fOffset);
                let fY = Game.WorldToScreenY(vOrigin[0], vOrigin[1], vOrigin[2] + fOffset);
                let fYY = 0;
                let pPanel = this.__root__.current!;
                pPanel.SetPositionInPixels((fX - pPanel.actuallayoutwidth / 2) / pPanel.actualuiscale_x, (fY - (pPanel.actuallayoutheight - fYY)) / pPanel.actualuiscale_y, 0);
                this.__root__.current!.visible = true;
            }
        }
        this.updateSelf();
    }

    HasOverhead(iEntIndex: EntityIndex): boolean {
        let EntityRootManage = PlayerScene.EntityRootManage;
        let entityroot = EntityRootManage.getBuilding(iEntIndex);
        if (entityroot && entityroot.IsShowOverhead) {
            return Entities.IsValidEntity(iEntIndex) && Entities.IsAlive(iEntIndex) && !Entities.IsInvisible(iEntIndex);
        }
        return false;
    }
    HasHpUI(iEntIndex: EntityIndex): boolean {
        return this.HasOverhead(iEntIndex) && !Entities.NoHealthBar(iEntIndex);
    }
}
