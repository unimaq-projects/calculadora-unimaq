import {PaymentTypeEnum} from "../enums/paymentType.enum";
import {PromocodeEnum, PromocodeKey} from "../enums/promocode.enum";
import {EquipmentKey} from "../enums/equipment.enum";

export class CalculatorModel{
    equipment: EquipmentKey | null; //Equipo elegido (CCR y Nuevo)
    serie: string; //Serie
    numExcavator: number; // Excavadora
    numRetroExcavator: number; //Retro excavadora
    numSkidSteer: number; //Mini cargador
    numFrontLoader: number; //Cargador Frontal
    discountCCR: number;
    discountNew: number;
    paymentTypeCCR: PaymentTypeEnum;
    paymentTypeNew: PaymentTypeEnum;
    interestRate: number;
    promocode: PromocodeKey;

    constructor(
        ccrEquipment?: EquipmentKey,
        serie?: string,
        numExcavator?: number,
        numRetroExcavator?: number,
        numSkidSteer?: number,
        numFrontLoader?: number,
        discountCCR?: number,
        discountNew?: number,
        paymentTypeCCR?: PaymentTypeEnum,
        paymentTypeNew?: PaymentTypeEnum,
        interestRate?: number,
        promocode?: PromocodeKey
    ) {
        this.equipment = ccrEquipment ?? null;
        this.serie = serie ?? "";
        this.numExcavator = numExcavator ?? 0;
        this.numRetroExcavator = numRetroExcavator ?? 0;
        this.numSkidSteer = numSkidSteer ?? 0;
        this.numFrontLoader = numFrontLoader ?? 0;
        this.discountCCR = discountCCR ?? 0;
        this.discountNew = discountNew ?? 0;
        this.paymentTypeCCR = paymentTypeCCR ?? null;
        this.paymentTypeNew = paymentTypeNew ?? null;
        this.interestRate = interestRate ?? 0;
        this.promocode = promocode ?? null;
    }
}