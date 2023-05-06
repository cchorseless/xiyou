import { render } from "@demon673/react-panorama";
import React, { Children } from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCDropDownButton.less";

interface ICCDropDownButton {
    /** 没有初始选择时显示的文字 */
    placeholder?: string;
    /** 初始选择 */
    index?: number;
    /** 当选择改变时 */
    onChange?: (index: number, item: LabelPanel) => void;
    /** 当清除选项 */
    onClear?: () => void;
};

export class CCDropDownButton extends CCPanel<ICCDropDownButton, TextButton> {
    private myMenu?: Panel;
    defaultClass() { return ("CCDropDown"); };
    onStartUI() {
        const { children, id } = this.props;
        const rootpanel = $.GetContextPanel();
        if (this.myMenu == undefined) {
            this.myMenu = $.CreatePanel("Panel", rootpanel, `${id}_DropDownMenu`);
            this.myMenu.SetParent(rootpanel);
            this.myMenu.visible = false;
            this.myMenu.AddClass("CCDropDownMenu");
        }
        let pBtn = this.__root__.current!;
        for (let index = 0; index < pBtn.GetChildCount(); index++) {
            const c = pBtn.GetChild(index);
            if (c && c.id != "CCDropDown_placeholder" && c.id != "CCDropDown_arrow") {
                c.visible = (index + 1 == this.props.index);
            }
        }
        render(
            <>
                {Children.map(children, (p, childIndex) => {
                    return (
                        // 包一层
                        <RadioButton group="CCDropDownMenuItem" selected={childIndex + 1 == this.props.index} className={"CCDropDownMenuItem"} onactivate={self => {
                            let bClear = false;
                            if (pBtn) {
                                for (let index = 0; index < pBtn.GetChildCount(); index++) {
                                    const c = pBtn.GetChild(index) as LabelPanel;
                                    if (c && c.id != "CCDropDown_arrow" && c.id != "CCDropDown_Clear") {
                                        c.visible = index == childIndex + 1;
                                        if (c.visible) {
                                            if (this.props.onChange) {
                                                this.props.onChange(childIndex, c);
                                            }
                                        }
                                    }
                                    if (c && c.id == "CCDropDown_Clear" && index == childIndex) {
                                        bClear = true;
                                        c.visible == false;
                                        if (this.props.onClear) {
                                            this.props.onClear();
                                        }
                                    }
                                }
                                if (bClear) {
                                    (pBtn.FindChildTraverse("CCDropDown_placeholder") as Panel).visible = true;
                                }
                            }
                            this.toggleMenu(false);
                        }} onblur={self => { this.toggleMenu(false); }}>
                            {p}
                        </RadioButton>
                    );
                })}
            </>,
            this.myMenu as Panel);
    }

    onDestroy() {
        if (this.myMenu != undefined) {
            render(<></>, this.myMenu);
        }
    }

    toggleMenu(state?: boolean) {
        let pBtn = this.__root__.current;
        if (pBtn && this.myMenu) {
            let vPos = pBtn.GetPositionWithinWindow();
            this.myMenu.SetPositionInPixels(
                (vPos.x) / this.myMenu.actualuiscale_x,
                (vPos.y + pBtn.actuallayoutheight + 2) / pBtn.actualuiscale_y,
                0
            );

            this.myMenu.visible = state == undefined ? !this.myMenu.visible : state;
            this.myMenu.SetHasClass("CCDropDownMenuShow", this.myMenu.visible);
            if (this.myMenu.visible) {
                this.myMenu.SetFocus();
                $.Schedule(0.06, () => {
                    if (pBtn && this.myMenu) {
                        this.myMenu.style.minWidth = Math.max(this.myMenu.actuallayoutwidth, pBtn.actuallayoutwidth) + "px";
                        const childItems = this.myMenu.FindChildrenWithClassTraverse("CCDropDownMenuItem");
                        if (childItems && childItems.length > 0) {
                            childItems.forEach(item => {
                                item.style.width = "100%";
                            });
                        }
                    }
                });
            }
        }
    }

    render() {
        return (<TextButton ref={this.__root__}  {...this.initRootAttrs()}
            onactivate={() => { this.toggleMenu(); }}>
            {this.props.children}
            <Label id="CCDropDown_placeholder" localizedText={(this.props.index == undefined && this.props.placeholder) ? this.props.placeholder : ""} />
            <Image id="CCDropDown_arrow" />
        </TextButton>
        );
    }
}