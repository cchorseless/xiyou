import { CCIcon } from "./CCIcon";

export class CCIcon_RarityN extends CCIcon<{ type?: "Tui3"; }> {
	defaultStyle = () => {
		switch (this.props.type) {
			case "Tui3":
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui3/card_rarity_n_png.vtex",
				};
			default:
				return {
					src: "s2r://panorama/images/eom_design/icon/Tui3/card_rarity_n_png.vtex",
				};
		}
	}
}