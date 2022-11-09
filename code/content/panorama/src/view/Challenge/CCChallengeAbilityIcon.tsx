import React, { } from "react";
import { AbilityEntityRoot } from "../../game/components/Ability/AbilityEntityRoot";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { GameEnum } from "../../libs/GameEnum";
import { CCAbilityIcon } from "../allCustomUIElement/CCAbility/CCAbilityIcon";
import { CCIcon_CoinType } from "../allCustomUIElement/CCIcons/CCIcon_CoinType";
import { CCLabel } from "../allCustomUIElement/CCLabel/CCLabel";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";

import "./CCChallengeAbilityIcon.less";

export interface ICCChallengeAbilityIcon {
    abilityname: string
}

export class CCChallengeAbilityIcon extends CCPanel<ICCChallengeAbilityIcon> {

    onInitUI() {
        const abilityname = this.props.abilityname;
        const castentity = PlayerScene.Local.GetHeroEntityIndex();
        const abilityindex = Entities.GetAbilityByName(castentity, abilityname);
        let entity = PlayerScene.EntityRootManage.getAbility("" + abilityindex);
        if (entity) {
            this.abilityEntity = entity;
            entity.RegRef(this);
        }
    }
    abilityEntity: AbilityEntityRoot;
    render() {
        const abilityname = this.props.abilityname;
        const castentity = PlayerScene.Local.GetHeroEntityIndex();
        const abilityindex = Entities.GetAbilityByName(castentity, abilityname);
        const ability = this.GetStateEntity(this.abilityEntity);
        return (
            this.__root___isValid &&
            <Panel id="CC_ChallengeAbilityIcon" ref={this.__root__}      {...this.initRootAttrs()}>
                <CCAbilityIcon abilityname={abilityname} castEntityIndex={castentity} horizontalAlign={"center"}>
                    <CCLabel type="Level" text={`Lv.${Abilities.GetLevel(abilityindex)}`} align={"left bottom"} />
                </CCAbilityIcon>
                <CCLabel type="AbilityName" text={$.Localize("#DOTA_Tooltip_ability_" + abilityname)} horizontalAlign={"center"} />
                {
                    ability && <CCPanel flowChildren="right" horizontalAlign="center">
                        <CCIcon_CoinType width="20px" height="20px" cointype={GameEnum.Item.EItemIndex[ability?.costType as any] as any} />
                        <CCLabel type="Gold" text={`${ability?.costCount}`} fontSize={'18px'} />
                    </CCPanel>
                }
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}