import { ReactElement } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { FuncHelper } from "../../helper/FuncHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { BuildingTopBarItem } from "../Building/BuildingTopBarItem";
import { EnemyTopBarItem } from "../Enemy/EnemyTopBarItem";

export class CCOverHeadPanel extends CCPanel<NodePropsData> {
    defaultClass = () => {
        return "CC_root";
    }
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
            let entityroot = EntityRootManage.getEnemy(entityid);
            if (entityroot && entityroot.EnemyUnitComp!.IsShowOverhead) {
                if (this.allOverHeadUI[entityid] == null) {
                    this.allOverHeadUI[entityid] = this.addNodeChildAt(this.NODENAME.__root__, EnemyTopBarItem, { "entityid": Number(entityid) })!;
                } else {
                    this.getPureCompByNode<EnemyTopBarItem>(this.allOverHeadUI[entityid] as any)?.onRefreshUI({ "entityid": Number(entityid) }, scale);
                }
            }
            else {
                if (this.allOverHeadUI[entityid]) {
                    this.getPureCompByNode<EnemyTopBarItem>(this.allOverHeadUI[entityid] as any)?.close();
                    delete this.allOverHeadUI[entityid];
                }
            }
        }
    }

    updateBuilding() {
        let EntityRootManage = PlayerScene.EntityRootManage;
        let scale = 800 / GameUI.GetCameraPosition()[2];
        for (let entityid in EntityRootManage.AllBuilding) {
            let entityroot = EntityRootManage.getBuilding(entityid);
            if (entityroot && entityroot.BuildingComp!.IsShowOverhead) {
                if (this.allOverHeadUI[entityid] == null) {
                    this.allOverHeadUI[entityid] = this.addNodeChildAt(this.NODENAME.__root__, BuildingTopBarItem, { "entityid": Number(entityid) })!;
                } else {
                    this.getPureCompByNode<BuildingTopBarItem>(this.allOverHeadUI[entityid] as any)?.onRefreshUI({ "entityid": Number(entityid) }, scale);
                }
            }
            else {
                if (this.allOverHeadUI[entityid]) {
                    this.getPureCompByNode<BuildingTopBarItem>(this.allOverHeadUI[entityid] as any)?.close();
                    delete this.allOverHeadUI[entityid];
                }
            }
        }
    }
}