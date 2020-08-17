const signValueSpan = document.querySelector('#sign-value')
const exponentValueSpan = document.querySelector('#exponent-value')
const fractionValueSpan = document.querySelector('#fraction-value')
const realValueSpan = document.querySelector('#real-value')
const formSpan = document.querySelector('#form')
const bits = document.querySelectorAll('.bit')

const FPTypes = {
  NORMALISED: 'Normalised',
  DENORMALISED: 'Denormalised',
  SPECIAL: 'Special'
};

class FloatingPointNumber {
  constructor(sign, exponent, fraction) {
    this.sign = sign;
    this.exponent = exponent;
    this.fraction = fraction;

    this.type = this.type();
    this.exponentBias = Math.pow(2, this.exponent.length - 1) - 1;
    this.value = this.value();
  }

  value = () => {
    switch (this.type) {
      case FPTypes.SPECIAL:
        return this.special();
        break;

      case FPTypes.DENORMALISED:
        return Math.pow(-1, this.sign[0]) * this.fractionValue() * Math.pow(2, this.exponentValue());
        break;

      default:
        return Math.pow(-1, this.sign[0]) * (1 + this.fractionValue()) * Math.pow(2, this.exponentValue());
        break;
    }
  }

  fractionValue = () => {
    let total = 0
    let fraction = 0.5
    this.fraction.forEach(bit => {
      if (bit == 1) total += fraction;
      fraction /= 2;
    });
    return total
  }

  special = () => {
    if (this.fraction.every(val => val == 0)) return '∞'

    return 'NaN'
  }

  exponentValue = () => {
    if (this.type == FPTypes.DENORMALISED) return 1 - this.exponentBias;

    return parseInt(this.exponent.join(''), 2) - this.exponentBias;
  }

  type = () => {
    if (this.exponent.every(val => val == 1)) return FPTypes.SPECIAL;
    if (this.exponent.every(val => val == 0)) return FPTypes.DENORMALISED;

    return FPTypes.NORMALISED;
  }
};


const getBits = (domId) => {
  const parentElement = document.querySelector('#' + domId);
  const bits = [...parentElement.querySelectorAll('.bit')].map(node => node.innerText);
  return bits;
}

const refreshFloatingPoint = () => {
  const bits = [...document.querySelectorAll('.bit')].map(node => node.innerText);
  const sign = bits.slice(0, 1);
  const exponent = bits.slice(1, 5);
  const fraction = bits.slice(5);
  const floatingPoint = new FloatingPointNumber(sign, exponent, fraction);
  return floatingPoint;
}

const renderFloatingPoint = (fp) => {
  signValueSpan.innerText = Math.pow(-1, fp.sign[0]);
  formSpan.innerText = fp.type;
  realValueSpan.innerText = fp.value;
  exponentValueSpan.innerText = fp.exponentValue();
  fractionValueSpan.innerText = fp.fractionValue();
}

bits.forEach((node) => {
  node.addEventListener('click', e => {
    const currentValue = e.target.innerText
    if (currentValue == '1') {
      e.target.innerText = '0'
    } else {
      e.target.innerText = '1'
    }
    const fp = refreshFloatingPoint()
    renderFloatingPoint(fp)
  })
})

const fp = refreshFloatingPoint()
renderFloatingPoint(fp)
