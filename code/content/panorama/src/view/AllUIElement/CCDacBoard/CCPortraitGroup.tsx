import React from "react";

import { CCPanel } from "../CCPanel/CCPanel";
import { CCPortrait } from "../CCPortrait/CCPortrait";
import { CCDOTAXP } from "./CCDOTAXP";
import { CCUnitStats } from "./CCUnitStats";

import "./CCPortraitGroup.less";

interface ICCPortraitGroup {
    particleAttrs: NodePropsData;
    CurSelectUnit: EntityIndex;

}

export class CCPortraitGroup extends CCPanel<ICCPortraitGroup> {


    render() {
        return (
            this.__root___isValid && (
                <Panel id="CC_PortraitGroup" ref={this.__root__}  {...this.initRootAttrs()}>
                    <GenericPanel type="DOTAUnitName" id="unitname" hittest={false} style={{ width: "100%" }} />
                    <CCPanel>
                        <CCPanel id="PortraitGroup" marginLeft={"0px"}>
                            <DOTAParticleScenePanel id="PortraitStreakParticle" particleonly={true} cameraOrigin="-300 0 150" lookAt="0 0 180" fov={50} hittest={false} {...this.props.particleAttrs} />
                            <Panel id="PortraitStreakParticleBorder" hittest={false} />
                            <Panel id="PortraitBacker" hittest={false} />
                            <Panel id="PortraitBackerColor" hittest={false} />
                            <CCPanel id="PortraitContainer" width="100%" height="100%" hittest={false}>
                                <CCPortrait hudType={"portraitHUD"} width="100%" height="100%" />
                                {/* <CCPortrait hudType={"portraitHUDOverlay"} /> */}
                                <Image id="RightSideHeroBlur" src="panel://portraitHUD" hittest={false} />
                                <Panel id="SilenceIcon" hittest={false} always-cache-composition-layer={true} />
                                <Panel id="MutedIcon" hittest={false} always-cache-composition-layer={true} />
                                <Panel id="DeathGradient" />
                            </CCPanel>
                        </CCPanel>
                        <GenericPanel type="DOTAHUDDeathPanel" id="death_panel_buyback" align="right center" />
                        <CCUnitStats align="right center" />
                        <CCDOTAXP align="right bottom" marginRight={"140px"} CurSelectUnit={this.props.CurSelectUnit} />
                    </CCPanel>
                    {this.props.children}
                    {this.__root___childs}
                </Panel>
            )
        );
    }
}