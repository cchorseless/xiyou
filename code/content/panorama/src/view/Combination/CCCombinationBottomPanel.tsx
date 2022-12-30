import React, { } from "react";
import { ECombination } from "../../game/components/Combination/ECombination";
import { CSSHelper } from "../../helper/CSSHelper";
import { KVHelper } from "../../helper/KVHelper";
import { ET } from "../../../../scripts/tscripts/shared/lib/Entity";
import { GameEnum } from "../../../../scripts/tscripts/shared/GameEnum";
import { CCImage } from "../AllUIElement/CCImage/CCImage";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCCombinationSingleBottomItem } from "./CCCombinationSingleBottomItem";

import "./CCCombinationBottomPanel.less";
import { LogHelper } from "../../helper/LogHelper";

export interface ICCCombinationBottomPanel {

}

export class CCCombinationBottomPanel extends CCPanel<ICCCombinationBottomPanel> {

    onReady() {
        return Boolean(GGameScene.Local.CombinationManager)
    }

    onInitUI() {
        this.UpdateState({ curunit: Players.GetLocalPlayerPortraitUnit() || -1 });
        this.addGameEvent(GameEnum.GameEvent.dota_player_update_selected_unit, (e) => {
            this.UpdateState({ curunit: Players.GetLocalPlayerPortraitUnit() });
        });
        this.addGameEvent(GameEnum.GameEvent.dota_player_update_query_unit, (e) => {
            this.UpdateState({ curunit: Players.GetLocalPlayerPortraitUnit() });
        });
    }


    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_CombinationBottomPanel");
        }
        const curunit = this.GetState<EntityIndex>("curunit");
        const courier = GCourierEntityRoot.GetEntity(curunit);
        const fakerhero = GFakerHeroEntityRoot.GetEntity(curunit);
        let combinations: { [k: string]: ECombination[] } = {};
        if (fakerhero) {
            combinations = fakerhero.FHeroCombinationManager.getAllCombination();
        }
        else if (courier) {
            combinations = courier.GetPlayer().CombinationManager.getAllCombination();
        }
        return (
            <Panel ref={this.__root__} id="CC_CombinationBottomPanel"    {...this.initRootAttrs()}>
                {
                    Object.keys(combinations).map((v, index) => {
                        const combos = combinations[v].map((entity) => { return entity.InstanceId });
                        return <CCCombinationSingleBottomItem key={index + ""} combinationName={v} InstanceIdList={combos} />
                    })
                }
            </Panel>)
    }

}