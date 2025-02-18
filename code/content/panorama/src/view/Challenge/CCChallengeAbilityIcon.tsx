import React from "react";
import { CCIcon_CoinType } from "../AllUIElement/CCIcons/CCIcon_CoinType";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";

import { CCAbilityPanel } from "../AllUIElement/CCAbility/CCAbilityPanel";
import "./CCChallengeAbilityIcon.less";

export interface ICCChallengeAbilityIcon {
    abilityname: string,
    contextEntityIndex: AbilityEntityIndex,
    cointype: ICoinType,
}

export class CCChallengeAbilityIcon extends CCPanel<ICCChallengeAbilityIcon> {


    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_ChallengeAbilityIcon");
        }
        const abilityname = this.props.abilityname;
        const abilityindex = this.props.contextEntityIndex;
        let costcount = 0;
        if (this.props.cointype == GEEnum.EMoneyType.Gold) {
            costcount = Abilities.GetLevelGoldCost(abilityindex)
        }
        else if (this.props.cointype == GEEnum.EMoneyType.Wood) {
            costcount = Abilities.GetLevelWoodCost(abilityindex)
        }
        else if (this.props.cointype == GEEnum.EMoneyType.SoulCrystal) {
            costcount = Abilities.GetLevelSoulCrystal(abilityindex)
        }
        return (
            <Panel id="CC_ChallengeAbilityIcon" ref={this.__root__}      {...this.initRootAttrs()}>
                {/* <CCAbilityIcon_Custom onclick={() => this.UpdateSelf()} abilityname={abilityname} contextEntityIndex={abilityindex} horizontalAlign={"center"}>
                    <CCLabel type="Level" text={`Lv.${Abilities.GetLevel(abilityindex)}`} align={"left bottom"} />
                </CCAbilityIcon_Custom> */}
                <CCAbilityPanel width="64px" height="64px" abilityname={abilityname} overrideentityindex={abilityindex as any} horizontalAlign={"center"} />
                <CCLabel type="AbilityName" text={$.Localize("#DOTA_Tooltip_ability_" + abilityname)} horizontalAlign={"center"} />
                {
                    <CCPanel flowChildren="right" horizontalAlign="center">
                        <CCIcon_CoinType width="20px" height="20px" cointype={this.props.cointype} />
                        <CCLabel type="Gold" text={costcount} fontSize={'18px'} />
                    </CCPanel>
                }
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}