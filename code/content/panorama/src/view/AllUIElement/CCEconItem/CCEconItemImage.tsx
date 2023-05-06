import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCEconItemImage.less";


interface ICCEconItemImage extends NodePropsData {
    itemdef: number;
}
export class CCEconItemImage extends CCPanel<ICCEconItemImage> {

    render() {
        return (<Panel className="CCEconItemImage" ref={this.__root__}    {...this.initRootAttrs()}>
            <EconItemImage itemdef={this.props.itemdef} className="EconItem" />
        </Panel>)
    }

}
