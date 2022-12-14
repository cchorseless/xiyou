import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";

interface CourierData {
    CourierId?: number,
    Rarity?: string,
    Modifier?: string,
    Model?: string,
    Skin?: number,
    ItemDef?: number,
    ItemStyle?: number,
    ModelScale?: number,
    AmbientEffect?: string,
    Ability1?: string,
    VisualZDelta?: number,
}
interface ICCCourierCard {
    tCourierData: CourierData,
    sCourierName: string,
    allowrotation?: boolean;
    showmodel?: boolean;
}

export class CCCourierCard extends CCPanel<ICCCourierCard> {

    static defaultProps = {
        showmodel: true,
        allowrotation: true,
    }

    defaultClass() {
        const tCourierData = this.props.tCourierData;
        const sRarity = tCourierData.Rarity || "R";
        return CSSHelper.ClassMaker("CourierCard", sRarity)
    }
    render() {
        const tCourierData = this.props.tCourierData;
        const sCourierName = this.props.sCourierName;
        const showmodel = this.props.showmodel;
        const allowrotation = this.props.allowrotation;
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_CourierCard"   {...this.initRootAttrs()} hittest={false}>
                {showmodel ?
                    < Panel id="CourierScene" hittest={false} >
                        <GenericPanel type="DOTAUIEconSetPreview" key={sCourierName} itemdef={tCourierData?.ItemDef ?? 0} itemstyle={tCourierData?.ItemStyle ?? 0} displaymode="loadout_small" drawbackground={true} antialias={true} allowrotation={allowrotation} />
                    </Panel>
                    : < Image id="CourierImage" hittest={false} />
                }
                <Label id="CourierName" text={$.Localize("#" + sCourierName)} hittest={false} />
                {
                    tCourierData.Ability1 && <Panel id="CourierAbility" >
                        <DOTAAbilityImage abilityname={tCourierData.Ability1} showtooltip={false} style={{ width: "100%", height: "100%" }} />
                    </Panel>
                }
            </Panel >
        )
    }
}
