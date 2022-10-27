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

export class CCAvatar extends CCPanel<ICCAvatarProps> {

    defaultClass = () => { return "CC_Avatar"; };
    render() {
        return (this.__root___isValid &&
            <Panel ref={this.__root__}      {...this.initRootAttrs()}>
                <DOTAAvatarImage key={this.props.steamid ?? "" + this.props.accountid ?? ""} steamid={this.props.steamid} style={{ width: "100%", height: "100%" }} hittest={false}
                    onload={self => {
                        if (this.props.accountid) {
                            self.accountid = this.props.accountid.toString();
                        }
                    }} />
                {this.__root___childs}
                {this.props.children}
            </Panel>)
    }
}
