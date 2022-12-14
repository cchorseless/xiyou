/** Create By Editor*/
import React, { createRef, useState } from "react";
import { render } from "@demon673/react-panorama";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { CCPanel } from "../../AllUIElement/CCPanel/CCPanel";
export class CCEnd_Screen extends CCPanel<NodePropsData> {
}
render(<CCEnd_Screen />, $.GetContextPanel());
