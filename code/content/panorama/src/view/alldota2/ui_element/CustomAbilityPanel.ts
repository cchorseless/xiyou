import { LogHelper } from "../../../helper/LogHelper";
import { CustomAbilityPanel_UI } from "./CustomAbilityPanel_UI";

export class CustomAbilityPanel extends CustomAbilityPanel_UI {
    constructor(p: any) {
        super(p);
    }
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        if (this.props.abilityid == null) {
            return;
        }
        LogHelper.print(this.props.abilityid, 1111);
        let panel = $.CreatePanelWithProperties("DOTAAbilityPanel", this.__root__.current!, this.props.abilityid, {
        });
        if (panel) {
            // panel.SetParent(this.__root__.current!);
            // panel.style.width = "100%";
            // panel.style.height = "100%";
        }
    }
    onStartUI() {}
}
