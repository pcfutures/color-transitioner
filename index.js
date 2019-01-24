class ColorTransitioner {
    /**
     * Transitions between two colours
     * @param {Object} from - The start color
     * @param {Object} to - The end color
     * @param {Number} interval - How often the color is transitioned
     * @param {Number} delay - The time before the transition starts
     * @param {Number} amount - The amount to increment/decrement everytime the color transitions
     * @param {Function} cb - The callback, called with the updated color every time it transitions
     * Usage: const transitioner = new ColorTransitioner(
     *      { r: 255, g: 255, b: 255 },
     *      { r: 0, g: 0, b: 0 },
     *      1,
     *      0,
     *      1,
     *      ({ r, g, b }) => console.log(r, g, b)),
     *  );
     */
    constructor (from, to, interval = 1, delay = 0, amount = 1, cb = () => null) {
        this.originalColor = from;
        this.currentColor = from;
        this.targetColor = to;

        this.intervalTime = interval;

        this.delay = delay;

        this.amount = amount;

        this.cb = cb;

        this.interval = null;
    }

    /**
     * Start our transition
     */
    transition = () => setTimeout(() => {
        this.interval = setInterval(() => {
            this.currentColor = {
                r: this.getNextColor('r'),
                g: this.getNextColor('g'),
                b: this.getNextColor('b'),
            };

            this.cb(this.currentColor);

            if (this.hasFinished()) { this.stop(); }
        }, this.intervalTime);
    }, this.delay);

    /**
     * Calculate the next color value
     */
    getNextColor = (type) => {
        const val = this.currentColor[type];
        const targetVal = this.targetColor[type];
        const originalVal = this.originalColor[type];

        const shouldSubtract = targetVal < originalVal;

        if (shouldSubtract) {
            return val - this.amount >= targetVal ? val - this.amount : targetVal;
        }

        return val + this.amount <= targetVal ? val + this.amount : targetVal;
    }

    /**
     * Have we finished our transition?
     */
    hasFinished = () => {
        const { r, g, b } = this.currentColor;
        const { r: tr, g: tg, b: tb } = this.targetColor;

        return (r === tr && g === tg && b === tb);
    }

    /**
     * Clear our transition interval
     */
    stop = () => clearInterval(this.interval);
}

export default ColorTransitioner;
