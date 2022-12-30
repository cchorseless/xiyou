import { ReactElement } from "react";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCBuildingTopBarItem } from "./CCBuildingTopBarItem";
import { CCEnemyTopBarItem } from "./CCEnemyTopBarItem";

export class CCOverHeadPanel extends CCPanel<NodePropsData> {
    defaultClass() {
        return "CC_root";
    }
    onStartUI() {
        GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
            this.onUpdate();
            return 1
        }));
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
                    this.getPureCompByNode<CCBuildingTopBarItem>(this.allOverHeadUI[k] as any)?.close();
                    delete this.allOverHeadUI[k];
                }
        }
        this.updateSelf();
    }

    private allOverHeadUI: { [k: string]: ReactElement } = {};
    updateEnemy() {
        // 所有的怪物
        const allenemy = GEnemyUnitEntityRoot.GetAllInstance();
        let scale = 800 / GameUI.GetCameraPosition()[2];
        for (let entityroot of allenemy) {
            const entityid = entityroot.EntityId;
            if (entityroot && entityroot.EnemyUnitComp!.IsShowOverhead) {
                if (this.allOverHeadUI[entityid] == null) {
                    this.allOverHeadUI[entityid] = this.addNodeChildAt(this.NODENAME.__root__, CCEnemyTopBarItem, { "entityid": Number(entityid) })!;
                } else {
                    this.getPureCompByNode<CCEnemyTopBarItem>(this.allOverHeadUI[entityid] as any)?.updatePos(scale);
                }
            }
            else {
                if (this.allOverHeadUI[entityid]) {
                    this.getPureCompByNode<CCEnemyTopBarItem>(this.allOverHeadUI[entityid] as any)?.close();
                    delete this.allOverHeadUI[entityid];
                }
            }
        }
    }

    updateBuilding() {
        let scale = 800 / GameUI.GetCameraPosition()[2];
        const allbuilding = GBuildingEntityRoot.GetAllInstance();
        for (let entityroot of allbuilding) {
            const entityid = entityroot.EntityId;
            if (entityroot && entityroot.BuildingComp!.IsShowOverhead) {
                if (this.allOverHeadUI[entityid] == null) {
                    this.allOverHeadUI[entityid] = this.addNodeChildAt(this.NODENAME.__root__, CCBuildingTopBarItem, { "entityid": Number(entityid) })!;
                } else {
                    this.getPureCompByNode<CCBuildingTopBarItem>(this.allOverHeadUI[entityid] as any)?.updatePos(scale);
                }
            }
            else {
                if (this.allOverHeadUI[entityid]) {
                    this.getPureCompByNode<CCBuildingTopBarItem>(this.allOverHeadUI[entityid] as any)?.close();
                    delete this.allOverHeadUI[entityid];
                }
            }
        }
    }
}