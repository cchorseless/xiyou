import React, { createRef, PureComponent } from "react";
import { DOTAParticleScenePanelAttributes, PanelAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../CCPanel/CCPanel";
import { NodePropsData } from "../../../libs/BasePureComponent";

interface ICCPortrait extends NodePropsData {
    hudType: string
}

export class CCPortrait extends CCPanel<ICCPortrait> {
    render() {
        return (
            this.__root___isValid && (
                <GenericPanel type="DOTAPortrait" className="PortraitLocation CC_root" id={this.props.hudType} ref={this.__root__}  >
                    {this.props.children}
                    {this.__root___childs}
                </GenericPanel>
            )
        );
    }
}

interface ICCPortraitGroup {
    particleAttrs: NodePropsData
}

export class CCPortraitGroup extends CCPanel<ICCPortraitGroup> {

    render() {
        return (
            this.__root___isValid && (
                <CCPanel id="PortraitGroup" width="200px" height="200px" ref={this.__root__}  {...this.initRootAttrs()}>
                    <DOTAParticleScenePanel id="PortraitStreakParticle" particleonly={true} cameraOrigin="-300 0 150" lookAt="0 0 180" fov={50} hittest={false} {...this.props.particleAttrs} />
                    <Panel id="PortraitStreakParticleBorder" hittest={false} />
                    <Panel id="PortraitBacker" hittest={false} />
                    <Panel id="PortraitBackerColor" hittest={false} />
                    <CCPanel id="PortraitContainer" width="200px" height="200px" hittest={false}>
                        <CCPortrait hudType={"portraitHUD"} />
                        <CCPortrait hudType={"portraitHUDOverlay"} />
                        <Image id="RightSideHeroBlur" src="panel://portraitHUD" hittest={false} />
                        <Panel id="SilenceIcon" hittest={false} always-cache-composition-layer={true} />
                        <Panel id="MutedIcon" hittest={false} always-cache-composition-layer={true} />
                        <Panel id="DeathGradient" />
                    </CCPanel>
                    {this.props.children}
                    {this.__root___childs}
                </CCPanel>
            )
        );
    }
}