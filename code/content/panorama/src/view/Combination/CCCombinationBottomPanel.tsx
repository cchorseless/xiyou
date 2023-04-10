import React from "react";
import { ECombination } from "../../game/components/Combination/ECombination";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCCombinationSingleBottomItem } from "./CCCombinationSingleBottomItem";

import { GEventHelper } from "../../../../scripts/tscripts/shared/lib/GEventHelper";
import { FHeroCombination } from "../../game/components/FakerHero/FHeroCombination";
import "./CCCombinationBottomPanel.less";

export interface ICCCombinationBottomPanel {
    CurSelectUnit: EntityIndex;
}

export class CCCombinationBottomPanel extends CCPanel<ICCCombinationBottomPanel> {

    curBelongPlayerid: PlayerID;
    onInitUI() {
        GEventHelper.AddEvent(ECombination.name, GHandler.create(this, (e: ECombination) => {
            if (e.BelongPlayerid == this.curBelongPlayerid) {
                this.UpdateSelf()
            }
        }))
    }

    render() {
        const curunit = this.props.CurSelectUnit;
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
        // GLogHelper.print(1111, fakerhero, courier)
        return (
            <Panel ref={this.__root__} className="CCCombinationBottomPanel"    {...this.initRootAttrs()}>
                {
                    Object.keys(combinations).map((v, index) => {
                        const combos = combinations[v].map((entity) => { return entity.InstanceId });
                        return <CCCombinationSingleBottomItem key={index + ""} SectName={v} InstanceIdList={combos} />
                    })
                }
            </Panel>)
    }

}