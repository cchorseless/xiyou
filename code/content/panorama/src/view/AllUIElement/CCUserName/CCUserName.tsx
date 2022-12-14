import React from 'react';
import { CCPanel } from '../CCPanel/CCPanel';
import "./CCUserName.less";
interface ICCUserName {
    /** 长id */
    steamid?: string;
    /** 短id */
    accountid?: string;
    /** 是否显示工会 */
    showgGild?: boolean;
}

export class CCUserName extends CCPanel<ICCUserName> {
    defaultClass() { return ("CC_UserName"); };
    static defaultProps = {
        showgGild: false
    };
    render() {
        return (this.__root___isValid &&
            <Panel ref={this.__root__}      {...this.initRootAttrs()}>
                <DOTAUserName key={this.props.steamid ?? "" + this.props.accountid ?? ""} steamid={this.props.steamid} style={{ width: "100%", height: "100%" }} hittest={false} onload={self => {
                    if (this.props.accountid) {
                        self.accountid = this.props.accountid.toString();
                    }
                    if (this.props.showgGild == false) {
                        $.Schedule(0, () => {
                            let label = self.GetChild(0) as LabelPanel;
                            let gild = label.text.match(/\[.*\]/);
                            if (gild && gild[0]) {
                                label.text = label.text.replace(gild[0], "");
                            }
                        });
                    }
                }} />
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}
