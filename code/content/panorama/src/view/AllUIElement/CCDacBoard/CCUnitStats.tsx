import React, { createRef } from "react";
import { PathHelper } from "../../../helper/PathHelper";
import { CCPanel } from "../CCPanel/CCPanel";


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
        PathHelper.setPanelBgImageUrl(DamageIcon, `custom_game/eom_design/ccunitstats/icon_props_damage.png`);
        let armorIcon = this.stats.current!.FindChildTraverse("ArmorIcon")!;
        PathHelper.setPanelBgImageUrl(armorIcon, `custom_game/eom_design/ccunitstats/icon_props_armor.png`);
        let speedIcon = this.stats.current!.FindChildTraverse("MoveSpeedIcon")!;
        PathHelper.setPanelBgImageUrl(speedIcon, `custom_game/eom_design/ccunitstats/icon_props_speed.png`);

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
                        <GenericPanel type="DOTAHUDStrAgiInt" id="stragiint" ref={this.stragiint} className="stragiintDiv" always-cache-composition-layer={true} require-composition-layer={true} hittest={false} />
                        <Panel id="HUDSkinPreCenterParticlesLeft" className="hud_skinnable" hittest={false} />
                        {this.__root___childs}
                        {this.props.children}
                    </CCPanel>
                </Panel>
            )
        );
    }
}
