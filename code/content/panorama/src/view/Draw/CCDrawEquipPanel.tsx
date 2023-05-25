import React from "react";
import { DrawConfig } from "../../../../scripts/tscripts/shared/DrawConfig";
import { CSSHelper } from "../../helper/CSSHelper";
import { NetHelper } from "../../helper/NetHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCIconButton } from "../AllUIElement/CCButton/CCIconButton";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelBG } from "../AllUIElement/CCPanel/CCPanelPart";
import "./CCDrawEquipPanel.less";
interface ICCDrawEquipPanel {
    cards: string[];
}


export class CCDrawEquipPanel extends CCPanel<ICCDrawEquipPanel> {
    onStartUI() {
        this.__root__.current!.AddClass("PopUpEffect")
    }

    onSelectEquip(index: number, itemName?: string) {
        NetHelper.SendToLua(DrawConfig.EProtocol.DrawEquipSelected, {
            index: index,
            itemName: itemName
        });
        this.close();
    }

    render() {
        const equips = this.props.cards || []
        return (<Panel ref={this.__root__} className="CCDrawEquipPanel" hittest={false} {...this.initRootAttrs()}>
            <CCPanelBG type="Tui3">
                <CCPanel flowChildren="down" margin="20px 20px">
                    <CCLabel className="EquipTitle" text={"装备选择"} />
                    <CCPanel flowChildren="right">
                        {equips.map((itemName, index) => {
                            const rarity = Abilities.GetAbilityRarity(itemName)
                            return (
                                <CCIconButton key={index + ""} className="EquipContainer" onactivate={() => this.onSelectEquip(index, itemName)}>
                                    <DOTAItemImage itemname={itemName} />
                                    <CCLabel className="ItemName" text={$.Localize("#DOTA_Tooltip_ability_" + itemName)} color={CSSHelper.GetRarityColor(rarity)} />
                                    <Label className="ItemDescription" html={true} text={Abilities.GetAbilityDescriptionByName(itemName)} />
                                </CCIconButton>
                            );
                        })}
                    </CCPanel>
                    <CCPanel flowChildren="right" horizontalAlign="center">
                        {/* <EOM_Button color="Blue" text={"刷新"} onactivate={() => onActive(undefined, 1)} /> */}
                        <CCButton color="Blue" text={"随机其他"} onactivate={() => this.onSelectEquip(-1)} tooltip="#Tooltip_EquipRandom" />
                    </CCPanel>
                </CCPanel>

            </CCPanelBG>
        </Panel>)
    }
}