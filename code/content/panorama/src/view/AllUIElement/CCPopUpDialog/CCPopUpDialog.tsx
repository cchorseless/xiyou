import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { PathHelper } from "../../../helper/PathHelper";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { CCIconButton } from "../CCButton/CCIconButton";
import { CCIcon_XClose } from "../CCIcons/CCIcon_XClose";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCPopUpDialog.less";

interface ICCPopUpDialog extends NodePropsData {
    title?: string;
    type?: "Tui7" | "Tui3";
    /**是否填充整个界面 */
    fullcontent?: boolean;
    onClose: () => void;
}

export class CCPopUpDialog<T = {}> extends CCPanel<ICCPopUpDialog & T> {
    static defaultProps = {
        type: CSSHelper.DEFAULT_ADDON_TYPE,
        fullcontent: false,
        onClose: () => { }
    };
    defaultClass() { return "CC_PopUpDialog"; };
    render() {
        const { title } = this.props;
        return (
            <Panel ref={this.__root__}   {...this.initRootAttrs()}
                onload={(self) => { self.AddClass("CC_PopupMainShow"); }}
            >
                <CCPopupBG type={this.props.type} hasTitle={(title != undefined && title != "")} />
                {(title != null && title != "" && !this.props.fullcontent) &&
                    <Label className="CC_PopupTitle" text={$.Localize(title)} />
                }
                <CCIconButton zIndex={2} type={this.props.type} icon={<CCIcon_XClose type={this.props.type} />}
                    onactivate={() => {
                        this.props.onClose()
                    }} />
                <Panel className={CSSHelper.ClassMaker("CC_PopupContent", { IsFullContent: this.props.fullcontent! })} >
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
        return CSSHelper.ClassMaker("CC_PopupBG", this.props.type)
    }

    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__}      {...this.initRootAttrs()} hittest={false} hittestchildren={false} >
                <Panel className="CC_Texture" />
                {this.props.hasTitle &&
                    <Panel className="CC_TitleBG" />
                }
                <Panel className="CC_HeaderBG" />
                <Panel className="CC_LeftTopBG" />
                <Panel className="CC_CenterTopBG" />
                <Panel className="CC_RightTopBG" />
                <Panel className="CC_LeftCenterBG" />
                <Panel className="CC_CenterCenterBG" />
                <Panel className="CC_RightCenterBG" />
                <Panel className="CC_LeftBottomBG" />
                <Panel className="CC_CenterBottomBG" />
                <Panel className="CC_RightBottomBG" />
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}