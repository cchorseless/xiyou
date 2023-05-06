import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { KVHelper } from "../../helper/KVHelper";
import { CCIconButton } from "../AllUIElement/CCButton/CCIconButton";
import { CCItemImage } from "../AllUIElement/CCItem/CCItemImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCHandBookEquip.less";


interface ICCHandBookEquip {
}

export class CCHandBookEquip extends CCPanel<ICCHandBookEquip> {
	defaultStyle() {
		return {
			scroll: "y"
		}
	}
	getItemList() {
		let items: { [k: string]: string[] } = {};
		const imba_items = KVHelper.KVData().imba_items;
		for (const sItemName in imba_items) {
			if (sItemName != "Version") {
				const tItemData = imba_items[sItemName]
				if (typeof (tItemData) != "object") continue;
				if (tItemData.Rarity && tItemData.ShowHandBook && GToNumber(tItemData.ShowHandBook) == 1) {
					items[tItemData.Rarity] = items[tItemData.Rarity] || [];
					items[tItemData.Rarity].push(sItemName);
				};
			}
		}
		for (let k in items) {
			const v = items[k];
			v.sort((a, b) => {
				// 名字
				if ($.Localize("#DOTA_Tooltip_ability_" + a) > $.Localize("#DOTA_Tooltip_ability_" + b)) {
					return 1;
				} else if ($.Localize("#DOTA_Tooltip_ability_" + a) < $.Localize("#DOTA_Tooltip_ability_" + b)) {
					return -1;
				}
				return 0;
			});
		}
		return items;
	};
	render() {
		const items = this.getItemList();
		return <Panel className={CSSHelper.ClassMaker("CCHandBookEquip")}
			hittest={false}
			ref={this.__root__}  {...this.initRootAttrs()}>
			{["C", "B", "A", "S"].map((_, level) => {
				const rarity = _ as IRarity;
				const itemsNames = items[rarity] || [];
				return (
					<CCPanel key={level + ""} className="CCHandBookEquipDiv">
						<CCLabel id="CCHandBookEquipTitle" color={CSSHelper.GetRarityColor(rarity)} localizedText="#lang_HandBook_EquipRarityTitle" dialogVariables={{ rarity: rarity }} />
						<CCPanel id="CCHandBookEquipContainer">
							{itemsNames.map((sItemName, index) => {
								return (
									<CCIconButton className="CCHandBookEquipItem" key={index + ""} flowChildren="down" >
										<CCItemImage itemname={sItemName} showtooltip={true} />
										<CCLabel className="CCHandBookEquipItemName" color={CSSHelper.GetRarityColor(rarity)} text={$.Localize("#DOTA_Tooltip_ability_" + sItemName)} />
									</CCIconButton>
								);
							})}
						</CCPanel>
					</CCPanel>
				);
			})}
		</Panel>
	}
}