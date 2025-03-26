export const EquipmentEnum = {
    F420: {
        label: "420F",
        ccrPrice: 90000,
        newPrice: 146883,
        epp: 3228.57,
        cva500: 783.73,
        difference: 88.02,
        difference2: 169.94
    },
    D320: {
        label: "320D",
        ccrPrice: 160000,
        newPrice: 245950,
        epp: 4714,
        cva500: 1177.61,
        difference: 174.61,
        difference2: 170.99
    },
    K938: {
        label: "938K / 938H",
        ccrPrice: 145000,
        newPrice: 249600,
        epp: 4786,
        cva500: 1210,
        difference: 115,
        difference2: 154
    },
    D246: { label: "246D",
        ccrPrice: 45000,
        newPrice: 68200,
        epp: 0,
        cva500: 550,
        difference: 61.10,
        difference2: 97.66
    }
} as const;

export type EquipmentKey = keyof typeof EquipmentEnum;