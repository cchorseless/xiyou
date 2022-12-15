import React, { } from "react";
import { AbilityEntityRoot } from "../../game/components/Ability/AbilityEntityRoot";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { GameEnum } from "../../../../../game/scripts/tscripts/shared/GameEnum";

import { CCAbilityIcon } from "../AllUIElement/CCAbility/CCAbilityIcon";
import { CCIcon_CoinType } from "../AllUIElement/CCIcons/CCIcon_CoinType";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";

import "./CCChallengeAbilityIcon.less";
import { EEnum } from "../../../../../game/scripts/tscripts/shared/Gen/Types";

export interface ICCChallengeAbilityIcon {
    abilityname: string
}

export class CCChallengeAbilityIcon extends CCPanel<ICCChallengeAbilityIcon> {

    onReady() {
        const abilityname = this.props.abilityname;
        const castentity = PlayerScene.Local.GetHeroEntityIndex();
        if (!Entities.IsValidEntity(castentity)) { return false; }
        const abilityindex = Entities.GetAbilityByName(castentity, abilityname);
        if (!Entities.IsValidEntity(abilityindex)) { return false; }
        let entity = PlayerScene.EntityRootManage.getAbility("" + abilityindex);
        if (entity) {
            this.abilityEntity = entity;
        }
        return Boolean(entity);
    }
    abilityEntity: AbilityEntityRoot;
    onInitUI() {
        this.abilityEntity.RegRef(this);
    }
    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_ChallengeAbilityIcon");
        }
        const abilityname = this.props.abilityname;
        const castentity = PlayerScene.Local.GetHeroEntityIndex();
        const abilityindex = Entities.GetAbilityByName(castentity, abilityname);
        const ability = this.GetStateEntity(this.abilityEntity);
        return (
            <Panel id="CC_ChallengeAbilityIcon" ref={this.__root__}      {...this.initRootAttrs()}>
                <CCAbilityIcon abilityname={abilityname} castEntityIndex={castentity} horizontalAlign={"center"}>
                    <CCLabel type="Level" text={`Lv.${Abilities.GetLevel(abilityindex)}`} align={"left bottom"} />
                </CCAbilityIcon>
                <CCLabel type="AbilityName" text={$.Localize("#DOTA_Tooltip_ability_" + abilityname)} horizontalAlign={"center"} />
                {
                    ability && <CCPanel flowChildren="right" horizontalAlign="center">
                        <CCIcon_CoinType width="20px" height="20px" cointype={EEnum.EMoneyType[ability?.GetD_Props<IAbilityChallenge>().costType as any] as any} />
                        <CCLabel type="Gold" text={`${ability?.GetD_Props<IAbilityChallenge>().costCount}`} fontSize={'18px'} />
                    </CCPanel>
                }
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}