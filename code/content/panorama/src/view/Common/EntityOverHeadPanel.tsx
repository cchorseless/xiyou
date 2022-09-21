/** Create By Editor*/
import React, { createRef, ReactElement, useState } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { BuildingTopBarItem } from "../Building/BuildingTopBarItem";
import { EnemyTopBarItem } from "../Enemy/EnemyTopBarItem";
import { EntityOverHeadPanel_UI } from "./EntityOverHeadPanel_UI";
export class EntityOverHeadPanel extends EntityOverHeadPanel_UI {
    onStartUI() {
        TimerHelper.AddIntervalFrameTimer(
            1,
            1,
            FuncHelper.Handler.create(this, () => {
                this.onUpdate();
            }),
            -1
        );
    }
    onUpdate() {
        // let iCursorEntIndex = GameUI.CustomUIConfig().GetCursorEntity();
        // let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();
        // // 所有英雄
        // Entities.GetAllHeroEntities().forEach((iUnitEntIndex) => {});
        // //
        this.updateEnemy();
        this.updateBuilding();
        for (let k in this.allOverHeadUI) {
            let entityid = Number(k) as EntityIndex;
            if (this.allOverHeadUI[k])
                if (!Entities.IsValidEntity(entityid) || !Entities.IsAlive(entityid)) {
                    // !NetHelper.GetTableValue(NetHelper.ENetTables.enemy, k) ||
                    this.getPureCompByNode<BuildingTopBarItem>(this.allOverHeadUI[k] as any)?.close();
                    delete this.allOverHeadUI[k];
                }
        }
        this.updateSelf();
    }

    private allOverHeadUI: { [k: string]: ReactElement } = {};
    updateEnemy() {
        // 所有的怪物
        let EntityRootManage = PlayerScene.EntityRootManage;
        let scale = 800 / GameUI.GetCameraPosition()[2];
        for (let entityid in EntityRootManage.AllEnemy) {
            if (EntityRootManage.AllEnemy[entityid]) {
                if (this.allOverHeadUI[entityid] == null) {
                    this.allOverHeadUI[entityid] = this.addNodeChildAt(this.NODENAME.__root__, EnemyTopBarItem, { "entityid": Number(entityid) })!;
                } else {
                    this.getPureCompByNode<EnemyTopBarItem>(this.allOverHeadUI[entityid] as any)?.onRefreshUI({ "entityid": Number(entityid) }, scale);
                }
            }
        }
    }

    updateBuilding() {
        let EntityRootManage = PlayerScene.EntityRootManage;
        let scale = 800 / GameUI.GetCameraPosition()[2];
        for (let entityid in EntityRootManage.AllBuilding) {
            if (EntityRootManage.AllBuilding[entityid]) {
                if (this.allOverHeadUI[entityid] == null) {
                    this.allOverHeadUI[entityid] = this.addNodeChildAt(this.NODENAME.__root__, BuildingTopBarItem, { "entityid": Number(entityid) })!;
                } else {
                    this.getPureCompByNode<BuildingTopBarItem>(this.allOverHeadUI[entityid] as any)?.onRefreshUI({ "entityid": Number(entityid) }, scale);
                }
            }
        }
    }
}
