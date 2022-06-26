/** Create By Editor*/
import React, { createRef, useState } from "react";
import { AbilityEntityRoot } from "../../game/components/Ability/AbilityEntityRoot";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { CSSHelper } from "../../helper/CSSHelper";
import { EventHelper } from "../../helper/EventHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { PathHelper } from "../../helper/PathHelper";
import { GameEnum } from "../../libs/GameEnum";
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
        let entity = PlayerScene.PlayerComp.getNetTableETEntity<AbilityEntityRoot>("" + this.abilityindex);
        if (entity) {
            EventHelper.AddClientEvent(
                entity.updateEventName,
                FuncHelper.Handler.create(this, (entity: any) => {
                    this.onRefreshUI(entity);
                })
            );
        }
        this.skillitem.current!.onRefreshUI({
            abilityname: abilityname,
            castEntityIndex: castentity,
        });
        this.onRefreshUI(entity!);
    }

    onbtn_castability = () => {
        Abilities.ExecuteAbility(this.abilityindex, Game.GetLocalPlayerInfo().player_selected_hero_entity_index, false);
    };
    onRefreshUI(entity: AbilityEntityRoot) {
        this.lbl_lv.current!.text = "Lv." + Abilities.GetLevel(this.abilityindex);
        if (entity) {
            this.lbl_cost.current!.text = entity.costCount + "";
            CSSHelper.setBgImageUrl(this.img_cost, PathHelper.getMoneyIcon(entity.costType ));
        }
        this.updateSelf();
    }
}
