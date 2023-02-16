import { ReactElement } from "react";

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
        }), true);
    }
    onUpdate() {
        let scale = 800 / GameUI.GetCameraPosition()[2];
        this.updateEnemy(scale);
        this.updateBuilding(scale);
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
    updateEnemy(scale: number) {
        // 所有的怪物
        const allenemy = GEnemyUnitEntityRoot.GetAllInstance();
        for (let entityroot of allenemy) {
            const entityid = entityroot.EntityId;
            if (entityroot && entityroot.IsShowOverhead) {
                if (this.allOverHeadUI[entityid] == null) {
                    this.allOverHeadUI[entityid] = this.addNodeChildAt(this.NODENAME.__root__, CCEnemyTopBarItem, { entityid: Number(entityid) })!;
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

    updateBuilding(scale: number) {
        const allbuilding = GBuildingEntityRoot.GetAllInstance();
        for (let entityroot of allbuilding) {
            const entityid = entityroot.EntityId;
            if (entityroot && entityroot.IsShowOverhead) {
                if (this.allOverHeadUI[entityid] == null) {
                    this.allOverHeadUI[entityid] = this.addNodeChildAt(this.NODENAME.__root__, CCBuildingTopBarItem, { entityid: Number(entityid) })!;
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