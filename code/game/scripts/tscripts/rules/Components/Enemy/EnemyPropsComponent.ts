import { reloadable } from "../../../GameCache";
import { KVHelper } from "../../../helper/KVHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_wave } from "../../../npc/modifier/building/modifier_wave";
import { ET } from "../../Entity/Entity";
import { DifficultyConfig } from "../../System/Difficulty/DifficultyConfig";
import { DifficultyState } from "../../System/Difficulty/DifficultyState";
import { EnemyUnitEntityRoot } from "./EnemyUnitEntityRoot";
@reloadable
export class EnemyPropsComponent extends ET.Component {

    // fHPMult: number = 0;
    // fMPMult: number = 0;
    // fArmorPhyMult: number = 0;
    // fArmorMagMult: number = 0;

    // fHPAdd: number = 0;
    // fMPAdd: number = 0;
    // fArmorPhyAdd: number = 0;
    // fArmorMagAdd: number = 0;

    // onAwake(...args: any[]): void {
    //     let domain = this.GetDomain<BaseNpc_Plus>();
    //     let round = domain.ETRoot.As<EnemyUnitEntityRoot>().GetRound();
    //     let Roundconfig = round.config;
    //     switch (DifficultyState.DifficultyChapter) {
    //         case DifficultyConfig.EDifficultyChapter.n1:
    //             this.fHPMult = tonumber(Roundconfig.hp) || 0;
    //             this.fMPMult = tonumber(Roundconfig.mp) || 0;
    //             this.fArmorPhyMult = tonumber(Roundconfig.armorp) || 0;
    //             this.fArmorMagMult = tonumber(Roundconfig.armorm) || 0;
    //             break;
    //         case DifficultyConfig.EDifficultyChapter.n2:
    //         case DifficultyConfig.EDifficultyChapter.n3:
    //         case DifficultyConfig.EDifficultyChapter.n4:
    //         case DifficultyConfig.EDifficultyChapter.n5:
    //         case DifficultyConfig.EDifficultyChapter.n6:
    //         case DifficultyConfig.EDifficultyChapter.n7:
    //         case DifficultyConfig.EDifficultyChapter.n8:
    //             this.fHPMult = tonumber(Roundconfig[("hp_" + DifficultyState.DifficultyChapter) as "hp_1"]) || 0;
    //             this.fMPMult = tonumber(Roundconfig[("mp_" + DifficultyState.DifficultyChapter) as "mp_1"]) || 0;
    //             this.fArmorPhyMult = tonumber(Roundconfig[("armorp_" + DifficultyState.DifficultyChapter) as "armorp_1"]) || 0;
    //             this.fArmorMagMult = tonumber(Roundconfig[("armorm_" + DifficultyState.DifficultyChapter) as "armorm_1"]) || 0;
    //             break;
    //     }
    //     this.fHPMult += DifficultyState.getEnemyHPMult();
    //     this.fArmorPhyMult += DifficultyState.getEnemyArmorPhyMult();
    //     this.fArmorMagMult += DifficultyState.getEnemyArmorMagMult();

    //     this.fHPAdd += DifficultyState.getEnemyHPAdd();
    //     this.fArmorPhyAdd += DifficultyState.getEnemyArmorPhyAdd();
    //     this.fArmorMagAdd += DifficultyState.getEnemyArmorMagAdd();
    //     this.addPropsBuff();
    // }


    // private addPropsBuff() {
    //     let domain = this.GetDomain<BaseNpc_Plus>();
    //     let unitComp = domain.ETRoot.As<EnemyUnitEntityRoot>().EnemyUnitComp();
    //     let hpBouns = tonumber(unitComp.config.StatusHealth || "0") * this.fHPMult + this.fHPAdd;
    //     let mpBouns = tonumber(unitComp.config.StatusMana || "0") * this.fMPMult + this.fMPAdd;
    //     let armorPhyBouns = tonumber(unitComp.config.ArmorPhysical || "0") * this.fArmorPhyMult + this.fArmorPhyAdd;
    //     let armorMagBouns = tonumber(unitComp.config.MagicalArmor || "0") * this.fArmorMagMult + this.fArmorMagAdd;

    //     domain.addSpawnedHandler(
    //         ET.Handler.create(this, () => {
    //             modifier_wave.applyOnly(domain, domain, null,
    //                 {
    //                     Hp: hpBouns,
    //                     Mp: mpBouns,
    //                     PhysicalArmor: armorPhyBouns,
    //                     MagicalArmor: armorMagBouns
    //                 })
    //         })
    //     )
    // }

    onAwake(...args: any[]): void {
    }

}