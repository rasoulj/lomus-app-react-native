export default (value, decimal, currencySymbol, separator) => {
  // number -> the number to format
  // c -> decimal places to allow
  // d -> is the decimal character
  // t -> is the separator for thousands
  function formatMoney(number, c, d, t) {
    c = isNaN(c = Math.abs(c)) ? 2 : c
    d = d === undefined ? '.' : d
    t = t === undefined ? ',' : t
    var s = number < 0 ? '-' : ''
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(c)))
    var j = (j = i.length) > 3 ? j % 3 : 0
    return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(number - i).toFixed(c).slice(2) : '')
  }

  let safeSymbol = currencySymbol === undefined ? 'ریال' : currencySymbol
  let safeSeparator = separator === undefined ? ',' : separator
  return formatMoney(value, decimal || 0, '.', safeSeparator) + ' ' + safeSymbol //0 ---> 2
}
