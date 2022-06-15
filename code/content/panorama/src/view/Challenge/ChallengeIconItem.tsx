/** Create By Editor*/
import React, { createRef, useState } from "react";
import { AbilityEntityRoot } from "../../game/components/Ability/AbilityEntityRoot";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { NetHelper } from "../../helper/NetHelper";
import { ChallengeIconItem_UI } from "./ChallengeIconItem_UI";
export class ChallengeIconItem extends ChallengeIconItem_UI {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        // this.img_icon.current!.style.opacityMask="url(\"file://{images}/challenge/round_bg.png\")"
    }
    abilityindex: AbilityEntityIndex;
    onStartUI() {
        let abilityname = this.props.abilityname;
        if (!abilityname) {
            return;
        }
        let castentity = Game.GetLocalPlayerInfo().player_selected_hero_entity_index;
        this.abilityindex = Entities.GetAbilityByName(castentity, abilityname);
        this.skillitem.current!.onRefreshUI({
            abilityname: abilityname,
            castEntityIndex: castentity,
        });
       this.onRefreshUI()
    }

    onbtn_castability = () => {
        Abilities.ExecuteAbility(this.abilityindex, Game.GetLocalPlayerInfo().player_selected_hero_entity_index, false);
    };
    onRefreshUI() {
        this.lbl_lv.current!.text = "Lv." + Abilities.GetLevel(this.abilityindex);
        let entity = PlayerScene.PlayerETEntityComp.getNetTableETEntity<AbilityEntityRoot>("" + this.abilityindex);
        if (entity) {
            this.lbl_cost.current!.text = entity.costCount + "";
        }
        this.updateSelf();
    }
}
