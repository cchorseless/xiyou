import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { KVHelper } from "../../helper/KVHelper";
import { CCCircleAbilityItem } from "../AllUIElement/CCAbility/CCCircleAbilityItem";
import { CCIconButton } from "../AllUIElement/CCButton/CCIconButton";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCHandBookArtifact.less";


interface ICCHandBookArtifact {
}

export class CCHandBookArtifact extends CCPanel<ICCHandBookArtifact> {

    render() {
        const artifact_items = KVHelper.KVData().artifact_items;
        const itemsNames = Object.keys(artifact_items);
        itemsNames.sort((a, b) => {
            const sRarity_a = artifact_items[a].Rarity || "A";
            const sRarity_b = artifact_items[b].Rarity || "A";
            return KVHelper.GetRarityNumber(sRarity_a) - KVHelper.GetRarityNumber(sRarity_b);
        });
        return <Panel className={CSSHelper.ClassMaker("CCHandBookArtifact")}
            hittest={false}
            ref={this.__root__}  {...this.initRootAttrs()}>
            <CCPanel className="CCHandBookArtifactDiv">
                {itemsNames.map((sItemName, index) => {
                    const rarity = artifact_items[sItemName].Rarity || "A";
                    return (
                        <CCIconButton className="CCHandBookArtifactItem" key={index + ""} flowChildren="down" >
                            <CCCircleAbilityItem itemname={sItemName} showtooltip={true} width="66px" height="66px" horizontalAlign="center" />
                            <CCLabel className="CCHandBookArtifactItemName" color={CSSHelper.GetRarityColor(rarity)} text={$.Localize("#DOTA_Tooltip_ability_" + sItemName)} />
                        </CCIconButton>
                    );
                })}
            </CCPanel>
        </Panel>
    }
}