import React from "react";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelHeader } from "../AllUIElement/CCPanel/CCPanelPart";
import "./CCArtifactInfoDialog.less";


interface ICCArtifactInfoDialog extends NodePropsData {
    itemname: string;
}

export class CCArtifactInfoDialog extends CCPanel<ICCArtifactInfoDialog> {

    render() {
        const itemname = this.props.itemname!;
        const lore = $.Localize("#DOTA_Tooltip_ability_" + itemname + "_Lore");
        return (
            <Panel ref={this.__root__}  {...this.initRootAttrs()}>
                <CCPanel className="CC_ArtifactInfoDialog"  >
                    <CCPanelHeader flowChildren="right">
                        <DOTAItemImage className="SectImage" itemname={itemname} />
                        <CCPanel flowChildren="down" marginLeft="8px" height="100%">
                            <Label id="SectNameHeader" html={true} text={$.Localize("#DOTA_Tooltip_ability_" + itemname)} />
                            {/* <Label id="ArtifactLevel" html={true} localizedText="#ArtifactLevel" dialogVariables={{ level: 1 }} /> */}
                        </CCPanel>
                    </CCPanelHeader>
                    <CCPanel className="SectRow" flowChildren="right">
                        <Label className="SectDescription" html={true} text={Abilities.GetAbilityDescriptionByName(itemname)} />
                    </CCPanel>
                    {lore != "#DOTA_Tooltip_ability_" + itemname + "_Lore" &&
                        <CCPanel id="LoreContainer">
                            <Label html={true} text={lore} />
                        </CCPanel>
                    }
                </CCPanel>
            </Panel>
        )
    }
}
