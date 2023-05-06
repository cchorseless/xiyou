import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCHandBookFaq.less";


interface ICCHandBookFaq {
}

export class CCHandBookFaq extends CCPanel<ICCHandBookFaq> {

    defaultStyle() {
        return {
            scroll: "y"
        }
    }

    GetQAACount() {
        let iCount = 1;
        for (let i = 1; i < 1000; i++) {
            let key = "#lang_FAQ_Question_" + i;
            let sLoc = $.Localize(key);
            if (key == sLoc) {
                break;
            }
            key = "#lang_FAQ_Answer_" + i;
            sLoc = $.Localize(key);
            if (key == sLoc) {
                break;
            }
            iCount = i;
        }
        return iCount;
    };

    render() {
        return <Panel className={CSSHelper.ClassMaker("CCHandBookFaq")}
            ref={this.__root__} hittest={false}   {...this.initRootAttrs()}>
            {[...Array(this.GetQAACount())].map((_, index) => {
                return (<Panel key={index} id="HandBookFAQ" className="QAndAExpand" onactivate={self => { self.ToggleClass("Expand"); }}>
                    <Panel id="QAndA_Question" hittest={false}>
                        <Panel id="QAndA_Toggle" />
                        <Label id="QAndA_Question_Label" text={$.Localize("#lang_FAQ_Question_" + (index + 1))} html={true} />
                    </Panel>
                    <Panel id="QAndA_Answer" hittest={false}>
                        <Label id="QAndA_Answer_Label" text={$.Localize("#lang_FAQ_Answer_" + (index + 1))} html={true} />
                    </Panel>
                </Panel>
                );
            })}
        </Panel>
    }
}