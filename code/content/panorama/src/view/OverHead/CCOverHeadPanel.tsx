import { ReactElement } from "react";

import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCBuildingTopBarItem } from "./CCBuildingTopBarItem";
import { CCEnemyTopBarItem } from "./CCEnemyTopBarItem";
import { CCOverHeadBaseItem } from "./CCOverHeadBaseItem";

export class CCOverHeadPanel extends CCPanel<NodePropsData> {
    defaultClass() {
        return "CC_root";
    }
    onStartUI() {
        // GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
        //     this.onUpdate();
        //     return 1
        // }), true);
        $.Schedule(0, () => this.onUpdate());
    }
    onUpdate() {
        // let scale = 800 / GameUI.GetCameraPosition()[2];
        const allenemy = GEnemyUnitEntityRoot.GetAllInstance();
        this.updateUnitUI(CCEnemyTopBarItem, allenemy)
        const allbuilding = GBuildingEntityRoot.GetAllInstance();
        this.updateUnitUI(CCBuildingTopBarItem, allbuilding)
        const keys = Object.keys(this.allOverHeadUI);
        for (let k of keys) {
            let entityid = Number(k) as EntityIndex;
            if (this.allOverHeadUI[k]) {
                const comp = this.getPureCompByNode<CCBuildingTopBarItem>(this.allOverHeadUI[k] as any);
                if (comp) {
                    if (!Entities.IsValidEntity(entityid) || !Entities.IsAlive(entityid)) {
                        comp.close();
                    }
                    if (comp.IsClosed) {
                        delete this.allOverHeadUI[k];
                    }
                }
            }
        }
        this.UpdateSelf();
        $.Schedule(0, () => this.onUpdate());
    }

    checkInScreen(entityid: EntityIndex) {
        let vOrigin = Entities.GetAbsOrigin(entityid);
        let fScreenX = Game.WorldToScreenX(vOrigin[0], vOrigin[1], vOrigin[2]);
        let fScreenY = Game.WorldToScreenY(vOrigin[0], vOrigin[1], vOrigin[2]);
        if (fScreenX < 0 || fScreenX > Game.GetScreenWidth() || fScreenY < 0 || fScreenY > Game.GetScreenHeight()) {
            return false
        }
        return vOrigin;
    }

    private allOverHeadUI: { [k: string]: ReactElement } = {};
    updateUnitUI<T extends typeof CCOverHeadBaseItem>(uitype: T, rootlist: IBattleUnitEntityRoot[]) {
        for (let entityroot of rootlist) {
            const entityid = entityroot.EntityId;
            let needclose = true;
            if (entityroot && entityroot.HasOverhead()) {
                const pos = this.checkInScreen(entityid);
                if (pos) {
                    needclose = false;
                    if (this.allOverHeadUI[entityid] == null) {
                        this.allOverHeadUI[entityid] = this.addNodeChildAt(this.NODENAME.__root__, uitype, { entityid: Number(entityid), vOrigin: pos } as any)!;
                    } else {
                        this.getPureCompByNode<CCOverHeadBaseItem>(this.allOverHeadUI[entityid] as any)?.updatePos(pos);
                    }
                }
            }
            if (this.allOverHeadUI[entityid] && needclose) {
                this.getPureCompByNode<CCOverHeadBaseItem>(this.allOverHeadUI[entityid] as any)?.close();
                delete this.allOverHeadUI[entityid];
            }
        }
    }

}