import React from "react";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";



export class CCDrawCardPanel extends CCPanel<NodePropsData> {

    onInitUI() {

    }

    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_DrawCardPanel" hittest={false} {...this.initRootAttrs()}>


            </Panel>
        )
    }

}

