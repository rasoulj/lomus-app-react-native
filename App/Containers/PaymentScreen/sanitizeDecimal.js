import Currency from '../../Transforms/Currency'

function sanitizeDecimal (val) {
  // Returns a decimal rounded to two places without any separators
  return Number(Currency(val, 0, '', ''))
}

export default sanitizeDecimal
