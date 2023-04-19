import React, { createRef } from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCPortraitV1.less";

export interface ICCPortraitV1 {
    /** 单位名字 */
    unitname?: string;
    /** portraits.txt中找到该模型配置的背景 */
    model?: string;
}

export default class CCPortraitV1 extends CCPanel<ICCPortraitV1> {
    onInitUI() {
        this.customHeroPortrait = createRef<ScenePanel>();
    }
    customHeroPortrait: React.RefObject<ScenePanel>;
    render() {
        const model = this.props.model;
        const unitname = this.props.unitname;
        return (
            <Panel className="CC_PortraitV1" ref={this.__root__}  {...this.initRootAttrs()}>
                {(model != undefined) &&
                    <DOTAScenePanel key={"CustomHeroPortraitHUDBG" + model} className="CustomHeroPortraitHUDBG" hittest={false} />
                }
                {(unitname != undefined) &&
                    <DOTAScenePanel key={"CustomHeroPortraitHUD" + unitname} unit={unitname} ref={this.customHeroPortrait} className="CustomHeroPortraitHUD" map="portrait" camera="camera_1" light="portrait_light" particleonly={false} hittest={false} onload={self => {
                        // this.customHeroPortrait.current?.SetUnit(unitname, "", true);
                    }} />
                }
                {this.props.children}
            </Panel>
        );
    }
}