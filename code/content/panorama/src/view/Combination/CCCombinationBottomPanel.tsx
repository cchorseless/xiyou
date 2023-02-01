import React from "react";
import { GameEnum } from "../../../../scripts/tscripts/shared/GameEnum";
import { ECombination } from "../../game/components/Combination/ECombination";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCCombinationSingleBottomItem } from "./CCCombinationSingleBottomItem";

import { GEventHelper } from "../../../../scripts/tscripts/shared/lib/GEventHelper";
import { FHeroCombination } from "../../game/components/FakerHero/FHeroCombination";
import "./CCCombinationBottomPanel.less";

export interface ICCCombinationBottomPanel {

}

export class CCCombinationBottomPanel extends CCPanel<ICCCombinationBottomPanel> {

    curBelongPlayerid: PlayerID;
    onInitUI() {
        this.UpdateState({ curunit: Players.GetLocalPlayerPortraitUnit() || -1 });
        this.addGameEvent(GameEnum.GameEvent.dota_player_update_selected_unit, (e) => {
            this.UpdateState({ curunit: Players.GetLocalPlayerPortraitUnit() });
        });
        this.addGameEvent(GameEnum.GameEvent.dota_player_update_query_unit, (e) => {
            this.UpdateState({ curunit: Players.GetLocalPlayerPortraitUnit() });
        });
        GEventHelper.AddEvent(ECombination.name, GHandler.create(this, (e: ECombination) => {
            if (e.BelongPlayerid == this.curBelongPlayerid) {
                this.updateSelf()
            }
        }))
    }

    render() {
        const curunit = this.GetState<EntityIndex>("curunit");
        const courier = GCourierEntityRoot.GetEntity(curunit);
        const fakerhero = GFakerHeroEntityRoot.GetEntity(curunit);
        let combinations: { [k: string]: ECombination[] } = {};
        if (fakerhero) {
            this.curBelongPlayerid = fakerhero.BelongPlayerid;
            combinations = FHeroCombination.GetAllCombination(fakerhero.BelongPlayerid);
        }
        else if (courier) {
            this.curBelongPlayerid = courier.BelongPlayerid;
            combinations = ECombination.GetAllCombination(courier.BelongPlayerid);
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