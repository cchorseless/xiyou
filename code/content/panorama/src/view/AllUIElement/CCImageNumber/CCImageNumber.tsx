import React from 'react';
import { CSSHelper } from '../../../helper/CSSHelper';
import { CCPanel } from '../CCPanel/CCPanel';
import "./CCImageNumber.less";

export class CCImageNumber extends CCPanel<{ value: number, type: "1" | "2" | "3" | "4" | "5" | "9"; }> {
    defaultClass() { return "CC_ImageNumber" + this.props.type; };
    render() {
        let numberArr = String(this.props.value).replace("-", "").split("");
        return (<Panel ref={this.__root__}      {...this.initRootAttrs()}>
            {this.props.value >= 0 &&
                numberArr.map((num, index) => {
                    return <Image key={index} className={CSSHelper.ClassMaker("CC_NUM", "CC_NUM_" + num)} />
                })}
            {this.__root___childs}
            {this.props.children}
        </Panel>)
    }
}