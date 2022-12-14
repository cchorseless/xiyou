import React, { createRef, PureComponent } from "react";
import { DOTAParticleScenePanelAttributes, PanelAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../CCPanel/CCPanel";
import { CSSHelper } from "../../../helper/CSSHelper";
import { LogHelper } from "../../../helper/LogHelper";


interface ICCUnitStats {

}

export class CCUnitStats extends CCPanel<ICCUnitStats>  {

    stats: React.RefObject<Panel>;
    stragiint: React.RefObject<Panel>;
    onInitUI() {
        this.stats = createRef<Panel>();
        this.stragiint = createRef<Panel>();
    }

    onStartUI() {
        this.stats.current!.style.height = "72px";
        this.stragiint.current!.style.height = "66px";
        this.stragiint.current!.style.verticalAlign = "bottom";
        this.stragiint.current!.style.horizontalAlign = "right";
        this.stragiint.current!.style.marginBottom = "0px";
        this.stragiint.current!.style.marginRight = "5px";
        let DamageIcon = this.stats.current!.FindChildTraverse("DamageIcon")!;
        CSSHelper.setPanelBgImageUrl(DamageIcon, `common/icon_props_damage.png`);
        let armorIcon = this.stats.current!.FindChildTraverse("ArmorIcon")!;
        CSSHelper.setPanelBgImageUrl(armorIcon, `common/icon_props_armor.png`);
        let speedIcon = this.stats.current!.FindChildTraverse("MoveSpeedIcon")!;
        CSSHelper.setPanelBgImageUrl(speedIcon, `common/icon_props_speed.png`);

    }

    render() {
        return (
            this.__root___isValid && (
                <Panel id="CC_UnitStats" ref={this.__root__} hittest={false}{...this.initRootAttrs()}>
                    <CCPanel id="stats_container" hittest={false} marginLeft="0px">
                        <Panel id="stats_container_bg" hittest={false} />
                        <Panel id="HUDSkinStatBranchBG" className="hud_skinnable" hittest={false} />
                        <Panel id="HUDSkinStatBranchGlow" className="hud_skinnable" hittest={false} />
                        <GenericPanel type="DOTAStatsRegion" id="stats" ref={this.stats} className="ShowSplitLabels statsDiv" hittest={false} />
                        <GenericPanel type="DOTAHUDStrAgiInt" id="stragiint" ref={this.stragiint} className="stragiintDiv" always-cache-composition-layer="true" require-composition-layer="true" hittest={false} />
                        <Panel id="HUDSkinPreCenterParticlesLeft" className="hud_skinnable" hittest={false} />
                        {this.__root___childs}
                        {this.props.children}
                    </CCPanel>
                </Panel>
            )
        );
    }
}
