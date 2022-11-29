import React, { createRef, PureComponent } from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCIcon_CoinType } from "../allCustomUIElement/CCIcons/CCIcon_CoinType";
import { CCImage } from "../allCustomUIElement/CCImage/CCImage";
import { CCLabel } from "../allCustomUIElement/CCLabel/CCLabel";
import { CCMenuNavigation } from "../allCustomUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import "./CCCoinAddPanel.less";

interface ICCCoinAddPanel extends NodePropsData {
    cointype: CoinType;
    showAddBtn?: boolean;
    value?: number;
    onaddcoin?: () => void;
}

export class CCCoinAddPanel extends CCPanel<ICCCoinAddPanel> {
    static defaultProps = {
        showAddBtn: false,
        value: 0
    }

    onInitUI() {

    }

    render() {
        return (
            this.__root___isValid &&
            <Panel className="CC_CoinAddPanel" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCIcon_CoinType id="iconimg" cointype={this.props.cointype} titleTooltip={{ title: this.props.cointype, tip: this.props.cointype }} />
                <Panel id="iconNumBg">
                    <Label text={this.props.value} />
                </Panel>
                {
                    this.props.onaddcoin != null && <Button id="iconAddBtn" onactivate={() => this.props.onaddcoin!()} />
                }
                {this.props.children}
                {this.__root___childs}
            </Panel>)

    }
}