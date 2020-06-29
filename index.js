const signValueSpan = document.querySelector('#sign-value')
const exponentValueSpan = document.querySelector('#exponent-value')
const mantissaValueSpan = document.querySelector('#mantissa-value')
const realValueSpan = document.querySelector('#real-value')
const formSpan = document.querySelector('#form')
const bits = document.querySelectorAll('.bit')

const getBits = (domId) => {
  const parentElement = document.querySelector('#' + domId)
  const bits = [...parentElement.querySelectorAll('.bit')].map(node => node.innerText)
  return bits.join('')
}

const renderValues = () => {
  const sign = parseInt(getBits('sign'), 2)
  const exponent = parseInt(getBits('exponent'), 2)
  const form = floatingPointForm(exponent)
  const mantissa = bitsToMantissa(getBits('mantissa'), form === 'Normalised')
  formSpan.innerText = form
  signValueSpan.innerText = sign
  exponentValueSpan.innerText = exponent
  mantissaValueSpan.innerText = mantissa
  realValueSpan.innerText = computeRealValue(sign, exponent, mantissa)
}

const bitsToMantissa = (bits, isNormalised) => {
  let mantissa = isNormalised ? 1 : 0
  bits.split('').forEach((bit, index) => {
    if (bit == 1) {
      mantissa += Math.pow(0.5, index + 1)
    }
  })
  return mantissa
}

const floatingPointForm = (exponent) => {
  switch (exponent) {
    case 0:
      return 'Denormalised'
    case 7:
      return 'Special'
    default:
      return 'Normalised'
  }
}

const computeRealValue = (sign, exponent, mantissa) => {
  const form = floatingPointForm(exponent)
  let value
  switch (form) {
    case 'Denormalised':
      value = 0
      break
    case 'Special':
      value = computeSpecial(sign)
      break
    default:
      value = computeNormalised(sign, exponent, mantissa)
      break
  }
  return value
}

const computeSpecial = (sign) => {
  if (getBits('mantissa').includes('1')) {
    return'NaN'
  } else {
    return (sign == '0' ? '+' : '-').concat('∞')
  }
}

const computeNormalised = (sign, exponent, mantissa) => {
  return Math.pow(-1.0, sign) * mantissa * Math.pow(2.0, exponent)
}

bits.forEach((node) => {
  node.addEventListener('click', e => {
    const currentValue = e.target.innerText
    if (currentValue == '1') {
      e.target.innerText = '0'
    } else {
      e.target.innerText = '1'
    }
    renderValues()
  })
})

renderValues()
