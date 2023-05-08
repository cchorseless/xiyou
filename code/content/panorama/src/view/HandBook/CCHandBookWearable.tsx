import React from "react";
import { CombinationConfig } from "../../../../scripts/tscripts/shared/CombinationConfig";
import { CSSHelper } from "../../helper/CSSHelper";
import { KVHelper } from "../../helper/KVHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCDropDownButton } from "../AllUIElement/CCButton/CCDropDownButton";
import { CCDOTAScenePanel } from "../AllUIElement/CCDOTAScenePanel/CCDOTAScenePanel";
import { CCDOTAUIEconSetPreview } from "../AllUIElement/CCDOTAScenePanel/CCDOTAUIEconSetPreview";
import { CCEconItemImage } from "../AllUIElement/CCEconItem/CCEconItemImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCTxtTable } from "../AllUIElement/CCTable/CCTxtTable";
import { CCUnitBustIcon } from "../AllUIElement/CCUnit/CCUnitBustIcon";
import "./CCHandBookWearable.less";


interface ICCHandBookWearable {
}

export class CCHandBookWearable extends CCPanel<ICCHandBookWearable> {

    render() {
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
        return <Panel className={CSSHelper.ClassMaker("CCHandBookWearable")}
            ref={this.__root__} hittest={false}   {...this.initRootAttrs()}>
            <CCPanel id="HandBookWearableLeft" flowChildren="down" width="60%" height="100%" >
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
                <CCPanel id="HandBookWearableList" flowChildren="right-wrap" width="100%" scroll={"y"}>
                    {
                        unitnames.map((unitname, i) => {
                            return <CCHandBookWearableItem key={"" + i} itemname={unitname} marginLeft={"2px"} marginTop={"10px"}
                                onclick={() => {
                                    this.UpdateState({ curunitname: unitname })
                                }} />
                        })
                    }
                </CCPanel>
            </CCPanel>

            <CCPanel id="HandBookWearableLeft" width="40%" flowChildren="down" height="100%" >
                <CCHandBookWearableInfo key={"CCHandBookHeroInfo"} itemname={curunitname} />
            </CCPanel>
        </Panel>
    }
}


interface ICCHandBookWearableItem extends NodePropsData {
    itemname: string,
    onclick?: () => void
}

export class CCHandBookWearableItem extends CCPanel<ICCHandBookWearableItem> {

    render() {
        const unitname = this.props.itemname;
        const HeroManageComp = (GGameScene.Local.TCharacter.HeroManageComp!);
        const herounit = HeroManageComp.GetHeroUnit(unitname);
        const rarity = Entities.GetUnitRarity(unitname);
        const localname = Entities.GetLocalizeUnitName(this.props.itemname);
        if (herounit) {
        }
        return (
            <Panel className="CCHandBookWearableItem" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPanel flowChildren="down" onactivate={() => { this.props.onclick && this.props.onclick() }}>
                    <CCUnitBustIcon itemname={unitname} />
                    <CCLabel type="UnitName" fontSize="18px" horizontalAlign="center" text={localname} color={CSSHelper.GetRarityColor(rarity)} />
                </CCPanel>
                <CCPanel verticalAlign="center" flowChildren="right">
                    {
                        // [1, 2, 3, 6].map((a, i) => {
                        //     let abilityname = KVHelper.GetUnitDataForKey(unitname, "Ability" + a) as string;
                        //     if (abilityname && abilityname != "ability_empty" && abilityname != "ability_sect_empty") {
                        //         return <CCAbilityIcon key={"" + i} width="40px" height="40px" marginLeft={"2px"} abilityname={abilityname} showTips={true} />
                        //     }
                        // })

                    }
                    {/* <CCEconItemImage itemdef={20002} width="50px" height="35px" /> */}
                </CCPanel>
            </Panel>
        )

    }
}








interface ICCHandBookWearableInfo {
    itemname: string;
}


export class CCHandBookWearableInfo extends CCPanel<ICCHandBookWearableInfo> {

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

        let allwears = GJSONConfig.BuildingLevelUpConfig.get(unitname)?.Bundles;
        let curwearid = 0;
        if (unitname == this.GetState<string>("curunitname", "")) {
            curwearid = this.GetState<number>("curwearid", 0);
        }
        return (
            <Panel className="CCHandBookWearableInfo" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPanel horizontalAlign="center">
                    {
                        curwearid > 0 ? <CCDOTAUIEconSetPreview className="CCHandBookWearableSceneBox" key={Math.random() * 100 + ""} unit={unitname.replace("building", "npc_dota")} itemdef={curwearid} allowrotation={true}
                            rotateonmousemove={true} />
                            : <CCDOTAScenePanel className="CCHandBookWearableSceneBox"
                                key={Math.random() * 100 + ""}
                                unit={unitname.replace("building", "npc_dota")}
                                allowrotation={true}
                                rotateonmousemove={true}
                            // map="maps/scenes/rank_divine_ambient.vmap"
                            // particleonly={true}
                            // renderdeferred={false}
                            />
                    }
                    <CCLabel text="皮肤抽奖概率获取" horizontalAlign="center" type="UnitName" verticalAlign="bottom" />
                </CCPanel>
                <CCPanel flowChildren="right" horizontalAlign="center">
                </CCPanel>
                <CCPanel flowChildren="down" width="100%" marginTop={"20px"}>
                    <CCLabel text="皮肤详情" horizontalAlign="center" />
                    <CCPanel flowChildren="right" scroll={"y"} >
                        {
                            allwears && allwears.map((wear, i) => {
                                return <CCEconItemImage key={"" + i} itemdef={wear} onactivate={() => {
                                    this.UpdateState({ curwearid: wear, curunitname: unitname });
                                }} />
                            })
                        }
                    </CCPanel>
                    <CCPanel flowChildren="down" width="100%" marginTop={"20px"}>
                        <CCLabel text="穿戴效果" horizontalAlign="center" />
                        <CCLabel text="皮肤描述" horizontalAlign="center" />
                        <CCPanel flowChildren="right" horizontalAlign="center">
                            <CCButton text="穿戴" horizontalAlign="center" />
                        </CCPanel>
                    </CCPanel>
                </CCPanel>
            </Panel>
        )
    }
}