import { FuncHelper } from "../../../helper/FuncHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { CustomMiniMap_UI } from "./CustomMiniMap_UI";

export class CustomMiniMap extends CustomMiniMap_UI {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
    }
    onStartUI() {
        let minimap_block=this.__root__.current!.FindChildTraverse("minimap_block")
        minimap_block!.visible = true;
        this.__root__.current!.style.width='250px'
        this.__root__.current!.style.borderRadius="20px 20px 20px 20px / 20px 20px 20px 20px"
    }
}
