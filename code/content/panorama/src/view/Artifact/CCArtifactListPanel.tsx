import React, { createRef, useState } from "react";
import { ArtifactConfig } from "../../../../../game/scripts/tscripts/shared/ArtifactConfig";
import { CSSHelper } from "../../helper/CSSHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCArtifactListPanel.less";

interface ICCArtifactListPanel extends NodePropsData {

}

export class CCArtifactListPanel extends CCPanel<ICCArtifactListPanel> {

    render() {
        return (
            <Panel className="CC_ArtifactListPanel" ref={this.__root__}  {...this.initRootAttrs()}>
                <Button id="ToggleArtifact" onactivate={() => {
                    this.__root__.current?.ToggleClass("ExpandArtifact");
                }}>
                    <Image id="ToggleImg" />
                </Button>
                <Panel id="ArtifactPanelAndTitle" hittest={false}>
                    <Label id="ArtifactTitle" localizedText="#ArtifactTitle" />
                    <Panel id="ArtifactPanel" hittest={false}>
                        <Panel id="ArtifactList" hittest={false}>
                            {
                                [...Array(ArtifactConfig.PLAYER_MAX_ARTIFACT_WITH_EXTRA)].map((item, index) => {
                                    let itemIndex: ItemEntityIndex | undefined = tArtifacts[index + 1];
                                    let bLock = index >= iMaxArtifact;
                                    return (
                                        <CCPanel key={index + "_" + itemIndex} className={CSSHelper.ClassMaker("ArtifactBuffBG", { Lock: bLock })}
                                            onmouseover={(p) => { bLock ? $.DispatchEvent("DOTAShowTextTooltip", p, $.Localize("#Tooltip_Artifact_Slot_Lock")) : (itemIndex != undefined && Tooltips.ShowAbilityTooltip(p, { abilityname: Abilities.GetAbilityName(itemIndex) })); }}
                                            onmouseout={(p) => { bLock ? $.DispatchEvent("DOTAHideTextTooltip", p) : Tooltips.HideAbilityTooltip(p); }}
                                        >
                                            {/* 这里用itemname不会显示灰图 */}
                                            {itemIndex && <CustomItemImage className="ArtifactBuff" showtooltip={false} itemname={Abilities.GetAbilityName(itemIndex)} />}
                                        </CCPanel>
                                    );
                                })
                            }
                        </Panel>
                    </Panel>
                </Panel>
            </Panel>
        );
    }
}