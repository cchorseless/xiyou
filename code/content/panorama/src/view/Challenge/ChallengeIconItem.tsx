/** Create By Editor*/
import React, { createRef, useState } from "react";
import { ChallengeIconItem_UI } from "./ChallengeIconItem_UI";
export class ChallengeIconItem extends ChallengeIconItem_UI {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        // this.img_icon.current!.style.opacityMask="url(\"file://{images}/challenge/round_bg.png\")"
    }
    abilityindex: AbilityEntityIndex;
    onStartUI() {
        this.abilityindex = Entities.GetAbilityByName(Game.GetLocalPlayerInfo().player_selected_hero_entity_index, "courier_draw_card_v1");
        let castentity = Game.GetLocalPlayerInfo().player_selected_hero_entity_index;
        this.abilityindex = Entities.GetAbilityByName(castentity, "courier_draw_card_v1");
        this.skillitem.current!.onRefreshUI({
            abilityname: "courier_draw_card_v1",
            castEntityIndex: castentity,
        });
        this.updateSelf();
    }

    onbtn_castability = () => {
        Abilities.ExecuteAbility(this.abilityindex, Game.GetLocalPlayerInfo().player_selected_hero_entity_index, false);
    };
    onRefreshUI() {}
}
