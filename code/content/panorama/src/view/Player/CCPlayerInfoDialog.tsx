import React from 'react';

import { UnitHelper } from '../../helper/DotaEntityHelper';
import { CCDividerHeader } from '../AllUIElement/CCDivider/CCDividerHeader';
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelBG } from '../AllUIElement/CCPanel/CCPanelPart';
import { CCCourierCard } from '../Courier/CCCourierCard';
import "./CCPlayerInfoDialog.less";

interface ICCPlayerInfoDialog extends NodePropsData {
    Playerid: number;
    isFaker?: boolean;
}

export class CCPlayerInfoDialog extends CCPanel<ICCPlayerInfoDialog> {

    render() {
        const heroData = this.GetState<any>("heroData");
        // const CourierData = this.GetStateEntity(GGameScene.GetPlayer(this.props.Playerid)?.CourierDataComp!);
        let entityid = Players.GetPlayerHeroEntityIndex(this.props.Playerid as PlayerID);
        if (this.props.isFaker) {
            entityid = Players.GetLocalPlayerPortraitUnit()
        }
        const playerData = { heroName: UnitHelper.GetCourierName(entityid) }
        GLogHelper.print(playerData)
        return (
            <Panel ref={this.__root__} id="CC_PlayerInfoDialog" hittest={false} {...this.initRootAttrs()}>
                <CCPanelBG width="600px" type="ToolTip" flowChildren="down">
                    <CCDividerHeader flowChildren="right">
                        <Label text="英雄信息" />
                    </CCDividerHeader>
                    <CCPanel className="AbilityRow" flowChildren="right">
                        <CCCourierCard sCourierName={playerData.heroName} allowrotation={false} showmodel={true} />
                        {/* <CCPortraitV1 key={playerData.heroName} unitname={playerData.heroName} /> */}
                        <CCPanel flowChildren="down" >
                            <Label className="AttributeName" text={"等级：" + (1)} />
                            <Label className="AttributeDescription" text="每获得一个流派星级，等级提升1级，生命提升100点。" />
                            <Label className="AttributeName" text={"连胜：" + 1} />
                            <Label className="AttributeDescription" text="连胜越高，击败对手造成的伤害越高" />
                            <Label className="AttributeName" text={"伤害：" + 1} />
                            <Label className="AttributeDescription" text="击败对手后，对其造成的伤害值。" />
                        </CCPanel>
                    </CCPanel>
                    <CCPanel className="AbilityRow" flowChildren="right">
                        {(heroData && heroData.Ability1) &&
                            <>
                                <DOTAAbilityImage abilityname={heroData.Ability1} />
                                <CCPanel flowChildren="down" marginLeft="6px">
                                    <Label className="AbilityName" text={$.Localize("#DOTA_Tooltip_ability_" + heroData.Ability1)} />
                                    <Label className="AbilityType" text="天赋" />
                                    {/* <Label html className="AbilityDescription" text={replaceValues({
                                        sStr: $.Localize("#DOTA_Tooltip_ability_" + heroData.Ability1 + "_description"),
                                        sAbilityName: heroData.Ability1,
                                        bShowExtra: false,
                                        iLevel: 1,
                                        // bOnlyNowLevelValue: true
                                    })} /> */}
                                </CCPanel>
                            </>
                        }
                    </CCPanel>
                    <CCPanel className="AbilityRow" flowChildren="right">
                        {(heroData && heroData.Ability2) &&
                            <>
                                <DOTAAbilityImage abilityname={heroData.Ability2} />
                                <CCPanel flowChildren="down" marginLeft="6px">
                                    <Label className="AbilityName" text={$.Localize("#DOTA_Tooltip_ability_" + heroData.Ability2)} />
                                    <Label className="AbilityType" text="大招" />
                                    {/* <Label html className="AbilityDescription" text={replaceValues({
                                        sStr: $.Localize("#DOTA_Tooltip_ability_" + heroData.Ability2 + "_description"),
                                        sAbilityName: heroData.Ability2,
                                        bShowExtra: false,
                                        iLevel: 1,
                                        // bOnlyNowLevelValue: true
                                    })} /> */}
                                </CCPanel>
                            </>
                        }
                    </CCPanel>
                    <CCDividerHeader flowChildren="right">
                        <Label text="宝物信息" />
                    </CCDividerHeader>
                    {/* {[...Array(3)].map((_, index) => {
                        const itemIndex = Entities.GetItemInSlot(heroEntIndex, index);
                        if (itemIndex && itemIndex > -1) {
                            const abilityName = Abilities.GetAbilityName(itemIndex);
                            return (
                                <CCPanel key={index} className="AbilityRow" flowChildren="right">
                                    <DOTAItemImage itemname={abilityName} />
                                    <CCPanel flowChildren="down" marginLeft="6px">
                                        <Label className="AbilityName" text={$.Localize("#DOTA_Tooltip_ability_" + abilityName)} />
                                        <Label className="AbilityDescription" html text={replaceValues({
                                            sStr: $.Localize("#DOTA_Tooltip_ability_" + abilityName + "_description"),
                                            sAbilityName: abilityName,
                                            bShowExtra: false,
                                            iLevel: 1,
                                            // bOnlyNowLevelValue: true
                                        })} />
                                    </CCPanel>
                                </CCPanel>
                            );
                        }
                    })} */}
                    <CCDividerHeader flowChildren="right">
                        <Label text="流派" />
                    </CCDividerHeader>
                    {/* <CCPanel flowChildren="down-wrap" style={{ maxHeight: "265px" }} width="100%">
                        {sectNameList.sort((a, b) => { return sectData[b].exp - sectData[a].exp; }).map((sectName: string, index) => {
                            if (index == 0 || playerID == Players.GetLocalPlayer()) {
                                const sectInfo = sectData[sectName];
                                return (
                                    <CCPanel width="50%" key={index} className="AbilityRow" flowChildren="right">
                                        <DOTAAbilityImage abilityname={sectName} />
                                        <CCPanel flowChildren="down" marginLeft="6px">
                                            <Label className="AbilityName" text={$.Localize("#DOTA_Tooltip_ability_" + sectName) + [...Array(sectInfo.level)].map(() => { return "★"; }).join("") + ` (${sectInfo.exp}/${sectInfo.maxExp})`} />
                                            <Label html={true} className="AbilityDescription" text={replaceValues({
                                                sStr: $.Localize("#DOTA_Tooltip_ability_" + sectName + "_description"),
                                                sAbilityName: sectName,
                                                bShowExtra: false,
                                                iLevel: Math.max(0, sectInfo.level - 1),
                                                // bOnlyNowLevelValue: true
                                            })} />
                                        </CCPanel>
                                    </CCPanel>
                                );
                            }
                        })}
                    </CCPanel> */}
                </CCPanelBG>
            </Panel>
        )
    }
}