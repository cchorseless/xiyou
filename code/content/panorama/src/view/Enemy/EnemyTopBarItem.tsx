/** Create By Editor*/
import React, { createRef, useState } from "react";
import { EntityHpBarItem } from "../Common/EntityHpBarItem";
import { EnemyTopBarItem_UI } from "./EnemyTopBarItem_UI";
export class EnemyTopBarItem extends EnemyTopBarItem_UI {
    onStartUI() {
        let entityid = this.props.entityid as EntityIndex;
        this.addNodeChildAt(this.NODENAME.panel_hpbar, EntityHpBarItem, {
            entityid: entityid,
        });
    }

    onRefreshUI(p: { entityid: number }, scale: number) {
        let entityid = p.entityid as EntityIndex;
        if (!this.HasOverhead(entityid)) {
            this.close(false);
        } else {
            let vOrigin = Entities.GetAbsOrigin(entityid);
            let fScreenX = Game.WorldToScreenX(vOrigin[0], vOrigin[1], vOrigin[2]);
            let fScreenY = Game.WorldToScreenY(vOrigin[0], vOrigin[1], vOrigin[2]);
            if (fScreenX < 0 || fScreenX > Game.GetScreenWidth() || fScreenY < 0 || fScreenY > Game.GetScreenHeight()) {
                this.close(false);
            } else {
                this.__root__.current!.style.preTransformScale2d = "" + scale;
                let fOffset = Entities.GetHealthBarOffset(entityid);
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
        return Entities.IsValidEntity(iEntIndex) && Entities.IsAlive(iEntIndex);
        // return Entities.IsValidEntity(iEntIndex) && Entities.IsAlive(iEntIndex) && !Entities.NoHealthBar(iEntIndex);
    }
    HasHpUI(iEntIndex: EntityIndex): boolean {
        return Entities.IsValidEntity(iEntIndex) && Entities.IsAlive(iEntIndex) && !Entities.NoHealthBar(iEntIndex);
    }
}
