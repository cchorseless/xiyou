/** Create By Editor*/
import React, { createRef, useState } from "react";
import { NetHelper } from "../../helper/NetHelper";
import { EntityOverHeadPanel_UI } from "./EntityOverHeadPanel_UI";
export class EntityOverHeadPanel extends EntityOverHeadPanel_UI {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        this.startUpdate(1);
    }

    // 销毁
    componentWillUnmount() {
        super.componentWillUnmount();
    }
    onUpdate() {
        // let sScale = String(RemapValClamped(CustomUIConfig.__fCameraDistance__ ?? 1134, 1134, 3000, 1, 0.35));
        // let iCursorEntIndex = GameUI.CustomUIConfig().GetCursorEntity();
        let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();
        // 所有英雄
        Entities.GetAllHeroEntities().forEach((iUnitEntIndex) => {});
        NetHelper.GetTableValue("entity", "building");
        // 所有的怪物
        Entities.GetAllEntitiesByName("npc_dota_creature").forEach((iUnitEntIndex) => {
            // Entities.GetUnitLabel(iUnitEntIndex)
        });
    }
}
