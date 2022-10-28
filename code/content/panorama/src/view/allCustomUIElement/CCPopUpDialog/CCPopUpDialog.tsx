import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { PathHelper } from "../../../helper/PathHelper";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { CCIconButton } from "../CCIconButton/CCIconButton";
import CCIcon_XClose from "../CCIcons/CCIcon_XClose";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCPopUpDialog.less";

interface ICCPopUpDialog extends NodePropsData {
    title?: string;
    type: "Tui7" | "Tui3";
    onClose: () => void;
}

export class CCPopUpDialog extends CCPanel<ICCPopUpDialog> {
    defaultClass = () => { return "CC_PopupMain"; };
    render() {
        const { title } = this.props;
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__}      {...this.initRootAttrs()}
            // onload={(self) => { self.AddClass("EOM_PopupMainShow"); }}
            >
                <CCPopupBG type={this.props.type} hasTitle={(title != undefined && title != "")} />
                {(title != undefined && title != "") &&
                    <Label className="EOM_PopupTitle" text={$.Localize(title)} />
                }
                {/* <EOM_CloseButton style={{ horizontalAlign: "right", marginTop: "16px", marginRight: "3px" }} onactivate={() => LoadData($.GetContextPanel(), "ClosePopup")()} /> */}
                <CCIconButton className={this.props.type} icon={<CCIcon_XClose type={this.props.type} />} onactivate={() => this.props.onClose()} />
                <Panel className="EOM_PopupContent">
                    {this.props.children}
                </Panel>
            </Panel>
        );
    }
}


interface ICCPopupBG extends NodePropsData {
    hasTitle: boolean;
    type: "Tui7" | "Tui3"
}
/** 拼接弹窗背景 */
export class CCPopupBG extends CCPanel<ICCPopupBG> {
    static defaultProps = {
        /** 是否有标题 */
        hasTitle: true,
        // type: DEFAULT_ADDON_TYPE,
    };

    defaultClass = () => {
        return "EOM_PopupBG"
    }

    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__}      {...this.initRootAttrs()} hittest={false} hittestchildren={false} >
                <Panel className="EOM_Texture" />
                {this.props.hasTitle &&
                    <Panel className="EOM_TitleBG" />
                }
                <Panel className="EOM_HeaderBG" />
                <Panel className="EOM_LeftTopBG" />
                <Panel className="EOM_CenterTopBG" />
                <Panel className="EOM_RightTopBG" />
                <Panel className="EOM_LeftCenterBG" />
                <Panel className="EOM_CenterCenterBG" />
                <Panel className="EOM_RightCenterBG" />
                <Panel className="EOM_LeftBottomBG" />
                <Panel className="EOM_CenterBottomBG" />
                <Panel className="EOM_RightBottomBG" />
            </Panel>
        );
    }
}