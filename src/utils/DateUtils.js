import moment from 'moment'

class DateUtils {
  static getLocalTime(rawDate) {
    let offset = (new Date().getTimezoneOffset() / 60) * -1

    return moment(rawDate).add(offset, 'hours')
  }

  static getOrdinalDay(number) {
    switch (number) {
      case 1:
      case 21:
        return `${number}st`
      case 2:
      case 22:
        return `${number}nd`
      case 3:
      case 23:
        return `${number}rd`
      default:
        return `${number}th`
    }
  }
}

export default DateUtils
