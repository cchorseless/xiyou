import React, { createRef, PureComponent } from "react";
import { PanelAttributes, ImageAttributes, DOTAAbilityImageAttributes, LabelAttributes } from "@demon673/react-panorama";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { CCPanel } from "../CCPanel/CCPanel";
import { CSSHelper } from "../../../helper/CSSHelper";
import "./CCAvatar.less";

interface ICCAvatarProps extends NodePropsData {
    /** 长id */
    steamid?: string;
    /** 短id */
    accountid?: string;
}

export default class CCAvatar extends CCPanel<ICCAvatarProps> {

    defaultClass = () => { return CSSHelper.ClassMaker("CC_Avatar"); };
    render() {
        return (
            <Panel ref={this.__root__}  {...this.props} style={this.CSS_0_0}    {...this.__root___attrs}>
                <DOTAAvatarImage key={this.props.steamid ?? "" + this.props.accountid ?? ""} steamid={this.props.steamid} style={{ width: "100%", height: "100%" }} hittest={false}
                    onload={self => {
                        if (this.props.accountid) {
                            self.accountid = this.props.accountid.toString();
                        }
                    }} />
                {this.props.children}
            </Panel>
        );
    }
}
