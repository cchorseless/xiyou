import React, { } from "react";
import { ECombination } from "../../game/components/Combination/ECombination";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { CSSHelper } from "../../helper/CSSHelper";
import { KVHelper } from "../../helper/KVHelper";
import { ET } from "../../libs/Entity";
import { GameEnum } from "../../libs/GameEnum";
import { CCImage } from "../allCustomUIElement/CCImage/CCImage";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import "./CCCombinationBottomPanel.less";
import { CCCombinationSingleBottomItem } from "./CCCombinationSingleBottomItem";
export interface ICCCombinationBottomPanel {

}

export class CCCombinationBottomPanel extends CCPanel<ICCCombinationBottomPanel> {


    onInitUI() {
        this.UpdateState({ curunit: Players.GetLocalPlayerPortraitUnit() || -1 });
        this.addGameEvent(GameEnum.GameEvent.dota_player_update_selected_unit, (e) => {
            this.UpdateState({ curunit: Players.GetLocalPlayerPortraitUnit() });
        });
    }


    render() {
        const curunit = this.GetState<EntityIndex>("curunit");
        const player = PlayerScene.EntityRootManage.isHero(curunit);
        const fakerhero = PlayerScene.EntityRootManage.isFakerHero(curunit);
        let combinations: { [k: string]: ECombination[] } = {};
        if (fakerhero) {
            combinations = fakerhero.FHeroCombinationManager.getAllCombination();
        }
        else if (player) {
            combinations = player.CombinationManager.getAllCombination();
        }

        return (this.__root___isValid &&
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