import React, { createRef, PureComponent } from "react";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { PanelAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../CCPanel/CCPanel";

interface IBuffList extends NodePropsData {
}

export class CCBuffList extends CCPanel<IBuffList> {

    defaultStyle = () => {
        return {
            width: "100%",
            height: "50px",
        }
    }
    render() {
        return (
            this.__root___isValid && (
                <Panel id="BuffContainer" ref={this.__root__}  {...this.initRootAttrs()}>
                    <CCPanel flowChildren="right" width="100%">
                        <GenericPanel type="DOTABuffList" id="buffs" showdebuffs="false" style={{ flowChildren: "right-wrap", width: "50%" }} />
                        <GenericPanel type="DOTABuffList" id="debuffs" showbuffs="false" style={{ flowChildren: "right-wrap", width: "50%" }} />
                    </CCPanel>
                    {this.props.children}
                    {this.__root___childs}
                </Panel>
            )
        );
    }
}
