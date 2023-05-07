import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCCircleAbilityItem.less";
interface ICCCircleAbilityItem {
    iItemIndex?: ItemEntityIndex,
    itemname?: string,
    showtooltip?: boolean,
}
export class CCCircleAbilityItem extends CCPanel<ICCCircleAbilityItem>{

    static defaultProps = {
        iItemIndex: -1,
        itemname: "",
        showtooltip: false,
    }

    render() {
        const iItemIndex = this.props.iItemIndex!;
        const itemname = this.props.itemname!;
        const showtooltip = this.props.showtooltip!;
        const charge = Items.GetCurrentCharges(iItemIndex);
        return (
            <Panel className="CCCircleAbilityItem" ref={this.__root__} {...this.initRootAttrs()}>
                <CCPanel id="CircleBg" >
                    <DOTAItemImage itemname={itemname} contextEntityIndex={iItemIndex} showtooltip={showtooltip} scaling="stretch-to-fit-y-preserve-aspect" />
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