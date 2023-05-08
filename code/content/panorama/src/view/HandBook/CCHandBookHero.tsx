import React from "react";

import { CombinationConfig } from "../../../../scripts/tscripts/shared/CombinationConfig";
import { CSSHelper } from "../../helper/CSSHelper";
import { KVHelper } from "../../helper/KVHelper";
import { CCAbilityIcon } from "../AllUIElement/CCAbility/CCAbilityIcon";
import { CCDropDownButton } from "../AllUIElement/CCButton/CCDropDownButton";
import { CCIconButton } from "../AllUIElement/CCButton/CCIconButton";
import { CCDOTAScenePanel } from "../AllUIElement/CCDOTAScenePanel/CCDOTAScenePanel";
import { CCDOTAUIEconSetPreview } from "../AllUIElement/CCDOTAScenePanel/CCDOTAUIEconSetPreview";
import { CCIcon_Add } from "../AllUIElement/CCIcons/CCIcon_Add";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCLevelxp } from "../AllUIElement/CCLevelxp/CCLevelxp";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCTxtTable } from "../AllUIElement/CCTable/CCTxtTable";
import { CCUnitSmallIcon } from "../AllUIElement/CCUnit/CCUnitSmallIcon";
import { CCDOTAHeroRelicSummary } from "../RelicSummary/CCDOTAHeroRelicSummary";
import "./CCHandBookHero.less";
interface ICCHandBookHero extends NodePropsData {

}

export class CCHandBookHero extends CCPanel<ICCHandBookHero> {

    render() {
        const DataComp = (GGameScene.Local.TCharacter.DataComp!);
        const HeroManageComp = (GGameScene.Local.TCharacter.HeroManageComp!);
        const ComHeroExp = DataComp.NumericComp!.GetAsInt(GEEnum.EMoneyType.ComHeroExp)
        const InscriptionExp = DataComp.NumericComp!.GetAsInt(GEEnum.EMoneyType.InscriptionExp)
        const SumHeroLevel = HeroManageComp.SumHeroLevel;
        const currarity = this.GetState<string>("rarity") || "All";
        const cursect = this.GetState<string>("cursect") || "All";
        const allSect = CombinationConfig.ESectNameList;
        let unitnames = GJSONConfig.BuildingLevelUpConfig.getDataList().map((info) => { return info.Id });
        unitnames.sort((a, b) => {
            return Entities.GetUnitRarityNumber(a) - Entities.GetUnitRarityNumber(b);
        });
        unitnames = unitnames.filter((name) => {
            if (currarity == "All") {
                return true;
            }
            return Entities.GetUnitRarity(name) == currarity;
        });
        unitnames = unitnames.filter((name) => {
            if (cursect == "All") {
                return true;
            }
            return KVHelper.GetUnitSectLabels(name).includes(cursect);
        });
        const curunitname = this.GetState<string>("curunitname") || unitnames[0];

        return (
            <Panel className="CCHandBookHero" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPanel id="HandBookHeroLeft" flowChildren="down" width="65%" height="100%">
                    <CCPanel id="HandBookSelect" flowChildren="right" width="100%">
                        <CCLabel text={"稀有度："} marginLeft={"20px"} verticalAlign="center" />
                        <CCTxtTable id="HandBookSelectTable" verticalAlign="center" sepmarginleft={"5px"} list={["All", "C", "B", "A", "S"]}
                            onChange={(index: number, text: string) => {
                                this.UpdateState({ rarity: text })
                            }} />
                        <CCLabel text={"流派："} marginLeft={"150px"} verticalAlign="center" />
                        <CCDropDownButton placeholder={"All"} verticalAlign="center" onChange={(index) => {
                            this.UpdateState({ cursect: index == 0 ? "All" : allSect[index - 1] })
                        }} >
                            <CCLabel key={"all"} width="60px" text={"All"} />
                            {
                                allSect.map((sect) => {
                                    return <CCLabel key={sect} width="60px" text={$.Localize("#lang_" + sect)} />
                                })
                            }
                        </CCDropDownButton>
                    </CCPanel>
                    <CCPanel width="100%" height="100%" flowChildren="right-wrap" scroll={"y"}>
                        {
                            unitnames.map((unitname, i) => {
                                return <CCHandBookHeroItem key={"" + i} itemname={unitname} marginLeft={"2px"} marginTop={"10px"}
                                    onclick={() => {
                                        this.UpdateState({ curunitname: unitname })
                                    }} />
                            })
                        }
                    </CCPanel>
                </CCPanel>
                <CCPanel id="HandBookHeroRight" flowChildren="down" width="35%" height="100%">
                    <CCPanel flowChildren="right" verticalAlign="center">
                        <Label id="HandBookHeroExp" localizedText={"#lang_HandBook_SumHeroLevel"} />
                        <Label text={SumHeroLevel + ""} />
                        <Label id="HandBookHeroLevel" localizedText={"#lang_HandBook_ComHeroExp"} />
                        <Label text={ComHeroExp + ""} />
                        <Label id="HandBookHeroInscriptionExp" text={$.Localize("#lang_InscriptionExp") + ":"} />
                        <Label text={InscriptionExp + ""} />
                    </CCPanel>
                    <CCHandBookHeroInfo key={"CCHandBookHeroInfo"} itemname={curunitname} />
                </CCPanel>
            </Panel>
        )
    };
}

