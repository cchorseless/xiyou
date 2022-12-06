/** Create By Editor*/
import React, { createRef, useState } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { EntityHpBarItem } from "../Common/EntityHpBarItem";
interface IProps extends NodePropsData {
    entityid: EntityIndex
}

export class CCEnemyTopBarItem extends CCPanel<IProps> {
    onStartUI() {
        let entityid = this.props.entityid;
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
        let EntityRootManage = PlayerScene.EntityRootManage;
        let entityroot = EntityRootManage.getEnemy(iEntIndex);
        if (entityroot && entityroot.EnemyUnitComp!.IsShowOverhead) {
            return Entities.IsValidEntity(iEntIndex) && Entities.IsAlive(iEntIndex) && !Entities.IsInvisible(iEntIndex);
        }
        return false;
        // return Entities.IsValidEntity(iEntIndex) && Entities.IsAlive(iEntIndex) && !Entities.NoHealthBar(iEntIndex);
    }

    HasHpUI(iEntIndex: EntityIndex): boolean {
        return Entities.IsValidEntity(iEntIndex) && Entities.IsAlive(iEntIndex) && !Entities.NoHealthBar(iEntIndex);
    }

    render() {
        const entityid = this.props.entityid as EntityIndex;
        const scale = this.GetState("scale", 1);
        if (!this.HasOverhead(entityid)) {
            return <></>
        }
        let vOrigin = Entities.GetAbsOrigin(entityid);
        let fScreenX = Game.WorldToScreenX(vOrigin[0], vOrigin[1], vOrigin[2]);
        let fScreenY = Game.WorldToScreenY(vOrigin[0], vOrigin[1], vOrigin[2]);
        if (fScreenX < 0 || fScreenX > Game.GetScreenWidth() || fScreenY < 0 || fScreenY > Game.GetScreenHeight()) {
            return <></>
        }
        let fOffset = Entities.GetHealthBarOffset(entityid);
        fOffset = fOffset == -1 ? 275 : fOffset;
        fOffset = fOffset + scale * 80 - 75;
        let fX = Game.WorldToScreenX(vOrigin[0], vOrigin[1], vOrigin[2] + fOffset);
        let fY = Game.WorldToScreenY(vOrigin[0], vOrigin[1], vOrigin[2] + fOffset);
        let fYY = 0;
        let pPanel = this.__root__.current!;
        const x = (fX - pPanel.actuallayoutwidth / 2) / pPanel.actualuiscale_x;
        const y = (fY - (pPanel.actuallayoutheight - fYY)) / pPanel.actualuiscale_y;
        return (<Panel ref={this.__root__} x={x} y={y}  {...this.initRootAttrs()}>
            <Panel id="HealthProgress">
                <Panel id="HealthProgress_Loss" />
                <Panel id="HealthProgress_Left" />
                <Panel id="HealthLossLastContainer" hittest={false} />
            </Panel>
            <Label id="EnemyHealthCount" localizedText="×{d:enemy_health_count}" />
            {this.__root___childs}
            {this.props.children}
        </Panel>)
    }
}
