import { render } from "@demon673/react-panorama";
import React, { Children, createRef } from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCDropDownButton.less";

let pHudRoot = $.GetContextPanel();
while (pHudRoot.GetParent() != undefined) {
    pHudRoot = pHudRoot.GetParent() as Panel;
}

pHudRoot.FindChildrenWithClassTraverse("CC_DropDownMenu").forEach((child) => {
    child.DeleteAsync(-1);
});


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

export class CCDropDownButton extends CCPanel<ICCDropDownButton> {
    private myMenu?: Panel;
    private selfRef = createRef<TextButton>();
    defaultClass = () => { return ("CC_DropDown"); };
    onStartUI() {
        const { children, id } = this.props;
        if (this.myMenu == undefined) {
            this.myMenu = $.CreatePanel("Panel", $.GetContextPanel(), `${id}_DropDownMenu`);
            this.myMenu.SetParent(pHudRoot);
            this.myMenu.visible = false;
            this.myMenu.AddClass("CC_DropDownMenu");
        }
        let pBtn = this.selfRef.current;
        if (pBtn) {
            for (let index = 0; index < pBtn.GetChildCount(); index++) {
                const c = pBtn.GetChild(index);
                if (c && c.id != "CC_DropDown_placeholder" && c.id != "CC_DropDown_arrow") {
                    c.visible = (index + 1 == this.props.index);
                }
            }
        }
        render(
            <>
                {Children.map(children, (p, childIndex) => {
                    return (
                        // 包一层
                        <RadioButton group="CC_DropDownMenuItem" selected={childIndex + 1 == this.props.index} className={CSSHelper.ClassMaker("CC_DropDownMenuItem")} onactivate={self => {
                            let pBtn = this.selfRef.current;
                            let bClear = false;
                            if (pBtn) {
                                for (let index = 0; index < pBtn.GetChildCount(); index++) {
                                    const c = pBtn.GetChild(index) as LabelPanel;
                                    if (c && c.id != "CC_DropDown_arrow" && c.id != "CC_DropDown_Clear") {
                                        c.visible = index == childIndex;
                                        if (c.visible) {
                                            if (this.props.onChange) {
                                                this.props.onChange(childIndex, c);
                                            }
                                        }
                                    }
                                    if (c && c.id == "CC_DropDown_Clear" && index == childIndex) {
                                        bClear = true;
                                        c.visible == false;

                                        if (this.props.onClear) {
                                            this.props.onClear();
                                        }
                                    }
                                }
                                if (bClear) {
                                    (pBtn.FindChildTraverse("CC_DropDown_placeholder") as Panel).visible = true;
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

    componentWillUnmount() {
        if (this.myMenu != undefined) {
            render(<></>, this.myMenu);
        }
    }

    toggleMenu(state?: boolean) {
        let pBtn = this.selfRef.current;
        if (pBtn && this.myMenu) {
            let vPos = pBtn.GetPositionWithinWindow();
            this.myMenu.SetPositionInPixels(
                (vPos.x) / this.myMenu.actualuiscale_x,
                (vPos.y + pBtn.actuallayoutheight + 2) / pBtn.actualuiscale_y,
                0
            );

            this.myMenu.visible = state == undefined ? !this.myMenu.visible : state;
            this.myMenu.SetHasClass("CC_DropDownMenuShow", this.myMenu.visible);
            if (this.myMenu.visible) {
                this.myMenu.SetFocus();
                $.Schedule(0.06, () => {
                    if (pBtn && this.myMenu) {
                        this.myMenu.style.minWidth = Math.max(this.myMenu.actuallayoutwidth, pBtn.actuallayoutwidth) + "px";
                        const childItems = this.myMenu.FindChildrenWithClassTraverse("CC_DropDownMenuItem");
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
        const { children, className, ...others } = this.props;
        return (
            <Button ref={this.selfRef} {...others} {...this.initRootAttrs()}
                onactivate={() => { this.toggleMenu(); }}
            >
                {children}
                <Label id="CC_DropDown_placeholder" localizedText={(this.props.index == undefined && this.props.placeholder) ? this.props.placeholder : ""} />
                <Image id="CC_DropDown_arrow" />
            </Button>
        );
    }
}