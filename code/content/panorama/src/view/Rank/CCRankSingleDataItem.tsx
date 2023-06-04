import React from "react";
import { CCAvatar } from "../AllUIElement/CCAvatar/CCAvatar";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCUserName } from "../AllUIElement/CCUserName/CCUserName";
import "./CCRankSingleDataItem.less";


interface ICCRankSingleDataItem {
    rank: number,
    score: string,
    accoundid: string,
}

export class CCRankSingleDataItem extends CCPanel<ICCRankSingleDataItem> {


    render() {
        const accoundid = this.props.accoundid;
        const rank = this.props.rank;
        const score = this.props.score;
        const rankDes = $.Localize(`#${rank}`)
        const ScoreDes = $.Localize(`#${score}`)
        return <Panel className={"CCRankSingleDataItem"} ref={this.__root__}  {...this.initRootAttrs()}>
            <CCLabel id="RankDes" type="UnitName" text={rankDes} hittest={false} width="80px" marginLeft={"10px"} />
            <CCAvatar id="playerAvatar" width="48px" height="48px" accountid={accoundid} />
            <CCUserName id="PlayerName" accountid={accoundid} width="120px" height="24px" fontSize={"24"} />
            <CCLabel id="RankDes" type="UnitName" text={ScoreDes} hittest={false} width="100px" marginLeft={"30px"} />
        </Panel>
    }
}