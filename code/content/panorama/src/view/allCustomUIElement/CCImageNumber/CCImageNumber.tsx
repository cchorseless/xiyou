import React, { Component } from 'react';
import { CSSHelper } from '../../../helper/CSSHelper';
import { CCPanel } from '../CCPanel/CCPanel';
import "./CCImageNumber.less";

export default class CCImageNumber extends CCPanel<{ value: number, type: "1" | "2" | "3" | "4" | "5"; }> {
    defaultClass = () => { return "EOM_ImageNumber" + this.props.type; };
    render() {
        let numberArr = String(this.props.value).split("");
        return (this.__root___isValid &&
            <Panel ref={this.__root__}      {...this.initRootAttrs()}>
                {numberArr.map((num, index) => {
                    return <Image key={index} className={CSSHelper.ClassMaker("EOM_NUM", "EOM_NUM_" + num)} />;
                })}
                {this.__root___childs}
                {this.props.children}
            </Panel>)
    }
}