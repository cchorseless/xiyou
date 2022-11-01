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

    defaultStyle = () => {
        return {
        }
    }
    render() {
        return (
            this.__root___isValid && (
                <Panel id="PortraitGroup" ref={this.__root__}  {...this.initRootAttrs()}>
                    <GenericPanel type="DOTAUnitName" id="unitname" hittest={false} />
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
                    <CCPanel align="center center" width="100px" height="100px">
                        <GenericPanel type="DOTAXP" id="xp" hittest={false} always-cache-composition-layer="true" require-composition-layer="true" />
                    </CCPanel>
                    {this.props.children}
                    {this.__root___childs}
                </Panel>
            )
        );
    }
}