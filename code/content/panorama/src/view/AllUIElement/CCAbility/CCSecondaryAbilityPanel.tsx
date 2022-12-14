import { PanelAttributes } from "@demon673/react-panorama";
import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";

interface ICCSecondaryAbilityPanel extends PanelAttributes {
    overrideentityindex: ItemEntityIndex
}

export class CCSecondaryAbilityPanel extends CCPanel<ICCSecondaryAbilityPanel> {

    static defaultProps = {
        overrideentityindex: -1
    }


    render() {
        const overrideentityindex = this.props.overrideentityindex;
        return this.__root___isValid &&
            <Panel id="CC_SecondaryAbilityPanel" ref={this.__root__} {...this.initRootAttrs()}>
                <Panel className={CSSHelper.ClassMaker("DOTASecondaryAbility ShowAbility RequiresCharges HasCharges")}
                    onactivate={(self) => {
                        if (overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
                            if (GameUI.IsAltDown()) {
                                Abilities.PingAbility(overrideentityindex);
                                return;
                            }
                            if (GameUI.IsControlDown()) {
                                Abilities.AttemptToUpgrade(overrideentityindex);
                                return;
                            }
                            if (Abilities.IsItem(overrideentityindex)) {
                                var iAbilityIndex = Abilities.GetLocalPlayerActiveAbility();
                                if (iAbilityIndex != -1) {
                                    let iAbilityBehavior = Abilities.GetBehavior(iAbilityIndex);
                                    if (iAbilityBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_RUNE_TARGET) {
                                        let iClickbehaviors = GameUI.GetClickBehaviors();
                                        if (iClickbehaviors === CLICK_BEHAVIORS.DOTA_CLICK_BEHAVIOR_CAST) {
                                            // GameEvents.SendEventClientSide("custom_get_active_ability", { entindex: -1 as AbilityEntityIndex });
                                            Abilities.ExecuteAbility(iAbilityIndex, Abilities.GetCaster(iAbilityIndex), true);
                                        }
                                        return;
                                    }
                                }
                            }
                            let iCasterIndex = Abilities.GetCaster(overrideentityindex);
                            Abilities.ExecuteAbility(overrideentityindex, iCasterIndex, false);
                        }
                    }} onmouseover={(self) => {
                        // GameUI.CustomUIConfig().ShowAbilityTooltip(self, Abilities.GetAbilityName(overrideentityindex), Abilities.GetCaster(overrideentityindex));
                    }} onmouseout={(self) => {
                        // GameUI.CustomUIConfig().HideAbilityTooltip(self);
                    }}>
                    <Panel id="AbilityImageContainer" hittestchildren={false} >
                        <DOTAAbilityImage id="AbilityImage" hittest={false} abilityname={Abilities.GetAbilityName(overrideentityindex)} />
                        <Panel id="Cooldown">
                            <Panel id="CooldownBackground" />
                            <Label id="CooldownSeconds" className="MonoNumbersFont" text="{d:cooldown_seconds}" dialogVariables={{ cooldown_seconds: Abilities.GetCooldownTimeRemaining(overrideentityindex) }} />
                        </Panel>
                    </Panel>
                </Panel>
            </Panel>
    }
}