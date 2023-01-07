import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { AbilityHelper } from "../../helper/DotaEntityHelper";

import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopupBG } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import "./CCArtifactSelectionDialog.less";

interface ICCArtifactSelectionDialog extends NodePropsData {
    // playerid: PlayerID;
}

export class CCArtifactSelectionDialog extends CCPanel<ICCArtifactSelectionDialog> {

    render() {
        const courierbag = GGameScene.Local.CourierBagComp!;
        return (
            <Panel className={CSSHelper.ClassMaker("CC_ArtifactSelectionDialog")} ref={this.__root__}  {...this.initRootAttrs()}>
                <CCPopupBG type="Tui3" />
                <CCPanel flowChildren="down" margin="20px 20px">
                    <CCLabel className="ArtifactTitle" text={"神器选择"} />
                    <CCPanel flowChildren="right">
                        {courierbag.artifactSelection.map((itemName, index) => {
                            return (
                                <CCButton type="Empty" key={index + ""} className="ArtifactContainer" onactivate={() => courierbag.selectArtifact(itemName)}>
                                    <DOTAItemImage itemname={itemName} />
                                    <Label className="ItemName" text={$.Localize("#DOTA_Tooltip_ability_" + itemName)} />
                                    <Label className="ItemDescription" html text={AbilityHelper.GetAbilityDescriptionByName(itemName)} />
                                </CCButton>
                            );
                        })}
                    </CCPanel>
                    <CCPanel flowChildren="right" horizontalAlign="center">
                        {/* <CCButton color="Blue" text={"刷新"} onactivate={() => onActive(undefined, 1)} /> */}
                        <CCButton color="Blue" text={"随机"} onactivate={() => courierbag.selectArtifact(undefined, undefined, 1)} tooltip="#Tooltip_ArtifactRandom" />
                    </CCPanel>
                </CCPanel>
            </Panel >
        )
    }
}