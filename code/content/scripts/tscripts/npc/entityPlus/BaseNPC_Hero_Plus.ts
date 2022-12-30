/*
 * @Author: Jaxh
 * @Date: 2021-05-07 16:05:35
 * @LastEditors: your name
 * @LastEditTime: 2021-06-16 10:28:55
 * @Description: file content
 */
import { GameFunc } from "../../GameFunc";
import { LogHelper } from "../../helper/LogHelper";
import { BaseNpc_Hero } from "./Base_Plus";
/**英雄单位基类 */
export class BaseNpc_Hero_Plus extends BaseNpc_Hero {
}

declare global {
    type IBaseNpc_Hero_Plus = BaseNpc_Hero_Plus;
}