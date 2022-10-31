import React, { createRef, PureComponent } from "react";
import { DOTAParticleScenePanelAttributes, PanelAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../CCPanel/CCPanel";

interface ICCUnitStats {

}

export class CCUnitStats extends CCPanel<ICCUnitStats>  {
    stats_container: React.RefObject<Panel>;
    NODENAME = { __root__: "__root__", stats_container: "stats_container" };

    constructor(props: any) {
        super(props);
        this.__root__ = createRef<Panel>();
        this.stats_container = createRef<Panel>();
    }
    CSS_0_0: Partial<VCSSStyleDeclaration> = {};

    __root___isValid: boolean = true;
    __root___attrs: PanelAttributes = {};
    __root___childs: Array<JSX.Element> = [];

    render() {
        return (
            this.__root___isValid && (
                <Panel key="compId_1" className="root" ref={this.__root__} style={this.CSS_0_0} {...this.props} {...this.__root___attrs}>
                    <Panel id="stats_container" ref={this.stats_container} hittest={false}>
                        <Panel id="stats_container_bg" hittest={false} />
                        <Panel id="HUDSkinStatBranchBG" className="hud_skinnable" hittest={false} />
                        <Panel id="HUDSkinStatBranchGlow" className="hud_skinnable" hittest={false} />
                        <GenericPanel type="DOTAStatsRegion" id="stats" className="ShowSplitLabels" hittest={false} />
                        <GenericPanel type="DOTAHUDStrAgiInt" id="stragiint" always-cache-composition-layer="true" require-composition-layer="true" hittest={false} />
                        <Panel id="HUDSkinPreCenterParticlesLeft" className="hud_skinnable" hittest={false} />
                    </Panel>
                    {this.props.children}
                    {this.__root___childs}
                </Panel>
            )
        );
    }
}
