import React from "react";

import { CCPanel } from "../CCPanel/CCPanel";
import "./CCMiniMap.less";

interface ICCMiniMap extends NodePropsData {
}

export class CCMiniMap extends CCPanel<ICCMiniMap> {


    render() {
        return (
            this.__root___isValid && (
                <Panel
                    id="CC_MiniMap"
                    hittest={false}
                    disallowedstyleflags="hover,descendantfocus"
                    ref={this.__root__}
                    {...this.initRootAttrs()}
                >
                    <Panel id="minimap_block" acceptsfocus={true}>
                        <DOTAMinimap id="minimap" require-composition-layer={true} />
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
