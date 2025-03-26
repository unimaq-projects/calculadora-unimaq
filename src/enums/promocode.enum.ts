export const PromocodeEnum = {
    trimester: {num: 3},
    semester: {num: 6},
    threeTrimesters: {num: 9},
    annual: {num: 12}
}

export type PromocodeKey = keyof typeof PromocodeEnum;