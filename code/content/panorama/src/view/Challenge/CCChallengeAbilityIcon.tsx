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
                <CCAbilityIcon abilityname={abilityname} castEntityIndex={castentity} >
                    <CCLabel type="Gold" text={`lv.${Abilities.GetLevel(abilityindex)}`} align={"left bottom"} />
                </CCAbilityIcon>
                <CCPanel flowChildren="right" horizontalAlign="center">
                    <CCIcon_CoinType cointype={GameEnum.Item.EItemIndex[ability?.costType as any] as any} />
                    <CCLabel type="Gold" text={`${ability?.costCount}`} />
                </CCPanel>
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}