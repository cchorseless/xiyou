"use strict";

var tSettings = CustomNetTables.GetTableValue("common", "settings");
CustomNetTables.SubscribeNetTableListener("common", () => {
	tSettings = CustomNetTables.GetTableValue("common", "settings");
});

var iAttackRangeParticleID: ParticleID = -1 as ParticleID;

function ShowStatsTooltip() {
	let pStatsTooltipRegion = $("#StatsTooltipRegion");
	$.DispatchEvent("UIShowCustomLayoutTooltip", pStatsTooltipRegion, "stats_tooltip_region_tooltips", "file://{resources}/layout/custom_game/tooltips/unit_stats/unit_stats.xml");

	let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();
	if (iAttackRangeParticleID != -1) {
		Particles.DestroyParticleEffect(iAttackRangeParticleID, false);
		iAttackRangeParticleID = -1 as ParticleID;
	}
	let fRange = Entities.GetAttackRange(iLocalPortraitUnit) + Entities.GetHullRadius(iLocalPortraitUnit);
	iAttackRangeParticleID = Particles.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, iLocalPortraitUnit);
	Particles.SetParticleControl(iAttackRangeParticleID, 1, [fRange, fRange, fRange]);
}

function HideStatsTooltip() {
	let pStatsTooltipRegion = $("#StatsTooltipRegion");
	$.DispatchEvent("UIHideCustomLayoutTooltip", pStatsTooltipRegion, "stats_tooltip_region_tooltips");

	if (iAttackRangeParticleID != -1) {
		Particles.DestroyParticleEffect(iAttackRangeParticleID, false);
		iAttackRangeParticleID = -1 as ParticleID;
	}
}

