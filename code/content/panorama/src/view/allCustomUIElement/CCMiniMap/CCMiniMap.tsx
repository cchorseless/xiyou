import React, { createRef, PureComponent } from "react";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { PanelAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../CCPanel/CCPanel";

interface ICCMiniMap extends NodePropsData {
}

export class CCMiniMap extends CCPanel<ICCMiniMap> {
    NODENAME = { __root__: "__root__" };

    defaultStyle = () => {
        return {
            width: "250px",
            borderRadius: "5px",
            horizontalAlign: "left",
            verticalAlign: "bottom",
        }
    }

    render() {
        return (
            this.__root___isValid && (
                <Panel
                    id="minimap_container"
                    hittest={false}
                    disallowedstyleflags="hover,descendantfocus"
                    ref={this.__root__}
                    {...this.initRootAttrs()}
                >
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
