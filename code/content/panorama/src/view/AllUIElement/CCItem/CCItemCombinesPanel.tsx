import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCIconButton } from "../CCButton/CCIconButton";
import { CCIcon_Arrow } from "../CCIcons/CCIcon_Arrow";
import { CCIcon_XClose } from "../CCIcons/CCIcon_XClose";
import { CCLabel } from "../CCLabel/CCLabel";
import { CCPanel } from "../CCPanel/CCPanel";
import { CCPanelBG } from "../CCPanel/CCPanelPart";
import "./CCItemCombinesPanel.less";
import { CCItemImage } from "./CCItemImage";
interface ICCItemCombinesPanel extends NodePropsData {
    itemname: string,
}

export class CCItemCombinesPanel extends CCPanel<ICCItemCombinesPanel> {


    onclick(_itemname: string) {
        this.UpdateState({ curitemname: _itemname })
    }

    render() {
        const itemname = this.GetState<string>("curitemname") || this.props.itemname;
        const Combinables = Items.GetCombinableItems(itemname);
        const Disassembles = Items.GetDisassembleItems(itemname);
        return <Panel className="CCItemCombinesPanel" ref={this.__root__}   {...this.initRootAttrs()}>
            <CCIconButton className="XCloseButton" zIndex={2} type={this.props.type} icon={<CCIcon_XClose type={this.props.type} />}
                onactivate={() => {
                    this.close()
                }} />
            <CCPanelBG flowChildren="down" type="Tui3">
                {
                    Combinables && Combinables.length > 0 &&
                    <CCPanel className="ItemInfoDiv">
                        <CCLabel className="ItemInfoName" text={"可合成"} />
                        <CCPanel flowChildren="right" marginTop={"10px"}>

                            {
                                Combinables.map((_itemname, index) => {
                                    const rarity = Abilities.GetAbilityRarity(_itemname)
                                    return <CCPanel flowChildren="down" marginLeft={"10px"} key={index + ""}>
                                        <CCItemImage key={index + ""} className="ItemInfo" itemname={_itemname} showtooltip={true} onactivate={() => this.onclick(_itemname)} />
                                        <CCLabel className="ItemInfoName" color={CSSHelper.GetRarityColor(rarity)} text={$.Localize("#DOTA_Tooltip_ability_" + _itemname)} />
                                    </CCPanel>
                                })
                            }
                        </CCPanel>
                    </CCPanel>
                }
                {Combinables && Combinables.length > 0 && <CCIcon_Arrow key="UP" width="50px" height="40px" type="SolidUp" horizontalAlign="center" />}
                <CCPanel className="ItemInfoDiv" >
                    <CCPanel flowChildren="right" marginLeft={"10px"} >
                        <CCItemImage className="ItemInfo" itemname={itemname} showtooltip={true} />
                        <CCLabel className="ItemInfoName" color={CSSHelper.GetRarityColor(Abilities.GetAbilityRarity(itemname))} text={$.Localize("#DOTA_Tooltip_ability_" + itemname)} />
                    </CCPanel>
                </CCPanel>
                {Disassembles && Disassembles.length > 0 && <CCIcon_Arrow key="DOWN" width="50px" height="40px" type="SolidDown" horizontalAlign="center" />}

                {
                    Disassembles && Disassembles.length > 0 &&
                    <CCPanel className="ItemInfoDiv" >
                        <CCLabel className="ItemInfoName" text={"可分解"} />
                        <CCPanel flowChildren="right" marginTop={"10px"}>
                            {
                                Disassembles.map((_itemname, index) => {
                                    const rarity = Abilities.GetAbilityRarity(_itemname)
                                    return <CCPanel flowChildren="down" marginLeft={"10px"} key={index + ""}>
                                        <CCItemImage key={index + ""} className="ItemInfo" itemname={_itemname} showtooltip={true} onactivate={() => this.onclick(_itemname)} />
                                        <CCLabel className="ItemInfoName" color={CSSHelper.GetRarityColor(rarity)} text={$.Localize("#DOTA_Tooltip_ability_" + _itemname)} />
                                    </CCPanel>
                                })
                            }
                        </CCPanel>
                    </CCPanel>
                }
            </CCPanelBG>

        </Panel>
    }
}