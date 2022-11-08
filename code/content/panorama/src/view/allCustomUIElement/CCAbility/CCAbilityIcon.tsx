import React, { createRef, PureComponent } from "react";
import { DOTAAbilityImageAttributes, PanelAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../CCPanel/CCPanel";

import "./CCAbilityIcon.less";
import { LogHelper } from "../../../helper/LogHelper";

interface ICCAbilityIcon extends DOTAAbilityImageAttributes {
    abilityname: string;
    rarity?: Rarity
}


export class CCAbilityIcon extends CCPanel<ICCAbilityIcon> {
    static defaultProps = {
        rarity: "A"
    }
    render() {
        const abilityname = this.props.abilityname;
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_AbilityIcon" {...this.initRootAttrs()}  >
                {/* todo  */}
                <DOTAAbilityImage abilityname={abilityname} showtooltip={true} />
                <Image id="img_AbilityIcon" className={this.props.rarity} />
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    }
}