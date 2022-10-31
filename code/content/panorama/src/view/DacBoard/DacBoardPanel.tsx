import React from "react";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCAbilityList } from "../allCustomUIElement/CCAbility/CCAbilityList";
import { CCBuffList } from "../allCustomUIElement/CCBuffList/CCBuffList";
import { CCHealthMana } from "../allCustomUIElement/CCHealthMana/CCHealthMana";
import { CCInventory } from "../allCustomUIElement/CCInventory/CCInventory";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCPortraitGroup } from "../allCustomUIElement/CCPortrait/CCPortrait";
import { CCUnitStats } from "../allCustomUIElement/CCUnitStats/CCUnitStats";

export class DacBoardPanel<T extends NodePropsData> extends CCPanel<T> {

    onInitUI() {

    }
    render() {
        return (
            this.__root___isValid &&
            <CCPanel ref={this.__root__} id="CC_DacBoardPanel"    {...this.initRootAttrs()} hittest={false}>
                <CCPortraitGroup particleAttrs={{}} />
                <CCAbilityList />
                <CCHealthMana />
                <CCInventory />
                <CCUnitStats />
                <CCBuffList />
                {this.props.children}
                {this.__root___childs}
            </CCPanel >
        )
    }
}