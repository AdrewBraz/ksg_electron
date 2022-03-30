const DayCalculation = (inDate, outDate) => Math.round((outDate.getTime() - inDate.getTime()) / (24 * 3600 * 1000));
export { DayCalculation, makeCounter }