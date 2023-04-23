import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCAvatar.less";

interface ICCAvatarProps extends NodePropsData {
    /** 长id */
    steamid?: string;
    /** 短id */
    accountid?: string;

    nocompendiumborder?: boolean;
}

export class CCAvatar extends CCPanel<ICCAvatarProps> {

    render() {
        const nocompendiumborder = this.props.nocompendiumborder || false;
        return (<Panel className="CC_Avatar" ref={this.__root__}      {...this.initRootAttrs()}>
            <DOTAAvatarImage key={this.props.steamid ?? "" + this.props.accountid ?? ""} nocompendiumborder={nocompendiumborder} steamid={this.props.steamid} style={{ width: "100%", height: "100%" }} hittest={false}
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
