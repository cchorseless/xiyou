import React, { createRef, useState } from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";

import "./CCRankEmblem.less";


interface ICCRankEmblem extends NodePropsData {
    rank: number,
}

export class CCRankEmblem extends CCPanel<ICCRankEmblem> {

    render() {
        const rank = this.props.rank;
        return <Panel className={CSSHelper.ClassMaker("CCRankEmblem", "Rank" + rank)} ref={this.__root__}  {...this.initRootAttrs()}>
            <Label id="EndlessRankEmblemRank" localizedText="{d:r:rank}" hittest={false} dialogVariables={{ rank: rank }} />
            {/* {rank == 7 && <DOTAParticleScenePanel key="EndlessRankEmblemRankScenePanel" className="EndlessRankEmblemRankScenePanel" hittest={false} particleonly={true} particleName={`particles/ui/hud/rank_${rank}.vpcf`} cameraOrigin="100 0 0" lookAt="0 0 0" fov={40} />} */}
            {rank == 7 && <Panel id="EndlessRankEmblemRank_Widget1" hittest={false} ><Panel /></Panel>}
        </Panel>
    }
}