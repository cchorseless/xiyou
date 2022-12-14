import { CCIcon } from "./CCIcon";

export class CCIcon_RaritySSR extends CCIcon<{ type?: "Tui3"; }> {
	defaultStyle() {
		let styles = super.defaultStyle();
		switch (this.props.type) {
			case "Tui3":
				return Object.assign(styles, {
					src: "s2r://panorama/images/eom_design/icon/tui3/card_rarity_ssr_png.vtex",
				});
			default:
				return Object.assign(styles, {
					src: "s2r://panorama/images/eom_design/icon/tui3/card_rarity_ssr_png.vtex",
				});
		}
	}
}