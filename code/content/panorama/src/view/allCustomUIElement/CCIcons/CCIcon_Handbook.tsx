import { CSSHelper } from "../../../helper/CSSHelper";
import { CCIcon } from "./CCIcon";

export class CCIcon_Handbook extends CCIcon<{ type: "Tui3" | "Tui3Menu"; }> {
	static defaultProps = {
		type: CSSHelper.DEFAULT_ADDON_TYPE,
	};
	defaultStyle = () => {
		switch (this.props.type) {
			case "Tui3Menu":
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui3/handbook_menu.vtex",
				};
			case "Tui3":
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui3/handbook.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui3/handbook_menu.vtex",
				};
		}
	}
}