// import React, { } from "react";
// import { CSSHelper } from "../../helper/CSSHelper";
// import { CCImage } from "../allCustomUIElement/CCImage/CCImage";
// import { CCLabel } from "../allCustomUIElement/CCLabel/CCLabel";
// import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
// import { CCPanelHeader } from "../allCustomUIElement/CCPanel/CCPanelPart";
// import { CCProgressBar } from "../allCustomUIElement/CCProgressBar/CCProgressBar";
// import { CCCombinationIcon } from "./CCCombinationIcon";

// import "./CCCombinationInfoDialog.less";

// interface ICCCombinationInfoDialog {
//     sectName: string
// }

// export class CCCombinationInfoDialog extends CCPanel<ICCCombinationInfoDialog> {
//     render() {
//         const sectName = this.props.sectName;
//         return (
//             <Panel ref={this.__root__} id="CC_CombinationBottomPanel"  {...this.initRootAttrs()}>
//                 <CCPanel width="380px" flowChildren="down">
//                     <CCPanelHeader flowChildren="right">
//                         {/* <DOTAAbilityImage className="SectImage" abilityname={sectName} /> */}
//                         <CCCombinationIcon className="SectImage" sectName={sectName} />
//                         <CCPanel className="SectDes" flowChildren="down" marginLeft="8px" >
//                             <Label id="SectNameHeader" html={true} text={$.Localize("#DOTA_Tooltip_ability_" + sectName) + [...Array(sectInfo.level)].map(() => { return "★"; }).join("") + ` (${sectInfo.exp}/${sectInfo.maxExp})`} />
//                             <Label id="SectNameDescription" html={true} text={replaceValues({
//                                 sStr: $.Localize("#DOTA_Tooltip_ability_" + sectName + "_description"),
//                                 sAbilityName: sectName,
//                                 bShowExtra: false,
//                                 iLevel: Math.max(0, sectInfo.level) + sectInfo.bonusLevel,
//                                 // bOnlyNowLevelValue: true
//                             })} />
//                         </CCPanel>
//                     </CCPanelHeader>
//                     <CCProgressBar id="RemainProgress" max={100} value={sectOverload.remains} >
//                         <CCLabel align="center center" localizedText={"剩余:{d:value}%"} dialogVariables={{ value: sectOverload.remains }} />
//                     </CCProgressBar>
//                     {Object.keys(tData).sort((a, b) => { return GameUI.CustomUIConfig().AbilityUpgradesKv[a].cost - GameUI.CustomUIConfig().AbilityUpgradesKv[b].cost; }).map((abilityUpgradeID, index) => {
//                         const abilityUpgradeInfo = GameUI.CustomUIConfig().AbilityUpgradesKv[abilityUpgradeID];
//                         if (abilityUpgradeInfo.sect.indexOf(sectName) != -1) {
//                             const iLevel = tData[abilityUpgradeID].level;
//                             const rarity = abilityUpgradeInfo.rarity;
//                             return (
//                                 <CCPanel key={index + ""} className="SectRow" flowChildren="right">
//                                     {/* abilityUpgradeID */}
//                                     {/* <CCPanel style={{ overflow: "noclip" }}>
// 								<Image className="AbilityImage" src={`file://{images}/spellicons/${abilityUpgradeInfo.Texture}.png`} />
// 								{abilityUpgradeInfo.rarity == "r" &&
// 									<DOTAParticleScenePanel className="AbilityImageBorder" particleName="particles/ui/hud/rare_ability.vpcf" cameraOrigin="0 0 550" lookAt="0 0 0" fov={10} />
// 								}
// 								{abilityUpgradeInfo.rarity == "sr" &&
// 									<DOTAParticleScenePanel className="AbilityImageBorder" particleName="particles/ui/hud/autocasting_square.vpcf" cameraOrigin="0 0 550" lookAt="0 0 0" fov={10} />
// 								}
// 							</CCPanel> */}
//                                     <Image className="AbilityImage" src={`file://{images}/spellicons/${abilityUpgradeInfo.Texture}.png`} />
//                                     <CCPanel flowChildren="down" marginLeft="8px" >
//                                         <Label className={CSSHelper.ClassMaker("SectName", { Rare: rarity == "r", SuperRare: rarity == "sr" })} html={true} text={$.Localize("#DOTA_Tooltip_ability_mechanics_" + abilityUpgradeID) + "Lv." + (iLevel == tSetting[rarity] ? "Max" : iLevel)} />
//                                         <Label className="SectDescription" html={true} text={getSectDescription(abilityUpgradeID, iLevel - 1, true)} />
//                                     </CCPanel>
//                                 </CCPanel>
//                             );
//                         }
//                     })}
//                     <CCPanel id="LoreContainer">
//                         <Label html={true} text={$.Localize("#DOTA_Tooltip_ability_" + sectName + "_Lore")} />
//                     </CCPanel>
//                 </CCPanel>
//             </Panel>
//         )
//     }
// }