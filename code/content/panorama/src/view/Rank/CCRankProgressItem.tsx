import React from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { PathHelper } from "../../helper/PathHelper";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCRankProgressItem.less";


interface ICCRankProgressItem extends NodePropsData {
}

export class CCRankProgressItem extends CCPanel<ICCRankProgressItem> {

    render() {
        const RankComp = GGameScene.Local.TCharacter.RankComp!;
        const selfdata0 = RankComp.GetRankData(GameProtocol.ERankType.SeasonBattleSorceRank)!;
        const iXP = selfdata0.Score;
        const ilevel = selfdata0.GetLevel()
        const config = GJSONConfig.RankBattleScoreExpConfig.get(ilevel)!;
        const confignext = GJSONConfig.RankBattleScoreExpConfig.get(ilevel + 1)!;
        return <Panel className={"CCRankProgressItem"} ref={this.__root__}  {...this.initRootAttrs()}>
            <CCPanel id="RankTimerAndLevel" hittest={false}  >
                <CCPanel id="RankIcon" backgroundImage={PathHelper.getCustomImageUrl(`rank/${config.Icon}.png`)} />
                <Panel id="RankLevel" hittest={false}>
                    <ProgressBar value={config.ScoreMax > 0 ? (iXP - config.ScoreMin) / (config.ScoreMax - config.ScoreMin) : 1}>
                        <Label text={config.ScoreMax > 0 ? `${iXP} / ${config.ScoreMax}` : "已满级"} />
                    </ProgressBar>
                    {
                        confignext ? <CCLabel id="RankDes" text={`${config.Name}     =>     ${confignext.Name}`} type="UnitName" />
                            : <CCLabel id="RankDes" text={`最高段位：${config.Name}`} type="UnitName" />
                    }

                </Panel>
                {
                    confignext && <CCPanel id="RankIcon" backgroundImage={PathHelper.getCustomImageUrl(`rank/${confignext.Icon}.png`)} />
                }
            </CCPanel>
        </Panel>
    }
}