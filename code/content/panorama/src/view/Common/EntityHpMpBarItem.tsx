/** Create By Editor*/
import React, { createRef, useState } from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { EntityHpMpBarItem_UI } from "./EntityHpMpBarItem_UI";
export class EntityHpMpBarItem extends EntityHpMpBarItem_UI<NodePropsData> {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
    }
    onStartUI() {
        let entityid = this.props.entityid as EntityIndex;
        let ismy = Entities.GetTeamNumber(entityid) == Game.GetLocalPlayerInfo().player_team_id;
        if (ismy) {
            CSSHelper.setBgImageUrl(this.img_hp, `common/overhead/bar_86.png`);
        } else {
            CSSHelper.setBgImageUrl(this.img_hp, `common/overhead/bar_69.png`);
        }
    }
}
