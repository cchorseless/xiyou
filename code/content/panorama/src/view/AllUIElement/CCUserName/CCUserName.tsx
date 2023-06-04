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

    fontSize?: string
}

export class CCUserName extends CCPanel<ICCUserName> {
    static defaultProps = {
        showgGild: false,
        fontSize: "16"
    };
    render() {
        return (<Panel className='CCUserName' ref={this.__root__}      {...this.initRootAttrs()}>
            <DOTAUserName key={this.props.steamid ?? "" + this.props.accountid ?? ""} steamid={this.props.steamid} style={{ width: "100%", height: "100%" }} hittest={false} onload={self => {
                if (this.props.accountid) {
                    self.accountid = this.props.accountid.toString();
                }
                $.Schedule(0, () => {
                    let label = self.GetChild(0) as LabelPanel;
                    if (this.props.fontSize && label && label.IsValid()) {
                        label.style.fontSize = this.props.fontSize;
                    }
                    if (this.props.showgGild == false) {
                        let gild = label.text.match(/\[.*\]/);
                        if (gild && gild[0]) {
                            label.text = label.text.replace(gild[0], "");
                        }
                    }
                    // if (label.text.length == 0) {
                    //     label.text = FuncHelper.Random.RandomString(GRandomNumber(6, 12))
                    // }

                });

            }} />
            {this.__root___childs}
            {this.props.children}
        </Panel>
        );
    }
}
