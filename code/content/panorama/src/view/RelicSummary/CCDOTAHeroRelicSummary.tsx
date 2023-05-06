import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCDOTAHeroRelicSummary.less";


interface ICCDOTAHeroRelicSummary {
}

export class CCDOTAHeroRelicSummary extends CCPanel<ICCDOTAHeroRelicSummary> {

    render() {
        return <Panel className={CSSHelper.ClassMaker("CCDOTAHeroRelicSummary")}
            ref={this.__root__}  {...this.initRootAttrs()}>
            <GenericPanel type="DOTAHeroRelicSummary" id="HeroRelics" hittest={false} {... this.props} />
        </Panel>
    }
}