interface ICCHandBookHeroItem extends NodePropsData {
    itemname: string,
    onclick?: () => void
}

export class CCHandBookHeroItem extends CCPanel<ICCHandBookHeroItem> {

    render() {
        const unitname = this.props.itemname;
        const HeroManageComp = (GGameScene.Local.TCharacter.HeroManageComp!);
        const herounit = HeroManageComp.GetHeroUnit(unitname);
        const rarity = Entities.GetUnitRarity(unitname);
        const localname = Entities.GetLocalizeUnitName(this.props.itemname);
        let level = 0;
        let exp = 0;
        if (herounit) {
            level = herounit.Level;
            exp = herounit.Exp;
        }
        let maxexp = GJSONConfig.HeroLevelUpConfig.get(level + 1)!.Exp;
        return (
            <Panel className="CCHandBookHeroItem" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPanel flowChildren="right" onactivate={() => { this.props.onclick && this.props.onclick() }}>
                    <CCLevelxp level={level} exp={exp} max={maxexp} width="40px" height="40px" />
                    <CCUnitSmallIcon itemname={unitname} />
                    <CCLabel type="UnitName" width="80px" fontSize="18px" verticalAlign="center" text={localname} color={CSSHelper.GetRarityColor(rarity)} />
                </CCPanel>
                <CCPanel verticalAlign="center" flowChildren="right">
                    {
                        [1, 2, 3, 6].map((a, i) => {
                            let abilityname = KVHelper.GetUnitDataForKey(unitname, "Ability" + a) as string;
                            if (abilityname && abilityname != "ability_empty" && abilityname != "ability_sect_empty") {
                                return <CCAbilityIcon key={"" + i} width="40px" height="40px" marginLeft={"2px"} abilityname={abilityname} showTips={true} />
                            }
                        })

                    }
                    {/* <CCEconItemImage itemdef={20002} width="50px" height="35px" /> */}
                </CCPanel>
            </Panel>
        )

    }
}



export class CCHandBookHeroInfo extends CCPanel<ICCHandBookHeroItem> {

    render() {
        const unitname = this.props.itemname;
        const HeroManageComp = (GGameScene.Local.TCharacter.HeroManageComp!);
        const herounit = HeroManageComp.GetHeroUnit(unitname);
        let level = 0;
        let exp = 0;
        if (herounit) {
            level = herounit.Level;
            exp = herounit.Exp;
        }
        let maxexp = GJSONConfig.HeroLevelUpConfig.get(level + 1)!.Exp;
        const add_strength = 0 + "";
        const add_agility = 0 + "";
        const add_intellect = 0 + "";
        let allwears = GJSONConfig.BuildingLevelUpConfig.get(unitname)?.Bundles;
        const curwearid = this.GetState<number>("curwearid", 0);
        return (
            <Panel className="CCHandBookHeroInfo" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                {
                    curwearid > 0 ? <CCDOTAUIEconSetPreview horizontalAlign="center" key={Math.random() * 100 + ""} unit={unitname.replace("building", "npc_dota")} itemdef={curwearid} />
                        : <CCDOTAScenePanel className="CCHandBookHeroSceneBox"
                            key={Math.random() * 100 + ""}
                            unit={unitname.replace("building", "npc_dota")}
                            allowrotation={false}
                            rotateonmousemove={false}
                            horizontalAlign="center"
                        // map="maps/scenes/rank_divine_ambient.vmap"
                        // particleonly={true}
                        // renderdeferred={false}
                        />
                }

                <CCPanel flowChildren="right" horizontalAlign="center">
                    <CCLevelxp level={level} width="40px" height="40px" />
                    <ProgressBar className="CardLevelBar" value={exp / maxexp} >
                        <Label className="CardLevelLabel" text={`${exp}/${maxexp}`} hittest={false} />
                    </ProgressBar>
                    <CCIconButton icon={<CCIcon_Add id={"CCIcon_Add"} />} onactivate={() => { }} />
                </CCPanel>
                <CCPanel flowChildren="right" horizontalAlign="center">
                    <Label className="CardLevelLabel" text={"升级累计属性："} hittest={false} />
                    <Panel id="StrengthIcon" className="StatIcon" hittest={false} />
                    <Label className="CardLevelLabel" text={add_strength} hittest={false} />
                    <Panel id="AgilityIcon" className="StatIcon" hittest={false} />
                    <Label className="CardLevelLabel" text={add_agility} hittest={false} />
                    <Panel id="IntellectIcon" className="StatIcon" hittest={false} />
                    <Label className="CardLevelLabel" text={add_intellect} hittest={false} />
                </CCPanel>
                {/* <CCPanel flowChildren="right" marginTop={"10px"} uiScale={"100% 100% 100%"}> */}
                {/* <CCTalentBranch unitName={unitname} showLearned={true} /> */}

                {/* </CCPanel> */}
                <CCPanel flowChildren="down" width="100%" marginTop={"20px"}>
                    <CCLabel text="铭文详情" horizontalAlign="center" />
                    <CCDOTAHeroRelicSummary key={Math.random() * 100 + ""} unitName={unitname} />
                </CCPanel>
            </Panel>
        )
    }
}