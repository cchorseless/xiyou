/** Create By Editor*/
import React, { createRef, useState } from "react";
import { render } from "@demon673/react-panorama";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { CCPanel } from "../../AllUIElement/CCPanel/CCPanel";
export class CCHero_Select extends CCPanel<NodePropsData> {
}

render(<CCHero_Select />, $.GetContextPanel())

