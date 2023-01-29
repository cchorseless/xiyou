import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCRankEmblem.less";


interface ICCRankEmblem extends NodePropsData {
    rank: number,
}

export class CCRankEmblem extends CCPanel<ICCRankEmblem> {

    render() {
        const rank = this.props.rank;
        const rankDes = $.Localize(`#${rank}`)
        return <Panel className={CSSHelper.ClassMaker("CCRankEmblem", "Rank" + rank)}
            ref={this.__root__}  {...this.initRootAttrs()}>
            <Label id="EndlessRankEmblemRank" text={rankDes} hittest={false} />
            {/* {rank == 7 && <DOTAParticleScenePanel key="EndlessRankEmblemRankScenePanel" className="EndlessRankEmblemRankScenePanel" hittest={false} particleonly={true} particleName={`particles/ui/hud/rank_${rank}.vpcf`} cameraOrigin="100 0 0" lookAt="0 0 0" fov={40} />} */}
            {rank == 7 &&
                <Panel id="EndlessRankEmblemRank_Widget1" hittest={false} >
                    <Panel id="Widget1Div" />
                </Panel>}
        </Panel>
    }
}