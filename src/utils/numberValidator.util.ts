export const NumberValidator = {
    validateInterval(value: number): number {
        let num = Math.round(Number(value));
        return Math.min(100, Math.max(0, num));
    }
}
