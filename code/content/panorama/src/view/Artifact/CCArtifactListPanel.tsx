import React, { createRef, useState } from "react";
import { PublicBagConfig } from "../../../../scripts/tscripts/shared/PublicBagConfig";
import { CSSHelper } from "../../helper/CSSHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCIcon_Lock } from "../AllUIElement/CCIcons/CCIcon_Lock";
import { CCItemImage } from "../AllUIElement/CCItem/CCItemImage";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCArtifactListPanel.less";

interface ICCArtifactListPanel extends NodePropsData {
    // playerid: PlayerID;
}

export class CCArtifactListPanel extends CCPanel<ICCArtifactListPanel> {

    onReady() {
        return GGameScene.Local.CourierBagComp != null
    }
    onInitUI() {
        // this.useEffectProps(() => {
        //     const playerid = this.props.playerid;
        //     PlayerScene.EntityRootManage.getPlayer(playerid)?.CourierBagComp?.RegRef(this);
        // }, "playerid");
        GGameScene.Local.CourierBagComp.RegRef(this);
    }

    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_ArtifactListPanel") };
        const CourierBag = this.GetStateEntity(GGameScene.Local.CourierBagComp)!;
        const tArtifacts = CourierBag?.getAllArtifact() || [];
        const len = tArtifacts.length;
        const ExpandArtifact = this.GetState<boolean>("ExpandArtifact", false);
        return (
            <Panel id="CC_ArtifactListPanel" ref={this.__root__}  {...this.initRootAttrs()}>
                <Button id="ToggleArtifact"
                    className={CSSHelper.ClassMaker({ ExpandArtifact: ExpandArtifact })}
                    onactivate={
                        () => {
                            // $.Msg(GLogHelper == null)
                            GLogHelper.print(111111);
                            this.UpdateState({ ExpandArtifact: !ExpandArtifact })
                        }}>
                    <Image id="ToggleImg" />
                </Button>
                <Panel id="ArtifactPanelAndTitle" className={CSSHelper.ClassMaker({ ExpandArtifact: ExpandArtifact })} hittest={false}>
                    <Label id="ArtifactTitle" localizedText="#ArtifactTitle" />
                    <Panel id="ArtifactPanel" hittest={false}>
                        <Panel id="ArtifactList" hittest={false}>
                            {
                                [...Array(PublicBagConfig.PLAYER_MAX_ARTIFACT_WITH_EXTRA)].map((item, index) => {
                                    let itemIndex = ((len > index) ? tArtifacts[index].EntityId : null) as ItemEntityIndex;
                                    let bLock = index >= CourierBag.iMaxArtifact;
                                    return (
                                        <CCPanel key={index + "_"} className="ArtifactBuffBG">
                                            {bLock && <CCIcon_Lock id="imglock" tooltip={$.Localize("#Tooltip_Artifact_Slot_Lock")} />}
                                            {(!bLock) && itemIndex && <CCItemImage className="ArtifactBuff" showtooltip={false} itemname={Abilities.GetAbilityName(itemIndex)} />}
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