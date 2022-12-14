import { PanelAttributes } from "@demon673/react-panorama";
import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";

interface ICCCircleAbilityItem {
    iItemIndex: ItemEntityIndex,
}
export class CCCircleAbilityItem extends CCPanel<ICCCircleAbilityItem>{

    render() {
        const iItemIndex = this.props.iItemIndex!;
        const charge = Items.GetCurrentCharges(iItemIndex);
        return (
            <Panel className="CC_CircleAbilityItem" ref={this.__root__} {...this.initRootAttrs()}>
                <CCPanel id="CircleBg" hittest={true}>
                    <DOTAItemImage contextEntityIndex={iItemIndex} showtooltip={false} scaling="stretch-to-fit-x-preserve-aspect" />
                    {charge > 0 &&
                        <Label id="ItemCharges" text={charge} hittest={false} />
                    }
                    {this.props.children}
                    {this.__root___childs}
                </CCPanel>
            </Panel>
        );
    }
}