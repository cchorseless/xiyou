import React, { createRef, PureComponent } from "react";
import { BaseEasyPureComponent } from "../../../libs/BasePureComponent";
import { PanelAttributes } from "@demon673/react-panorama";

export class CustomAbilityButton_UI extends BaseEasyPureComponent {
    __root__: React.RefObject<Panel>;
    AbilityImage: React.RefObject<AbilityImage>;
    NODENAME = { __root__: "__root__" };
    FUNCNAME = {};

    constructor(props: any) {
        super(props);
        this.__root__ = createRef<Panel>();
        this.AbilityImage = createRef<AbilityImage>();
    }
    CSS_0_0: Partial<VCSSStyleDeclaration> = {};

    __root___isValid: boolean = true;
    __root___attrs: PanelAttributes = {};
    __root___childs: Array<JSX.Element> = [];
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
                    key="compId_1"
                    ref={this.__root__}
                    style={this.CSS_0_0}
                    {...this.props}
                    {...this.__root___attrs}
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
