/** Create By Editor*/
import React, { createRef, ReactElement, useState } from "react";
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
            if (this.allOverHeadUI[k] && !Entities.IsValidEntity(entityid)) {
                this.getPureCompByNode<BuildingTopBarItem>(this.allOverHeadUI[k] as any)?.close();
                delete this.allOverHeadUI[k];
            }
        }
        this.updateSelf();
    }

    private allOverHeadUI: { [k: string]: ReactElement } = {};
    updateEnemy() {
        // 所有的怪物
        let allenemy = NetHelper.GetOneTable(NetHelper.ENetTables.enemy);
        if (allenemy == null) {
            return;
        }
        let scale = 800 / GameUI.GetCameraPosition()[2];
        for (let info of allenemy) {
            if (info.value) {
                if (this.allOverHeadUI[info.key] == null) {
                    this.allOverHeadUI[info.key] = this.addNodeChildAt(this.NODENAME.__root__, EnemyTopBarItem, info.value)!;
                } else {
                    this.getPureCompByNode<EnemyTopBarItem>(this.allOverHeadUI[info.key] as any)?.onRefreshUI(info.value,scale);
                }
            }
        }
    }

    updateBuilding() {
        let allbuilding = NetHelper.GetOneTable(NetHelper.ENetTables.building);
        if (allbuilding == null) {
            return;
        }
        let scale = 800 / GameUI.GetCameraPosition()[2];
        for (let info of allbuilding) {
            if (info.value) {
                if (this.allOverHeadUI[info.key] == null) {
                    this.allOverHeadUI[info.key] = this.addNodeChildAt(this.NODENAME.__root__, BuildingTopBarItem, info.value)!;
                } else {
                    this.getPureCompByNode<BuildingTopBarItem>(this.allOverHeadUI[info.key] as any)?.onRefreshUI(info.value, scale);
                }
            }
        }
    }
}
