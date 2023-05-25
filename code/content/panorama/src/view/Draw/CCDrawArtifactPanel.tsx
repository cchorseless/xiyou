import React from "react";
import { DrawConfig } from "../../../../scripts/tscripts/shared/DrawConfig";
import { NetHelper } from "../../helper/NetHelper";
import { CCCircleAbilityItem } from "../AllUIElement/CCAbility/CCCircleAbilityItem";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCIconButton } from "../AllUIElement/CCButton/CCIconButton";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelBG } from "../AllUIElement/CCPanel/CCPanelPart";
import "./CCDrawArtifactPanel.less";
interface ICCDrawArtifactPanel {
    cards: string[];
}


export class CCDrawArtifactPanel extends CCPanel<ICCDrawArtifactPanel> {

    onStartUI() {
        this.__root__.current!.AddClass("PopUpEffect")
    }

    onSelectArtifact(index: number, itemName?: string) {
        NetHelper.SendToLua(DrawConfig.EProtocol.DrawArtifactSelected, {
            index: index,
            itemName: itemName
        });
        this.close();
    }

    render() {
        const artifactSelection = this.props.cards || []
        return (<Panel ref={this.__root__} className="CCDrawArtifactPanel" hittest={false} {...this.initRootAttrs()}>
            <CCPanelBG type="Tui3">
                <CCPanel flowChildren="down" margin="20px 20px">
                    <CCLabel className="ArtifactTitle" text={"神器选择"} />
                    <CCPanel flowChildren="right">
                        {artifactSelection.map((itemName, index) => {
                            return (
                                <CCIconButton key={index + ""} className="ArtifactContainer" onactivate={() => this.onSelectArtifact(index, itemName)}>
                                    <CCCircleAbilityItem id="ArtifactIcon" itemname={itemName} />
                                    <Label className="ItemName" text={$.Localize("#DOTA_Tooltip_ability_" + itemName)} />
                                    <Label className="ItemDescription" html={true} text={Abilities.GetAbilityDescriptionByName(itemName)} />
                                </CCIconButton>
                            );
                        })}
                    </CCPanel>
                    <CCPanel flowChildren="right" horizontalAlign="center">
                        {/* <EOM_Button color="Blue" text={"刷新"} onactivate={() => onActive(undefined, 1)} /> */}
                        <CCButton color="Blue" text={"随机其他"} onactivate={() => this.onSelectArtifact(-1)} tooltip="#Tooltip_ArtifactRandom" />
                    </CCPanel>
                </CCPanel>

            </CCPanelBG>
        </Panel>)
    }
}