import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../../libs/BasePureComponent";
import { PanelAttributes } from "@demon673/react-panorama";

export class CustomMiniMap_UI extends BasePureComponent {
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
    render() {
        return (
            this.__root___isValid && (
                <Panel
                    id="minimap_container"
                    hittest={false}
                    // disallowedstyleflags="hover,descendantfocus"
                    key="compId_1"
                    ref={this.__root__}
                    // style={this.CSS_0_0}
                    {...this.props}
                    {...this.__root___attrs}
                >
                    {/* acceptsinput={true} */}
                    <Panel id="minimap_block" acceptsfocus={true}>
                        <DOTAMinimap id="minimap" require-composition-layer="true" />
                    </Panel>
                    <Panel id="HUDSkinMinimap" hittest={false} />
                    {/* <Panel id="GlyphScanContainer" hittest="false">
                            <DOTARadarButton id="RadarButton" onactivate="DOTAHUDRadarButtonClicked();" onmouseout="DOTAHUDHideRadarTooltip();" onmouseover="DOTAHUDShowRadarTooltip();" />
                            <DOTAGlyph id="glyph" />
                        </Panel>
                        <Panel id="RoshanTimerContainer" hittest="false">
                            <DOTARoshanTimer id="RoshanTimer" />
                        </Panel> */}
                    {this.props.children}
                    {this.__root___childs}
                </Panel>
            )
        );
    }
}
