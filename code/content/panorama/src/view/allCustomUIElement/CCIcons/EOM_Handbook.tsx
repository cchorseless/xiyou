import { DEFAULT_ADDON_TYPE } from "../config";
import EOM_Icon from "./CCIcon";

export default class EOM_Handbook extends EOM_Icon<{ type: "Tui3" | "Tui3Menu"; }> {
	static defaultProps = {
		type: DEFAULT_ADDON_TYPE,
	};
	defaultIconAttribute = (() => {
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
	})();
}