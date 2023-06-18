import React from "react";
import { PathHelper } from "../../helper/PathHelper";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCRankIconItem.less";


interface ICCRankIconItem {
    score: number
}

export class CCRankIconItem extends CCPanel<ICCRankIconItem> {

    render() {
        const score = this.props.score;
        const ilevel = GJsonConfigHelper.GetRankScoreExpItemConfigId(score)!
        const config = GJSONConfig.RankBattleScoreExpConfig.get(ilevel)!;
        return <Panel className={"CCRankIconItem"} ref={this.__root__}  {...this.initRootAttrs()}>
            <CCPanel id="RankIcon" backgroundImage={PathHelper.getCustomImageUrl(`rank/${config.Icon}.png`)} />
            <Label id="RankDes" text={`${config.Name}`} />
        </Panel>
    }
}