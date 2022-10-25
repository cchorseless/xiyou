/** Create By Editor*/
import React, { createRef, useState } from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { EntityHpBarItem_UI } from "./EntityHpBarItem_UI";
export class EntityHpBarItem extends EntityHpBarItem_UI<NodePropsData> {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        let entityid = this.props.entityid as EntityIndex;
        let ismy = Entities.GetTeamNumber(entityid) == Game.GetLocalPlayerInfo().player_team_id;
        if (ismy) {
            CSSHelper.setBgImageUrl(this.img_hp, `common/overhead/bar_86.png`);
        } else {
            CSSHelper.setBgImageUrl(this.img_hp, `common/overhead/bar_69.png`);
        }
    }
}
