import React from "react";

import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCUnitSmallIcon } from "../AllUIElement/CCUnit/CCUnitSmallIcon";

interface ICCUnitChessMoveIcon extends NodePropsData {
    itemname: string;
}
export class CCUnitChessMoveIcon extends CCPanel<ICCUnitChessMoveIcon> {
    defaultStyle() {
        return {
            width: "50px",
            height: "50px",
        }
    }
    changePos(x: number, y: number) {
        this.__root__.current!.style.x = x + "px";
        this.__root__.current!.style.y = y + "px";
    }
    onStartUI() {
    }

    render() {
        return (<Panel id="CC_UnitChessMoveIcon" ref={this.__root__}    {...this.initRootAttrs()}>
            <CCUnitSmallIcon itemname={this.props.itemname} width={"100%"} height={"100%"} />
            {this.props.children}
            {this.__root___childs}
        </Panel>

        )
    };

}
