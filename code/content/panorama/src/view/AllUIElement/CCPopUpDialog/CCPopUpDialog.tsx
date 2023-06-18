import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";

import { CCIconButton } from "../CCButton/CCIconButton";
import { CCIcon_XClose } from "../CCIcons/CCIcon_XClose";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCPopUpDialog.less";

interface ICCPopUpDialog extends NodePropsData {
    title?: string;
    type?: "Tui7" | "Tui3";
    /**是否填充整个界面 */
    fullcontent?: boolean;
    onClose?: () => void;
}

export class CCPopUpDialog<T = {}> extends CCPanel<ICCPopUpDialog & T> {
    static defaultProps = {
        type: CSSHelper.DEFAULT_ADDON_TYPE,
        fullcontent: false,
        onClose: () => { }
    };
    render() {
        const { title } = this.props;
        return (
            <Panel className="CCPopUpDialog" ref={this.__root__}   {...this.initRootAttrs()}
                onload={(self) => { self.AddClass("CCPopupMainShow"); }}
            >
                <CCPopupBG type={this.props.type} hasTitle={(title != undefined && title != "")} />
                {(title != null && title != "" && !this.props.fullcontent) &&
                    <Label className="CCPopupTitle" text={$.Localize(title)} />
                }
                <CCIconButton className="PopUpCloseButton" zIndex={2} type={this.props.type} icon={<CCIcon_XClose type={this.props.type} />}
                    onactivate={() => {
                        this.props.onClose && this.props.onClose()
                    }} />
                <Panel className={CSSHelper.ClassMaker("CCPopupContent", { IsFullContent: this.props.fullcontent! })} >
                    {this.__root___childs}
                    {this.props.children}
                </Panel>
            </Panel >
        );
    }
}






interface ICCPopupBG extends NodePropsData {
    hasTitle?: boolean;
    type?: "Tui7" | "Tui3"
}
/** 拼接弹窗背景 */
export class CCPopupBG extends CCPanel<ICCPopupBG> {
    static defaultProps = {
        /** 是否有标题 */
        hasTitle: false,
        type: CSSHelper.DEFAULT_ADDON_TYPE,
    };

    defaultClass() {
        return CSSHelper.ClassMaker("CCPopupBG", this.props.type)
    }

    render() {
        return (<Panel ref={this.__root__} hittest={false}   {...this.initRootAttrs()}>
            <Panel className="CCTexture" />
            {this.props.hasTitle &&
                <Panel className="CCTitleBG" />
            }
            <Panel className="CCHeaderBG" />
            <Panel className="CCLeftTopBG" />
            <Panel className="CCCenterTopBG" />
            <Panel className="CCRightTopBG" />
            <Panel className="CCLeftCenterBG" />
            <Panel className="CCCenterCenterBG" />
            <Panel className="CCRightCenterBG" />
            <Panel className="CCLeftBottomBG" />
            <Panel className="CCCenterBottomBG" />
            <Panel className="CCRightBottomBG" />
        </Panel>
        );
    }
}