(function () {
	let pStatsContainer = $("#StatsContainer");
	let pStatsTooltipRegion = $("#StatsTooltipRegion");

	pStatsTooltipRegion.SetPanelEvent("onmouseover", ShowStatsTooltip);
	pStatsTooltipRegion.SetPanelEvent("onmouseout", HideStatsTooltip);

	function updateBonus(p: Panel, sVariableName: string, fValue: number, iRetained: number = 0) {
		let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();

		if (LoadData(p, "iUnit") == undefined) SaveData(p, "iUnit", -1);

		if (LoadData(p, "fValue") != undefined && LoadData(p, "fValue") == fValue) return;

		if (LoadData(p, "fSmoothValue") == undefined) SaveData(p, "fSmoothValue", 0);

		if (fValue <= LoadData(p, "fSmoothValue") || LoadData(p, "fValue") == undefined || iLocalPortraitUnit != LoadData(p, "iUnit")) {
			if (LoadData(p, "iAnimatingUpSchedule") != undefined) {
				$.CancelScheduled(LoadData(p, "iAnimatingUpSchedule"));
				SaveData(p, "iAnimatingUpSchedule", undefined);
			}

			let sSign = fValue == 0 ? "" : (fValue > 0 ? "+" : "-");
			let sValue;

			if (sSign == "") {
				sValue = "";
			}
			else if (sSign == "+") {
				sValue = sSign + FormatNumber(Round(fValue, iRetained));
			}
			else {
				sValue = FormatNumber(Round(fValue, iRetained));
			}
			p.SetHasClass("StatPositive", sSign == "+");
			p.SetHasClass("StatNegative", sSign == "-");

			p.SetDialogVariable(sVariableName, sValue);

			SaveData(p, "fSmoothValue", fValue);
			p.RemoveClass("AnimatingUp");
		} else {
			if (LoadData(p, "iAnimatingUpSchedule") != undefined) {
				$.CancelScheduled(LoadData(p, "iAnimatingUpSchedule"));
				SaveData(p, "iAnimatingUpSchedule", undefined);
			}

			p.AddClass("AnimatingUp");

			let fSpeed = 50;
			let fStartValue = LoadData(p, "fValue");
			let fEndValue = fValue;
			let fStartTime = Game.Time();
			let fEndTime = Game.Time() + Clamp(Math.abs(fEndValue - fStartValue) / fSpeed, 0, 0.5);
			let func = () => {
				let fTime = Game.Time();
				SaveData(p, "fSmoothValue", RemapValClamped(fTime, fStartTime, fEndTime, fStartValue, fEndValue));

				let sSign = LoadData(p, "fSmoothValue") == 0 ? "" : (LoadData(p, "fSmoothValue") > 0 ? "+" : "-");
				let sValue;

				if (sSign == "") {
					sValue = "";
				}
				else if (sSign == "+") {
					sValue = sSign + FormatNumber(Round(LoadData(p, "fSmoothValue"), iRetained));
				}
				else {
					sValue = FormatNumber(Round(LoadData(p, "fSmoothValue"), iRetained));
				}
				p.SetHasClass("StatPositive", sSign == "+");
				p.SetHasClass("StatNegative", sSign == "-");

				p.SetDialogVariable(sVariableName, sValue);

				if (fTime < fEndTime) {
					SaveData(p, "iAnimatingUpSchedule", $.Schedule(Game.GetGameFrameTime(), func));
				} else {
					p.RemoveClass("AnimatingUp");
					SaveData(p, "iAnimatingUpSchedule", undefined);
					SaveData(p, "fSmoothValue", LoadData(p, "fValue"));
				}
			};
			SaveData(p, "iAnimatingUpSchedule", $.Schedule(Game.GetGameFrameTime(), func));
		}
		SaveData(p, "fValue", fValue);
		SaveData(p, "iUnit", iLocalPortraitUnit);
	}

	let update = () => {
		$.Schedule(1 / 30, update);

		let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();

		if (iLocalPortraitUnit == -1) return;

		pStatsContainer.SetHasClass("ShowDamageArmorMovement", true);

		// 攻击力
		let pDamage = pStatsContainer.FindChildTraverse("Damage");
		if (pDamage) {
			pDamage.SetHasClass("ShowSplitLabels", !pDamage.BAscendantHasClass("AltPressed"));

			let fDamage = Math.floor(Entities.GetAttackDamage(iLocalPortraitUnit));
			let fBaseDamage = Math.floor(Entities.GetBaseAttackDamage(iLocalPortraitUnit));
			let fBonusDamage = fDamage - fBaseDamage;

			pDamage.SetDialogVariable("combined_damage", FormatNumber(Math.floor(fDamage)));
			pDamage.SetDialogVariable("damage", FormatNumber(Math.floor(fBaseDamage)));
			updateBonus(pDamage.FindChildTraverse("DamageModifierLabel")!, "bonus_damage", fBonusDamage);
		}
		// 防御
		let pArmor = pStatsContainer.FindChildTraverse("Armor");
		if (pArmor) {
			pArmor.SetHasClass("ShowSplitLabels", true);

			let fArmor = Entities.GetArmor(iLocalPortraitUnit);
			let fBaseArmor = Entities.GetBaseArmor(iLocalPortraitUnit);
			let fBonusArmor = fArmor - fBaseArmor;
			let fArmorReduction = finiteNumber(Number(Entities.GetUnitData(iLocalPortraitUnit, "GetReduction")));

			pArmor.SetDialogVariable("combined_armor", FormatNumber(Round(fArmor)));
			pArmor.SetDialogVariable("armor", FormatNumber(Round(fBaseArmor)));
			pArmor.SetDialogVariableInt("armor_resistance", parseInt((fArmorReduction * 100).toFixed(0)));

			updateBonus(pArmor.FindChildTraverse("ArmorModifierLabel")!, "bonus_armor", fBonusArmor);
		}
		// 移动速度
		let pMoveSpeed = pStatsContainer.FindChildTraverse("MoveSpeed");
		if (pMoveSpeed) {
			pMoveSpeed.SetHasClass("ShowSplitLabels", pMoveSpeed.BAscendantHasClass("AltPressed"));

			let fBaseMoveSpeed = Math.max(Entities.GetBaseMoveSpeed(iLocalPortraitUnit), 100);
			let fBonusMoveSpeed = Entities.GetMoveSpeedModifier(iLocalPortraitUnit, fBaseMoveSpeed) - fBaseMoveSpeed;

			pMoveSpeed.SetDialogVariable("combined_move_speed", (fBaseMoveSpeed + fBonusMoveSpeed).toFixed(0));
			pMoveSpeed.SetDialogVariableInt("base_move_speed", fBaseMoveSpeed);

			updateBonus(pMoveSpeed.FindChildTraverse("MoveSpeedModifierLabel")!, "bonus_move_speed", fBonusMoveSpeed);
		}

		pStatsContainer.SetHasClass("ShowStrAgiInt", Entities.HasHeroAttribute(iLocalPortraitUnit));

		if (Entities.HasHeroAttribute(iLocalPortraitUnit)) {
			// 力量
			let pStrength = pStatsContainer.FindChildTraverse("Strength");
			if (pStrength) {
				pStrength.SetHasClass("ShowSplitLabels", !pStrength.BAscendantHasClass("AltPressed"));

				let iStrength = Entities.GetStrength(iLocalPortraitUnit);
				let iBaseStrength = Entities.GetBaseStrength(iLocalPortraitUnit);
				let iBonusStrength = iStrength - iBaseStrength;

				pStrength.SetDialogVariable("strength", FormatNumber(Round(iBaseStrength)));
				pStrength.SetDialogVariable("combined_strength", FormatNumber(Round(iStrength)));
				updateBonus(pStrength.FindChildTraverse("StrengthModifierLabel")!, "strength_bonus", iBonusStrength);
			}
			// 敏捷
			let pAgility = pStatsContainer.FindChildTraverse("Agility");
			if (pAgility) {
				pAgility.SetHasClass("ShowSplitLabels", !pAgility.BAscendantHasClass("AltPressed"));

				let iAgility = Entities.GetAgility(iLocalPortraitUnit);
				let iBaseAgility = Entities.GetBaseAgility(iLocalPortraitUnit);
				let iBonusAgility = iAgility - iBaseAgility;

				pAgility.SetDialogVariable("agility", FormatNumber(Round(iBaseAgility)));
				pAgility.SetDialogVariable("combined_agility", FormatNumber(Round(iAgility)));
				updateBonus(pAgility.FindChildTraverse("AgilityModifierLabel")!, "agility_bonus", iBonusAgility);
			}
			// 智力
			let pIntellect = pStatsContainer.FindChildTraverse("Intellect");
			if (pIntellect) {
				pIntellect.SetHasClass("ShowSplitLabels", !pIntellect.BAscendantHasClass("AltPressed"));

				let iIntellect = Entities.GetIntellect(iLocalPortraitUnit);
				let iBaseIntellect = Entities.GetBaseIntellect(iLocalPortraitUnit);
				let iBonusIntellect = iIntellect - iBaseIntellect;

				pIntellect.SetDialogVariable("intellect", FormatNumber(Round(iBaseIntellect)));
				pIntellect.SetDialogVariable("combined_intellect", FormatNumber(Round(iIntellect)));
				updateBonus(pIntellect.FindChildTraverse("IntellectModifierLabel")!, "intellect_bonus", iBonusIntellect);
			}
		}
	};
	update();
})();