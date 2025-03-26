export const Formatter = {
    currency(value: number | bigint, locale = "en-US", currency = "USD") {
        if (value == null) return "-";
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    },

    percentage(value: number, locale = "en-US") {
        if (value == null) return "-";
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value) + "%";
    }
}