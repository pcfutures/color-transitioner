class ColorTransitioner {
  /**
   * Transitions between a custom array of colors or two colors.
   * @param {number[]} custom - An array of colors to transition between
   * @param {any} from - The start color if custom isn't supplied
   * @param {any} to - The end color if custom isn't supplied
   * @param {number} interval - How often the color is transitioned
   * @param {number} delay - The time before the transition starts
   * @param {number} amount - The amount to increment/decrement everytime the color transitions
   * @param {Function} cb - The callback, called with the updated color every time it transitions
   * ```
   * const transitioner = new ColorTransitioner(
   *     false,
   *     { r: 255, g: 255, b: 255 },
   *     { r: 0, g: 0, b: 0 },
   *     1,
   *     0,
   *     1,
   *     ({ r, g, b }) => console.log(r, g, b),
   * );
   *
   * transitioner.transition();
   * ```
   */
  constructor(
    custom,
    from,
    to,
    interval = 1,
    delay = 0,
    amount = 1,
    cb = () => null
  ) {
    this.isCustom = custom;
    this.custom = custom;
    this.nextCustomIndex = 0;

    this.originalColor = custom ? custom[0] : from;
    this.currentColor = custom ? custom[0] : from;
    this.targetColor = custom ? custom[0] : to;

    this.intervalTime = interval;

    this.delay = delay;

    this.amount = amount;

    this.cb = cb;

    this.interval = null;

    this.isDone = false;
  }

  /**
   * Calculate the next color value.
   *
   * @private
   *
   * @var {string} type The type of colour.
   *
   * @return {number}
   */
  _getNextColor = (type) => {
    // If we're custom, return the target color (next in the array)
    if (this.isCustom) {
      return this.targetColor[type];
    }

    const val = this.currentColor[type];
    const targetVal = this.targetColor[type];
    const originalVal = this.originalColor[type];

    const shouldSubtract = targetVal < originalVal;

    if (shouldSubtract) {
      return val - this.amount >= targetVal ? val - this.amount : targetVal;
    }

    return val + this.amount <= targetVal ? val + this.amount : targetVal;
  };

  /**
   * Have we finished our transition?
   *
   * @private
   *
   * @return {boolean}
   */
  _hasFinished = () => {
    // If we're custom, we've finished if we're at the end of our array
    if (this.isCustom) {
      return this.nextCustomIndex >= this.custom.length - 1;
    }

    const { r, g, b } = this.currentColor;
    const { r: tr, g: tg, b: tb } = this.targetColor;

    return r === tr && g === tg && b === tb;
  };

  /**
   * Start our transition.
   *
   * @return {void}
   */
  transition = () => {
    setTimeout(() => {
      this.interval = setInterval(() => {
        this.currentColor = {
          r: this._getNextColor("r"),
          g: this._getNextColor("g"),
          b: this._getNextColor("b"),
        };

        this.cb(this.currentColor);

        // If we're custom, update our next index and set our next target color
        if (this.isCustom) {
          this.nextCustomIndex += 1;
          this.targetColor = this.custom[this.nextCustomIndex];
        }

        if (this._hasFinished()) {
          this.stop();
        }
      }, this.intervalTime);
    }, this.delay);
  };

  /**
   * Clear our transition interval.
   *
   * @return {void}
   */
  stop = () => {
    clearInterval(this.interval);

    this.isDone = true;
  };
}

export default ColorTransitioner;
