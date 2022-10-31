import React, { createRef, PureComponent } from "react";
import { PanelAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../CCPanel/CCPanel";


interface ICCAbilityButton {

}


export class CCAbilityButton extends CCPanel<ICCAbilityButton> {
    AbilityImage: React.RefObject<AbilityImage>;

    onInitUI() {
        this.AbilityImage = createRef<AbilityImage>();
    }

    onbtn_mouseover = () => { };
    onbtn_mouseout = () => { };
    render() {
        return (
            this.__root___isValid && (
                <Panel
                    id="AbilityButton"
                    onmouseover={this.onbtn_mouseover}
                    onmouseout={this.onbtn_mouseout}
                    className="root"
                    ref={this.__root__}
                    {...this.initRootAttrs()}
                >
                    <DOTAAbilityImage id="AbilityImage" ref={this.AbilityImage} />
                    <DOTAItemImage id="ItemImage" scaling="stretch-to-fit-x-preserve-aspect" />
                    <Panel hittest={false} id="AbilityBevel" />
                    <Panel hittest={false} id="ShineContainer">
                        <Panel hittest={false} id="Shine" />
                    </Panel>
                    <Panel id="TopBarUltimateCooldown" hittest={false} />
                    <Panel id="Cooldown" hittest={false}>
                        <Panel id="CooldownOverlay" hittest={false} />
                        <Label id="CooldownTimer" className="MonoNumbersFont" text="{d:cooldown_timer}" dialogVariables={{ cooldown_timer: this.props.cooldown_timer }} hittest={false} />
                    </Panel>
                    <Panel id="ActiveAbility" hittest={false} />
                    <Panel id="InactiveOverlay" hittest={false} />
                    <Label id="ItemCharges" text="{d:item_charge_count}" dialogVariables={{ item_charge_count: this.props.item_charge_count }} hittest={false} />
                    <Label id="ItemAltCharges" text="{d:item_alt_charge_count}" dialogVariables={{ item_alt_charge_count: this.props.item_alt_charge_count }} hittest={false} />
                    <Label id="ItemTimer" text="{s:item_timer}" dialogVariables={{ item_timer: this.props.item_timer }} hittest={false} />
                    {this.props.children}
                    {this.__root___childs}
                </Panel>
            )
        );
    }
}
