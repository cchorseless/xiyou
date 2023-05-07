import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { KVHelper } from "../../helper/KVHelper";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCCourierCard.less";

interface ICCCourierCard {
    sCourierName: string,
    allowrotation?: boolean;
    showmodel?: boolean;
    showability?: boolean;

}

export class CCCourierCard extends CCPanel<ICCCourierCard> {

    static defaultProps = {
        showmodel: true,
        allowrotation: true,
        showability: false
    }

    defaultClass() {
        const sCourierName = this.props.sCourierName;
        const tCourierData = KVHelper.KVData().courier_units[sCourierName];
        const sRarity = tCourierData.Rarity || "A";
        return CSSHelper.ClassMaker("CourierCard", sRarity)
    }
    render() {
        const sCourierName = this.props.sCourierName;
        const tCourierData = KVHelper.KVData().courier_units[sCourierName];
        const sRarity = tCourierData.Rarity || "A";
        const showmodel = this.props.showmodel;
        const allowrotation = this.props.allowrotation;
        return (
            <Panel ref={this.__root__}   {...this.initRootAttrs()} hittest={false}>
                {showmodel ?
                    < Panel id="CourierScene" hittest={false} >
                        <GenericPanel type="DOTAUIEconSetPreview" key={sCourierName} itemdef={tCourierData?.ItemDef ?? 0} itemstyle={tCourierData?.ItemStyle ?? 0} displaymode="loadout_small" drawbackground={true} antialias={true} allowrotation={allowrotation} />
                    </Panel>
                    : < Image id="CourierImage" hittest={false} />
                }
                <CCLabel id="CourierName" text={$.Localize("#" + sCourierName)} color={CSSHelper.GetRarityColor(sRarity)} hittest={false} />
                {
                    this.props.showability && tCourierData.Ability1 && <Panel id="CourierAbility" >
                        <DOTAAbilityImage abilityname={tCourierData.Ability1} showtooltip={true} style={{ width: "100%", height: "100%" }} />
                    </Panel>
                }
                {this.props.children}
                {this.__root___childs}
            </Panel >
        )
    }
}
