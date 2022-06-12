import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../../libs/BasePureComponent";
import { DOTAParticleScenePanelAttributes, PanelAttributes } from "react-panorama-eom";
import { CustomPortrait } from "./CustomPortrait";

export class CustomPortraitGroup_UI extends BasePureComponent {
    __root__: React.RefObject<Panel>;
    NODENAME = { __root__: "__root__" };
    FUNCNAME = {};

    constructor(props: any) {
        super(props);
        this.__root__ = createRef<Panel>();
    }
    CSS_0_0: Partial<VCSSStyleDeclaration> = {};

    __root___isValid: boolean = true;
    __root___attrs: PanelAttributes = {};
    __root___childs: Array<JSX.Element> = [];
    __particle___attrs: DOTAParticleScenePanelAttributes = {};
    render() {
        return (
            this.__root___isValid && (
                <Panel id="PortraitGroup" key="compId_1" ref={this.__root__} style={this.CSS_0_0} {...this.props} {...this.__root___attrs}>
                    <DOTAParticleScenePanel id="PortraitStreakParticle" particleonly={true} cameraOrigin="-300 0 150" lookAt="0 0 180" fov={50} hittest={false} {...this.__particle___attrs} />
                    <Panel id="PortraitStreakParticleBorder" hittest={false} className="" />
                    <Panel id="PortraitBacker" hittest={false} />
                    <Panel id="PortraitBackerColor" hittest={false} />
                    <Panel id="PortraitContainer" hittest={false}>
                        <CustomPortrait key="compId_2" hudType={"portraitHUD"} />
                        <CustomPortrait key="compId_3"  hudType={"portraitHUDOverlay"} />
                        <Image id="RightSideHeroBlur" src="panel://portraitHUD" hittest={false} />
                        <Panel id="SilenceIcon" hittest={false} always-cache-composition-layer={true} />
                        <Panel id="MutedIcon" hittest={false} always-cache-composition-layer={true} />
                        <Panel id="DeathGradient" />
                    </Panel>
                    {this.props.children}
                    {this.__root___childs}
                </Panel>
            )
        );
    }
}
