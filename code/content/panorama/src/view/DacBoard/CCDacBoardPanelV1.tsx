import React from "react";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";


interface ICCDacBoardPanel {

}
export class CCDacBoardPanelV1 extends CCPanel<ICCDacBoardPanel> {

    onStartUI() {
        this.__root__.current!.style.height = "500px"
    }

    defaultStyle = () => {
        return { disallowedstyleflags: "hover,descendantfocus" }
    }

    render() {
        return (
            this.__root___isValid &&
            <Panel id="lower_hud" ref={this.__root__} hittest={false}  {...this.initRootAttrs()}>
                <Panel id="StatBranchDrawer" hittest={false}>
                    <GenericPanel type="DOTAStatBranch" id="statbranchdialog" hittest={false} />
                </Panel>
                <GenericPanel type="DOTABuffList" id="buffs" showdebuffs={false} />
                <GenericPanel type="DOTABuffList" id="debuffs" showbuffs={false} />
                < GenericPanel type="DOTASpellCard" id="InvokerSpellCard" hittest={false} />
                <CCPanel id="center_with_stats" hittest={false} disallowedstyleflags="hover,descendantfocus" >
                    <CCPanel id="center_block" hittest={false} disallowedstyleflags="hover,descendantfocus" >
                        <Panel id="left_flare" />
                        <Panel id="center_bg" />
                        <Panel id="HUDSkinPortrait" hittest={false} />
                        <Panel id="HUDSkinXPBackground" hittest={false} />
                        <GenericPanel type="DOTAMultiUnit" id="multiunit" class="PortraitLocation" />
                        <Panel id="PortraitBacker" hittest={false} />
                        <Panel id="PortraitBackerColor" hittest={false} />
                        <Panel id="PortraitContainer" hittest={false}>
                            <GenericPanel type="DOTAPortrait" id="portraitHUD" class="PortraitLocation" />
                            <GenericPanel type="DOTAPortrait" id="portraitHUDOverlay" class="PortraitLocation" />
                            <Panel id="SilenceIcon" hittest={false} always-cache-composition-layer="true" />
                            <Panel id="MutedIcon" hittest={false} always-cache-composition-layer="true" />
                            <Panel id="DeathGradient" />
                        </Panel>
                        <GenericPanel type="DOTAHUDDeathPanel" id="death_panel_buyback" />
                        <GenericPanel type="DOTAXP" id="xp" hittest={false} always-cache-composition-layer="true" require-composition-layer="true" />
                        <Panel id="stats_container" hittest={false} >
                            <Panel id="stats_container_bg" hittest={false} />
                            <Panel id="HUDSkinStatBranchBG" hittest={false} />
                            <Panel id="HUDSkinStatBranchGlow" hittest={false} />
                            <GenericPanel type="DOTAStatsRegion" id="stats" class="ShowSplitLabels" hittest={false} />
                            <GenericPanel type="DOTAHUDStrAgiInt" id="stragiint" always-cache-composition-layer="true" require-composition-layer="true" hittest={false} />
                            {/* "DOTAHUDShowDamageArmorTooltip();" */}
                            <GenericPanel type="DOTAPortraitStatsClickRegion" id="stats_tooltip_region" acceptsinput="true" onmouseover={() => { }} onmouseout={() => { }} />
                        </Panel>
                        <Panel hittest={false} id="RecommendedUpgradeOverlay" >
                            <Panel hittest={false} className="BorderEdge BorderTop" />
                            <Panel hittest={false} className="BorderEdge BorderRight" />
                            <Panel hittest={false} className="BorderEdge BorderBottom" />
                            <Panel hittest={false} className="BorderEdge BorderLeft" />
                        </Panel>
                        <GenericPanel type="DOTAUnitName" id="unitname" hittest={false} />
                        <GenericPanel type="DOTAHUDLevelStatsFrame" id="level_stats_frame" hittest={false} onmouseover={() => { }} onmouseout={() => { }} />
                        <GenericPanel type="DOTALevelUpButton" id="levelup" hittest={false} />
                        <GenericPanel type="DOTAHealthMana" id="health_mana" />
                        <Panel id="HUDSkinAbilityContainerBG" hittest={false} />
                        <Panel className="AbilityInsetShadowLeft" />
                        <GenericPanel type="DOTAHotkey" id="StatBranchHotkey" keybind="LearnStats" hittest={false} />
                        <Panel id="AbilitiesAndStatBranch" hittest={false}>
                            <GenericPanel type="DOTATalentDisplay" id="StatBranch" />
                            <GenericPanel type="DOTAAbilityList" id="abilities" hittest={false} />
                        </Panel>
                        <Panel className="AbilityInsetShadowRight" require-composition-layer="true" always-cache-composition-layer="true" />
                        <ProgressBar id="MorphProgress" min={0} max={1} value={0.5} />
                        <GenericPanel type="DOTAUnitEconItem" id="econ_item" />
                        <GenericPanel type="DOTAInventory" id="inventory" slotsDraggable="true" />
                        <Panel id="right_flare" />
                    </CCPanel>
                </CCPanel>
                {this.props.children}
                {this.__root___childs}
            </Panel>

            // </Panel >
        )
    }
}