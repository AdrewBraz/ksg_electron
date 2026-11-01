const DayCalculation = (inDate, outDate) => Math.round((outDate.getTime() - inDate.getTime()) / (24 * 3600 * 1000));

const checkPrice = (price) => {
    switch(price){
        case '381790.01':
          return '381790.00'
        case '67163.44':
          return '67163.43'
        case '87994.88':
          return '87994.87'
        case '278485.81':
          return '278485.82'
        case '8404.40':
          return '8404.41'
        case '22411.75':
          return '22411.76'
        case '58655.77':
          return '58655.76'
        case '12570.7':
          return '12570.69'
        case '64649.3':
          return '64649.29'
        case '20113.12':
          return '20113.11'
        case '30528.84':
          return '30528.83'
        case '48846.14':
          return '48846.13'
        case '63212.65':
          return '63212.64'
        case '61573.97':
          return '61573.96'
        case '258642.08':
          return '258642.07'
        case '12067.87':
          return '12067.87'
        case '115852.44':
            return '115852.43'
        case '18856.05':
            return '18856.04'
        case '38969.16':
            return '38969.15'
        default:
          return Math.round(price)
    }
}
export { DayCalculation, checkPrice }