let obsidian = require("obsidian");
let _codemirror_view = require("@codemirror/view");
// node_modules/motion-utils/dist/es/array.mjs
function addUniqueItem(arr, item) {
	if (arr.indexOf(item) === -1) arr.push(item);
}
function removeItem(arr, item) {
	const index = arr.indexOf(item);
	if (index > -1) arr.splice(index, 1);
}
// node_modules/motion-utils/dist/es/clamp.mjs
var clamp = (min, max, v) => {
	if (v > max) return max;
	if (v < min) return min;
	return v;
};
// node_modules/motion-utils/dist/es/format-error-message.mjs
function formatErrorMessage(message, errorCode) {
	return errorCode ? `${message}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${errorCode}` : message;
}
// node_modules/motion-utils/dist/es/errors.mjs
var warning = () => {};
var invariant = () => {};
if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
	warning = (check, message, errorCode) => {
		if (!check && typeof console !== "undefined") console.warn(formatErrorMessage(message, errorCode));
	};
	invariant = (check, message, errorCode) => {
		if (!check) throw new Error(formatErrorMessage(message, errorCode));
	};
}
// node_modules/motion-utils/dist/es/global-config.mjs
var MotionGlobalConfig = {};
// node_modules/motion-utils/dist/es/is-numerical-string.mjs
/**
* Check if value is a numerical string, ie a string that is purely a number eg "100" or "-100.1"
*/
var isNumericalString = (v) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);
// node_modules/motion-utils/dist/es/is-object.mjs
var isObject = (value) => typeof value === "object" && value !== null;
// node_modules/motion-utils/dist/es/is-zero-value-string.mjs
/**
* Check if the value is a zero value string like "0px" or "0%"
*/
var isZeroValueString = (v) => /^0[^.\s]+$/u.test(v);
// node_modules/motion-utils/dist/es/memo.mjs
/*#__NO_SIDE_EFFECTS__*/
function memo(callback) {
	let result;
	return () => {
		if (result === void 0) result = callback();
		return result;
	};
}
// node_modules/motion-utils/dist/es/noop.mjs
var noop = /* @__NO_SIDE_EFFECTS__ */ (any) => any;
// node_modules/motion-utils/dist/es/pipe.mjs
/**
* Pipe
* Compose other transformers to run linearily
* pipe(min(20), max(40))
* @param  {...functions} transformers
* @return {function}
*/
var pipe = (...transformers) => transformers.reduce((a, b) => (v) => b(a(v)));
// node_modules/motion-utils/dist/es/progress.mjs
var progress = /* @__NO_SIDE_EFFECTS__ */ (from, to, value) => {
	const range = to - from;
	return range ? (value - from) / range : 1;
};
// node_modules/motion-utils/dist/es/subscription-manager.mjs
var SubscriptionManager = class {
	constructor() {
		this.subscriptions = [];
	}
	add(handler) {
		addUniqueItem(this.subscriptions, handler);
		return () => this.remove(handler);
	}
	remove(handler) {
		removeItem(this.subscriptions, handler);
	}
	notify(a, b, c) {
		const numSubscriptions = this.subscriptions.length;
		if (!numSubscriptions) return;
		if (numSubscriptions === 1)
 /**
		* If there's only a single handler we can just call it without invoking a loop.
		*/
		this.subscriptions[0](a, b, c);
		else for (let i = 0; i < numSubscriptions; i++) {
			/**
			* Check whether the handler exists before firing as it's possible
			* the subscriptions were modified during this loop running.
			*/
			const handler = this.subscriptions[i];
			handler && handler(a, b, c);
		}
	}
	getSize() {
		return this.subscriptions.length;
	}
	clear() {
		this.subscriptions.length = 0;
	}
};
// node_modules/motion-utils/dist/es/time-conversion.mjs
/**
* Converts seconds to milliseconds
*
* @param seconds - Time in seconds.
* @return milliseconds - Converted time in milliseconds.
*/
var secondsToMilliseconds = /* @__NO_SIDE_EFFECTS__ */ (seconds) => seconds * 1e3;
var millisecondsToSeconds = /* @__NO_SIDE_EFFECTS__ */ (milliseconds) => milliseconds / 1e3;
// node_modules/motion-utils/dist/es/velocity-per-second.mjs
var velocityPerSecond = /* @__NO_SIDE_EFFECTS__ */ (velocity, frameDuration) => frameDuration ? velocity * (1e3 / frameDuration) : 0;
// node_modules/motion-utils/dist/es/warn-once.mjs
var warned = /* @__PURE__ */ new Set();
function warnOnce(condition, message, errorCode) {
	if (condition || warned.has(message)) return;
	console.warn(formatErrorMessage(message, errorCode));
	warned.add(message);
}
// node_modules/motion-utils/dist/es/wrap.mjs
var wrap = (min, max, v) => {
	const rangeSize = max - min;
	return ((v - min) % rangeSize + rangeSize) % rangeSize + min;
};
// node_modules/motion-utils/dist/es/easing/cubic-bezier.mjs
var calcBezier = (t, a1, a2) => t * (3 * (1 - t) * ((1 - t) * a1 + t * a2) + t * t);
/*#__NO_SIDE_EFFECTS__*/
function cubicBezier(mX1, mY1, mX2, mY2) {
	if (mX1 === mY1 && mX2 === mY2) return noop;
	return (x) => {
		let lowerBound = 0;
		let upperBound = 1;
		let t = x;
		for (let i = 0;; i++) {
			if (!(t >= lowerBound && t <= upperBound)) t = (lowerBound + upperBound) / 2;
			const currentX = calcBezier(t, mX1, mX2) - x;
			if (currentX * currentX < 1e-28 || i === 40) break;
			currentX > 0 ? upperBound = t : lowerBound = t;
			t -= currentX * 1e-7 / (calcBezier(t + 1e-7, mX1, mX2) - x - currentX);
		}
		return calcBezier(t, mY1, mY2);
	};
}
// node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs
var mirrorEasing = /* @__NO_SIDE_EFFECTS__ */ (easing) => (p) => p <= .5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
// node_modules/motion-utils/dist/es/easing/modifiers/reverse.mjs
var reverseEasing = /* @__NO_SIDE_EFFECTS__ */ (easing) => (p) => 1 - easing(1 - p);
// node_modules/motion-utils/dist/es/easing/back.mjs
var backOut = /*@__PURE__*/ cubicBezier(.33, 1.53, .69, .99);
var backIn = /*@__PURE__*/ reverseEasing(backOut);
var backInOut = /*@__PURE__*/ mirrorEasing(backIn);
// node_modules/motion-utils/dist/es/easing/anticipate.mjs
var anticipate = (p) => p >= 1 ? 1 : (p *= 2) < 1 ? .5 * backIn(p) : .5 * (2 - Math.pow(2, -10 * (p - 1)));
// node_modules/motion-utils/dist/es/easing/circ.mjs
var circIn = (p) => 1 - Math.sin(Math.acos(p));
var circOut = /* @__PURE__ */ reverseEasing(circIn);
var circInOut = /* @__PURE__ */ mirrorEasing(circIn);
// node_modules/motion-utils/dist/es/easing/ease.mjs
var easeIn = /*@__PURE__*/ cubicBezier(.42, 0, 1, 1);
var easeOut = /*@__PURE__*/ cubicBezier(0, 0, .58, 1);
var easeInOut = /*@__PURE__*/ cubicBezier(.42, 0, .58, 1);
// node_modules/motion-utils/dist/es/easing/utils/is-easing-array.mjs
var isEasingArray = /* @__NO_SIDE_EFFECTS__ */ (ease) => {
	return Array.isArray(ease) && typeof ease[0] !== "number";
};
// node_modules/motion-utils/dist/es/easing/utils/get-easing-for-segment.mjs
/*#__NO_SIDE_EFFECTS__*/
function getEasingForSegment(easing, i) {
	return /* @__PURE__ */ isEasingArray(easing) ? easing[wrap(0, easing.length, i)] : easing;
}
// node_modules/motion-utils/dist/es/easing/utils/is-bezier-definition.mjs
var isBezierDefinition = /* @__NO_SIDE_EFFECTS__ */ (easing) => Array.isArray(easing) && typeof easing[0] === "number";
// node_modules/motion-utils/dist/es/easing/utils/map.mjs
var easingLookup = {
	linear: noop,
	easeIn,
	easeInOut,
	easeOut,
	circIn,
	circInOut,
	circOut,
	backIn,
	backInOut,
	backOut,
	anticipate
};
var isValidEasing = (easing) => {
	return typeof easing === "string";
};
var easingDefinitionToFunction = (definition) => {
	if (/* @__PURE__ */ isBezierDefinition(definition)) {
		typeof process !== "undefined" && process.env.NODE_ENV !== "production" && invariant(definition.length === 4, `Cubic bezier arrays must contain four numerical values.`, "cubic-bezier-length");
		const [x1, y1, x2, y2] = definition;
		return /* @__PURE__ */ cubicBezier(x1, y1, x2, y2);
	} else if (isValidEasing(definition)) {
		typeof process !== "undefined" && process.env.NODE_ENV !== "production" && invariant(easingLookup[definition] !== void 0, `Invalid easing type '${definition}'`, "invalid-easing-type");
		return easingLookup[definition];
	}
	return definition;
};
// node_modules/motion-dom/dist/es/frameloop/frame-data.mjs
/**
* The frameloop's state, kept apart from the frameloop itself so that
* reading it doesn't bundle the scheduler.
*/
var frameData = {
	delta: 0,
	timestamp: 0,
	isProcessing: false
};
// node_modules/motion-dom/dist/es/frameloop/sync-time.mjs
var now;
function clearTime() {
	now = void 0;
}
/**
* An eventloop-synchronous alternative to performance.now().
*
* Ensures that time measurements remain consistent within a synchronous context.
* Usually calling performance.now() twice within the same synchronous context
* will return different values which isn't useful for animations when we're usually
* trying to sync animations to the same frame.
*/
var time = {
	now: () => {
		if (now === void 0) time.set(frameData.isProcessing || MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now());
		return now;
	},
	set: (newTime) => {
		now = newTime;
		queueMicrotask(clearTime);
	}
};
// node_modules/motion-dom/dist/es/value/types/utils/sanitize.mjs
var sanitize = (v) => Math.round(v * 1e5) / 1e5;
// node_modules/motion-dom/dist/es/animation/utils/is-css-variable.mjs
var checkStringStartsWith = (token) => (key) => typeof key === "string" && key.startsWith(token);
var startsAsVariableToken = /*@__PURE__*/ checkStringStartsWith("var(--");
var isCSSVariableToken = (value) => {
	if (!startsAsVariableToken(value)) return false;
	return singleCssVariableRegex.test(value.split("/*")[0].trim());
};
var singleCssVariableRegex = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
/**
* Check if a value contains a CSS variable anywhere (e.g. inside calc()).
* Unlike isCSSVariableToken which checks if the value IS a var() token,
* this checks if the value CONTAINS var() somewhere in the string.
*/
function containsCSSVariable(value) {
	if (typeof value !== "string") return false;
	return value.split("/*")[0].includes("var(--");
}
// node_modules/motion-dom/dist/es/value/types/numbers/index.mjs
var number = {
	test: (v) => typeof v === "number",
	parse: parseFloat,
	transform: (v) => v
};
var alpha = {
	...number,
	transform: (v) => clamp(0, 1, v)
};
var scale = {
	...number,
	default: 1
};
// node_modules/motion-dom/dist/es/value/types/utils/float-regex.mjs
var floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
// node_modules/motion-dom/dist/es/value/types/utils/is-nullish.mjs
function isNullish(v) {
	return v == null;
}
// node_modules/motion-dom/dist/es/value/types/utils/single-color-regex.mjs
var singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
// node_modules/motion-dom/dist/es/value/types/color/utils.mjs
/**
* Returns true if the provided string is a color, ie rgba(0,0,0,0) or #000,
* but false if a number or multiple colors
*/
var isColorString = (type, testProp) => (v) => {
	return Boolean(typeof v === "string" && singleColorRegex.test(v) && v.startsWith(type) || testProp && !isNullish(v) && Object.prototype.hasOwnProperty.call(v, testProp));
};
var splitColor = (aName, bName, cName) => (v) => {
	if (typeof v !== "string") return v;
	const [a, b, c, alpha] = v.match(floatRegex);
	return {
		[aName]: parseFloat(a),
		[bName]: parseFloat(b),
		[cName]: parseFloat(c),
		alpha: alpha !== void 0 ? parseFloat(alpha) : 1
	};
};
// node_modules/motion-dom/dist/es/value/types/color/rgba.mjs
var clampRgbUnit = (v) => clamp(0, 255, v);
var rgbUnit = {
	...number,
	transform: (v) => Math.round(clampRgbUnit(v))
};
var rgba = {
	test: /*@__PURE__*/ isColorString("rgb", "red"),
	parse: /*@__PURE__*/ splitColor("red", "green", "blue"),
	transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
};
// node_modules/motion-dom/dist/es/value/types/color/hex.mjs
/**
* #FF0000 has two characters per channel, #F00 one, which is doubled.
*/
var channel = (v, i, size) => {
	const c = v.substring(1 + i * size, 1 + (i + 1) * size);
	return size > 1 ? c : c + c;
};
function parseHex(v) {
	const size = v.length > 5 ? 2 : 1;
	const alpha = channel(v, 3, size);
	return {
		red: parseInt(channel(v, 0, size), 16),
		green: parseInt(channel(v, 1, size), 16),
		blue: parseInt(channel(v, 2, size), 16),
		alpha: alpha ? parseInt(alpha, 16) / 255 : 1
	};
}
var hex = {
	test: /*@__PURE__*/ isColorString("#"),
	parse: parseHex,
	transform: rgba.transform
};
// node_modules/motion-dom/dist/es/value/types/numbers/units.mjs
var createUnitType = /* @__NO_SIDE_EFFECTS__ */ (unit) => ({
	test: (v) => typeof v === "string" && v.endsWith(unit) && v.split(" ").length === 1,
	parse: parseFloat,
	transform: (v) => `${v}${unit}`
});
var degrees = /*@__PURE__*/ createUnitType("deg");
var percent = /*@__PURE__*/ createUnitType("%");
var px = /*@__PURE__*/ createUnitType("px");
var vh = /*@__PURE__*/ createUnitType("vh");
var vw = /*@__PURE__*/ createUnitType("vw");
var progressPercentage = /*@__PURE__*/ (() => ({
	...percent,
	parse: (v) => percent.parse(v) / 100,
	transform: (v) => percent.transform(v * 100)
}))();
// node_modules/motion-dom/dist/es/value/types/color/hsla.mjs
var hsla = {
	test: /*@__PURE__*/ isColorString("hsl", "hue"),
	parse: /*@__PURE__*/ splitColor("hue", "saturation", "lightness"),
	transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
		return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
	}
};
// node_modules/motion-dom/dist/es/value/types/color/index.mjs
var color = {
	test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
	parse: (v) => {
		if (rgba.test(v)) return rgba.parse(v);
		else if (hsla.test(v)) return hsla.parse(v);
		else return hex.parse(v);
	},
	transform: (v) => {
		return typeof v === "string" ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v);
	},
	getAnimatableNone: (v) => {
		const parsed = color.parse(v);
		parsed.alpha = 0;
		return color.transform(parsed);
	}
};
// node_modules/motion-dom/dist/es/value/types/utils/color-regex.mjs
var colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
// node_modules/motion-dom/dist/es/value/types/complex/index.mjs
/**
* Non-global copies of the token regexes so test() can use .test()
* (no match array, stops at the first token) without lastIndex state.
*/
var hasFloat = /*@__PURE__*/ new RegExp(floatRegex.source);
var hasColor = /*@__PURE__*/ new RegExp(colorRegex.source, "i");
function test(v) {
	return isNaN(v) && typeof v === "string" && (hasFloat.test(v) || hasColor.test(v));
}
var NUMBER_TOKEN = "number";
var COLOR_TOKEN = "color";
var VAR_TOKEN = "var";
var VAR_FUNCTION_TOKEN = "var(";
var SPLIT_TOKEN = "${}";
var complexRegex = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)(?![a-z]*\()/giu;
/**
* Whether analyseComplexValue(value) would find any values, without
* tokenising the string. CSS variables are resolved before this is
* used, so it's enough to look for a number or a color.
*/
function hasComplexValues(value) {
	const asString = value.toString();
	return hasFloat.test(asString) || hasColor.test(asString);
}
function analyseComplexValue(value) {
	const originalValue = value.toString();
	const values = [];
	const indexes = {
		color: [],
		number: [],
		var: []
	};
	const types = [];
	let i = 0;
	return {
		values,
		split: originalValue.replace(complexRegex, (parsedValue) => {
			if (color.test(parsedValue)) {
				indexes.color.push(i);
				types.push(COLOR_TOKEN);
				values.push(color.parse(parsedValue));
			} else if (parsedValue.startsWith(VAR_FUNCTION_TOKEN)) {
				indexes.var.push(i);
				types.push(VAR_TOKEN);
				values.push(parsedValue);
			} else {
				indexes.number.push(i);
				types.push(NUMBER_TOKEN);
				values.push(parseFloat(parsedValue));
			}
			++i;
			return SPLIT_TOKEN;
		}).split(SPLIT_TOKEN),
		indexes,
		types
	};
}
function parseComplexValue(v) {
	return analyseComplexValue(v).values;
}
function buildTransformer({ split, types }) {
	const numSections = split.length;
	return (v) => {
		let output = "";
		for (let i = 0; i < numSections; i++) {
			output += split[i];
			if (v[i] !== void 0) {
				const type = types[i];
				if (type === NUMBER_TOKEN) output += sanitize(v[i]);
				else if (type === COLOR_TOKEN) output += color.transform(v[i]);
				else output += v[i];
			}
		}
		return output;
	};
}
function createTransformer(source) {
	return buildTransformer(analyseComplexValue(source));
}
var convertNumbersToZero = (v) => typeof v === "number" ? 0 : color.test(v) ? color.getAnimatableNone(v) : v;
/**
* Convert a parsed value to its zero equivalent, but preserve numbers
* that act as divisors in CSS calc() expressions.
*
* analyseComplexValue extracts numbers from CSS strings and puts the
* surrounding text into a `split` template array. For example:
*   "calc(var(--gap) / 5)"  →  values: [var(--gap), 5]
*                               split:  ["calc(", " / ", ")"]
*
* When building a zero-equivalent for animation, naively zeroing all
* numbers turns the divisor into 0 → "calc(var(--gap) / 0)" → NaN.
* We detect this by checking whether the text preceding a number
* (split[i]) ends with "/" — the CSS calc division operator.
*/
var convertToZero = (value, splitBefore) => {
	if (typeof value === "number") return splitBefore?.trim().endsWith("/") ? value : 0;
	return convertNumbersToZero(value);
};
function getAnimatableNone$1(v) {
	const info = analyseComplexValue(v);
	return buildTransformer(info)(info.values.map((value, i) => convertToZero(value, info.split[i])));
}
var complex = {
	test,
	parse: parseComplexValue,
	createTransformer,
	getAnimatableNone: getAnimatableNone$1
};
// node_modules/motion-dom/dist/es/value/types/color/hsla-to-rgba.mjs
function hueToRgb(p, q, t) {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
}
function hslaToRgba({ hue, saturation, lightness, alpha }) {
	hue /= 360;
	saturation /= 100;
	lightness /= 100;
	let red = 0;
	let green = 0;
	let blue = 0;
	if (!saturation) red = green = blue = lightness;
	else {
		const q = lightness < .5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
		const p = 2 * lightness - q;
		red = hueToRgb(p, q, hue + 1 / 3);
		green = hueToRgb(p, q, hue);
		blue = hueToRgb(p, q, hue - 1 / 3);
	}
	return {
		red: Math.round(red * 255),
		green: Math.round(green * 255),
		blue: Math.round(blue * 255),
		alpha
	};
}
// node_modules/motion-dom/dist/es/utils/mix/immediate.mjs
function mixImmediate(a, b) {
	return (p) => p > 0 ? b : a;
}
// node_modules/motion-dom/dist/es/utils/mix/number.mjs
var mixNumber$1 = (from, to, progress) => {
	return from + (to - from) * progress;
};
// node_modules/motion-dom/dist/es/utils/mix/color.mjs
var mixLinearColor = (from, to, v) => {
	const fromExpo = from * from;
	const expo = v * (to * to - fromExpo) + fromExpo;
	return expo < 0 ? 0 : Math.sqrt(expo);
};
var colorTypes = [
	hex,
	rgba,
	hsla
];
var getColorType = (v) => colorTypes.find((type) => type.test(v));
function asRGBA(color) {
	const type = getColorType(color);
	if (!type) {
		process.env.NODE_ENV !== "production" && warning(false, `'${color}' is not an animatable color. Use the equivalent color code instead.`, "color-not-animatable");
		return false;
	}
	let model = type.parse(color);
	if (type === hsla) model = hslaToRgba(model);
	return model;
}
var mixColor = (from, to) => {
	const fromRGBA = asRGBA(from);
	const toRGBA = asRGBA(to);
	if (!fromRGBA || !toRGBA) return mixImmediate(from, to);
	const blended = { ...fromRGBA };
	return (v) => {
		blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v);
		blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v);
		blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v);
		blended.alpha = mixNumber$1(fromRGBA.alpha, toRGBA.alpha, v);
		return rgba.transform(blended);
	};
};
// node_modules/motion-dom/dist/es/utils/mix/visibility.mjs
var invisibleValues = /* @__PURE__ */ new Set(["none", "hidden"]);
/**
* Returns a function that, when provided a progress value between 0 and 1,
* will return the "none" or "hidden" string only when the progress is that of
* the origin or target.
*/
function mixVisibility(origin, target) {
	if (invisibleValues.has(origin)) return (p) => p <= 0 ? origin : target;
	else return (p) => p >= 1 ? target : origin;
}
// node_modules/motion-dom/dist/es/utils/mix/complex.mjs
function mixNumber(a, b) {
	return (p) => mixNumber$1(a, b, p);
}
function getMixer(a) {
	if (typeof a === "number") return mixNumber;
	else if (typeof a === "string") return isCSSVariableToken(a) ? mixImmediate : color.test(a) ? mixColor : mixComplex;
	else if (Array.isArray(a)) return mixArray;
	else if (typeof a === "object") return color.test(a) ? mixColor : mixObject;
	return mixImmediate;
}
function mixArray(a, b) {
	const output = [...a];
	const numValues = output.length;
	const blendValue = a.map((v, i) => getMixer(v)(v, b[i]));
	return (p) => {
		for (let i = 0; i < numValues; i++) output[i] = blendValue[i](p);
		return output;
	};
}
function mixObject(a, b) {
	const output = {
		...a,
		...b
	};
	const blendValue = {};
	for (const key in output) if (a[key] !== void 0 && b[key] !== void 0) blendValue[key] = getMixer(a[key])(a[key], b[key]);
	return (v) => {
		for (const key in blendValue) output[key] = blendValue[key](v);
		return output;
	};
}
function matchOrder(origin, target) {
	const orderedOrigin = [];
	const pointers = {
		color: 0,
		var: 0,
		number: 0
	};
	for (let i = 0; i < target.values.length; i++) {
		const type = target.types[i];
		const originIndex = origin.indexes[type][pointers[type]];
		const originValue = origin.values[originIndex] ?? 0;
		orderedOrigin[i] = originValue;
		pointers[type]++;
	}
	return orderedOrigin;
}
var mixComplex = (origin, target) => {
	const originStats = analyseComplexValue(origin);
	const targetStats = analyseComplexValue(target);
	if (originStats.indexes.var.length === targetStats.indexes.var.length && originStats.indexes.color.length === targetStats.indexes.color.length && originStats.indexes.number.length >= targetStats.indexes.number.length) {
		if (invisibleValues.has(origin) && !targetStats.values.length || invisibleValues.has(target) && !originStats.values.length) return mixVisibility(origin, target);
		return pipe(mixArray(matchOrder(originStats, targetStats), targetStats.values), buildTransformer(targetStats));
	} else {
		process.env.NODE_ENV !== "production" && warning(true, `Complex values '${origin}' and '${target}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`, "complex-values-different");
		return mixImmediate(origin, target);
	}
};
// node_modules/motion-dom/dist/es/utils/mix/index.mjs
/**
* A single number with an optional unit, e.g. "50%", "-10px", ".5em".
* Exponents don't match, so they fall through to the complex mixer.
*/
var unitValue = /^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu;
/**
* Most CSS values Motion mixes are a single number with a unit. Mixing
* these directly produces the same output as the complex mixer
* ("25%", "0.33333px") without tokenising both strings.
*/
function mixUnit(from, to) {
	const a = unitValue.exec(from);
	if (!a) return;
	const b = unitValue.exec(to);
	if (!b || a[2] !== b[2]) return;
	const unit = a[2];
	const origin = parseFloat(a[1]);
	const target = parseFloat(b[1]);
	return (p) => sanitize(mixNumber$1(origin, target, p)) + unit;
}
function mix(from, to, p) {
	if (typeof from === "number" && typeof to === "number" && typeof p === "number") return mixNumber$1(from, to, p);
	if (typeof from === "string" && typeof to === "string") {
		const mixer = mixUnit(from, to);
		if (mixer) return mixer;
	}
	return getMixer(from)(from, to);
}
// node_modules/motion-dom/dist/es/frameloop/order.mjs
var stepsOrder = [
	"setup",
	"read",
	"resolveKeyframes",
	"preUpdate",
	"update",
	"preRender",
	"render",
	"postRender"
];
// node_modules/motion-dom/dist/es/frameloop/render-step.mjs
function createRenderStep(runNextFrame) {
	/**
	* We create and reuse two queues, one to queue jobs for the current frame
	* and one for the next. We reuse to avoid triggering GC after x frames.
	*/
	let thisFrame = /* @__PURE__ */ new Set();
	let nextFrame = /* @__PURE__ */ new Set();
	/**
	* Track whether we're currently processing jobs in this step. This way
	* we can decide whether to schedule new jobs for this frame or next.
	*/
	let isProcessing = false;
	let flushNextFrame = false;
	/**
	* The callback currently running. If it schedules itself with `immediate`
	* it's left in place, so as before it doesn't run again this step.
	*/
	let running;
	/**
	* A set of processes which were marked keepAlive when scheduled.
	* A keepAlive process is always also held by a frame queue until
	* it's cancelled, so a Set has the same lifetime semantics as a
	* WeakSet here while being considerably faster to query every frame.
	*/
	const toKeepAlive = /* @__PURE__ */ new Set();
	let latestFrameData = {
		delta: 0,
		timestamp: 0,
		isProcessing: false
	};
	function triggerCallback(callback) {
		if (toKeepAlive.has(callback)) {
			nextFrame.add(callback);
			runNextFrame();
		}
		(running = callback)(latestFrameData);
	}
	const step = {
		/**
		* Schedule a process to run on the next frame.
		*/
		schedule: (callback, keepAlive = false, immediate = false) => {
			const addToCurrentFrame = immediate && isProcessing;
			const queue = addToCurrentFrame ? thisFrame : nextFrame;
			if (keepAlive) toKeepAlive.add(callback);
			/**
			* A callback scheduled with `immediate` during processing may
			* already have run this step (for instance, a value it reads was
			* changed by a later callback). Re-adding moves it to the end of
			* the queue, so it runs again. The running callback is excluded,
			* so one that re-schedules itself can't loop forever.
			*/
			addToCurrentFrame && callback !== running && queue.delete(callback);
			queue.add(callback);
			return callback;
		},
		/**
		* Cancel the provided callback from running on the next frame.
		*/
		cancel: (callback) => {
			nextFrame.delete(callback);
			toKeepAlive.delete(callback);
		},
		/**
		* Execute all schedule callbacks.
		*/
		process: (frameData) => {
			latestFrameData = frameData;
			/**
			* If we're already processing we've probably been triggered by a flushSync
			* inside an existing process. Instead of executing, mark flushNextFrame
			* as true and ensure we flush the following frame at the end of this one.
			*/
			if (isProcessing) {
				flushNextFrame = true;
				return;
			}
			isProcessing = true;
			const prevFrame = thisFrame;
			thisFrame = nextFrame;
			nextFrame = prevFrame;
			thisFrame.forEach(triggerCallback);
			thisFrame.clear();
			running = void 0;
			isProcessing = false;
			if (flushNextFrame) {
				flushNextFrame = false;
				step.process(frameData);
			}
		}
	};
	return step;
}
// node_modules/motion-dom/dist/es/frameloop/batcher.mjs
var maxElapsed = 40;
function createRenderBatcher(scheduleNextBatch, allowKeepAlive, state = {
	delta: 0,
	timestamp: 0,
	isProcessing: false
}) {
	let runNextFrame = false;
	let useDefaultElapsed = true;
	const flagRunNextFrame = () => runNextFrame = true;
	const steps = stepsOrder.reduce((acc, key) => {
		acc[key] = createRenderStep(flagRunNextFrame);
		return acc;
	}, {});
	const { setup, read, resolveKeyframes, preUpdate, update, preRender, render, postRender } = steps;
	const processBatch = () => {
		const useManualTiming = MotionGlobalConfig.useManualTiming;
		const timestamp = useManualTiming ? state.timestamp : performance.now();
		runNextFrame = false;
		if (!useManualTiming) state.delta = useDefaultElapsed ? 1e3 / 60 : Math.max(Math.min(timestamp - state.timestamp, maxElapsed), 1);
		state.timestamp = timestamp;
		state.isProcessing = true;
		setup.process(state);
		read.process(state);
		resolveKeyframes.process(state);
		preUpdate.process(state);
		update.process(state);
		preRender.process(state);
		render.process(state);
		postRender.process(state);
		state.isProcessing = false;
		if (runNextFrame && allowKeepAlive) {
			useDefaultElapsed = false;
			scheduleNextBatch(processBatch);
		}
	};
	const wake = () => {
		runNextFrame = true;
		useDefaultElapsed = true;
		if (!state.isProcessing) scheduleNextBatch(processBatch);
	};
	const schedule = stepsOrder.reduce((acc, key) => {
		const step = steps[key];
		acc[key] = (process, keepAlive = false, immediate = false) => {
			if (!runNextFrame) wake();
			return step.schedule(process, keepAlive, immediate);
		};
		return acc;
	}, {});
	const cancel = (process) => {
		for (let i = 0; i < stepsOrder.length; i++) steps[stepsOrder[i]].cancel(process);
	};
	return {
		schedule,
		cancel,
		state,
		steps
	};
}
// node_modules/motion-dom/dist/es/frameloop/frame.mjs
var { schedule: frame, cancel: cancelFrame, steps: frameSteps } = /* @__PURE__ */ createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : noop, true, frameData);
// node_modules/motion-dom/dist/es/animation/drivers/frame.mjs
var frameloopDriver = (update) => {
	const passTimestamp = ({ timestamp }) => update(timestamp);
	return {
		start: (keepAlive = true) => frame.update(passTimestamp, keepAlive),
		stop: () => cancelFrame(passTimestamp),
		/**
		* If we're processing this frame we can use the
		* framelocked timestamp to keep things in sync.
		*/
		now: () => frameData.isProcessing ? frameData.timestamp : time.now()
	};
};
// node_modules/motion-dom/dist/es/animation/waapi/utils/linear.mjs
var generateLinearEasing = (easing, duration, resolution = 10) => {
	let points = "";
	const numPoints = Math.max(Math.round(duration / resolution), 2);
	for (let i = 0; i < numPoints; i++) points += Math.round(easing(i / (numPoints - 1)) * 1e4) / 1e4 + ", ";
	return `linear(${points.substring(0, points.length - 2)})`;
};
// node_modules/motion-dom/dist/es/animation/generators/utils/calc-duration.mjs
/**
* Implement a practical max duration for keyframe generation
* to prevent infinite loops
*/
var maxGeneratorDuration = 2e4;
function calcGeneratorDuration(generator, timeStep = 50, maxDuration = maxGeneratorDuration, keyframes) {
	let duration = 0;
	let state = generator.next(duration);
	keyframes?.push(state.value);
	while (!state.done && duration < maxDuration) {
		duration += timeStep;
		state = generator.next(duration);
		keyframes?.push(state.value);
	}
	return duration >= maxDuration ? Infinity : duration;
}
// node_modules/motion-dom/dist/es/animation/generators/utils/create-generator-easing.mjs
/**
* Create a progress => progress easing function from a generator.
*/
function createGeneratorEasing(options, scale = 100, createGenerator) {
	/**
	* The easing is generated over 0 - scale, but velocity is in the
	* value's own units, so scale it to match. Otherwise an interrupted
	* spring hands off the wrong speed, or direction. Keyframes with
	* units (colours, filters, mixed units) give NaN, which is falsy,
	* so their velocity passes through unscaled.
	*/
	const { keyframes: k, velocity: v } = options;
	const delta = k && k[k.length - 1] - k[0];
	const generator = createGenerator({
		...options,
		velocity: v && delta ? v * scale / delta : v,
		keyframes: [0, scale]
	});
	const duration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
	return {
		type: "keyframes",
		ease: (progress) => {
			return generator.next(duration * progress).value / scale;
		},
		duration: /* @__PURE__ */ millisecondsToSeconds(duration)
	};
}
// node_modules/motion-dom/dist/es/animation/generators/spring.mjs
var defaultStiffness = 100;
var defaultDamping = 10;
var defaultMass = 1;
var defaultDuration = 800;
var defaultBounce = .3;
var defaultVisualDuration = .3;
var restSpeedGranular = .01;
var restSpeedDefault = 2;
var restDeltaGranular = .005;
var restDeltaDefault = .5;
var minDuration = .01;
var maxDuration = 10;
var minDamping = .05;
/**
* Maps bounce to a damping ratio as SwiftUI does: 0 is critically damped, and
* it approaches undamped towards 1 and infinitely overdamped towards -1. Both
* ends are limited so the spring still moves and settles.
*/
var bounceToDampingRatio = (bounce) => bounce < 0 ? 1 / Math.max(1 + bounce, minDamping) : Math.max(1 - bounce, minDamping);
/**
* Scales an overdamped spring's undamped frequency so that, at its defining
* time, it has as far left to go as the critically damped spring that's
* criticalFreqTime radians in by then. A negative bounce then changes the
* shape of the curve, not when it arrives. 1 at a damping ratio of 1, so
* there's no jump at a bounce of 0.
*
* Solved by Newton on the remaining distance (times fast - slow), which is
* convex from criticalFreqTime onwards. criticalFreqTime is always below the
* answer, so it converges from below without overshooting.
*/
function overdampedFreqScale(dampingRatio, criticalFreqTime) {
	if (!(dampingRatio > 1)) return 1;
	const root = Math.sqrt(dampingRatio * dampingRatio - 1);
	const slow = dampingRatio - root;
	const fast = dampingRatio + root;
	const target = 2 * root * Math.exp(-criticalFreqTime) * (1 + criticalFreqTime);
	return approximateRoot((freqTime) => fast * Math.exp(-slow * freqTime) - slow * Math.exp(-fast * freqTime) - target, (freqTime) => Math.exp(-fast * freqTime) - Math.exp(-slow * freqTime), criticalFreqTime) / criticalFreqTime;
}
function calcAngularFreq(undampedFreq, dampingRatio) {
	return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
}
var rootIterations = 12;
function approximateRoot(envelope, derivative, initialGuess) {
	let result = initialGuess;
	for (let i = 1; i < rootIterations; i++) result = result - envelope(result) / derivative(result);
	return result;
}
/**
* This is ported from the Framer implementation of duration-based spring resolution.
*/
var safeMin = .001;
/**
* Assumes zero initial velocity and the default mass: time-defined springs
* ignore inherited velocity and only resolve without valid physics. Returns
* NaN physics when the root search doesn't converge.
*/
function findSpring({ duration = defaultDuration, bounce = defaultBounce }) {
	let envelope;
	let derivative;
	process.env.NODE_ENV !== "production" && warning(duration <= /* @__PURE__ */ secondsToMilliseconds(maxDuration), "Spring duration must be 10 seconds or less", "spring-duration-limit");
	const dampingRatio = bounceToDampingRatio(bounce);
	duration = clamp(minDuration, maxDuration, /* @__PURE__ */ millisecondsToSeconds(duration));
	if (dampingRatio < 1) {
		/**
		* Underdamped spring
		*/
		envelope = (undampedFreq) => {
			const exponentialDecay = undampedFreq * dampingRatio;
			const delta = exponentialDecay * duration;
			const b = calcAngularFreq(undampedFreq, dampingRatio);
			const c = Math.exp(-delta);
			return safeMin - exponentialDecay / b * c;
		};
		derivative = (undampedFreq) => {
			const delta = undampedFreq * dampingRatio * duration;
			const e = dampingRatio * dampingRatio * undampedFreq * undampedFreq * duration;
			const f = Math.exp(-delta);
			const g = calcAngularFreq(undampedFreq * undampedFreq, dampingRatio);
			return (-envelope(undampedFreq) + safeMin > 0 ? -1 : 1) * -e * f / g;
		};
	} else {
		/**
		* Critically-damped spring. Overdamped springs reuse this root,
		* scaled below.
		*/
		envelope = (undampedFreq) => {
			return -.001 + Math.exp(-undampedFreq * duration) * (undampedFreq * duration + 1);
		};
		derivative = (undampedFreq) => {
			return Math.exp(-undampedFreq * duration) * (-undampedFreq * (duration * duration));
		};
	}
	const initialGuess = 5 / duration;
	const criticalFreq = approximateRoot(envelope, derivative, initialGuess);
	const undampedFreq = criticalFreq * overdampedFreqScale(dampingRatio, criticalFreq * duration);
	const stiffness = undampedFreq * undampedFreq;
	return {
		stiffness,
		damping: dampingRatio * 2 * Math.sqrt(stiffness),
		duration: /* @__PURE__ */ secondsToMilliseconds(duration)
	};
}
/**
* Spring physics must be finite. stiffness and mass are also divisors so must
* be positive, whereas a damping of 0 is a valid, perpetually oscillating
* spring. Relational rather than Number.isFinite so numeric strings still
* coerce.
*/
var isValidPhysics = (value, canBeZero) => (canBeZero ? value >= 0 : value > 0) && value < Infinity;
/**
* Returns value if it's usable spring physics, otherwise undefined so callers
* fall back to the default. An explicit `undefined`, e.g. from a forwarded
* optional prop, must fall back too. Invalid physics would otherwise resolve
* to NaN spring values that never report done.
*/
function resolvePhysics(value, canBeZero) {
	if (isValidPhysics(value, canBeZero)) return value;
	if (process.env.NODE_ENV !== "production") warning(value === void 0, "Spring stiffness and mass must be positive, damping 0 or greater", "spring-invalid-physics");
}
function getSpringOptions(options) {
	/**
	* Resolve physics before choosing between physics- and duration-based
	* resolution, so an invalid stiffness doesn't also silently discard a
	* valid duration/bounce.
	*/
	const validStiffness = resolvePhysics(options.stiffness);
	const validDamping = resolvePhysics(options.damping, true);
	const validMass = resolvePhysics(options.mass);
	const springOptions = {
		...options,
		stiffness: validStiffness ?? defaultStiffness,
		damping: validDamping ?? defaultDamping,
		mass: validMass ?? defaultMass,
		isResolvedFromDuration: false,
		isTimeDefined: (validStiffness ?? validDamping ?? validMass) === void 0 && (options.duration !== void 0 || options.bounce !== void 0)
	};
	if (springOptions.isTimeDefined) {
		if (options.visualDuration) {
			const dampingRatio = bounceToDampingRatio(options.bounce || 0);
			const root = 2 * Math.PI / (options.visualDuration * 1.2) * overdampedFreqScale(dampingRatio, 2 * Math.PI / 1.2);
			springOptions.stiffness = root * root;
			springOptions.damping = 2 * dampingRatio * Math.sqrt(springOptions.stiffness);
		} else {
			Object.assign(springOptions, findSpring(springOptions));
			springOptions.isResolvedFromDuration = true;
		}
		/**
		* Time options can degenerate: a NaN bounce gives a NaN damping, an
		* infinite visualDuration a 0 stiffness, and findSpring NaN for both
		* when it doesn't converge. Replace the two together, so the
		* relationship duration resolution establishes between them is never
		* left half-overwritten.
		*/
		if (!isValidPhysics(springOptions.stiffness) || !isValidPhysics(springOptions.damping, true)) {
			springOptions.stiffness = defaultStiffness;
			springOptions.damping = defaultDamping;
		}
	}
	return springOptions;
}
function springGenerator(optionsOrVisualDuration = defaultVisualDuration, bounce = defaultBounce) {
	const options = typeof optionsOrVisualDuration !== "object" ? {
		visualDuration: optionsOrVisualDuration,
		keyframes: [0, 1],
		bounce
	} : optionsOrVisualDuration;
	const origin = options.keyframes[0];
	const target = options.keyframes[options.keyframes.length - 1];
	/**
	* This is the Iterator-spec return value. We ensure it's mutable rather than using a generator
	* to reduce GC during animation.
	*/
	const state = {
		done: false,
		value: origin
	};
	const { stiffness, damping, mass, duration, isResolvedFromDuration, isTimeDefined } = getSpringOptions({ ...options });
	/**
	* Time-defined springs ignore inherited velocity. Velocity from
	* interrupted animations causes massive oscillation on small-range
	* animations.
	*/
	const inheritVelocity = (velocity) => isTimeDefined ? 0 : -/* @__PURE__ */ millisecondsToSeconds(velocity);
	const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
	const undampedAngularFreq = /* @__PURE__ */ millisecondsToSeconds(Math.sqrt(stiffness / mass));
	const decay = dampingRatio * undampedAngularFreq;
	/**
	* Everything that changes when the spring is retargeted: written by
	* retarget() and update(), read by the resolvers. Grouped on one object,
	* like the coefficients (c) below. Writing doubles to object fields
	* measured marginally faster than to captured let variables in optimised
	* code; neither allocates, so this is a grouping choice, not a GC one.
	*/
	const s = {
		target,
		delta: target - origin,
		velocity: inheritVelocity(options.velocity || 0) || 0,
		restSpeed: 0,
		restDelta: 0
	};
	/**
	* If we're working on a granular scale, use smaller defaults for determining
	* when the spring is finished.
	*
	* These defaults have been selected empirically based on what strikes a good
	* ratio between feeling good and finishing as soon as changes are imperceptible.
	*/
	const setRestThresholds = () => {
		const isGranularScale = Math.abs(s.delta) < 5;
		s.restSpeed = options.restSpeed || (isGranularScale ? restSpeedGranular : restSpeedDefault);
		s.restDelta = options.restDelta || (isGranularScale ? restDeltaGranular : restDeltaDefault);
	};
	setRestThresholds();
	let resolveSpring;
	let resolveVelocity;
	/**
	* Derives the coefficients that depend on origin, target and initial
	* velocity. Called once now and again whenever the spring is retargeted.
	*/
	let update;
	if (dampingRatio < 1) {
		const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
		/**
		* A is the position coefficient, sinC/cosC the coefficients of the
		* analytical derivative (px/ms). The exp/sin/cos terms depend only
		* on t, so they're memoized by t independently of the target: a
		* spring retargeted every frame samples the same t each frame and
		* skips the transcendentals entirely.
		*/
		const c = {
			A: 0,
			sinC: 0,
			cosC: 0,
			t: -1,
			env: 0,
			sin: 0,
			cos: 0
		};
		update = () => {
			c.A = (s.velocity + decay * s.delta) / angularFreq;
			c.sinC = decay * c.A + s.delta * angularFreq;
			c.cosC = decay * s.delta - c.A * angularFreq;
		};
		const sample = (t) => {
			if (t !== c.t) {
				c.t = t;
				c.env = Math.exp(-decay * t);
				c.sin = Math.sin(angularFreq * t);
				c.cos = Math.cos(angularFreq * t);
			}
		};
		resolveSpring = (t) => {
			sample(t);
			return s.target - c.env * (c.A * c.sin + s.delta * c.cos);
		};
		resolveVelocity = (t) => {
			sample(t);
			return c.env * (c.sinC * c.sin + c.cosC * c.cos);
		};
	} else if (dampingRatio === 1) {
		resolveSpring = (t) => s.target - Math.exp(-undampedAngularFreq * t) * (s.delta + (s.velocity + undampedAngularFreq * s.delta) * t);
		const c = { C: 0 };
		update = () => {
			c.C = s.velocity + undampedAngularFreq * s.delta;
		};
		resolveVelocity = (t) => Math.exp(-undampedAngularFreq * t) * (undampedAngularFreq * c.C * t - s.velocity);
	} else {
		/**
		* Overdamped spring: the sum of a slow and a fast decaying
		* exponential, so no term can overflow however heavily it's damped.
		*/
		const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
		const slow = decay - dampedAngularFreq;
		const fast = decay + dampedAngularFreq;
		/**
		* Physics-defined springs keep a non-physical limit: once
		* dampedAngularFreq * t passes 300, both terms decay at the damping
		* rate. Heavily overdamped drag springs (dragElastic: 0,
		* dragTransition) rely on this to settle almost at once rather than
		* creep at stiffness / damping. It only applies when reached within
		* 300ms (a dampedAngularFreq of 1 rad/ms), so it reads as a stiff
		* spring snapping into place: any later and it cuts off a slow spring
		* that's visibly still moving (#1207). Negative bounce needs the
		* exact curve, so time-defined springs are exempt.
		*/
		const limit = dampedAngularFreq < 1 || isTimeDefined ? Infinity : 300 / dampedAngularFreq;
		const decayAt = (rate, t) => Math.exp(t > limit ? (decay - rate) * limit - decay * t : -rate * t);
		const c = {
			S: 0,
			F: 0
		};
		update = () => {
			const P = (s.velocity + decay * s.delta) / dampedAngularFreq;
			c.S = (s.delta + P) / 2;
			c.F = (s.delta - P) / 2;
		};
		resolveSpring = (t) => s.target - c.S * decayAt(slow, t) - c.F * decayAt(fast, t);
		resolveVelocity = (t) => slow * c.S * decayAt(slow, t) + fast * c.F * decayAt(fast, t);
	}
	update();
	const calculatedDuration = isResolvedFromDuration ? duration || null : null;
	const generator = {
		calculatedDuration,
		/**
		* Aim the spring at a new target from its current position and
		* velocity, reusing the resolved physics and closures.
		*/
		retarget: (keyframes, newVelocity) => {
			s.target = keyframes[keyframes.length - 1];
			s.delta = s.target - keyframes[0];
			s.velocity = inheritVelocity(newVelocity);
			if (!(options.restSpeed && options.restDelta)) setRestThresholds();
			generator.calculatedDuration = calculatedDuration;
			state.done = false;
			update();
		},
		velocity: (t) => /* @__PURE__ */ secondsToMilliseconds(resolveVelocity(t)),
		next: (t) => {
			const current = resolveSpring(t);
			if (!isResolvedFromDuration) {
				const currentVelocity = /* @__PURE__ */ secondsToMilliseconds(resolveVelocity(t));
				state.done = Math.abs(currentVelocity) <= s.restSpeed && Math.abs(s.target - current) <= s.restDelta;
			} else state.done = t >= duration;
			state.value = state.done ? s.target : current;
			return state;
		},
		toString: () => {
			const easingDuration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
			const easing = generateLinearEasing((progress) => generator.next(easingDuration * progress).value, easingDuration, 30);
			return easingDuration + "ms " + easing;
		},
		toTransition: () => {}
	};
	return generator;
}
var spring = /* @__PURE__ */ Object.assign(springGenerator, { applyToOptions: (options) => {
	const generatorOptions = createGeneratorEasing(options, 100, springGenerator);
	options.ease = generatorOptions.ease;
	options.duration = /* @__PURE__ */ secondsToMilliseconds(generatorOptions.duration);
	options.type = "keyframes";
	return options;
} });
// node_modules/motion-dom/dist/es/animation/generators/inertia.mjs
function inertia({ keyframes, velocity = 0, power = .8, timeConstant = 325, bounceDamping = 10, bounceStiffness = 500, modifyTarget, min, max, restDelta = .5, restSpeed }) {
	const origin = keyframes[0];
	const state = {
		done: false,
		value: origin
	};
	const isOutOfBounds = (v) => v < min || v > max;
	const nearestBoundary = (v) => {
		if (min === void 0) return max;
		if (max === void 0) return min;
		return Math.abs(min - v) < Math.abs(max - v) ? min : max;
	};
	let amplitude = power * velocity;
	const ideal = origin + amplitude;
	const target = modifyTarget ? modifyTarget(ideal) : ideal;
	/**
	* If the target has changed we need to re-calculate the amplitude, otherwise
	* the animation will start from the wrong position.
	*/
	if (target !== ideal) amplitude = target - origin;
	const calcDelta = (t) => -amplitude * Math.exp(-t / timeConstant);
	const applyFriction = (t) => {
		const delta = calcDelta(t);
		state.done = Math.abs(delta) <= restDelta;
		state.value = state.done ? target : t ? target + delta : origin;
	};
	/**
	* Ideally this would resolve for t in a stateless way, we could
	* do that by always precalculating the animation but as we know
	* this will be done anyway we can assume that spring will
	* be discovered during that.
	*/
	let timeReachedBoundary;
	let spring$1;
	const checkCatchBoundary = (t) => {
		if (!isOutOfBounds(state.value)) return;
		timeReachedBoundary = t;
		spring$1 = spring({
			keyframes: [state.value, nearestBoundary(state.value)],
			/**
			* The friction curve is target + calcDelta(t), so its exact
			* derivative is -calcDelta(t) / timeConstant in units/ms,
			* converted here to the units/second expected by spring.
			*/
			velocity: -calcDelta(t) / timeConstant * 1e3,
			damping: bounceDamping,
			stiffness: bounceStiffness,
			restDelta,
			restSpeed
		});
	};
	checkCatchBoundary(0);
	return {
		calculatedDuration: null,
		next: (t) => {
			/**
			* We need to resolve the friction to figure out if we need a
			* spring but we don't want to do this twice per frame. So here
			* we flag if we updated for this frame and later if we did
			* we can skip doing it again.
			*/
			let hasUpdatedFrame = false;
			if (!spring$1 && timeReachedBoundary === void 0) {
				hasUpdatedFrame = true;
				applyFriction(t);
				checkCatchBoundary(t);
			}
			/**
			* If we have a spring and the provided t is beyond the moment the friction
			* animation crossed the min/max boundary, use the spring.
			*/
			if (timeReachedBoundary !== void 0 && t >= timeReachedBoundary) return spring$1.next(t - timeReachedBoundary);
			else {
				!hasUpdatedFrame && applyFriction(t);
				return state;
			}
		}
	};
}
// node_modules/motion-dom/dist/es/utils/interpolate.mjs
function createMixers(output, ease, customMixer) {
	const mixers = [];
	const mixerFactory = MotionGlobalConfig.mix || mix;
	const numMixers = output.length - 1;
	for (let i = 0; i < numMixers; i++) {
		let mixer = customMixer?.(output[i], output[i + 1]) || mixerFactory(output[i], output[i + 1]);
		if (ease) mixer = pipe(Array.isArray(ease) ? ease[i] || noop : ease, mixer);
		mixers.push(mixer);
	}
	return mixers;
}
/**
* Create a function that maps from a numerical input array to a generic output array.
*
* Accepts:
*   - Numbers
*   - Colors (hex, hsl, hsla, rgb, rgba)
*   - Complex (combinations of one or more numbers or strings)
*
* ```jsx
* const mixColor = interpolate([0, 1], ['#fff', '#000'])
*
* mixColor(0.5) // 'rgba(128, 128, 128, 1)'
* ```
*
* TODO Revisit this approach once we've moved to data models for values,
* probably not needed to pregenerate mixer functions.
*
* @public
*/
function interpolate(input, output, { clamp: isClamp = true, ease, mixer } = {}) {
	const inputLength = input.length;
	process.env.NODE_ENV !== "production" && invariant(inputLength === output.length, "Both input and output ranges must be the same length", "range-length");
	/**
	* If we're only provided a single input, we can just make a function
	* that returns the output.
	*/
	if (inputLength === 1) return () => output[0];
	if (inputLength === 2 && output[0] === output[1]) return () => output[1];
	const isZeroDeltaRange = input[0] === input[1];
	if (input[0] > input[inputLength - 1]) {
		input = [...input].reverse();
		output = [...output].reverse();
	}
	const mixers = createMixers(output, ease, mixer);
	const numMixers = mixers.length;
	const interpolator = (v) => {
		if (isZeroDeltaRange && v < input[0]) return output[0];
		let i = 0;
		if (numMixers > 1) {
			for (; i < input.length - 2; i++) if (v < input[i + 1]) break;
		}
		const progressInRange = /* @__PURE__ */ progress(input[i], input[i + 1], v);
		return mixers[i](progressInRange);
	};
	return isClamp ? (v) => interpolator(clamp(input[0], input[inputLength - 1], v)) : interpolator;
}
// node_modules/motion-dom/dist/es/animation/keyframes/offsets/fill.mjs
function fillOffset(offset, remaining) {
	const min = offset[offset.length - 1];
	for (let i = 1; i <= remaining; i++) {
		const offsetProgress = /* @__PURE__ */ progress(0, remaining, i);
		offset.push(mixNumber$1(min, 1, offsetProgress));
	}
}
// node_modules/motion-dom/dist/es/animation/keyframes/offsets/default.mjs
function defaultOffset(arr) {
	const offset = [0];
	fillOffset(offset, arr.length - 1);
	return offset;
}
// node_modules/motion-dom/dist/es/animation/keyframes/offsets/time.mjs
function convertOffsetToTimes(offset, duration) {
	return offset.map((o) => o * duration);
}
// node_modules/motion-dom/dist/es/animation/generators/keyframes.mjs
function defaultEasing(values, easing) {
	return values.map(() => easing || easeInOut).splice(0, values.length - 1);
}
function keyframes({ duration = 300, keyframes: keyframeValues, times, ease = "easeInOut", mixer: transitionMixer }) {
	/**
	* A mixer only blends values that aren't numbers. Numbers blend as
	* usual, as they do in springs, and so do the progress animations
	* behind layout and path animations, which take the same transition.
	*/
	const customMixer = typeof keyframeValues[0] === "number" ? void 0 : transitionMixer;
	/**
	* Easing functions can be externally defined as strings. Here we convert them
	* into actual functions.
	*/
	const easingFunctions = /* @__PURE__ */ isEasingArray(ease) ? ease.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease) || easeInOut;
	/**
	* This is the Iterator-spec return value. We ensure it's mutable rather than using a generator
	* to reduce GC during animation.
	*/
	const state = {
		done: false,
		value: keyframeValues[0]
	};
	/**
	* Fast setup path for two keyframes one easing. interpolate() handles
	* a custom mixer, and falls back to the usual one where it declines.
	*/
	if (!customMixer && keyframeValues.length === 2 && !Array.isArray(easingFunctions) && (!times || times.length !== 2 || times[0] === 0 && times[1] === 1)) {
		const [origin, target] = keyframeValues;
		const mixer = origin === target ? void 0 : (MotionGlobalConfig.mix || mix)(origin, target);
		return {
			calculatedDuration: duration,
			next: (t) => {
				state.value = mixer ? mixer(easingFunctions(duration > 0 ? clamp(0, 1, t / duration) : 1)) : target;
				state.done = t >= duration;
				return state;
			}
		};
	}
	const mapTimeToKeyframe = interpolate(convertOffsetToTimes(times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues), duration), keyframeValues, {
		ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions),
		mixer: customMixer
	});
	return {
		calculatedDuration: duration,
		next: (t) => {
			state.value = mapTimeToKeyframe(t);
			state.done = t >= duration;
			return state;
		}
	};
}
// node_modules/motion-dom/dist/es/animation/generators/utils/velocity.mjs
var velocitySampleDuration = 5;
function getGeneratorVelocity(resolveValue, t, current) {
	const prevT = Math.max(t - velocitySampleDuration, 0);
	return /* @__PURE__ */ velocityPerSecond(current - resolveValue(prevT), t - prevT);
}
/**
* A generator's velocity at time t in units/second: analytical where the
* generator provides it (springs), otherwise by finite difference. Before
* the animation has started this is its initial velocity.
*/
function calcGeneratorVelocity(generator, t, initialVelocity = 0) {
	if (t <= 0) return initialVelocity;
	return generator.velocity ? generator.velocity(t) : getGeneratorVelocity((s) => generator.next(s).value, t, generator.next(t).value);
}
// node_modules/motion-dom/dist/es/animation/keyframes/get-final.mjs
var isNotNull = (value) => value !== null;
function getFinalKeyframe(keyframes, { repeat, repeatType = "loop" }, finalKeyframe, speed = 1) {
	const resolvedKeyframes = keyframes.filter(isNotNull);
	const index = speed < 0 || repeat && repeatType !== "loop" && repeat % 2 === 1 ? 0 : resolvedKeyframes.length - 1;
	return !index || finalKeyframe === void 0 ? resolvedKeyframes[index] : finalKeyframe;
}
// node_modules/motion-dom/dist/es/animation/utils/replace-transition-type.mjs
var transitionTypeMap = {
	decay: inertia,
	inertia,
	tween: keyframes,
	keyframes,
	spring
};
function replaceTransitionType(transition) {
	if (typeof transition.type === "string") transition.type = transitionTypeMap[transition.type];
}
// node_modules/motion-dom/dist/es/animation/utils/resolve-start-time.mjs
/**
* If an animation's keyframes resolve, or its first frame renders, more than
* this long after its start time, it starts from then instead. While we prefer
* to "start" an animation as soon as it's triggered, this avoids a visual jump
* into it after main thread work.
*
* Manual timing steps frames by however long it likes, so never lags.
*/
var MAX_START_DELAY = 40;
var resolveStartTime = (startTime, now) => now - startTime > MAX_START_DELAY && !MotionGlobalConfig.useManualTiming ? now : startTime;
// node_modules/motion-dom/dist/es/animation/utils/notify-inspector.mjs
function baseRecord(kind, animation) {
	return {
		kind,
		animation,
		timestamp: time.now(),
		frameTimestamp: frameData.timestamp,
		frameIsProcessing: frameData.isProcessing
	};
}
/**
* Notify an optional inspector without adding a public Motion API.
*
* The record is a raw firehose: the live animation handle, the concrete
* animation's internal options object untouched (timing fields in
* internal milliseconds, name/keyframes/element/motionValue still
* attached), a timestamp and the raw frameloop state at notify time.
* All interpretation belongs to the consumer behind
* globalThis.__MOTION_INSPECT__.
*/
function notifyAnimationStart(animation, options, transition) {
	const notify = globalThis.__MOTION_INSPECT__;
	if (!notify) return;
	try {
		notify({
			...baseRecord("animation-start", animation),
			options: transition ? {
				...options,
				...transition
			} : options
		});
	} catch {}
}
// node_modules/motion-dom/dist/es/animation/utils/WithPromise.mjs
var WithPromise = class {
	constructor() {
		this.isResolved = false;
	}
	get finished() {
		if (!this._finished) this._finished = this.isResolved ? Promise.resolve() : new Promise((resolve) => {
			this._resolve = resolve;
		});
		return this._finished;
	}
	updateFinished() {
		this._finished = this._resolve = void 0;
		this.isResolved = false;
	}
	notifyFinished() {
		this.isResolved = true;
		this._resolve?.();
	}
	/**
	* Allows the animation to be awaited.
	*
	* @deprecated Use `finished` instead.
	*/
	then(onResolve, onReject) {
		return this.finished.then(onResolve, onReject);
	}
};
// node_modules/motion-dom/dist/es/animation/JSAnimation.mjs
var percentToProgress = (percent) => percent / 100;
var round = (value) => Math.round(value * 1e4) / 1e4;
var JSAnimation = class extends WithPromise {
	constructor(options) {
		super();
		this.state = "idle";
		this.startTime = null;
		this.isStopped = false;
		/**
		* The current time of the animation.
		*/
		this.currentTime = 0;
		/**
		* The time at which the animation was paused.
		*/
		this.holdTime = null;
		/**
		* Playback speed as a factor. 0 would be stopped, -1 reverse and 2 double speed.
		*/
		this.playbackSpeed = 1;
		/**
		* Reusable state object for the delay phase to avoid
		* allocating a new object every frame.
		*/
		this.delayState = {
			done: false,
			value: void 0
		};
		/**
		* This method is bound to the instance to fix a pattern where
		* animation.stop is returned as a reference from a useEffect.
		*/
		this.stop = () => {
			const { motionValue } = this.options;
			if (motionValue && motionValue.updatedAt !== time.now()) this.tick(time.now());
			this.isStopped = true;
			if (this.state === "idle") return;
			this.teardown();
			this.options.onStop?.();
		};
		this.options = options;
		this.initAnimation();
		this.play();
		if (options.autoplay === false) this.pause();
		notifyAnimationStart(this, this.options);
	}
	initAnimation() {
		const { options } = this;
		replaceTransitionType(options);
		const { type = keyframes, repeat = 0, repeatDelay = 0, repeatType, velocity = 0 } = options;
		let { keyframes: keyframes$1 } = options;
		const generatorFactory = type || keyframes;
		if (process.env.NODE_ENV !== "production" && generatorFactory !== keyframes) invariant(keyframes$1.length <= 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${keyframes$1}`, "spring-two-frames");
		/**
		* This runs again when a spring is flattened to attach it to a
		* timeline, and the keyframes generator blends values itself.
		*/
		this.mixKeyframes = void 0;
		if (generatorFactory !== keyframes && typeof keyframes$1[0] !== "number") {
			this.mixKeyframes = pipe(percentToProgress, options.mixer?.(keyframes$1[0], keyframes$1[1]) || mix(keyframes$1[0], keyframes$1[1]));
			keyframes$1 = [0, 100];
		}
		const generator = generatorFactory(keyframes$1 === options.keyframes ? options : {
			...options,
			keyframes: keyframes$1
		});
		/**
		* If we have a mirror repeat type we need to create a second generator that outputs the
		* mirrored (not reversed) animation and later ping pong between the two generators.
		*/
		if (repeatType === "mirror") this.mirroredGenerator = generatorFactory({
			...options,
			keyframes: [...keyframes$1].reverse(),
			velocity: -velocity
		});
		/**
		* If duration is undefined and we have repeat options,
		* we need to calculate a duration from the generator.
		*
		* We set it to the generator itself to cache the duration.
		* Any timeline resolver will need to have already precalculated
		* the duration by this step.
		*/
		if (generator.calculatedDuration === null) generator.calculatedDuration = calcGeneratorDuration(generator);
		const { calculatedDuration } = generator;
		this.calculatedDuration = calculatedDuration;
		this.resolvedDuration = calculatedDuration + repeatDelay;
		this.totalDuration = this.resolvedDuration * (repeat + 1) - repeatDelay;
		this.generator = generator;
	}
	updateTime(timestamp) {
		this.currentTime = this.holdTime ?? Math.round(timestamp - this.startTime) * this.playbackSpeed;
	}
	tick(timestamp, sample = false) {
		const { generator, totalDuration, calculatedDuration } = this;
		if (this.startTime === null) return generator.next(0);
		const { delay = 0, keyframes, type, onUpdate, finalKeyframe } = this.options;
		if (this.startTime === this.pendingStartTime) this.startTime = resolveStartTime(this.startTime, timestamp);
		this.pendingStartTime = void 0;
		/**
		* requestAnimationFrame timestamps can come through as lower than
		* the startTime as set by performance.now(). Here we prevent this,
		* though in the future it could be possible to make setting startTime
		* a pending operation that gets resolved here.
		*/
		if (this.speed > 0) this.startTime = Math.min(this.startTime, timestamp);
		else if (this.speed < 0) this.startTime = Math.min(timestamp - totalDuration / this.speed, this.startTime);
		if (sample) this.currentTime = timestamp;
		else this.updateTime(timestamp);
		const timeWithoutDelay = this.currentTime - delay * (this.playbackSpeed >= 0 ? 1 : -1);
		const isInDelayPhase = this.playbackSpeed >= 0 ? timeWithoutDelay < 0 : timeWithoutDelay > totalDuration;
		this.currentTime = Math.max(timeWithoutDelay, 0);
		if (this.state === "finished" && this.holdTime === null) this.currentTime = totalDuration;
		const state = this.generate(this.currentTime, isInDelayPhase);
		let { done } = state;
		/**
		* A generator that takes longer than maxGeneratorDuration to finish
		* has an Infinity duration, so played forwards it finishes when it
		* says it's done.
		*/
		if (!isInDelayPhase) done = this.playbackSpeed >= 0 ? calculatedDuration < Infinity ? this.currentTime >= totalDuration : done : this.currentTime <= 0;
		const isAnimationFinished = this.holdTime === null && (this.state === "finished" || this.state === "running" && done);
		if (isAnimationFinished && type !== inertia) state.value = getFinalKeyframe(keyframes, this.options, finalKeyframe, this.speed);
		if (onUpdate) onUpdate(state.value);
		if (isAnimationFinished) this.finish();
		return state;
	}
	/**
	* This animation's time, including delay, at a timestamp.
	*/
	at(timestamp) {
		return this.holdTime ?? round((timestamp - this.startTime) * this.playbackSpeed);
	}
	/**
	* The value at a timestamp, without changing this animation's state.
	* If resolved, it ends at the last resolved keyframe, which is in the
	* same unit as the others, rather than at finalKeyframe.
	*/
	sampleAt(timestamp, resolved) {
		const { options, totalDuration } = this;
		const t = this.at(timestamp) - (options.delay || 0);
		return t >= totalDuration && options.type !== inertia ? getFinalKeyframe(options.keyframes, options, resolved ? void 0 : options.finalKeyframe) : this.generate(Math.max(t, 0), t < 0).value;
	}
	/**
	* The generator's state `currentTime` ms after the delay, without
	* changing the animation's own state.
	*/
	generate(currentTime, isInDelayPhase) {
		const { generator, totalDuration, mixKeyframes, mirroredGenerator, resolvedDuration } = this;
		const { keyframes, repeat, repeatType, repeatDelay } = this.options;
		let elapsed = currentTime;
		let frameGenerator = generator;
		if (repeat) {
			/**
			* Get the current progress (0-1) of the animation. If t is >
			* than duration we'll get values like 2.5 (midway through the
			* third iteration)
			*/
			const progress = Math.min(currentTime, totalDuration) / resolvedDuration;
			/**
			* Get the current iteration (0 indexed). For instance the floor of
			* 2.5 is 2.
			*/
			let currentIteration = Math.floor(progress);
			/**
			* Get the current progress of the iteration by taking the remainder
			* so 2.5 is 0.5 through iteration 2
			*/
			let iterationProgress = progress % 1;
			/**
			* If iteration progress is 1 we count that as the end
			* of the previous iteration.
			*/
			if (!iterationProgress && progress >= 1) iterationProgress = 1;
			iterationProgress === 1 && currentIteration--;
			currentIteration = Math.min(currentIteration, repeat + 1);
			if (Boolean(currentIteration % 2)) {
				if (repeatType === "reverse") {
					iterationProgress = 1 - iterationProgress;
					if (repeatDelay) iterationProgress -= repeatDelay / resolvedDuration;
				} else if (repeatType === "mirror") frameGenerator = mirroredGenerator;
			}
			elapsed = clamp(0, 1, iterationProgress) * resolvedDuration;
		}
		/**
		* If we're in negative time, set state as the initial keyframe.
		* This prevents delay: x, duration: 0 animations from finishing
		* instantly.
		*/
		let state;
		if (isInDelayPhase) {
			this.delayState.value = keyframes[0];
			state = this.delayState;
		} else state = frameGenerator.next(elapsed);
		if (mixKeyframes && !isInDelayPhase) state.value = mixKeyframes(state.value);
		return state;
	}
	get duration() {
		return /* @__PURE__ */ millisecondsToSeconds(this.calculatedDuration);
	}
	get iterationDuration() {
		return this.duration + /* @__PURE__ */ millisecondsToSeconds(this.options.delay ?? 0);
	}
	get time() {
		return /* @__PURE__ */ millisecondsToSeconds(this.currentTime);
	}
	set time(newTime) {
		newTime = /* @__PURE__ */ secondsToMilliseconds(newTime);
		this.currentTime = newTime;
		if (this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0) this.holdTime = newTime;
		else if (this.driver) this.startTime = this.driver.now() - newTime / this.playbackSpeed;
		if (this.driver) this.driver.start(false);
		else {
			this.startTime = 0;
			this.state = "paused";
			this.holdTime = newTime;
			this.tick(newTime);
		}
	}
	/**
	* Returns the generator's velocity at the current time in units/second.
	* Uses the analytical derivative when available (springs), avoiding
	* the MotionValue's frame-dependent velocity estimation.
	*/
	getGeneratorVelocity() {
		return calcGeneratorVelocity(this.generator, this.currentTime, this.options.velocity);
	}
	get speed() {
		return this.playbackSpeed;
	}
	set speed(newSpeed) {
		const hasChanged = this.playbackSpeed !== newSpeed;
		if (hasChanged && this.driver) this.updateTime(time.now());
		this.playbackSpeed = newSpeed;
		if (hasChanged && this.driver) this.time = /* @__PURE__ */ millisecondsToSeconds(this.currentTime);
	}
	play() {
		if (this.isStopped) return;
		const { driver = frameloopDriver, startTime } = this.options;
		if (!this.driver) this.driver = driver((timestamp) => this.tick(timestamp));
		this.options.onPlay?.();
		const now = this.driver.now();
		if (this.state === "finished") {
			this.updateFinished();
			this.startTime = now;
		} else if (this.holdTime !== null) this.startTime = now - this.holdTime / (this.playbackSpeed || 1);
		else if (!this.startTime) this.startTime = startTime ?? (this.pendingStartTime = now);
		if (this.state === "finished" && this.speed < 0) this.startTime += this.calculatedDuration;
		this.holdTime = null;
		/**
		* Set playState to running only after we've used it in
		* the previous logic.
		*/
		this.state = "running";
		this.driver.start();
	}
	pause() {
		this.state = "paused";
		this.updateTime(time.now());
		this.holdTime = this.currentTime;
	}
	complete() {
		if (this.state !== "running") this.play();
		this.state = "finished";
		this.holdTime = null;
	}
	finish() {
		this.notifyFinished();
		this.teardown();
		this.state = "finished";
		this.options.onComplete?.();
	}
	cancel() {
		this.holdTime = null;
		this.startTime = 0;
		this.tick(0);
		this.teardown();
		this.options.onCancel?.();
	}
	teardown() {
		this.state = "idle";
		this.driver?.stop();
		this.driver = void 0;
		this.startTime = this.holdTime = null;
	}
	sample(sampleTime) {
		this.startTime = 0;
		return this.tick(sampleTime, true);
	}
	attachTimeline(timeline) {
		if (this.options.allowFlatten) {
			this.options.type = "keyframes";
			this.options.ease = "linear";
			this.initAnimation();
		}
		this.driver?.stop();
		return timeline.observe(this);
	}
};
// node_modules/motion-dom/dist/es/value/types/complex/filter.mjs
/**
* Properties that should default to 1 or 100%
*/
var maxDefaults = /* @__PURE__ */ new Set([
	"brightness",
	"contrast",
	"saturate",
	"opacity"
]);
function applyDefaultFilter(v) {
	const [name, value] = v.slice(0, -1).split("(");
	if (name === "drop-shadow") return v;
	const [number] = value.match(floatRegex) || [];
	if (!number) return v;
	const unit = value.replace(number, "");
	let defaultValue = maxDefaults.has(name) ? 1 : 0;
	if (number !== value) defaultValue *= 100;
	return name + "(" + defaultValue + unit + ")";
}
var functionRegex = /\b([a-z-]*)\(.*?\)/gu;
var filter = {
	...complex,
	getAnimatableNone: (v) => {
		const functions = v.match(functionRegex);
		return functions ? functions.map(applyDefaultFilter).join(" ") : v;
	}
};
// node_modules/motion-dom/dist/es/value/types/complex/mask.mjs
var mask = {
	...complex,
	getAnimatableNone: (v) => {
		const parsed = complex.parse(v);
		return complex.createTransformer(v)(parsed.map((v) => typeof v === "number" ? 0 : typeof v === "object" ? {
			...v,
			alpha: 1
		} : v));
	}
};
// node_modules/motion-dom/dist/es/value/types/int.mjs
var int = {
	...number,
	transform: Math.round
};
// node_modules/motion-dom/dist/es/value/types/maps/transform.mjs
var transformValueTypes = {
	rotate: degrees,
	/**
	* Internal channel for `transition.path` orientToPath. Composed onto
	* `rotate` at the transform-build sites so the user's `rotate` is
	* never read or overwritten. Not part of `transformPropOrder`.
	*/
	pathRotation: degrees,
	rotateX: degrees,
	rotateY: degrees,
	rotateZ: degrees,
	scale,
	scaleX: scale,
	scaleY: scale,
	scaleZ: scale,
	skew: degrees,
	skewX: degrees,
	skewY: degrees,
	distance: px,
	translateX: px,
	translateY: px,
	translateZ: px,
	x: px,
	y: px,
	z: px,
	perspective: px,
	transformPerspective: px,
	opacity: alpha,
	originX: progressPercentage,
	originY: progressPercentage,
	originZ: px
};
// node_modules/motion-dom/dist/es/value/types/maps/number.mjs
var numberValueTypes = {
	borderWidth: px,
	borderTopWidth: px,
	borderRightWidth: px,
	borderBottomWidth: px,
	borderLeftWidth: px,
	borderRadius: px,
	borderTopLeftRadius: px,
	borderTopRightRadius: px,
	borderBottomRightRadius: px,
	borderBottomLeftRadius: px,
	width: px,
	maxWidth: px,
	height: px,
	maxHeight: px,
	top: px,
	right: px,
	bottom: px,
	left: px,
	inset: px,
	insetBlock: px,
	insetBlockStart: px,
	insetBlockEnd: px,
	insetInline: px,
	insetInlineStart: px,
	insetInlineEnd: px,
	padding: px,
	paddingTop: px,
	paddingRight: px,
	paddingBottom: px,
	paddingLeft: px,
	paddingBlock: px,
	paddingBlockStart: px,
	paddingBlockEnd: px,
	paddingInline: px,
	paddingInlineStart: px,
	paddingInlineEnd: px,
	margin: px,
	marginTop: px,
	marginRight: px,
	marginBottom: px,
	marginLeft: px,
	marginBlock: px,
	marginBlockStart: px,
	marginBlockEnd: px,
	marginInline: px,
	marginInlineStart: px,
	marginInlineEnd: px,
	fontSize: px,
	backgroundPositionX: px,
	backgroundPositionY: px,
	...transformValueTypes,
	zIndex: int,
	fillOpacity: alpha,
	strokeOpacity: alpha,
	numOctaves: int
};
// node_modules/motion-dom/dist/es/value/types/maps/defaults.mjs
/**
* A map of default value types for common values
*/
var defaultValueTypes = {
	...numberValueTypes,
	color,
	backgroundColor: color,
	outlineColor: color,
	fill: color,
	stroke: color,
	borderColor: color,
	borderTopColor: color,
	borderRightColor: color,
	borderBottomColor: color,
	borderLeftColor: color,
	filter,
	WebkitFilter: filter,
	mask,
	WebkitMask: mask
};
/**
* Gets the default ValueType for the provided value key
*/
var getDefaultValueType = (key) => defaultValueTypes[key];
// node_modules/motion-dom/dist/es/value/types/utils/animatable-none.mjs
var customTypes = /*@__PURE__*/ new Set([filter, mask]);
function getAnimatableNone(key, value) {
	let defaultValueType = getDefaultValueType(key);
	if (!customTypes.has(defaultValueType)) defaultValueType = complex;
	return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
}
// node_modules/motion-dom/dist/es/animation/keyframes/utils/fill-wildcards.mjs
function fillWildcards(keyframes) {
	for (let i = 1; i < keyframes.length; i++) keyframes[i] ?? (keyframes[i] = keyframes[i - 1]);
}
// node_modules/motion-dom/dist/es/render/dom/parse-transform.mjs
var radToDeg = (rad) => rad * 180 / Math.PI;
var rotate = (v) => {
	return rebaseAngle(radToDeg(Math.atan2(v[1], v[0])));
};
var matrix2dParsers = {
	x: 4,
	y: 5,
	translateX: 4,
	translateY: 5,
	scaleX: 0,
	scaleY: 3,
	scaleZ: () => 1,
	scale: (v) => (Math.abs(v[0]) + Math.abs(v[3])) / 2,
	rotate,
	rotateZ: rotate,
	skewX: (v) => radToDeg(Math.atan(v[1])),
	skewY: (v) => radToDeg(Math.atan(v[2])),
	skew: (v) => (Math.abs(v[1]) + Math.abs(v[2])) / 2
};
var rebaseAngle = (angle) => {
	angle = angle % 360;
	if (angle < 0) angle += 360;
	return angle;
};
var rotateZ = rotate;
var scaleX = (v) => Math.hypot(v[0], v[1]);
var scaleY = (v) => Math.hypot(v[4], v[5]);
var matrix3dParsers = {
	x: 12,
	y: 13,
	z: 14,
	translateX: 12,
	translateY: 13,
	translateZ: 14,
	scaleX,
	scaleY,
	scaleZ: (v) => Math.hypot(v[8], v[9], v[10]),
	scale: (v) => (scaleX(v) + scaleY(v)) / 2,
	rotateX: (v) => rebaseAngle(radToDeg(Math.atan2(v[6], v[5]))),
	rotateY: (v) => rebaseAngle(radToDeg(Math.atan2(-v[2], v[0]))),
	rotateZ,
	rotate: rotateZ,
	skewX: (v) => radToDeg(Math.atan(v[4])),
	skewY: (v) => radToDeg(Math.atan(v[1])),
	skew: (v) => (Math.abs(v[1]) + Math.abs(v[4])) / 2
};
function defaultTransformValue(name) {
	return name.includes("scale") ? 1 : 0;
}
function parseValueFromTransform(transform, name) {
	if (!transform || transform === "none") return defaultTransformValue(name);
	const match = transform.match(/^matrix(3d)?\(([-\d.e\s,]+)\)$/u);
	if (!match) return defaultTransformValue(name);
	const valueParser = (match[1] ? matrix3dParsers : matrix2dParsers)[name];
	/**
	* parseFloat skips leading whitespace and stops at trailing whitespace.
	*/
	const values = match[2].split(",").map((v) => parseFloat(v));
	return typeof valueParser === "function" ? valueParser(values) : values[valueParser];
}
var readTransformValue = (instance, name) => {
	const { transform = "none" } = getComputedStyle(instance);
	return parseValueFromTransform(transform, name);
};
// node_modules/motion-dom/dist/es/render/utils/keys-transform.mjs
/**
* Generate a list of every possible transform key.
*/
var transformPropOrder = [
	"transformPerspective",
	"x",
	"y",
	"z",
	"translateX",
	"translateY",
	"translateZ",
	"scale",
	"scaleX",
	"scaleY",
	"scaleZ",
	"rotate",
	"rotateX",
	"rotateY",
	"rotateZ",
	"skew",
	"skewX",
	"skewY"
];
/**
* A quick lookup for transform props.
*
* `pathRotation` is a transform for routing purposes (skipped from raw
* style application, wired to the transform composite, flags transform
* dirty) but is intentionally NOT in `transformPropOrder` — it is
* composed onto `rotate` at the build sites, not serialized in its own
* slot, and must stay out of the order-array consumers (parse-transform,
* unit-conversion, keys-position).
*/
var transformProps = /*@__PURE__*/ (() => /* @__PURE__ */ new Set([...transformPropOrder, "pathRotation"]))();
// node_modules/motion-dom/dist/es/animation/keyframes/utils/unit-conversion.mjs
var isNumOrPxType = (v) => v === number || v === px;
var transformKeys = /* @__PURE__ */ new Set([
	"x",
	"y",
	"z"
]);
var nonTranslationalTransformKeys = /* @__PURE__ */ transformPropOrder.filter((key) => !transformKeys.has(key));
/**
* Reset any bounding box-changing transforms so the element can be
* measured. Returns the values to restore. Values already at their
* default don't change the box, so they're left alone: an element with
* only `rotate: 0` doesn't need to be re-rendered before measuring.
*/
function removeNonTranslationalTransform(visualElement) {
	const removedTransforms = [];
	nonTranslationalTransformKeys.forEach((key) => {
		const value = visualElement.getValue(key);
		if (value !== void 0) {
			const current = value.get();
			const reset = key.startsWith("scale") ? 1 : 0;
			if (current === reset) return;
			removedTransforms.push([key, current]);
			value.set(reset);
		}
	});
	return removedTransforms;
}
/**
* Values that can only be measured from the bounding box. Elements with
* these values need bounding box-changing transforms removed first.
*/
var boxDependentValues = /* @__PURE__ */ new Set(["bottom", "right"]);
/**
* Computed width/height is already in pixels and unaffected by
* transforms. It's "auto" for elements without a layout box (e.g. inline),
* in which case we fall back to measuring the bounding box.
*/
function measureDimension(computed, measureBox, axis, paddingStart, paddingEnd, boxSizing) {
	const px = parseFloat(computed);
	if (!isNaN(px)) return px;
	const { min, max } = measureBox()[axis];
	const size = max - min;
	return boxSizing === "border-box" ? size : size - parseFloat(paddingStart) - parseFloat(paddingEnd);
}
var transformX = ({ transform }) => parseValueFromTransform(transform, "x");
var transformY = ({ transform }) => parseValueFromTransform(transform, "y");
var positionalValues = {
	width: ({ width, paddingLeft = "0", paddingRight = "0", boxSizing }, measureBox) => measureDimension(width, measureBox, "x", paddingLeft, paddingRight, boxSizing),
	height: ({ height, paddingTop = "0", paddingBottom = "0", boxSizing }, measureBox) => measureDimension(height, measureBox, "y", paddingTop, paddingBottom, boxSizing),
	top: ({ top }) => parseFloat(top),
	left: ({ left }) => parseFloat(left),
	bottom: ({ top }, measureBox) => {
		const { y } = measureBox();
		return parseFloat(top) + (y.max - y.min);
	},
	right: ({ left }, measureBox) => {
		const { x } = measureBox();
		return parseFloat(left) + (x.max - x.min);
	},
	x: transformX,
	y: transformY,
	translateX: transformX,
	translateY: transformY
};
// node_modules/motion-dom/dist/es/animation/keyframes/KeyframesResolver.mjs
var toResolve = /* @__PURE__ */ new Set();
var isScheduled = false;
var anyNeedsMeasurement = false;
var isForced = false;
function measureAllKeyframes() {
	if (anyNeedsMeasurement) {
		const resolversToMeasure = [];
		const elementsToMeasure = /* @__PURE__ */ new Set();
		const elementsToUntransform = /* @__PURE__ */ new Set();
		toResolve.forEach((resolver) => {
			if (!resolver.needsMeasurement) return;
			resolversToMeasure.push(resolver);
			elementsToMeasure.add(resolver.element);
			if (boxDependentValues.has(resolver.name)) elementsToUntransform.add(resolver.element);
		});
		const transformsToRestore = /* @__PURE__ */ new Map();
		/**
		* Write pass
		* Values measured from the bounding box need bounding box-changing
		* transforms removed first. Values read from computed style don't.
		*/
		elementsToUntransform.forEach((element) => {
			const removedTransforms = removeNonTranslationalTransform(element);
			if (!removedTransforms.length) return;
			transformsToRestore.set(element, removedTransforms);
			element.render();
		});
		resolversToMeasure.forEach((resolver) => resolver.measureInitialState());
		elementsToMeasure.forEach((element) => {
			element.render();
			const restore = transformsToRestore.get(element);
			if (restore) restore.forEach(([key, value]) => {
				element.getValue(key)?.set(value);
			});
		});
		resolversToMeasure.forEach((resolver) => resolver.measureEndState());
		resolversToMeasure.forEach((resolver) => {
			if (resolver.suspendedScrollY !== void 0) window.scrollTo(0, resolver.suspendedScrollY);
		});
	}
	anyNeedsMeasurement = false;
	isScheduled = false;
	toResolve.forEach((resolver) => resolver.complete(isForced));
	toResolve.clear();
}
function readAllKeyframes() {
	toResolve.forEach((resolver) => {
		resolver.readKeyframes();
		if (resolver.needsMeasurement) anyNeedsMeasurement = true;
	});
}
function flushKeyframeResolvers() {
	isForced = true;
	readAllKeyframes();
	measureAllKeyframes();
	isForced = false;
}
/**
* Normalise a value read from the subject into an animation origin: a
* number read as a string ("0", "200") becomes a number, and a value
* that isn't animatable (e.g. "none") but whose target is becomes an
* animatable zero in the shape of the target.
*/
function readOrigin(value, name, target) {
	if (typeof value === "string") {
		if (isNumericalString(value) || isZeroValueString(value)) return parseFloat(value);
		else if (!complex.test(value) && complex.test(target)) return getAnimatableNone(name, target);
	}
	return value ?? void 0;
}
var KeyframeResolver = class {
	constructor(unresolvedKeyframes, onComplete, name, motionValue, element, isAsync = false) {
		this.state = "pending";
		/**
		* Track whether this resolver is async. If it is, it'll be added to the
		* resolver queue and flushed in the next frame. Resolvers that aren't going
		* to trigger read/write thrashing don't need to be async.
		*/
		this.isAsync = false;
		/**
		* Track whether this resolver needs to perform a measurement
		* to resolve its keyframes.
		*/
		this.needsMeasurement = false;
		this.unresolvedKeyframes = [...unresolvedKeyframes];
		this.onComplete = onComplete;
		this.name = name;
		this.motionValue = motionValue;
		this.element = element;
		this.isAsync = isAsync;
	}
	scheduleResolve() {
		this.state = "scheduled";
		if (this.isAsync) {
			toResolve.add(this);
			if (!isScheduled) {
				isScheduled = true;
				frame.read(readAllKeyframes);
				frame.resolveKeyframes(measureAllKeyframes);
			}
		} else {
			this.readKeyframes();
			this.complete();
		}
	}
	readKeyframes() {
		const { unresolvedKeyframes, name, element, motionValue } = this;
		if (unresolvedKeyframes[0] === null) {
			const currentValue = motionValue?.get();
			const finalKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
			if (currentValue !== void 0) unresolvedKeyframes[0] = currentValue;
			else if (element && name) {
				const valueAsRead = readOrigin(element.readValue(name, finalKeyframe), name, finalKeyframe);
				if (valueAsRead !== void 0) unresolvedKeyframes[0] = valueAsRead;
			}
			if (unresolvedKeyframes[0] === void 0) unresolvedKeyframes[0] = finalKeyframe;
			if (motionValue && currentValue === void 0) motionValue.set(unresolvedKeyframes[0]);
		}
		fillWildcards(unresolvedKeyframes);
	}
	setFinalKeyframe() {}
	measureInitialState() {}
	renderEndStyles() {}
	measureEndState() {}
	complete(isForcedComplete = false) {
		this.state = "complete";
		this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, isForcedComplete);
		toResolve.delete(this);
	}
	cancel() {
		if (this.state === "scheduled") {
			toResolve.delete(this);
			this.state = "pending";
		}
	}
	resume() {
		if (this.state === "pending") this.scheduleResolve();
	}
};
// node_modules/motion-dom/dist/es/render/dom/is-css-var.mjs
var isCSSVar = (name) => name.startsWith("--");
// node_modules/motion-dom/dist/es/render/dom/style-set.mjs
function setStyle(element, name, value) {
	isCSSVar(name) ? element.style.setProperty(name, value) : element.style[name] = value;
}
// node_modules/motion-dom/dist/es/utils/supports/flags.mjs
/**
* Add the ability for test suites to manually set support flags
* to better test more environments.
*/
var supportsFlags = {};
// node_modules/motion-dom/dist/es/utils/supports/memo.mjs
function memoSupports(callback, supportsFlag) {
	const memoized = /* @__PURE__ */ memo(callback);
	return () => supportsFlags[supportsFlag] ?? memoized();
}
// node_modules/motion-dom/dist/es/utils/supports/scroll-timeline.mjs
var supportsScrollTimeline = /* @__PURE__ */ memoSupports(() => window.ScrollTimeline !== void 0, "scrollTimeline");
// node_modules/motion-dom/dist/es/utils/supports/linear-easing.mjs
var supportsLinearEasing = /*@__PURE__*/ memoSupports(() => {
	try {
		document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
	} catch (e) {
		return false;
	}
	return true;
}, "linearEasing");
// node_modules/motion-dom/dist/es/animation/waapi/easing/cubic-bezier.mjs
var cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
// node_modules/motion-dom/dist/es/animation/waapi/easing/supported.mjs
var supportedWaapiEasing = {
	linear: "linear",
	ease: "ease",
	easeIn: "ease-in",
	easeOut: "ease-out",
	easeInOut: "ease-in-out",
	circIn: /*@__PURE__*/ cubicBezierAsString([
		0,
		.65,
		.55,
		1
	]),
	circOut: /*@__PURE__*/ cubicBezierAsString([
		.55,
		0,
		1,
		.45
	]),
	backIn: /*@__PURE__*/ cubicBezierAsString([
		.31,
		.01,
		.66,
		-.59
	]),
	backOut: /*@__PURE__*/ cubicBezierAsString([
		.33,
		1.53,
		.69,
		.99
	])
};
// node_modules/motion-dom/dist/es/animation/waapi/easing/map-easing.mjs
function mapEasingToNativeEasing(easing, duration) {
	if (!easing) return;
	else if (typeof easing === "function") return supportsLinearEasing() ? generateLinearEasing(easing, duration) : "ease-out";
	else if (/* @__PURE__ */ isBezierDefinition(easing)) return cubicBezierAsString(easing);
	else if (Array.isArray(easing)) return easing.map((segmentEasing) => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut);
	else return supportedWaapiEasing[easing];
}
// node_modules/motion-dom/dist/es/animation/waapi/start-waapi-animation.mjs
function startWaapiAnimation(element, valueName, keyframes, { delay = 0, duration = 300, repeat = 0, repeatType = "loop", ease = "easeOut", times } = {}, pseudoElement = void 0) {
	const keyframeOptions = { [valueName]: keyframes };
	if (times) keyframeOptions.offset = times;
	const easing = mapEasingToNativeEasing(ease, duration);
	/**
	* If this is an easing array, apply to keyframes, not animation as a whole
	*/
	if (Array.isArray(easing)) keyframeOptions.easing = easing;
	const options = {
		delay,
		duration,
		easing: !Array.isArray(easing) ? easing : "linear",
		fill: "both",
		iterations: repeat + 1,
		direction: repeatType === "reverse" ? "alternate" : "normal"
	};
	if (pseudoElement) options.pseudoElement = pseudoElement;
	return element.animate(keyframeOptions, options);
}
// node_modules/motion-dom/dist/es/animation/generators/utils/is-generator.mjs
function isGenerator(type) {
	return typeof type === "function" && "applyToOptions" in type;
}
// node_modules/motion-dom/dist/es/animation/waapi/utils/apply-generator.mjs
function applyGeneratorOptions({ type, ...options }) {
	if (isGenerator(type) && supportsLinearEasing()) return type.applyToOptions(options);
	else {
		options.duration ?? (options.duration = 300);
		options.ease ?? (options.ease = "easeOut");
	}
	return options;
}
// node_modules/motion-dom/dist/es/animation/NativeAnimation.mjs
/**
* NativeAnimation implements AnimationPlaybackControls for the browser's Web Animations API.
*/
var NativeAnimation = class extends WithPromise {
	constructor(options) {
		super();
		this.finishedTime = null;
		this.isStopped = false;
		/**
		* Tracks a manually-set start time that takes precedence over WAAPI's
		* dynamic startTime. This is cleared when play() or time setter is called,
		* allowing WAAPI to take over timing.
		*/
		this.manualStartTime = null;
		if (!options) return;
		const { element, name, keyframes, pseudoElement, allowFlatten = false, finalKeyframe, onComplete } = options;
		this.isPseudoElement = Boolean(pseudoElement);
		this.allowFlatten = allowFlatten;
		this.options = options;
		typeof process !== "undefined" && process.env.NODE_ENV !== "production" && invariant(typeof options.type !== "string", `Mini animate() doesn't support "type" as a string.`, "mini-spring");
		const transition = applyGeneratorOptions(options);
		this.animation = startWaapiAnimation(element, name, keyframes, transition, pseudoElement);
		if (transition.autoplay === false) this.animation.pause();
		this.animation.onfinish = () => {
			this.finishedTime = this.time;
			if (!pseudoElement) {
				const keyframe = getFinalKeyframe(keyframes, this.options, finalKeyframe, this.speed);
				this.updateMotionValue?.(keyframe);
				/**
				* If we can, we want to commit the final style as set by the user,
				* rather than the computed keyframe value supplied by the animation.
				* We always do this, even when a motion value is present, to prevent
				* a visual flash in Firefox where the WAAPI animation's fill is removed
				* during cancel() before the scheduled render can apply the correct value.
				*/
				setStyle(element, name, keyframe);
				this.animation.cancel();
			}
			onComplete?.();
			this.notifyFinished();
		};
		notifyAnimationStart(this, options, transition);
	}
	play() {
		if (this.isStopped) return;
		this.manualStartTime = null;
		this.animation.play();
		if (this.state === "finished") this.updateFinished();
	}
	pause() {
		this.animation.pause();
	}
	complete() {
		this.animation.finish?.();
	}
	cancel() {
		try {
			this.animation.cancel();
		} catch (e) {}
	}
	stop() {
		if (this.isStopped) return;
		this.isStopped = true;
		/**
		* Before its finish event, a finished animation (an instant one is
		* as soon as it starts) is still showing its end, so it's stopped
		* like a running one. Otherwise that event would apply its end
		* over whatever animates the value next.
		*/
		if (this.state === "idle" || this.finishedTime !== null) return;
		if (this.updateMotionValue) this.updateMotionValue();
		else this.commitStyles();
		if (!this.isPseudoElement) {
			this.animation.onfinish = null;
			this.cancel();
		}
	}
	/**
	* WAAPI doesn't natively have any interruption capabilities.
	*
	* In this method, we commit styles back to the DOM before cancelling
	* the animation.
	*
	* This is designed to be overridden by NativeAnimationExtended, which
	* will create a renderless JS animation and sample it twice to calculate
	* its current value, "previous" value, and therefore allow
	* Motion to also correctly calculate velocity for any subsequent animation
	* while deferring the commit until the next animation frame.
	*/
	commitStyles() {
		const element = this.options?.element;
		if (!this.isPseudoElement && element?.isConnected) this.animation.commitStyles?.();
	}
	get duration() {
		const duration = this.animation.effect?.getComputedTiming?.().duration || 0;
		return /* @__PURE__ */ millisecondsToSeconds(Number(duration));
	}
	get iterationDuration() {
		const { delay = 0 } = this.options || {};
		return this.duration + /* @__PURE__ */ millisecondsToSeconds(delay);
	}
	get time() {
		return /* @__PURE__ */ millisecondsToSeconds(Number(this.animation.currentTime) || 0);
	}
	set time(newTime) {
		const wasFinished = this.finishedTime !== null;
		this.manualStartTime = null;
		this.finishedTime = null;
		this.animation.currentTime = /* @__PURE__ */ secondsToMilliseconds(newTime);
		if (wasFinished) this.animation.pause();
	}
	/**
	* The playback speed of the animation.
	* 1 = normal speed, 2 = double speed, 0.5 = half speed.
	*/
	get speed() {
		return this.animation.playbackRate;
	}
	set speed(newSpeed) {
		if (newSpeed < 0) this.finishedTime = null;
		this.animation.playbackRate = newSpeed;
	}
	get state() {
		return this.finishedTime !== null ? "finished" : this.animation.playState;
	}
	get startTime() {
		return this.manualStartTime ?? Number(this.animation.startTime);
	}
	set startTime(newStartTime) {
		this.manualStartTime = this.animation.startTime = newStartTime;
	}
	/**
	* Attaches a timeline to the animation, for instance the `ScrollTimeline`.
	*/
	attachTimeline({ timeline, onAttach, observe }) {
		if (this.allowFlatten) this.animation.effect?.updateTiming({ easing: "linear" });
		this.animation.onfinish = null;
		if (timeline && supportsScrollTimeline()) {
			this.animation.timeline = timeline;
			onAttach?.(this.animation);
			return noop;
		} else return observe(this);
	}
};
// node_modules/motion-dom/dist/es/animation/waapi/utils/unsupported-easing.mjs
var unsupportedEasingFunctions = {
	anticipate,
	backInOut,
	circInOut
};
function isUnsupportedEase(key) {
	return key in unsupportedEasingFunctions;
}
function replaceStringEasing(transition) {
	if (typeof transition.ease === "string" && isUnsupportedEase(transition.ease)) transition.ease = unsupportedEasingFunctions[transition.ease];
}
var NativeAnimationExtended = class extends NativeAnimation {
	constructor(options) {
		/**
		* The base NativeAnimation function only supports a subset
		* of Motion easings, and WAAPI also only supports some
		* easing functions via string/cubic-bezier definitions.
		*
		* This function replaces those unsupported easing functions
		* with a JS easing function. This will later get compiled
		* to a linear() easing function.
		*/
		replaceStringEasing(options);
		/**
		* Ensure we replace the transition type with a generator function
		* before passing to WAAPI.
		*
		* TODO: Does this have a better home? It could be shared with
		* JSAnimation.
		*/
		replaceTransitionType(options);
		super(options);
		/**
		* Only set startTime when the animation should autoplay.
		* Setting startTime on a paused WAAPI animation unpauses it
		* (per the WAAPI spec), which breaks autoplay: false.
		*/
		if (options.startTime !== void 0 && options.autoplay !== false) this.startTime = options.startTime;
		this.options = options;
	}
	/**
	* The animation's time now, in ms. Wall-clock rather than WAAPI's
	* currentTime while running, as under CPU load currentTime may not
	* reflect the actual elapsed time, causing incorrect sampling and
	* visual jumps.
	*/
	elapsed() {
		return this.state === "running" ? (time.now() - this.startTime) * this.speed : this.time * 1e3;
	}
	/**
	* The value at a time, from a renderless JS animation.
	*/
	sample(sampleTime) {
		if (!this.sampler) {
			const { motionValue, onUpdate, onComplete, onPlay, onStop, element, ...options } = this.options;
			/**
			* Stop it straight away so its driver doesn't run every frame.
			* It can still be sampled.
			*/
			this.sampler = new JSAnimation({
				...options,
				autoplay: false
			});
			this.sampler.stop();
		}
		return this.sampler.sample(Math.max(0, sampleTime)).value;
	}
	/**
	* The value now, as WAAPI doesn't set the motion value while it runs.
	*/
	liveValue() {
		const { state } = this;
		if (state === "running" || state === "paused") return this.sample(this.elapsed());
	}
	/**
	* WAAPI doesn't natively have any interruption capabilities.
	*
	* Rather than read committed styles back out of the DOM, we can
	* sample a renderless JS animation twice to calculate its current
	* value, "previous" value, and therefore allow Motion to calculate
	* velocity for any subsequent animation.
	*/
	updateMotionValue(value) {
		const { motionValue, element, name } = this.options;
		if (!motionValue) return;
		if (value !== void 0) {
			motionValue.set(value);
			return;
		}
		const { speed } = this;
		const sampleTime = this.elapsed();
		const delta = this.state === "running" && speed ? clamp(0, 10, sampleTime) : 0;
		const current = this.sample(sampleTime);
		/**
		* Write the estimated value to inline style so it persists
		* after cancel(), covering the async gap before the next
		* animation starts.
		*/
		if (element && name) setStyle(element, name, current);
		motionValue.setWithVelocity(this.sample(sampleTime - delta * Math.sign(speed)), current, delta / Math.abs(speed || 1));
	}
};
// node_modules/motion-dom/dist/es/animation/utils/is-animatable.mjs
/**
* Check if a value is animatable. Examples:
*
* ✅: 100, "100px", "#fff"
* ❌: "block", "url(2.jpg)"
* @param value
*
* @internal
*/
var isAnimatable = (value, name) => {
	if (name === "zIndex") return false;
	if (typeof value === "number" || Array.isArray(value)) return true;
	if (typeof value === "string" && (complex.test(value) || value === "0") && !value.startsWith("url(")) return true;
	return false;
};
// node_modules/motion-dom/dist/es/animation/utils/can-animate.mjs
function hasKeyframesChanged(keyframes) {
	const current = keyframes[0];
	if (keyframes.length === 1) return true;
	for (let i = 0; i < keyframes.length; i++) if (keyframes[i] !== current) return true;
}
function canAnimate(keyframes, name, type, velocity) {
	/**
	* Check if we're able to animate between the start and end keyframes,
	* and throw a warning if we're attempting to animate between one that's
	* animatable and another that isn't.
	*/
	const originKeyframe = keyframes[0];
	if (originKeyframe === null) return false;
	/**
	* These aren't traditionally animatable but we do support them.
	* In future we could look into making this more generic or replacing
	* this function with mix() === mixImmediate
	*/
	if (name === "display" || name === "visibility") return true;
	const targetKeyframe = keyframes[keyframes.length - 1];
	const isOriginAnimatable = isAnimatable(originKeyframe, name);
	const isTargetAnimatable = isAnimatable(targetKeyframe, name);
	if (!isOriginAnimatable || !isTargetAnimatable) {
		isOriginAnimatable !== isTargetAnimatable && process.env.NODE_ENV !== "production" && warning(false, `You are trying to animate ${name} from "${originKeyframe}" to "${targetKeyframe}". "${isOriginAnimatable ? targetKeyframe : originKeyframe}" is not an animatable value.`, "value-not-animatable");
		return false;
	}
	return hasKeyframesChanged(keyframes) || (type === "spring" || isGenerator(type)) && velocity;
}
// node_modules/motion-dom/dist/es/animation/utils/make-animation-instant.mjs
function makeAnimationInstant(options) {
	options.duration = 0;
	options.type = "keyframes";
}
// node_modules/motion-dom/dist/es/animation/waapi/utils/accelerated-values.mjs
/**
* A list of values that can be hardware-accelerated.
*
* Colors aren't included: WAAPI mixes them in sRGB, but JS animations
* (and the sampler that estimates a WAAPI value on interrupt) mix them
* in linear color space, so interrupting one would visibly jump.
*/
var acceleratedValues = /* @__PURE__ */ new Set([
	"opacity",
	"clipPath",
	"filter",
	"transform"
]);
// node_modules/motion-dom/dist/es/animation/waapi/utils/is-browser-color.mjs
var browserColorFunctions = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function hasBrowserOnlyColors(keyframes) {
	for (let i = 0; i < keyframes.length; i++) if (typeof keyframes[i] === "string" && browserColorFunctions.test(keyframes[i])) return true;
	return false;
}
// node_modules/motion-dom/dist/es/animation/waapi/utils/needs-mixer.mjs
/**
* Whether an animation needs its mixer, which WAAPI can't call. Numbers
* blend as usual, and an animation whose mixer declines every pair runs
* as it would without one.
*/
var needsMixer = ({ mixer, keyframes }) => mixer && typeof keyframes[0] !== "number" && keyframes.some((keyframe, i) => i && mixer(keyframes[i - 1], keyframe));
// node_modules/motion-dom/dist/es/animation/waapi/supports/waapi.mjs
var colorProperties = /* @__PURE__ */ new Set([
	"color",
	"backgroundColor",
	"outlineColor",
	"fill",
	"stroke",
	"borderColor",
	"borderTopColor",
	"borderRightColor",
	"borderBottomColor",
	"borderLeftColor"
]);
/**
* WAAPI runs on the browser's clock, so on a manual clock every animation
* runs in JS where processFrame can drive it. Set the flag before starting
* animations: running WAAPI animations stay on the browser's clock.
*/
var supportsWaapi = () => !MotionGlobalConfig.useManualTiming && Object.hasOwnProperty.call(Element.prototype, "animate");
function supportsBrowserAnimation(options) {
	const { motionValue, name, repeatDelay, repeatType, damping, type, keyframes } = options;
	/**
	* Most values can't be accelerated at all, so check the name before
	* looking at the element or its props.
	*/
	if (!name || !(acceleratedValues.has(name) || colorProperties.has(name))) return false;
	const subject = motionValue?.owner?.current;
	/**
	* We use instanceof checks instead of isHTMLElement()/isSVGElement()
	* because we explicitly **don't** want elements in different timing
	* contexts (i.e. popups) to be accelerated, as it's not possible to sync
	* these animations properly with those driven from the main window
	* frameloop.
	*/
	if (!(subject instanceof HTMLElement) && !(subject instanceof SVGElement)) return false;
	const { onUpdate, transformTemplate } = motionValue.owner.getProps();
	return supportsWaapi() && (acceleratedValues.has(name) || colorProperties.has(name) && hasBrowserOnlyColors(keyframes)) && (name !== "transform" || !transformTemplate) && !onUpdate && !repeatDelay && repeatType !== "mirror" && damping !== 0 && type !== "inertia" && !needsMixer(options);
}
// node_modules/motion-dom/dist/es/value/types/utils/get-as-type.mjs
/**
* Provided a value and a ValueType, returns the value as that value type.
*/
var getValueAsType = (value, type) => {
	return type && typeof value === "number" ? type.transform(value) : value;
};
// node_modules/motion-dom/dist/es/render/html/utils/build-transform.mjs
var translateAlias = {
	x: "translateX",
	y: "translateY",
	z: "translateZ",
	transformPerspective: "perspective"
};
transformPropOrder.length;
/**
* Cache of `translateX(`-style openers so each transform function is a few
* string concatenations rather than a template.
*/
var openers = {};
/**
* A transform function, e.g. `translateX(10px)` for `x: 10`.
*/
var transformFunction = (key, value, valueAsType = getValueAsType(value, transformValueTypes[key])) => (openers[key] || (openers[key] = (translateAlias[key] || key) + "(")) + valueAsType + ")";
/**
* Whether a transform value is at its default, so can be left out.
*/
var isDefaultTransform = (key, value) => (typeof value === "number" ? value : parseFloat(value)) === (key.startsWith("scale") ? 1 : 0);
// node_modules/motion-dom/dist/es/animation/waapi/transforms/groups.mjs
var transformGroups = /* @__PURE__ */ new WeakMap();
// node_modules/motion-dom/dist/es/animation/waapi/transforms/TransformAnimation.mjs
/**
* Sample at the interruption sampling rate, up to a cap for long
* animations.
*/
var maxSamples = 200;
/**
* How far values may stray from the WAAPI animation: as a fraction of
* each value's change when they share an easing, otherwise in px or deg,
* or for scale.
*/
var easingTolerance = .001;
var sampleTolerance = .1;
var scaleTolerance = .001;
/**
* If an outside write, or a seek the WAAPI animation can't follow,
* happens again within this window, the group is being driven every
* frame (scrubbing, drag), which is cheaper on the main thread than
* rebuilding the WAAPI animation every frame.
*/
var churnWindow = 100;
/**
* Named easings that are the same cubic-bezier in JS and CSS.
*/
var isNativeEasing = (ease) => /^(linear|ease(In|Out|InOut))$/.test(ease);
/**
* Whether two eased progresses match. False if either is NaN.
*/
var isNear = (a, b) => Math.abs(a - b) <= easingTolerance;
var byTime = (a, b) => a - b;
/**
* n + 1 evenly spaced timestamps, from one timestamp to another.
*/
var spread = (from, to, n) => defaultOffset(Array(n + 1)).map((p) => mixNumber$1(from, to, p));
var getOwner = (options) => options.motionValue.owner;
var getGroup = (element) => transformGroups.get(element);
/**
* Whether an animation has ended, so can leave its group.
*/
var hasEnded = ({ state }) => state === "idle" || state === "finished";
var read = (owner, key) => owner.latestValues ? owner.latestValues[key] : owner.getValue(key)?.get();
/**
* Whether this animation should join its element's transform group.
* Animations that can't be accelerated still join, so the group knows
* to stay on the main thread while they run. Browsers without linear()
* easing stay on the main thread.
*/
var canGroupTransform = ({ name, motionValue }) => name && transformPropOrder.includes(name) && motionValue?.owner?.current instanceof HTMLElement && supportsWaapi() && supportsLinearEasing();
function canAccelerateTransform(options) {
	const owner = getOwner(options);
	const { onUpdate, transformTemplate } = owner.getProps();
	return !options.isHandoff && !onUpdate && !options.hasOnUpdate && !transformTemplate && options.type !== "inertia" && (read(owner, "transform") || "none") === "none" && !read(owner, "pathRotation") && !owner.projection?.isProjecting() && !needsMixer(options);
}
var TransformAnimation = class extends JSAnimation {
	constructor(options) {
		const element = getOwner(options).current;
		const { driver = frameloopDriver } = options;
		let animation;
		/**
		* Before JSAnimation replaces the type with its generator.
		*/
		const canAccelerate = canAccelerateTransform(options);
		/**
		* The driver ticks on the main thread only once the group has
		* moved there. Until then, starting or stopping tells the group to
		* update its WAAPI animation.
		*/
		options.driver = (update) => {
			const js = driver(update);
			return {
				js,
				now: js.now,
				start: (keepAlive = true) => {
					const group = getGroup(element);
					/**
					* keepAlive is false when seeking. Seeking the WAAPI
					* animation is free, but if a seek needs a rebuild and
					* keeps happening, the group moves to the main thread.
					*/
					!group || group.isJS ? js.start(keepAlive) : group.schedule(false, !keepAlive);
				},
				stop: () => {
					js.stop();
					const group = getGroup(element);
					group && !group.isFinishing && group.release(animation);
				}
			};
		};
		super(options);
		animation = this;
		this.canAccelerate = canAccelerate;
		/**
		* stop is bound in JSAnimation, so wrap it rather than override.
		* Before stopping, set the motion value to where the WAAPI
		* animation is now, with velocity, for the next animation to
		* start from.
		*/
		const { stop } = this;
		this.stop = () => {
			this.isAccelerated() && this.sync();
			stop();
		};
	}
	get group() {
		return getGroup(getOwner(this.options).current);
	}
	get js() {
		return this.driver?.js;
	}
	get name() {
		return this.options.name;
	}
	/**
	* When this stops moving, or, if it repeats forever, when it starts
	* repeating, and how long each repeat takes. Held (paused, or at
	* speed 0) animations never stop moving.
	*/
	timing() {
		const { startTime, speed, totalDuration } = this;
		const { delay = 0, repeatType } = this.options;
		return this.holdTime !== null ? [Infinity, 0] : totalDuration === Infinity ? [startTime + delay / speed, this.resolvedDuration * (repeatType === "loop" ? 1 : 2) / speed || 1] : [startTime + (delay + totalDuration) / speed, 0];
	}
	/**
	* Whether this is running, or paused, on the compositor.
	*/
	isAccelerated() {
		const { group, state } = this;
		return group?.tracks.has(this) && !group.isJS && this.canAccelerate && (state === "running" || state === "paused");
	}
	/**
	* The value now, while this runs on the compositor and so doesn't
	* set its motion value every frame.
	*/
	liveValue() {
		return this.isAccelerated() ? this.sampleAt(time.now()) : void 0;
	}
	/**
	* If this is a two-keyframe tween whose easing WAAPI runs exactly,
	* when it starts and stops moving, and that easing.
	*/
	tween() {
		const { keyframes: keyframes$1, type, ease, times, repeat, delay = 0 } = this.options;
		const easing = /* @__PURE__ */ isBezierDefinition(ease) ? cubicBezierAsString(ease) : isNativeEasing(ease) && supportedWaapiEasing[ease];
		if (easing && !repeat && !times && keyframes$1.length === 2 && type === keyframes && this.holdTime === null) {
			const start = this.startTime + delay / this.speed;
			return [
				start,
				start + this.resolvedDuration / this.speed,
				easing
			];
		}
	}
	/**
	* The timestamps between two timestamps where this reaches a
	* keyframe or starts a repeat, where it can turn or jump.
	*/
	boundaries(from, to) {
		const { startTime, speed, resolvedDuration, options } = this;
		const { delay = 0, repeat = 0, repeatDelay = 0, repeatType, times, keyframes: keyframes$1, type } = options;
		const offsets = (type || keyframes) === keyframes ? times || defaultOffset(keyframes$1) : [0, 1];
		const start = startTime + delay / speed;
		const result = [];
		if (this.holdTime !== null || !(resolvedDuration > 0)) return result;
		for (let i = Math.max(0, Math.floor((from - start) * speed / resolvedDuration)); i <= repeat; i++) {
			const iterationStart = start + i * resolvedDuration / speed;
			if (iterationStart > to) break;
			for (const offset of offsets) {
				const t = iterationStart + (i % 2 && repeatType && repeatType !== "loop" ? 1 - offset : offset) * (resolvedDuration - repeatDelay) / speed;
				t > from && t < to && result.push(t);
			}
		}
		return result;
	}
	/**
	* The value at a timestamp, as a number.
	*/
	numberAt(timestamp) {
		return parseFloat(this.sampleAt(timestamp, true));
	}
	/**
	* Write the current value, and velocity, to the motion value.
	*/
	sync() {
		const now = time.now();
		this.options.motionValue.setWithVelocity(this.sampleAt(now - 10, true), this.sampleAt(now, true), 10);
	}
	play() {
		/**
		* A stopped animation (one that was interrupted) can't play again,
		* so it mustn't join the group.
		*/
		if (this.isStopped) return;
		(this.group || createGroup(getOwner(this.options))).tracks.add(this);
		super.play();
	}
	pause() {
		super.pause();
		if (this.isAccelerated()) {
			this.sync();
			this.group.schedule(false);
		}
	}
	/**
	* JSAnimation finishes on its next tick, which only happens on the
	* main thread, so finish now.
	*/
	complete() {
		super.complete();
		const { group } = this;
		group && !group.isJS && this.canAccelerate && this.tick(time.now());
	}
	/**
	* Without a tick to rebase it, a held time still includes the delay,
	* so take it off here, as a JS animation does on its next tick.
	*/
	get time() {
		if (this.isAccelerated()) return /* @__PURE__ */ millisecondsToSeconds(clamp(0, this.totalDuration, this.at(time.now()) - (this.options.delay || 0)));
		return super.time;
	}
	/**
	* A JS animation sets its motion value from a seek on its next tick.
	* This doesn't tick, so set it now, rather than leave it to be set
	* when this next stops.
	*/
	set time(newTime) {
		super.time = newTime;
		this.isAccelerated() && this.sync();
	}
	/**
	* Scroll timelines set time every frame, so run these on the main
	* thread.
	*/
	attachTimeline(timeline) {
		this.canAccelerate = false;
		this.group?.demote(true);
		return super.attachTimeline(timeline);
	}
};
function createGroup(owner) {
	const element = owner.current;
	const tracks = /* @__PURE__ */ new Set();
	const byKey = /* @__PURE__ */ new Map();
	/**
	* Transforms that aren't animating, as built into the WAAPI animation.
	*/
	let statics = {};
	/**
	* The transforms in the WAAPI animation, in order.
	*/
	let keys = [];
	let built = /* @__PURE__ */ new Map();
	let segments = [];
	let needsBuild = false;
	let isScheduled = false;
	let isEnded = false;
	let hasChurned = false;
	let lastChurn = -Infinity;
	const has = (key) => {
		for (const track of tracks) if (track.name === key) return true;
	};
	/**
	* The transform values at a timestamp or, without one, from the
	* motion values. Animations that don't repeat forever are sampled no
	* earlier than settled, so a loop that starts from an earlier cycle
	* boundary holds them at their end.
	*/
	const valuesAt = (timestamp, settled) => {
		const values = {};
		for (const key of timestamp === void 0 ? transformPropOrder : keys) {
			const track = byKey.get(key);
			const value = timestamp === void 0 ? read(owner, key) : track ? track.sampleAt(settled > timestamp && !track.timing()[1] ? settled : timestamp) : statics[key];
			if (value !== void 0) values[key] = value;
		}
		return values;
	};
	/**
	* Build a transform from values in transformPropOrder. For a keyframe,
	* every key is written, even at its default, so each keyframe has the
	* same list of functions and the browser interpolates them one by one.
	* As an inline style, defaults are left out, as buildTransform does.
	*/
	const toTransform = (values, isStyle) => {
		let transform = "";
		for (const key in values) {
			const value = values[key];
			if (!isStyle || !isDefaultTransform(key, value)) transform += transformFunction(key, value) + " ";
		}
		return (isStyle ? transform.trim() : transform) || "none";
	};
	/**
	* Build the transform at a timestamp.
	*/
	const compose = (timestamp, settled) => toTransform(valuesAt(timestamp, settled));
	/**
	* Write the transform as an inline style, as the renderer would.
	*/
	const commit = (values = valuesAt()) => {
		element.style.transform = toTransform(values, true);
	};
	/**
	* Cancel the WAAPI animations, by default first committing the
	* transform. The renderer writes its own version on its next render.
	*/
	const stop = (shouldCommit = true) => {
		shouldCommit && commit();
		segments.forEach(({ animation }) => animation.cancel());
		segments = [];
	};
	/**
	* A WAAPI animation that add() starts by setting its startTime. Playing
	* it first, as element.animate() does, would leave WebKit holding that
	* play's ready time once startTime ends the play, and it uses that for
	* the next updatePlaybackRate(), so the animation would jump.
	*/
	const create = (keyframes, options) => new Animation(new KeyframeEffect(element, keyframes, options));
	const add = (animation, offset, end = Infinity) => {
		const segment = {
			animation,
			offset,
			end
		};
		animation.startTime = time.now() + offset;
		/**
		* Animations finish when the WAAPI animation reaches their end.
		* Once a loop has taken over, the finished animation isn't needed.
		*/
		if (end < Infinity) animation.onfinish = () => {
			segment.isDone = true;
			if (segments.some((s) => s.end === Infinity)) {
				animation.cancel();
				segments = segments.filter((s) => s !== segment);
			}
			group.schedule(false);
		};
		/**
		* Something else cancelled it, so carry on on the main thread.
		*/
		animation.oncancel = () => segments.includes(segment) && group.demote();
		segments.push(segment);
	};
	/**
	* Where a value jumps between two timestamps, as when a repeat starts
	* again: the timestamps either side of the jump, or none if it moves
	* there continuously.
	*/
	const jumpAt = (value, a, b) => {
		const change = (x, y) => Math.abs(value(y) - value(x));
		const size = change(a, b);
		while (b - a > .01) {
			const mid = (a + b) / 2;
			change(a, mid) > change(mid, b) ? b = mid : a = mid;
		}
		return change(a, b) > size / 2 ? [a, b] : [];
	};
	/**
	* If every moving animation follows the same eased progress between
	* two timestamps, the easing that describes it.
	*/
	const getEasing = (moving, from, to, bounds) => {
		const samples = Math.min(maxSamples, Math.max(2, Math.ceil((to - from) / 10)));
		/**
		* Too many keyframes or repeats to follow with this many samples.
		*/
		if (bounds.length * 4 > samples) return;
		const at = spread(from, to, samples).concat(bounds).sort(byTime);
		const position = (t) => /* @__PURE__ */ progress(from, to, t);
		let shared;
		let progressAt;
		for (const track of moving) {
			const first = track.numberAt(from);
			const changes = at.map((t) => track.numberAt(t) - first);
			const end = changes[changes.length - 1];
			/**
			* A value that ends only a tiny way from where it started, as
			* a round trip does if it's built just after it starts, or
			* from a float residue, ends where it started. Dividing by
			* that tiny range would stretch the easing to values the
			* compositor can't render.
			*/
			const range = changes.some((change) => Math.abs(change) * easingTolerance > Math.abs(end)) ? 0 : end;
			const progress = changes.map((change) => range ? change / range : change);
			/**
			* The first value that moves sets the easing, and every other
			* one must follow it. A value that doesn't change, like one
			* still in its delay, fits any easing. One that changes but
			* ends where it started fits none.
			*/
			if (range && !shared) {
				shared = progress;
				progressAt = (t) => (track.numberAt(t) - first) / range;
			} else if (progress.some((p, i) => !isNear(p, range && shared[i]))) return;
		}
		if (!shared || shared.every((p, i) => isNear(p, position(at[i])))) return "linear";
		/**
		* A repeat that starts again jumps back, which takes two points at
		* the same position.
		*/
		const points = [];
		const point = (t, p = progressAt(t)) => points.push(round(p) + " " + round(position(t) * 100) + "%");
		shared.forEach((p, i) => {
			i && Math.abs(p - shared[i - 1]) > .2 && jumpAt(progressAt, at[i - 1], at[i]).forEach((t) => point(t));
			point(at[i], p);
		});
		return "linear(" + points + ")";
	};
	/**
	* Sample timestamps between two timestamps, closer together where the
	* moving animations curve.
	*/
	const sample = (moving, from, to, bounds) => {
		const times = [from];
		/**
		* Values that aren't numbers, like calc(), are left to the
		* browser to interpolate.
		*/
		const isStraight = (a, b) => moving.every((track) => !(Math.abs(track.numberAt((a + b) / 2) - (track.numberAt(a) + track.numberAt(b)) / 2) > (track.name.startsWith("scale") ? scaleTolerance : sampleTolerance)));
		const split = (a, b, depth) => {
			if (b - a < 1 || isStraight(a, b)) times.push(b);
			else if (depth < 4) {
				split(a, (a + b) / 2, depth + 1);
				split((a + b) / 2, b, depth + 1);
			} else {
				/**
				* Keyframes either side of a jump, like a repeat starting
				* again, so it doesn't play as a quick sweep.
				*/
				for (const track of moving) times.push(...jumpAt((t) => track.numberAt(t), a, b));
				times.push(b);
			}
		};
		/**
		* Split at least every 100ms, and at every keyframe and repeat,
		* either side of where a value can jump.
		*/
		const ends = spread(from, to, Math.ceil((to - from) / 100));
		for (const t of bounds) ends.push(t, Math.min(t + .01, to));
		let start = from;
		for (const end of ends.sort(byTime)) {
			end > start && split(start, end, 0);
			start = end;
		}
		return times.sort(byTime);
	};
	/**
	* If every moving animation is the same tween, started together, as
	* happens for the values of one animate() call or transition, when
	* they move and their native easing.
	*/
	const getTween = (moving) => {
		let shared;
		for (const track of moving) {
			const tween = track.tween();
			if (!tween || shared?.some((v, i) => i < 2 ? Math.abs(tween[i] - v) > 1 : tween[i] !== v)) return;
			shared = tween;
		}
		return shared;
	};
	/**
	* A WAAPI animation of the composed transform between two timestamps.
	*/
	const run = (moving, from, to, nativeEasing, options = { fill: "both" }, settled) => {
		const bounds = moving.flatMap((track) => track.boundaries(from, to));
		const easing = nativeEasing || getEasing(moving, from, to, bounds);
		const times = easing ? [from, to] : sample(moving, from, to, bounds);
		const transform = times.map((t) => compose(t, settled));
		let keyframes = { transform };
		if (!easing) keyframes.offset = times.map((t) => /* @__PURE__ */ progress(from, to, t));
		/**
		* If nothing moves, don't hold a transform, which, even at its
		* default, would make the element a containing block. The empty
		* animation still finishes the animations.
		*/
		if (transform.every((t) => t === transform[0])) {
			commit(valuesAt(from, settled));
			keyframes = null;
		}
		return create(keyframes, {
			...options,
			duration: to - from,
			easing: easing || "linear"
		});
	};
	/**
	* Replace the WAAPI animations with ones built from now. Returns
	* undefined if the animations can't be composed.
	*/
	const animate = (now) => {
		/**
		* The finite part runs until the last finite animation (or the
		* last delay) ends. Infinitely repeating animations then continue
		* as one looping WAAPI animation, which needs them to share a
		* cycle.
		*/
		let end = now;
		let cycle = 0;
		let cycleStart = 0;
		const moving = [];
		const looping = [];
		const ends = /* @__PURE__ */ new Set();
		byKey.clear();
		built = /* @__PURE__ */ new Map();
		for (const track of tracks) {
			byKey.set(track.name, track);
			const [trackEnd, trackCycle] = track.timing();
			const isHeld = trackEnd === Infinity;
			built.set(track, [
				track.at(now),
				track.speed,
				isHeld
			]);
			/**
			* Held animations don't move, so keep their motion values up
			* to date, as a JSAnimation would on a seek.
			*/
			if (isHeld) {
				track.sync();
				continue;
			}
			if (track.speed < 0) return;
			if (trackCycle) {
				if (cycle) {
					const phase = (trackEnd - cycleStart) / trackCycle;
					if (Math.abs(trackCycle - cycle) > 1 || Math.abs(phase - Math.round(phase)) * cycle > 1) return;
				} else {
					cycle = trackCycle;
					cycleStart = trackEnd;
				}
				looping.push(track);
			} else ends.add(trackEnd);
			moving.push(track);
			end = Math.max(end, trackEnd);
		}
		statics = {};
		/**
		* Transforms that aren't animating are left out at their default.
		*/
		keys = transformPropOrder.filter((key) => {
			if (byKey.has(key)) return true;
			const value = statics[key] = read(owner, key);
			return value !== void 0 && !isDefaultTransform(key, value);
		});
		stop(false);
		/**
		* Values that share one tween are one WAAPI animation of it, with
		* two keyframes and its own easing, from when they started.
		*/
		const tween = !cycle && getTween(moving);
		try {
			if (tween && tween[1] > now) {
				const [from, to, easing] = tween;
				add(run(moving, from, to, easing), from - now, to - from);
			} else if (end > now) {
				add(run(moving, now, end), 0, end - now);
				/**
				* Animations that end sooner finish on the events of
				* empty animations that end with them.
				*/
				ends.forEach((trackEnd) => trackEnd < end - 1 && add(create(null, { duration: trackEnd - now }), 0, trackEnd - now));
			}
			if (cycle) {
				/**
				* Build one cycle from a cycle boundary, so it repeats
				* seamlessly, and start it part way through.
				*/
				const from = cycleStart + Math.floor((end - cycleStart) / cycle) * cycle;
				add(run(looping, from, from + cycle, void 0, {
					iterations: Infinity,
					iterationStart: (end - from) / cycle,
					/**
					* It must not fill backwards over the finite part
					* that runs before it.
					*/
					fill: "forwards"
				}, end), end - now);
			}
		} catch {
			return;
		}
		/**
		* Everything is held, so hold it with an inline style instead.
		*/
		segments.length || stop();
		return true;
	};
	/**
	* If every animation has been paused, played, seeked or sped up
	* together since the WAAPI animation was built, do the same to it.
	* Returns false if it needs rebuilding instead.
	*/
	const retime = (now) => {
		let elapsed;
		let rate = 0;
		for (const track of tracks) {
			const state = built.get(track);
			if (!state) return false;
			const [builtTime, builtSpeed, wasHeld] = state;
			const trackTime = track.at(now);
			const isHeld = track.timing()[0] === Infinity;
			if (wasHeld) {
				if (isHeld && trackTime === builtTime) continue;
				return false;
			}
			const trackElapsed = (trackTime - builtTime) / builtSpeed;
			const trackRate = isHeld ? 0 : track.speed / builtSpeed;
			if (elapsed === void 0) {
				elapsed = trackElapsed;
				rate = trackRate;
			} else if (Math.abs(trackElapsed - elapsed) > 1 || trackRate !== rate) return false;
		}
		if (elapsed === void 0) return true;
		if (!segments.length) return false;
		for (const { offset, end, isDone } of segments) {
			const local = elapsed - offset;
			if (end < Infinity && (isDone ? local < end - 1 : local < 0 || local >= end)) return false;
		}
		for (const { animation, offset, isDone } of segments) {
			if (isDone) continue;
			const local = elapsed - offset;
			if (rate && animation.updatePlaybackRate && animation.playState === "running" && Math.abs(Number(animation.currentTime) - local) < 20)
 /**
			* Only the speed changed. Setting playbackRate and
			* startTime restarts a running compositor animation, which
			* can render the underlying value for a frame.
			*/
			animation.playbackRate !== rate && animation.updatePlaybackRate(rate);
			else if (rate) {
				animation.playbackRate = rate;
				animation.startTime = now - local / rate;
			} else {
				/**
				* Hold it without pause(), whose pending pause setting
				* currentTime would end at once, leaving WebKit holding its
				* ready time (see create()).
				*/
				animation.startTime = null;
				animation.currentTime = local;
			}
		}
		return true;
	};
	/**
	* If no animations are left, write where they got to and cancel the
	* WAAPI animations. Returns whether the group ended.
	*/
	const end = () => {
		if (tracks.size) return false;
		isEnded = true;
		/**
		* The element may have a newer group if this one was detached
		* (see handOffElementState).
		*/
		getGroup(element) === group && transformGroups.delete(element);
		group.isJS || stop();
		return true;
	};
	const build = () => {
		const now = time.now();
		/**
		* Finish the animations that have reached their end, which the
		* WAAPI animation has already rendered.
		*/
		if (!group.isJS) {
			group.isFinishing = true;
			tracks.forEach((track) => {
				const [trackEnd, trackCycle] = track.timing();
				if (track.state === "running" && track.speed > 0 && !trackCycle && trackEnd <= now + 1) {
					track.complete();
					/**
					* From now it's checked for outside writes like any
					* other static transform. If the WAAPI animation never
					* rendered it (it was instant), rebuild with its value.
					*/
					statics[track.name] = read(owner, track.name);
					built.has(track) || (needsBuild = true);
				}
			});
			group.isFinishing = false;
		}
		isScheduled = false;
		if (isEnded) return;
		tracks.forEach((track) => hasEnded(track) && tracks.delete(track));
		if (end()) return;
		for (const track of tracks) if (!track.canAccelerate) return group.demote(true);
		/**
		* Everything that kept the group on the main thread has finished,
		* so move the remaining animations back to the compositor.
		*/
		if (group.isJS) {
			group.isJS = false;
			needsBuild = true;
			tracks.forEach((track) => track.js?.stop());
		}
		const shouldBuild = needsBuild;
		const churned = hasChurned;
		needsBuild = hasChurned = false;
		if (shouldBuild || !retime(now)) {
			if (churned) {
				if (now - lastChurn < churnWindow) return group.demote();
				lastChurn = now;
			}
			if (!animate(now)) return group.demote();
		}
	};
	const group = {
		tracks,
		isJS: false,
		isFinishing: false,
		schedule(build_, isChurn) {
			if (isEnded) return;
			needsBuild || (needsBuild = build_);
			hasChurned || (hasChurned = !!isChurn);
			/**
			* Build in this frame's render step, so it's in place before
			* anything reads the DOM in postRender, or straight after the
			* current task outside of a frame.
			*/
			if (!isScheduled) {
				isScheduled = true;
				frameData.isProcessing ? frame.render(build, false, true) : queueMicrotask(build);
			}
		},
		/**
		* End the group now, rather than when it next builds, so the
		* element's transform is the caller's again as soon as its last
		* animation is stopped.
		*/
		release(track) {
			/**
			* Only drop the stopped animation. Others can be idle because
			* they're part way through play(), and are about to run.
			*/
			hasEnded(track) && tracks.delete(track);
			end() || group.schedule(true);
		},
		/**
		* An outside write. Rebuild once, but if it keeps happening, move
		* to the main thread.
		*/
		check() {
			if (group.isJS) return;
			for (const key in statics) if (read(owner, key) !== statics[key] && !has(key)) return group.schedule(true, true);
		},
		demote(canReturn) {
			if (group.isJS || isEnded) return;
			/**
			* Unless only another animation is holding the group on the
			* main thread, these animations stay there until they end.
			*/
			tracks.forEach((track) => {
				track.isAccelerated() && track.sync();
				canReturn || (track.canAccelerate = false);
			});
			group.isJS = true;
			built = /* @__PURE__ */ new Map();
			stop();
			tracks.forEach((track) => track.state === "running" && track.js?.start());
			return true;
		}
	};
	transformGroups.set(element, group);
	return group;
}
// node_modules/motion-dom/dist/es/animation/AsyncMotionValueAnimation.mjs
var AsyncMotionValueAnimation = class extends WithPromise {
	constructor(options) {
		super();
		/**
		* Bound to support return animation.stop pattern
		*/
		this.stop = () => {
			if (this._animation) {
				this._animation.stop();
				this.stopTimeline?.();
			}
			this.keyframeResolver?.cancel();
		};
		this.createdAt = time.now();
		const { keyframes, name, motionValue, element } = options;
		/**
		* animateMotionValue builds a fresh options object per value, so
		* it's completed in place as keyframes resolve rather than copied.
		*/
		const optionsWithDefaults = options;
		optionsWithDefaults.autoplay ?? (optionsWithDefaults.autoplay = true);
		optionsWithDefaults.delay ?? (optionsWithDefaults.delay = 0);
		optionsWithDefaults.type ?? (optionsWithDefaults.type = "keyframes");
		optionsWithDefaults.repeat ?? (optionsWithDefaults.repeat = 0);
		optionsWithDefaults.repeatDelay ?? (optionsWithDefaults.repeatDelay = 0);
		optionsWithDefaults.repeatType ?? (optionsWithDefaults.repeatType = "loop");
		const KeyframeResolver$1 = element?.KeyframeResolver || KeyframeResolver;
		this.keyframeResolver = new KeyframeResolver$1(keyframes, (resolvedKeyframes, finalKeyframe, forced) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe, optionsWithDefaults, !forced), name, motionValue, element);
		this.keyframeResolver?.scheduleResolve();
	}
	onKeyframesResolved(keyframes, finalKeyframe, options, sync) {
		this.keyframeResolver = void 0;
		const { name, type, velocity, delay, isHandoff, onUpdate } = options;
		this.resolvedAt = time.now();
		/**
		* If we can't animate this value with the resolved keyframes
		* then we should complete it immediately.
		*/
		const canAnimateValue = canAnimate(keyframes, name, type, velocity);
		if (!canAnimateValue) {
			if (MotionGlobalConfig.instantAnimations || !delay) onUpdate?.(getFinalKeyframe(keyframes, options, finalKeyframe));
			keyframes[0] = keyframes[keyframes.length - 1];
			makeAnimationInstant(options);
			options.repeat = 0;
		}
		const { onComplete } = options;
		options.finalKeyframe = finalKeyframe;
		options.keyframes = keyframes;
		/**
		* JSAnimation and NativeAnimation call onComplete exactly when
		* their own `finished` resolves, so this replaces a promise chain
		* per value with a callback.
		*/
		options.onComplete = () => {
			onComplete?.();
			this.notifyFinished();
		};
		/**
		* Animate via WAAPI if possible. If this is a handoff animation, the optimised animation will be running via
		* WAAPI. Therefore, this animation must be JS to ensure it runs "under" the
		* optimised animation.
		*
		* Also skip WAAPI when keyframes aren't animatable, as the resolved
		* values may not be valid CSS and would trigger browser warnings.
		*/
		const useWaapi = canAnimateValue && !isHandoff && supportsBrowserAnimation(options);
		/**
		* Independent transforms (x, scale etc) on an HTML element are
		* composed into one WAAPI transform animation per element.
		*/
		const isGroupedTransform = !useWaapi && canGroupTransform(options);
		/**
		* Resolve startTime for the animation. A startTime passed in options
		* (an optimised appear handoff syncing to its WAAPI animation) takes
		* precedence.
		*
		* *Ideally*, we would use the createdAt time as t=0 as the following
		* frame would then be the first frame of the animation in progress,
		* which would feel snappier. If keyframes resolved on a later frame,
		* and long after creation, we start from then instead.
		*
		* If they resolved immediately, a JSAnimation picks its own start
		* time and resolves it the same way on its first frame, so every
		* animation started in that moment stays in sync. WAAPI has no frame
		* of ours to do that on.
		*/
		if (sync && (useWaapi || isGroupedTransform || this.resolvedAt !== this.createdAt)) options.startTime ?? (options.startTime = resolveStartTime(this.createdAt, this.resolvedAt));
		let animation;
		if (useWaapi) {
			/**
			* The resolver needed the VisualElement, WAAPI needs the DOM
			* element. JSAnimation reads neither, so this is safe to
			* leave in place if we fall back to it.
			*/
			options.element = options.motionValue?.owner?.current;
			try {
				animation = new NativeAnimationExtended(options);
			} catch {
				animation = new JSAnimation(options);
			}
		} else if (isGroupedTransform) animation = new TransformAnimation(options);
		else animation = new JSAnimation(options);
		if (this.pendingTimeline) {
			this.stopTimeline = animation.attachTimeline(this.pendingTimeline);
			this.pendingTimeline = void 0;
		}
		this._animation = animation;
	}
	get finished() {
		return this._animation ? this._animation.finished : super.finished;
	}
	then(onResolve, _onReject) {
		return this.finished.finally(onResolve).then(() => {});
	}
	/**
	* The value now, if the animation runs on the compositor.
	*/
	liveValue() {
		return this._animation?.liveValue?.();
	}
	get animation() {
		if (!this._animation) {
			this.keyframeResolver?.resume();
			flushKeyframeResolvers();
		}
		return this._animation;
	}
	get duration() {
		return this.animation.duration;
	}
	get iterationDuration() {
		return this.animation.iterationDuration;
	}
	get time() {
		return this.animation.time;
	}
	set time(newTime) {
		this.animation.time = newTime;
	}
	get speed() {
		return this.animation.speed;
	}
	get state() {
		return this.animation.state;
	}
	set speed(newSpeed) {
		this.animation.speed = newSpeed;
	}
	get startTime() {
		return this.animation.startTime;
	}
	attachTimeline(timeline) {
		if (this._animation) this.stopTimeline = this.animation.attachTimeline(timeline);
		else this.pendingTimeline = timeline;
		return () => this.stop();
	}
	play() {
		this.animation.play();
	}
	pause() {
		this.animation.pause();
	}
	complete() {
		this.animation.complete();
	}
	cancel() {
		this._animation?.cancel();
		this.keyframeResolver?.cancel();
	}
};
// node_modules/motion-dom/dist/es/animation/GroupAnimation.mjs
var GroupAnimation = class {
	constructor(animations) {
		this.stop = () => this.runAll("stop");
		this.animations = animations.filter(Boolean);
	}
	get finished() {
		return Promise.all(this.animations.map((animation) => animation.finished));
	}
	/**
	* TODO: Filter out cancelled or stopped animations before returning
	*/
	getAll(propName) {
		return this.animations[0][propName];
	}
	setAll(propName, newValue) {
		for (let i = 0; i < this.animations.length; i++) this.animations[i][propName] = newValue;
	}
	attachTimeline(timeline) {
		const subscriptions = this.animations.map((animation) => animation.attachTimeline(timeline));
		return () => {
			subscriptions.forEach((cancel, i) => {
				cancel && cancel();
				this.animations[i].stop();
			});
		};
	}
	get time() {
		return this.getAll("time");
	}
	set time(time) {
		this.setAll("time", time);
	}
	get speed() {
		return this.getAll("speed");
	}
	set speed(speed) {
		this.setAll("speed", speed);
	}
	get state() {
		return this.getAll("state");
	}
	get startTime() {
		return this.getAll("startTime");
	}
	get duration() {
		return getMax(this.animations, "duration");
	}
	get iterationDuration() {
		return getMax(this.animations, "iterationDuration");
	}
	runAll(methodName) {
		this.animations.forEach((controls) => controls[methodName]());
	}
	play() {
		this.runAll("play");
	}
	pause() {
		this.runAll("pause");
	}
	cancel() {
		this.runAll("cancel");
	}
	complete() {
		this.runAll("complete");
	}
};
function getMax(animations, propName) {
	let max = 0;
	for (let i = 0; i < animations.length; i++) {
		const value = animations[i][propName];
		if (value !== null && value > max) max = value;
	}
	return max;
}
// node_modules/motion-dom/dist/es/animation/GroupAnimationWithThen.mjs
var GroupAnimationWithThen = class extends GroupAnimation {
	then(onResolve, _onReject) {
		return this.finished.finally(onResolve).then(() => {});
	}
};
// node_modules/motion-dom/dist/es/value/index.mjs
/**
* Maximum time between the value of two frames, beyond which we
* assume the velocity has since been 0.
*/
var MAX_VELOCITY_DELTA = 30;
var isFloat = (value) => {
	return !isNaN(parseFloat(value));
};
var collectMotionValues = { current: void 0 };
/**
* `MotionValue` is used to track the state and velocity of motion values.
*
* @public
*/
var MotionValue = class {
	/**
	* @param init - The initiating value
	* @param config - Optional configuration options
	*
	* -  `transformer`: A function to transform incoming values with.
	*/
	constructor(init, options = {}) {
		/**
		* Tracks whether this value can output a velocity. Currently this is only true
		* if the value is numerical, but we might be able to widen the scope here and support
		* other value types.
		*
		* @internal
		*/
		this.canTrackVelocity = null;
		/**
		* An object containing a SubscriptionManager for each active event.
		*/
		this.events = {};
		this.updateAndNotify = (v) => {
			const currentTime = time.now();
			/**
			* If we're updating the value during another frame or eventloop
			* than the previous frame, then the we set the previous frame value
			* to current.
			*/
			if (this.updatedAt !== currentTime) this.setPrevFrameValue();
			this.prev = this.current;
			this.setCurrent(v);
			if (this.current !== this.prev) {
				this.dirty();
				if (this.dependents) for (const dependent of this.dependents) dependent.dirty();
			}
		};
		this.hasAnimated = false;
		this.setCurrent(init);
		this.owner = options.owner;
	}
	setCurrent(current) {
		this.current = current;
		this.updatedAt = time.now();
		if (this.canTrackVelocity === null && current !== void 0) this.canTrackVelocity = isFloat(this.current);
	}
	setPrevFrameValue(prevFrameValue = this.current) {
		this.prevFrameValue = prevFrameValue;
		this.prevUpdatedAt = this.updatedAt;
	}
	/**
	* Adds a function that will be notified when the `MotionValue` is updated.
	*
	* It returns a function that, when called, will cancel the subscription.
	*
	* When calling `onChange` inside a React component, it should be wrapped with the
	* `useEffect` hook. As it returns an unsubscribe function, this should be returned
	* from the `useEffect` function to ensure you don't add duplicate subscribers..
	*
	* ```jsx
	* export const MyComponent = () => {
	*   const x = useMotionValue(0)
	*   const y = useMotionValue(0)
	*   const opacity = useMotionValue(1)
	*
	*   useEffect(() => {
	*     function updateOpacity() {
	*       const maxXY = Math.max(x.get(), y.get())
	*       const newOpacity = transform(maxXY, [0, 100], [1, 0])
	*       opacity.set(newOpacity)
	*     }
	*
	*     const unsubscribeX = x.on("change", updateOpacity)
	*     const unsubscribeY = y.on("change", updateOpacity)
	*
	*     return () => {
	*       unsubscribeX()
	*       unsubscribeY()
	*     }
	*   }, [])
	*
	*   return <motion.div style={{ x }} />
	* }
	* ```
	*
	* @param subscriber - A function that receives the latest value.
	* @returns A function that, when called, will cancel this subscription.
	*
	* @deprecated
	*/
	onChange(subscription) {
		if (process.env.NODE_ENV !== "production") warnOnce(false, `value.onChange(callback) is deprecated. Switch to value.on("change", callback).`);
		return this.on("change", subscription);
	}
	on(eventName, callback) {
		var _a;
		if (eventName === "change") return this.onChangeSubscribe(callback);
		return ((_a = this.events)[eventName] || (_a[eventName] = new SubscriptionManager())).add(callback);
	}
	onChangeSubscribe(callback) {
		const { events } = this;
		if (!events.change && !this.changeSubscriber) this.changeSubscriber = callback;
		else {
			if (!events.change) {
				events.change = new SubscriptionManager();
				events.change.add(this.changeSubscriber);
				this.changeSubscriber = void 0;
			}
			events.change.add(callback);
		}
		return () => {
			if (this.changeSubscriber === callback) this.changeSubscriber = void 0;
			else events.change?.remove(callback);
			this.stopIfUnobserved();
		};
	}
	/**
	* If we have no more change listeners by the start
	* of the next frame, stop active animations.
	*/
	stopIfUnobserved() {
		frame.read(() => {
			if (!this.changeSubscriber && !this.events.change?.getSize()) this.stop();
		});
	}
	clearListeners() {
		this.changeSubscriber = void 0;
		for (const eventManagers in this.events) this.events[eventManagers].clear();
	}
	/**
	* Attaches a passive effect to the `MotionValue`.
	*/
	attach(passiveEffect, stopPassiveEffect) {
		this.passiveEffect = passiveEffect;
		this.stopPassiveEffect = stopPassiveEffect;
	}
	/**
	* Sets the state of the `MotionValue`.
	*
	* @remarks
	*
	* ```jsx
	* const x = useMotionValue(0)
	* x.set(10)
	* ```
	*
	* @param latest - Latest value to set.
	* @param render - Whether to notify render subscribers. Defaults to `true`
	*
	* @public
	*/
	set(v) {
		this.passiveEffect ? this.passiveEffect(v, this.updateAndNotify) : this.updateAndNotify(v);
	}
	setWithVelocity(prev, current, delta) {
		this.set(current);
		this.prev = void 0;
		this.prevFrameValue = prev;
		this.prevUpdatedAt = this.updatedAt - delta;
	}
	/**
	* Set the state of the `MotionValue`, stopping any active animations,
	* effects, and resets velocity to `0`.
	*/
	jump(v, endAnimation = true) {
		if (endAnimation) {
			/**
			* Stop first, as stopping a running animation can set the
			* value it's showing, which would replace v. Marking the value
			* as updated now skips a JS animation's catch-up tick on stop,
			* which could otherwise complete it.
			*/
			this.updatedAt = time.now();
			this.stop();
		}
		this.updateAndNotify(v);
		this.prev = v;
		this.prevUpdatedAt = this.prevFrameValue = void 0;
		this.stopPassiveEffect?.();
	}
	dirty() {
		const { current, changeSubscriber } = this;
		/**
		* One or the other exists. Subscribing during the direct
		* subscriber's call moves it into a new manager, which must not
		* then be notified for the same change.
		*/
		if (changeSubscriber) changeSubscriber(current);
		else this.events.change?.notify(current);
	}
	addDependent(dependent) {
		(this.dependents || (this.dependents = /* @__PURE__ */ new Set())).add(dependent);
	}
	removeDependent(dependent) {
		this.dependents?.delete(dependent);
	}
	/**
	* Returns the latest state of `MotionValue`
	*
	* @returns - The latest state of `MotionValue`
	*
	* @public
	*/
	get() {
		collectMotionValues.current?.push(this);
		/**
		* A value animating on the compositor isn't updated every frame,
		* so read it from its animation.
		*/
		const sampled = this.animation?.liveValue?.();
		return sampled === void 0 ? this.current : sampled;
	}
	/**
	* The value as last set. Unlike get(), this doesn't read an animation
	* running on the compositor, which renders the value itself.
	*/
	getCurrent() {
		return this.current;
	}
	/**
	* @public
	*/
	getPrevious() {
		return this.prev;
	}
	/**
	* Returns the latest velocity of `MotionValue`
	*
	* @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
	*
	* @public
	*/
	getVelocity() {
		const currentTime = time.now();
		if (!this.canTrackVelocity || this.prevFrameValue === void 0 || currentTime - this.updatedAt > MAX_VELOCITY_DELTA) return 0;
		const delta = Math.min(this.updatedAt - this.prevUpdatedAt, MAX_VELOCITY_DELTA);
		return /* @__PURE__ */ velocityPerSecond(parseFloat(this.current) - parseFloat(this.prevFrameValue), delta);
	}
	/**
	* Registers a new animation to control this `MotionValue`. Only one
	* animation can drive a `MotionValue` at one time.
	*
	* ```jsx
	* value.start()
	* ```
	*
	* @param animation - A function that starts the provided animation
	*/
	start(startAnimation) {
		this.stop();
		return new Promise((resolve) => {
			this.hasAnimated = true;
			/**
			* Complete synchronously via the callback rather than chaining a
			* second promise per animation. Guard against animations that
			* complete before startAnimation has returned.
			*/
			let isComplete = false;
			let animation;
			animation = startAnimation(() => {
				isComplete = true;
				this.events.animationComplete?.notify();
				if (this.animation === animation) this.animation = void 0;
				resolve();
			});
			if (!isComplete) this.animation = animation;
			this.events.animationStart?.notify();
		});
	}
	/**
	* Stop the currently active animation.
	*
	* @public
	*/
	stop() {
		if (this.animation) {
			this.animation.stop();
			this.events.animationCancel?.notify();
		}
		this.animation = void 0;
	}
	/**
	* Returns `true` if this value is currently animating.
	*
	* @public
	*/
	isAnimating() {
		return !!this.animation;
	}
	/**
	* Destroy and clean up subscribers to this `MotionValue`.
	*
	* The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
	* handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
	* created a `MotionValue` via the `motionValue` function.
	*
	* @public
	*/
	destroy() {
		this.dependents?.clear();
		this.events.destroy?.notify();
		this.clearListeners();
		this.stop();
		this.stopPassiveEffect?.();
	}
};
function motionValue(init, options) {
	return new MotionValue(init, options);
}
// node_modules/motion-dom/dist/es/animation/utils/resolve-transition.mjs
/**
* If `transition` has `inherit: true`, shallow-merge it with
* `parentTransition` (child keys win) and strip the `inherit` key.
* Otherwise return `transition` unchanged.
*/
function resolveTransition(transition, parentTransition) {
	if (transition?.inherit && parentTransition) {
		const { inherit: _, ...rest } = transition;
		return {
			...parentTransition,
			...rest
		};
	}
	return transition;
}
// node_modules/motion-dom/dist/es/animation/utils/get-value-transition.mjs
function getValueTransition$1(transition, key) {
	const valueTransition = transition?.[key] ?? transition?.["default"] ?? transition;
	if (valueTransition !== transition) return resolveTransition(valueTransition, transition);
	return valueTransition;
}
// node_modules/motion-dom/dist/es/animation/utils/default-transitions.mjs
var underDampedSpring = {
	type: "spring",
	stiffness: 500,
	damping: 25,
	restSpeed: 10
};
var criticallyDampedSpring = (target) => ({
	type: "spring",
	stiffness: 550,
	damping: target === 0 ? 2 * Math.sqrt(550) : 30,
	restSpeed: 10
});
var keyframesTransition = {
	type: "keyframes",
	duration: .8
};
/**
* Default easing curve is a slightly shallower version of
* the default browser easing curve.
*/
var ease = {
	type: "keyframes",
	ease: [
		.25,
		.1,
		.35,
		1
	],
	duration: .3
};
var getDefaultTransition = (valueKey, { keyframes }) => {
	if (keyframes.length > 2) return keyframesTransition;
	else if (transformProps.has(valueKey)) return valueKey.startsWith("scale") ? criticallyDampedSpring(keyframes[1]) : underDampedSpring;
	return ease;
};
// node_modules/motion-dom/dist/es/animation/utils/is-transition-defined.mjs
var orchestrationKeys = /* @__PURE__ */ new Set([
	"when",
	"delay",
	"delayChildren",
	"staggerChildren",
	"staggerDirection",
	"repeat",
	"repeatType",
	"repeatDelay",
	"from",
	"elapsed",
	"out",
	"mixer"
]);
/**
* Decide whether a transition is defined on a given Transition.
* This filters out orchestration options and returns true
* if any options are left.
*/
function isTransitionDefined(transition) {
	for (const key in transition) if (!orchestrationKeys.has(key)) return true;
	return false;
}
// node_modules/motion-dom/dist/es/animation/interfaces/motion-value.mjs
var animateMotionValue = (name, value, target, transition = {}, element, isHandoff) => (onComplete) => {
	const valueTransition = getValueTransition$1(transition, name) || {};
	/**
	* Most transition values are currently completely overwritten by value-specific
	* transitions. In the future it'd be nicer to blend these transitions. But for now
	* delay actually does inherit from the root transition if not value-specific.
	*/
	const delay = valueTransition.delay || transition.delay || 0;
	/**
	* Elapsed isn't a public transition option but can be passed through from
	* optimized appear effects in milliseconds.
	*/
	let { elapsed = 0 } = transition;
	elapsed = elapsed - /* @__PURE__ */ secondsToMilliseconds(delay);
	const options = {
		keyframes: Array.isArray(target) ? target : [null, target],
		ease: "easeOut",
		velocity: value.getVelocity(),
		...valueTransition,
		delay: -elapsed,
		onUpdate: (v) => {
			value.set(v);
			valueTransition.onUpdate && valueTransition.onUpdate(v);
		},
		onComplete: () => {
			onComplete();
			valueTransition.onComplete && valueTransition.onComplete();
		},
		name,
		motionValue: value,
		element: isHandoff ? void 0 : element,
		hasOnUpdate: !!valueTransition.onUpdate
	};
	/**
	* If there's no transition defined for this value, we can generate
	* unique transition settings for this value.
	*/
	if (!isTransitionDefined(valueTransition)) Object.assign(options, getDefaultTransition(name, options));
	/**
	* Both WAAPI and our internal animation functions use durations
	* as defined by milliseconds, while our external API defines them
	* as seconds.
	*/
	options.duration && (options.duration = /* @__PURE__ */ secondsToMilliseconds(options.duration));
	options.repeatDelay && (options.repeatDelay = /* @__PURE__ */ secondsToMilliseconds(options.repeatDelay));
	/**
	* Support deprecated way to set initial value. Prefer keyframe syntax.
	*/
	if (options.from !== void 0) options.keyframes[0] = options.from;
	let shouldSkip = false;
	if (options.type === false || options.duration === 0 && !options.repeatDelay) {
		makeAnimationInstant(options);
		if (options.delay === 0) shouldSkip = true;
	}
	if (MotionGlobalConfig.instantAnimations || MotionGlobalConfig.skipAnimations || element?.shouldSkipAnimations || valueTransition.skipAnimations) {
		shouldSkip = true;
		makeAnimationInstant(options);
		options.delay = 0;
	}
	/**
	* If the transition type or easing has been explicitly set by the user
	* then we don't want to allow flattening the animation.
	*/
	options.allowFlatten = !valueTransition.type && !valueTransition.ease;
	/**
	* If we can or must skip creating the animation, and apply only
	* the final keyframe, do so. We also check once keyframes are resolved but
	* this early check prevents the need to create an animation at all.
	*/
	if (shouldSkip && !isHandoff && value.get() !== void 0) {
		const finalKeyframe = getFinalKeyframe(options.keyframes, valueTransition);
		if (finalKeyframe !== void 0) {
			frame.update(() => {
				options.onUpdate(finalKeyframe);
				options.onComplete();
			});
			return;
		}
	}
	return valueTransition.isSync ? new JSAnimation(options) : new AsyncMotionValueAnimation(options);
};
// node_modules/motion-dom/dist/es/animation/utils/css-variables-conversion.mjs
/**
* Parse Framer's special CSS variable format into a CSS token and a fallback.
*
* ```
* `var(--foo, #fff)` => [`--foo`, '#fff']
* ```
*
* @param current
*/
var splitCSSVariableRegex = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function parseCSSVariable(current) {
	const match = splitCSSVariableRegex.exec(current);
	if (!match) return [,];
	const [, token1, token2, fallback] = match;
	return [`--${token1 ?? token2}`, fallback];
}
var maxDepth = 4;
function getVariableValue(current, element, depth = 1) {
	process.env.NODE_ENV !== "production" && invariant(depth <= maxDepth, `Max CSS variable fallback depth detected in property "${current}". This may indicate a circular fallback dependency.`, "max-css-var-depth");
	const [token, fallback] = parseCSSVariable(current);
	if (!token) return;
	const resolved = window.getComputedStyle(element).getPropertyValue(token);
	if (resolved) {
		const trimmed = resolved.trim();
		return isNumericalString(trimmed) ? parseFloat(trimmed) : trimmed;
	}
	return isCSSVariableToken(fallback) ? getVariableValue(fallback, element, depth + 1) : fallback;
}
// node_modules/motion-dom/dist/es/render/utils/keys-position.mjs
var positionalKeys = /* @__PURE__ */ new Set([
	"width",
	"height",
	"top",
	"left",
	"right",
	"bottom",
	...transformPropOrder
]);
// node_modules/motion-dom/dist/es/value/utils/is-motion-value.mjs
var isMotionValue = (value) => Boolean(value && value.getVelocity);
// node_modules/motion-dom/dist/es/value/types/auto.mjs
/**
* ValueType for "auto"
*/
var auto = {
	test: (v) => v === "auto",
	parse: (v) => v
};
// node_modules/motion-dom/dist/es/value/types/test.mjs
/**
* Tests a provided value against a ValueType
*/
var testValueType = (v) => (type) => type.test(v);
// node_modules/motion-dom/dist/es/value/types/dimensions.mjs
/**
* A list of value types commonly used for dimensions
*/
var dimensionValueTypes = [
	number,
	px,
	percent,
	degrees,
	vw,
	vh,
	auto
];
/**
* Tests a dimensional value against the list of dimension ValueTypes
*/
var findDimensionValueType = (v) => dimensionValueTypes.find(testValueType(v));
// node_modules/motion-dom/dist/es/animation/keyframes/utils/is-none.mjs
function isNone(value) {
	if (typeof value === "number") return value === 0;
	else if (value !== null) return value === "none" || value === "0" || isZeroValueString(value);
	else return true;
}
// node_modules/motion-dom/dist/es/animation/keyframes/utils/make-none-animatable.mjs
/**
* If we encounter keyframes like "none" or "0" and we also have keyframes like
* "#fff" or "200px 200px" we want to find a keyframe to serve as a template for
* the "none" keyframes. In this case "#fff" or "200px 200px" - then these get turned into
* zero equivalents, i.e. "#fff0" or "0px 0px".
*/
var invalidTemplates = /* @__PURE__ */ new Set([
	"auto",
	"none",
	"0"
]);
function makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name) {
	let i = 0;
	let animatableTemplate = void 0;
	while (i < unresolvedKeyframes.length && !animatableTemplate) {
		const keyframe = unresolvedKeyframes[i];
		if (typeof keyframe === "string" && !invalidTemplates.has(keyframe) && hasComplexValues(keyframe)) animatableTemplate = unresolvedKeyframes[i];
		i++;
	}
	if (animatableTemplate && name) for (const noneIndex of noneKeyframeIndexes) {
		/**
		* A zero-valued template like "0%" is already its own
		* animatable none, so there's nothing to derive.
		*/
		if (unresolvedKeyframes[noneIndex] === animatableTemplate) continue;
		unresolvedKeyframes[noneIndex] = getAnimatableNone(name, animatableTemplate);
	}
}
// node_modules/motion-dom/dist/es/animation/keyframes/DOMKeyframesResolver.mjs
var DOMKeyframesResolver = class extends KeyframeResolver {
	constructor() {
		super(...arguments);
		this.isAsync = true;
	}
	/**
	* Keyframes that don't need reading from the DOM, or measuring,
	* resolve straight away rather than in the frame loop's batched read.
	*/
	scheduleResolve() {
		if (this.canReadNow()) {
			this.readKeyframes();
			if (!this.needsMeasurement) return this.complete();
		}
		super.scheduleResolve();
	}
	canReadNow() {
		const { unresolvedKeyframes, element, motionValue } = this;
		const origin = unresolvedKeyframes[0] ?? motionValue?.get();
		if (!element?.current || origin === void 0) return false;
		for (let i = 0; i < unresolvedKeyframes.length; i++) if (containsCSSVariable(i ? unresolvedKeyframes[i] : origin)) return false;
		return true;
	}
	readKeyframes() {
		const { unresolvedKeyframes, element, name } = this;
		if (!element?.current) return;
		super.readKeyframes();
		/**
		* If any keyframe is a CSS variable, we need to find its value by sampling the element
		*/
		for (let i = 0; i < unresolvedKeyframes.length; i++) {
			let keyframe = unresolvedKeyframes[i];
			if (typeof keyframe === "string") {
				keyframe = keyframe.trim();
				if (isCSSVariableToken(keyframe)) {
					const resolved = getVariableValue(keyframe, element.current);
					if (resolved !== void 0) unresolvedKeyframes[i] = resolved;
					if (i === unresolvedKeyframes.length - 1) this.finalKeyframe = keyframe;
				}
			}
		}
		/**
		* Resolve "none" values. We do this potentially twice - once before and once after measuring keyframes.
		* This could be seen as inefficient but it's a trade-off to avoid measurements in more situations, which
		* have a far bigger performance impact.
		*/
		this.resolveNoneKeyframes();
		/**
		* Check to see if unit type has changed. If so schedule jobs that will
		* temporarily set styles to the destination keyframes.
		* Skip if we have more than two keyframes or this isn't a positional value.
		* TODO: We can throw if there are multiple keyframes and the value type changes.
		*/
		if (!positionalKeys.has(name) || unresolvedKeyframes.length !== 2) return;
		const [origin, target] = unresolvedKeyframes;
		if (typeof origin === "number" && typeof target === "number") return;
		const originType = findDimensionValueType(origin);
		const targetType = findDimensionValueType(target);
		if (containsCSSVariable(origin) !== containsCSSVariable(target) && positionalValues[name]) {
			this.needsMeasurement = true;
			return;
		}
		/**
		* Either we don't recognise these value types or we can animate between them.
		*/
		if (originType === targetType) return;
		/**
		* If both values are numbers or pixels, we can animate between them by
		* converting them to numbers.
		*/
		if (isNumOrPxType(originType) && isNumOrPxType(targetType)) for (let i = 0; i < unresolvedKeyframes.length; i++) {
			const value = unresolvedKeyframes[i];
			if (typeof value === "string") unresolvedKeyframes[i] = parseFloat(value);
		}
		else if (positionalValues[name])
 /**
		* Else, the only way to resolve this is by measuring the element.
		*/
		this.needsMeasurement = true;
	}
	resolveNoneKeyframes() {
		const { unresolvedKeyframes, name } = this;
		const noneKeyframeIndexes = [];
		for (let i = 0; i < unresolvedKeyframes.length; i++) if (unresolvedKeyframes[i] === null || isNone(unresolvedKeyframes[i])) noneKeyframeIndexes.push(i);
		if (noneKeyframeIndexes.length) makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name);
	}
	measure() {
		const { element, name } = this;
		return positionalValues[name](window.getComputedStyle(element.current), () => element.measureViewportBox());
	}
	measureInitialState() {
		const { element, unresolvedKeyframes, name } = this;
		if (!element?.current) return;
		if (name === "height") this.suspendedScrollY = window.pageYOffset;
		this.measuredOrigin = this.measure();
		unresolvedKeyframes[0] = this.measuredOrigin;
		const measureKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
		if (measureKeyframe !== void 0) this.motionValue?.jump(measureKeyframe, false);
	}
	measureEndState() {
		const { element, unresolvedKeyframes } = this;
		if (!element?.current) return;
		this.motionValue?.jump(this.measuredOrigin, false);
		const finalKeyframeIndex = unresolvedKeyframes.length - 1;
		const finalKeyframe = unresolvedKeyframes[finalKeyframeIndex];
		unresolvedKeyframes[finalKeyframeIndex] = this.measure();
		if (finalKeyframe !== null && this.finalKeyframe === void 0) this.finalKeyframe = finalKeyframe;
		this.resolveNoneKeyframes();
	}
};
// node_modules/motion-dom/dist/es/animation/animate/effects.mjs
/**
* Effects registered via `animate.addEffect()`, most recent first.
*/
var effects = [];
function addEffect(effect) {
	process.env.NODE_ENV !== "production" && invariant(typeof effect.test === "function" && typeof effect.read === "function", "Effects passed to animate.addEffect() need test() and read().", "effect-missing-test");
	removeEffect(effect);
	effects.unshift(effect);
}
function removeEffect(effect) {
	removeItem(effects, effect);
}
function findEffect(subject) {
	return effects.find((effect) => effect.test(subject));
}
/**
* Animate each key in `keyframes` on the motion value `getValue` returns
* for it. `element` is what the keyframe resolver uses to read, render
* and measure the subject when the effect defers resolution to it.
*/
function animateValues(getValue, keyframes, transition = {}, element) {
	const animations = [];
	const { velocity, path } = transition;
	const reduceMotion = transition.reduceMotion ?? element?.shouldReduceMotion;
	/**
	* Only elements have x/y to move along a path. path claims them by
	* deleting them, so hand it a copy.
	*/
	if (path?.animateValues && element) {
		keyframes = { ...keyframes };
		path.animateValues(getValue, keyframes, transition, 0, animations);
	}
	for (const key in keyframes) {
		if (key === "transition" || key === "transitionEnd") continue;
		const target = keyframes[key];
		if (target === void 0) continue;
		const value = getValue(key);
		/**
		* If the value is already at the defined target, skip the animation.
		* We still re-assert the value via frame.update to take precedence
		* over any stale transitionEnd callbacks from previous animations.
		*/
		const current = value.get();
		if (current !== void 0 && !value.isAnimating() && !Array.isArray(target) && target === current && !velocity) {
			frame.update(() => value.set(target));
			continue;
		}
		value.start(animateMotionValue(key, value, target, reduceMotion && positionalKeys.has(key) ? { type: false } : transition, element));
		value.animation && animations.push(value.animation);
	}
	const { transitionEnd } = keyframes;
	if (transitionEnd) {
		const applyTransitionEnd = () => frame.update(() => {
			for (const key in transitionEnd) getValue(key).set(transitionEnd[key]);
		});
		animations.length ? Promise.all(animations).then(applyTransitionEnd) : applyTransitionEnd();
	}
	return animations;
}
/**
* Animate the keys of `subject` via `effect`. Motion values are created on
* first animation and bound to the subject through the effect for the
* rest of its life.
*
* Without `element`, a new value is seeded synchronously from the first
* keyframe or `effect.read()`. With it, the value starts undefined and the
* keyframe resolver reads the subject (batched, with unit conversion by
* measurement) via `element`.
*/
function animateEffectSubject(effect, subject, keyframes, transition, element) {
	return animateValues((key) => {
		let value = effect.get(subject, key);
		if (!value) {
			let initial;
			if (!element) {
				const target = keyframes[key];
				initial = firstKeyframe(target) ?? effect.read(subject, key, target);
				process.env.NODE_ENV !== "production" && invariant(initial !== void 0, `"${key}" can't be read from the animated subject. Provide [from, to] keyframes.`, "effect-unreadable-value");
			}
			value = motionValue(initial, { owner: element });
			effect(subject, { [key]: value });
		}
		return value;
	}, keyframes, transition, element);
}
function firstKeyframe(target) {
	const first = Array.isArray(target) ? target[0] : void 0;
	return first === null ? void 0 : first;
}
// node_modules/motion-dom/dist/es/utils/is-html-element.mjs
/**
* Checks if an element is an HTML element in a way
* that works across iframes
*/
function isHTMLElement(element) {
	return isObject(element) && "offsetHeight" in element && !("ownerSVGElement" in element);
}
// node_modules/motion-dom/dist/es/utils/is-svg-element.mjs
/**
* Checks if an element is an SVG element in a way
* that works across iframes
*/
function isSVGElement(element) {
	return isObject(element) && "ownerSVGElement" in element;
}
// node_modules/motion-dom/dist/es/scope/active.mjs
var activeScope = {};
// node_modules/motion-dom/dist/es/utils/resolve-elements.mjs
function resolveElements(elementOrSelector, scope, selectorCache) {
	if (elementOrSelector == null) return [];
	if (elementOrSelector instanceof EventTarget) return [elementOrSelector];
	else if (typeof elementOrSelector === "string") {
		const root = scope ? scope.current : activeScope.current?.root || document;
		const elements = selectorCache?.[elementOrSelector] ?? root.querySelectorAll(elementOrSelector);
		return elements ? Array.from(elements) : [];
	}
	return Array.from(elementOrSelector).filter((element) => element != null);
}
// node_modules/motion-dom/dist/es/effects/MotionValueState.mjs
var MotionValueState = class {
	/**
	* @param step - The frameloop step renders are scheduled in. Defaults
	* to `frame.render`. Effects that feed a render loop running in
	* `frame.render` (GPU scenes) should write in `frame.preRender`.
	*/
	constructor(step = frame.render) {
		this.step = step;
		this.values = /* @__PURE__ */ new Map();
		/**
		* Renders scheduled for the next flush, usually one or two (values
		* bound to the same computed render, e.g. `x` and `y` to `transform`,
		* share an entry). Tracked with a count rather than truncating the
		* array so no backing store is reallocated every frame. Kept per
		* state so pending writes can be flushed synchronously before the
		* subject is measured.
		*/
		this.pending = [];
		this.numPending = 0;
		/**
		* Run the pending renders. Resetting the count first means a render
		* scheduled while flushing lands in the next frame, as with the
		* frameloop itself.
		*/
		this.flush = () => {
			const { pending, numPending } = this;
			this.numPending = 0;
			for (let i = 0; i < numPending; i++) pending[i]();
		};
	}
	/**
	* @param render - Writes the value to the subject. Renders read the
	* motion value directly rather than a cached copy, so there is one
	* place a value lives.
	* @param computed - A value already in this state (e.g. `transform`)
	* whose render should run whenever `value` changes.
	*/
	set(name, value, render, computed) {
		this.values.get(name)?.onRemove();
		if (computed) {
			for (const entry of this.values.values()) if (entry.value === computed) render = entry.render;
		}
		const onChange = () => render && this.schedule(render);
		/**
		* Values created ahead of a DOM read start out undefined and
		* have nothing to render until they're set.
		*/
		value.get() !== void 0 && onChange();
		const cancelOnChange = value.on("change", onChange);
		const onRemove = () => {
			cancelOnChange();
			render && !computed && this.cancel(render);
			/**
			* A later set() of the same name has already removed this
			* entry, so leave the one that replaced it.
			*/
			this.values.get(name)?.onRemove === onRemove && this.values.delete(name);
		};
		this.values.set(name, {
			value,
			render: computed ? void 0 : render,
			onRemove
		});
		return onRemove;
	}
	get(name) {
		return this.values.get(name)?.value;
	}
	/**
	* Detach every value from this state and return them, so another
	* renderer can take them over. The state stays cached by its effect,
	* so the bound transforms are reset too rather than leaking into
	* values bound later.
	*/
	release() {
		const values = /* @__PURE__ */ new Map();
		this.values.forEach((entry, name) => {
			values.set(name, entry.value);
			entry.onRemove();
		});
		this.transformKeys = this.transformValues = void 0;
		return values;
	}
	schedule(render) {
		const { pending, numPending } = this;
		for (let i = 0; i < numPending; i++) if (pending[i] === render) return;
		numPending || this.step(this.flush);
		pending[this.numPending++] = render;
	}
	cancel(render) {
		const { pending } = this;
		for (let i = 0; i < this.numPending; i++) if (pending[i] === render) {
			pending[i] = pending[--this.numPending];
			return;
		}
	}
};
// node_modules/motion-dom/dist/es/effects/utils/create-effect.mjs
function createEffect(addValue, { step, ...options } = {}) {
	const stateCache = /* @__PURE__ */ new WeakMap();
	const effect = (subject, values) => {
		const state = stateCache.get(subject) ?? new MotionValueState(step);
		stateCache.set(subject, state);
		const subscriptions = [];
		for (const key in values) {
			const value = values[key];
			const remove = addValue(subject, state, key, value);
			subscriptions.push(remove);
		}
		return () => {
			for (const cancel of subscriptions) cancel();
		};
	};
	return Object.assign(effect, options, {
		get: (subject, key) => stateCache.get(subject)?.get(key),
		flush: (subject) => stateCache.get(subject)?.flush(),
		state: (subject) => stateCache.get(subject)
	});
}
// node_modules/motion-dom/dist/es/effects/style/transform.mjs
function buildTransform(state) {
	let transform = "";
	const { transformKeys: keys = [], transformValues: values = {} } = state;
	/**
	* Loop over the bound transforms in order, adding the ones that
	* aren't at their default value to the transform string.
	*/
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const value = values[key].getCurrent();
		if (value === void 0) continue;
		if (!isDefaultTransform(key, value)) transform += (transform && " ") + transformFunction(key, value);
	}
	const pathRotation = state.get("pathRotation")?.get();
	if (pathRotation) transform += (transform && " ") + transformFunction("rotate", pathRotation);
	return transform || "none";
}
// node_modules/motion-dom/dist/es/effects/style/index.mjs
var originProps = /* @__PURE__ */ new Set([
	"originX",
	"originY",
	"originZ"
]);
/**
* A bound value in its default unit, e.g. `originX: 50` -> `"50%"`.
*/
var styleValue = (state, key) => getValueAsType(state.get(key)?.get(), numberValueTypes[key]);
var addStyleValue = (element, state, key, value) => {
	let render = void 0;
	let computed = void 0;
	if (transformProps.has(key)) {
		if (key !== "pathRotation") {
			const keys = state.transformKeys ?? (state.transformKeys = []);
			(state.transformValues ?? (state.transformValues = {}))[key] = value;
			if (!keys.includes(key)) {
				keys.push(key);
				keys.sort((a, b) => transformPropOrder.indexOf(a) - transformPropOrder.indexOf(b));
			}
		}
		if (!state.get("transform")) {
			if (!isHTMLElement(element) && !state.get("transformBox")) addStyleValue(element, state, "transformBox", new MotionValue("fill-box"));
			state.set("transform", new MotionValue("none"), () => {
				transformGroups.get(element)?.check();
				element.style.transform = buildTransform(state);
			});
		}
		computed = state.get("transform");
	} else if (originProps.has(key)) {
		if (!state.get("transformOrigin")) state.set("transformOrigin", new MotionValue(""), () => {
			const originX = styleValue(state, "originX") ?? "50%";
			const originY = styleValue(state, "originY") ?? "50%";
			const originZ = styleValue(state, "originZ") ?? 0;
			element.style.transformOrigin = `${originX} ${originY} ${originZ}`;
		});
		computed = state.get("transformOrigin");
	} else if (isCSSVar(key)) render = () => {
		element.style.setProperty(key, value.getCurrent());
	};
	else render = () => {
		element.style[key] = getValueAsType(value.getCurrent(), numberValueTypes[key]);
	};
	return state.set(key, value, render, computed);
};
var isStyleSubject = (subject) => isHTMLElement(subject) || isSVGElement(subject);
/**
* Reads the current value of a style from the element, as the initial
* keyframe when `animate()` targets an element via this effect. Transforms
* are parsed out of the computed matrix; everything else is the computed
* style. Units aren't converted to match the target keyframes. A style
* the browser can't report is 0, as a VisualElement reports it.
*/
var readStyleValue = (element, key) => {
	if (transformProps.has(key)) return readTransformValue(element, key);
	const computedStyle = getComputedStyle(element);
	const value = isCSSVar(key) ? computedStyle.getPropertyValue(key) : computedStyle[key];
	return typeof value === "string" && value.trim() || 0;
};
/**
* The per-element effect `animate()` binds through, so HTML values share
* state with a direct `styleEffect()` call. The exported `styleEffect`
* is this wrapped to also accept selectors.
*/
var styleSubjectEffect = /*@__PURE__*/ createEffect(addStyleValue, {
	test: isStyleSubject,
	read: readStyleValue
});
// node_modules/motion-dom/dist/es/render/dom/utils/camel-to-dash.mjs
function camelToDash(str) {
	return str.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
}
// node_modules/motion-dom/dist/es/render/svg/utils/build-attrs.mjs
/**
* Values rendered via style rather than as attributes. This must include
* every value WAAPI can accelerate, as WAAPI writes its final value to
* style, which would otherwise override later attribute writes.
*/
var cssStyleProperties = [
	"transform",
	"opacity",
	"clipPath",
	"filter",
	"offsetDistance",
	"offsetPath",
	"offsetRotate",
	"offsetAnchor"
];
// node_modules/motion-dom/dist/es/effects/attr/index.mjs
function canSetAsProperty(element, name) {
	if (!(name in element)) return false;
	const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), name) || Object.getOwnPropertyDescriptor(element, name);
	return descriptor && typeof descriptor.set === "function";
}
/**
* `name` is the attribute written when it differs from the key the value
* is stored under, e.g. `attrX` -> `x`. Numbers take the attribute's
* default unit (`x: 100` -> `"100px"`), as they do when key and name match.
*/
var addAttrValue = (element, state, key, value, name = key) => {
	const isProp = canSetAsProperty(element, name);
	if (!isProp && (name.startsWith("data") || name.startsWith("aria"))) name = camelToDash(name);
	const type = numberValueTypes[key] || numberValueTypes[name];
	/**
	* Set attribute directly via property if available
	*/
	const render = isProp ? () => {
		element[name] = getValueAsType(value.get(), numberValueTypes[key]);
	} : () => {
		const v = getValueAsType(value.get(), type);
		if (v === null || v === void 0) element.removeAttribute(name);
		else element.setAttribute(name, String(v));
	};
	return state.set(key, value, render);
};
// node_modules/motion-dom/dist/es/effects/svg/index.mjs
function addSVGPathValue(element, state, key, value) {
	frame.render(() => element.setAttribute("pathLength", "1"));
	if (key === "pathOffset") return state.set(key, value, () => {
		const offset = value.get();
		element.setAttribute("stroke-dashoffset", `${-offset}`);
	});
	else {
		if (!state.get("stroke-dasharray")) state.set("stroke-dasharray", new MotionValue("1 1"), () => {
			const pathLength = state.get("pathLength")?.get() ?? 1;
			const pathSpacing = state.get("pathSpacing")?.get();
			element.setAttribute("stroke-dasharray", `${pathLength} ${pathSpacing ?? 1 - Number(pathLength)}`);
		});
		return state.set(key, value, void 0, state.get("stroke-dasharray"));
	}
}
var addSVGValue = (element, state, key, value) => {
	if (key.startsWith("path") && !transformProps.has(key)) return addSVGPathValue(element, state, key, value);
	else if (key.startsWith("attr")) return addAttrValue(element, state, key, value, convertAttrKey(key));
	else if (key === "d")
 /**
	* `d` is a CSS property in Chrome and Firefox, but only as
	* `path(...)`, so path data goes to the attribute, taken out of
	* `path(...)` if it's written that way. Path data itself has no
	* quotes or brackets.
	*/
	return state.set(key, value, () => {
		const d = value.get()?.replace(/path\(|["')]/g, "");
		d === void 0 ? element.removeAttribute(key) : element.setAttribute(key, d);
	});
	return (transformProps.has(key) || originProps.has(key) || isCSSVar(key) || key in element.style ? addStyleValue : addAttrValue)(element, state, key, value);
};
/**
* Reads the current value of `key` from an SVG element as the origin of
* an animation, as the SVG VisualElement does: transforms start from
* their defaults, CSS variables and the few CSS-only properties come from
* computed style, falling back to the attribute when that's empty (e.g.
* the element isn't rendered), and everything else is read from the
* attribute, dash-cased (`strokeWidth` -> `stroke-width`) or, failing
* that, as written (`baseFrequency`).
*/
var readSVGValue = (element, key) => {
	if (transformProps.has(key)) return numberValueTypes[key]?.default || 0;
	if (isCSSVar(key) || cssStyleProperties.includes(key)) return readStyleValue(element, key) || element.getAttribute(camelToDash(key)) || 0;
	key = convertAttrKey(key);
	return element.getAttribute(camelToDash(key)) ?? element.getAttribute(key) ?? void 0;
};
/**
* The per-element effect `animate()` binds through, so SVG values share
* state with a direct `svgEffect()` call.
*/
var svgSubjectEffect = /*@__PURE__*/ createEffect(addSVGValue, {
	test: isSVGElement,
	read: readSVGValue
});
function convertAttrKey(key) {
	return key.replace(/^attr([A-Z])/, (_, firstChar) => firstChar.toLowerCase());
}
// node_modules/motion-dom/dist/es/projection/geometry/conversion.mjs
/**
* Bounding boxes tend to be defined as top, left, right, bottom. For various operations
* it's easier to consider each axis individually. This function returns a bounding box
* as a map of single-axis min/max values.
*/
function convertBoundingBoxToBox({ top, left, right, bottom }) {
	return {
		x: {
			min: left,
			max: right
		},
		y: {
			min: top,
			max: bottom
		}
	};
}
/**
* Applies a TransformPoint function to a bounding box. TransformPoint is usually a function
* provided by Framer to allow measured points to be corrected for device scaling. This is used
* when measuring DOM elements and DOM event points.
*/
function transformBoxPoints(point, transformPoint) {
	if (!transformPoint) return point;
	const topLeft = transformPoint({
		x: point.left,
		y: point.top
	});
	const bottomRight = transformPoint({
		x: point.right,
		y: point.bottom
	});
	return {
		top: topLeft.y,
		left: topLeft.x,
		bottom: bottomRight.y,
		right: bottomRight.x
	};
}
// node_modules/motion-dom/dist/es/projection/utils/measure.mjs
function measureViewportBox(instance, transformPoint) {
	return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint));
}
// node_modules/motion-dom/dist/es/animation/animate/element.mjs
var noProps = {};
var getElementEffect = (element) => isSVGElement(element) ? svgSubjectEffect : styleSubjectEffect;
/**
* Presents an effect bound to a DOM element in the shape the DOM keyframe
* resolver and WAAPI expect, which is that of a VisualElement. Holds no
* state: everything delegates to the effect. Goes once the resolver takes
* an effect and subject directly.
*/
var EffectSubject = class {
	constructor(effect, current) {
		this.effect = effect;
		this.current = current;
		this.KeyframeResolver = DOMKeyframesResolver;
	}
	getValue(key) {
		return this.effect.get(this.current, key);
	}
	readValue(key, target) {
		return this.effect.read(this.current, key, target);
	}
	render() {
		this.effect.flush(this.current);
	}
	measureViewportBox() {
		return measureViewportBox(this.current);
	}
	getProps() {
		return noProps;
	}
};
/**
* Animate a DOM element's styles. HTML elements are bound through
* styleEffect, SVG through svgEffect, and both are resolved with the DOM
* keyframe resolver so reads are batched, units are converted by
* measurement and eligible values run on WAAPI.
*
* Pass the element's VisualElement (a <motion.*> component or an
* animateLayout() node) to animate its values instead, so the two keep
* sharing values and a renderer.
*/
function animateElement(element, keyframes, transition, visualElement) {
	activeScope.current?.track(element);
	if (visualElement) return animateValues((key) => visualElement.getValue(key, null), keyframes, transition, visualElement);
	const effect = getElementEffect(element);
	return animateEffectSubject(effect, element, keyframes, transition, new EffectSubject(effect, element));
}
// node_modules/motion-dom/dist/es/effects/prop/index.mjs
/**
* Writes motion values to the properties of any object. This is
* animate()'s fallback for subjects no registered effect claims.
*/
var propEffect = /*@__PURE__*/ createEffect((subject, state, key, value) => {
	return state.set(key, value, () => {
		subject[key] = value.get();
	});
}, {
	test: (subject) => isObject(subject),
	read: (subject, key) => {
		const value = subject[key];
		return typeof value === "string" || typeof value === "number" ? value : void 0;
	}
});
// node_modules/motion-dom/dist/es/animation/animate/single-value.mjs
function animateSingleValue(value, keyframes, options) {
	const motionValue$1 = isMotionValue(value) ? value : motionValue(value);
	motionValue$1.start(animateMotionValue("", motionValue$1, keyframes, options));
	return motionValue$1.animation;
}
// node_modules/motion-dom/dist/es/render/store.mjs
var visualElementStore = /* @__PURE__ */ new WeakMap();
// node_modules/framer-motion/dist/es/animation/utils/is-dom-keyframes.mjs
function isDOMKeyframes(keyframes) {
	return typeof keyframes === "object" && !Array.isArray(keyframes);
}
// node_modules/framer-motion/dist/es/animation/animate/resolve-subjects.mjs
function resolveSubjects(subject, keyframes, scope, selectorCache) {
	if (subject == null) return [];
	if (typeof subject === "string" && isDOMKeyframes(keyframes)) return resolveElements(subject, scope, selectorCache);
	else if (subject instanceof NodeList) return Array.from(subject);
	else if (Array.isArray(subject)) return subject.filter((s) => s != null);
	else return [subject];
}
// node_modules/framer-motion/dist/es/animation/sequence/utils/calc-repeat-duration.mjs
function calculateRepeatDuration(duration, repeat, repeatDelay) {
	return duration * (repeat + 1) + repeatDelay * repeat;
}
// node_modules/framer-motion/dist/es/animation/sequence/utils/calc-time.mjs
/**
* The time of a label, or a label with an offset like "label+1" or
* "label-0.5". An exact label name wins over an offset.
*/
function calcLabelTime(position, labels) {
	if (labels.has(position)) return labels.get(position);
	const [, name, offset] = position.match(/^(.+?)([+-][\d.]+)$/) || [];
	return labels.has(name) ? Math.max(0, labels.get(name) + parseFloat(offset)) : void 0;
}
/**
* Given a absolute or relative time definition and current/prev time state of the sequence,
* calculate an absolute time for the next keyframes.
*/
function calcNextTime(current, next, prev, labels) {
	if (typeof next === "number") return next;
	else if (next.startsWith("-") || next.startsWith("+")) return Math.max(0, current + parseFloat(next));
	else if (next === "<") return prev;
	else if (next.startsWith("<")) return Math.max(0, prev + parseFloat(next.slice(1)));
	else return calcLabelTime(next, labels) ?? current;
}
// node_modules/framer-motion/dist/es/animation/sequence/utils/edit.mjs
function eraseKeyframes(sequence, startTime, endTime) {
	for (let i = 0; i < sequence.length; i++) {
		const keyframe = sequence[i];
		if (keyframe.at > startTime && keyframe.at < endTime) {
			removeItem(sequence, keyframe);
			i--;
		}
	}
}
function addKeyframes(sequence, keyframes, easing, offset, startTime, endTime) {
	/**
	* Erase every existing value between currentTime and targetTime,
	* this will essentially splice this timeline into any currently
	* defined ones.
	*/
	eraseKeyframes(sequence, startTime, endTime);
	for (let i = 0; i < keyframes.length; i++) sequence.push({
		value: keyframes[i],
		at: mixNumber$1(startTime, endTime, offset[i]),
		easing: /* @__PURE__ */ getEasingForSegment(easing, i)
	});
}
// node_modules/framer-motion/dist/es/animation/sequence/utils/normalize-times.mjs
/**
* Take an array of times that represent repeated keyframes. For instance
* if we have original times of [0, 0.5, 1] then our repeated times will
* be [0, 0.5, 1, 1, 1.5, 2]. Loop over the times and scale them back
* down to a 0-1 scale.
*
* `repeatDelayUnits` is the repeatDelay expressed in units of a single
* iteration's duration, so the total span equals `(repeat + 1) + repeat * repeatDelayUnits`.
*/
function normalizeTimes(times, repeat, repeatDelayUnits = 0) {
	const totalUnits = repeat + 1 + repeat * repeatDelayUnits;
	for (let i = 0; i < times.length; i++) times[i] = times[i] / totalUnits;
}
// node_modules/framer-motion/dist/es/animation/sequence/utils/sort.mjs
function compareByTime(a, b) {
	if (a.at === b.at) {
		if (a.value === null) return 1;
		if (b.value === null) return -1;
		return 0;
	} else return a.at - b.at;
}
// node_modules/framer-motion/dist/es/animation/sequence/create.mjs
var defaultSegmentEasing = "easeInOut";
var MAX_REPEAT = 20;
function createAnimationsFromSequence(sequence, { defaultTransition = {}, ...sequenceTransition } = {}, scope, generators, info) {
	const defaultDuration = defaultTransition.duration || .3;
	const animationDefinitions = /* @__PURE__ */ new Map();
	const sequences = /* @__PURE__ */ new Map();
	const elementCache = {};
	const timeLabels = /* @__PURE__ */ new Map();
	let prevTime = 0;
	let currentTime = 0;
	let totalDuration = 0;
	/**
	* Build the timeline by mapping over the sequence array and converting
	* the definitions into keyframes and offsets with absolute time values.
	* These will later get converted into relative offsets in a second pass.
	*
	* Nested sequences are resolved recursively. `base` is the absolute
	* start of the sequence being resolved, so numeric `at` values inside
	* a nested sequence are relative to where it starts. Returns the time
	* the sequence ends.
	*/
	const resolveSequence = (sequence, base) => {
		let sequenceEnd = base;
		const resolveTime = (at) => typeof at === "number" ? base + at : calcNextTime(currentTime, at, prevTime, timeLabels);
		for (let i = 0; i < sequence.length; i++) {
			const segment = sequence[i];
			/**
			* If this is a timeline label, mark it and skip the rest of this iteration.
			*/
			if (typeof segment === "string") {
				timeLabels.set(segment, currentTime);
				continue;
			} else if (!Array.isArray(segment)) {
				const start = segment.at === void 0 ? currentTime : resolveTime(segment.at);
				if ("sequence" in segment) {
					/**
					* Resolve the nested sequence from its start. Afterwards
					* "<" points at its start and the next segment follows
					* its end, as if it were a single segment.
					*/
					prevTime = currentTime = start;
					currentTime = resolveSequence(segment.sequence, start);
					prevTime = start;
					sequenceEnd = Math.max(sequenceEnd, currentTime);
				} else timeLabels.set(segment.name, start);
				continue;
			}
			let [subject, keyframes, transition = {}] = segment;
			/**
			* If a relative or absolute time value has been specified we need to resolve
			* it in relation to the currentTime.
			*/
			if (transition.at !== void 0) currentTime = resolveTime(transition.at);
			/**
			* Keep track of the maximum duration in this definition. This will be
			* applied to currentTime once the definition has been parsed.
			*/
			let maxDuration = 0;
			const resolveValueSequence = (valueKeyframes, valueTransition, valueSequence, elementIndex = 0, numSubjects = 0) => {
				const valueKeyframesAsList = keyframesAsList(valueKeyframes);
				const { delay = 0, times = defaultOffset(valueKeyframesAsList), type = defaultTransition.type || "keyframes", repeat, repeatType, repeatDelay = 0, ...remainingTransition } = valueTransition;
				let { ease = defaultTransition.ease || "easeOut", duration } = valueTransition;
				/**
				* The value animates as one, so it takes the first mixer
				* given for it, or else the default transition's.
				*/
				valueSequence.mixer || (valueSequence.mixer = valueTransition.mixer);
				/**
				* Resolve stagger() if defined.
				*/
				const calculatedDelay = typeof delay === "function" ? delay(elementIndex, numSubjects) : delay;
				/**
				* If this animation should and can use a spring, generate a spring easing function.
				*/
				const numKeyframes = valueKeyframesAsList.length;
				const createGenerator = isGenerator(type) ? type : generators?.[type || "keyframes"];
				if (numKeyframes <= 2 && createGenerator) {
					/**
					* As we're creating an easing function from a spring,
					* ideally we want to generate it using the real distance
					* between the two keyframes. However this isn't always
					* possible - in these situations we use 0-100.
					*/
					let absoluteDelta = 100;
					if (numKeyframes === 2 && isNumberKeyframesArray(valueKeyframesAsList)) {
						const delta = valueKeyframesAsList[1] - valueKeyframesAsList[0];
						absoluteDelta = Math.abs(delta);
					}
					const springTransition = {
						...defaultTransition,
						...remainingTransition
					};
					if (duration !== void 0) springTransition.duration = /* @__PURE__ */ secondsToMilliseconds(duration);
					const springEasing = createGeneratorEasing(springTransition, absoluteDelta, createGenerator);
					ease = springEasing.ease;
					duration = springEasing.duration;
				}
				duration ?? (duration = defaultDuration);
				const startTime = currentTime + calculatedDelay;
				/**
				* If there's only one time offset of 0, fill in a second with length 1
				*/
				if (times.length === 1 && times[0] === 0) times[1] = 1;
				/**
				* Fill out if offset if fewer offsets than keyframes
				*/
				const remainder = times.length - valueKeyframesAsList.length;
				remainder > 0 && fillOffset(times, remainder);
				/**
				* If only one value has been set, ie [1], push a null to the start of
				* the keyframe array. This will let us mark a keyframe at this point
				* that will later be hydrated with the previous value.
				*/
				valueKeyframesAsList.length === 1 && valueKeyframesAsList.unshift(null);
				/**
				* Segments can't express `repeat: Infinity` or very large
				* counts — they'd leave dead time after the segment or
				* explode the keyframe array. Ignore with a warning.
				*/
				if (repeat) typeof process !== "undefined" && process.env.NODE_ENV !== "production" && warning(repeat < MAX_REPEAT, `Sequence segments can't repeat ${repeat} times — ignoring repeat option. Use a value below ${MAX_REPEAT} or apply repeat at the sequence level instead.`);
				if (repeat && repeat < MAX_REPEAT) {
					/**
					* Express repeatDelay in units of a single iteration's duration
					* so it can be added to the per-iteration time offsets below
					* before they're normalized to 0-1.
					*/
					const repeatDelayUnits = duration > 0 ? repeatDelay / duration : 0;
					duration = calculateRepeatDuration(duration, repeat, repeatDelay);
					const originalKeyframes = [...valueKeyframesAsList];
					const originalTimes = [...times];
					ease = Array.isArray(ease) ? [...ease] : [ease];
					const originalEase = [...ease];
					/**
					* For reverse/mirror, alternate iterations play the segment
					* backwards. mirror matches JSAnimation's mirroredGenerator:
					* reversed keyframes, easings unchanged. reverse matches
					* JSAnimation's iterationProgress = 1 - p: reversed
					* keyframes, easing array reversed AND each function easing
					* mapped through reverseEasing (string easings unchanged —
					* they're resolved later by the keyframes engine).
					*/
					const isFlipping = repeatType === "reverse" || repeatType === "mirror";
					let flippedKeyframes = originalKeyframes;
					let flippedEases = originalEase;
					if (isFlipping) {
						flippedKeyframes = [...originalKeyframes].reverse();
						if (repeatType === "reverse") flippedEases = [...originalEase].reverse().map((e) => typeof e === "function" ? /* @__PURE__ */ reverseEasing(e) : e);
					}
					for (let repeatIndex = 0; repeatIndex < repeat; repeatIndex++) {
						const isFlipped = isFlipping && repeatIndex % 2 === 0;
						const iterKeyframes = isFlipped ? flippedKeyframes : originalKeyframes;
						const iterEase = isFlipped ? flippedEases : originalEase;
						const iterStartOffset = (repeatIndex + 1) * (1 + repeatDelayUnits);
						/**
						* If repeatDelay is set, hold the previous iteration's
						* final value through the delay by inserting a keyframe
						* at the moment the next iteration begins.
						*/
						if (repeatDelayUnits > 0) {
							valueKeyframesAsList.push(valueKeyframesAsList[valueKeyframesAsList.length - 1]);
							times.push(iterStartOffset);
							ease.push("linear");
						}
						valueKeyframesAsList.push(...iterKeyframes);
						for (let keyframeIndex = 0; keyframeIndex < iterKeyframes.length; keyframeIndex++) {
							times.push(originalTimes[keyframeIndex] + iterStartOffset);
							ease.push(keyframeIndex === 0 ? "linear" : /* @__PURE__ */ getEasingForSegment(iterEase, keyframeIndex - 1));
						}
					}
					normalizeTimes(times, repeat, repeatDelayUnits);
				}
				const targetTime = startTime + duration;
				/**
				* Add keyframes, mapping offsets to absolute time.
				*/
				addKeyframes(valueSequence, valueKeyframesAsList, ease, times, startTime, targetTime);
				maxDuration = Math.max(calculatedDelay + duration, maxDuration);
				totalDuration = Math.max(targetTime, totalDuration);
			};
			if (isMotionValue(subject)) {
				const subjectSequence = getSubjectSequence(subject, sequences);
				resolveValueSequence(keyframes, transition, getValueSequence("default", subjectSequence));
			} else {
				const subjects = resolveSubjects(subject, keyframes, scope, elementCache);
				const numSubjects = subjects.length;
				/**
				* For every element in this segment, process the defined values.
				*/
				for (let subjectIndex = 0; subjectIndex < numSubjects; subjectIndex++) {
					/**
					* Cast necessary, but we know these are of this type
					*/
					keyframes = keyframes;
					transition = transition;
					const thisSubject = subjects[subjectIndex];
					const subjectSequence = getSubjectSequence(thisSubject, sequences);
					for (const key in keyframes) resolveValueSequence(keyframes[key], getValueTransition(transition, key), getValueSequence(key, subjectSequence), subjectIndex, numSubjects);
				}
			}
			prevTime = currentTime;
			currentTime += maxDuration;
			sequenceEnd = Math.max(sequenceEnd, currentTime);
		}
		return sequenceEnd;
	};
	resolveSequence(sequence, 0);
	if (info) {
		info.duration = totalDuration;
		info.labels = timeLabels;
	}
	/**
	* For every element and value combination create a new animation.
	*/
	sequences.forEach((valueSequences, element) => {
		for (const key in valueSequences) {
			const valueSequence = valueSequences[key];
			/**
			* Arrange all the keyframes in ascending time order.
			*/
			valueSequence.sort(compareByTime);
			const keyframes = [];
			const valueOffset = [];
			const valueEasing = [];
			/**
			* For each keyframe, translate absolute times into
			* relative offsets based on the total duration of the timeline.
			*/
			for (let i = 0; i < valueSequence.length; i++) {
				const { at, value, easing } = valueSequence[i];
				keyframes.push(value);
				valueOffset.push(/* @__PURE__ */ progress(0, totalDuration, at));
				valueEasing.push(easing || "easeOut");
			}
			/**
			* If the first keyframe doesn't land on offset: 0
			* provide one by duplicating the initial keyframe. This ensures
			* it snaps to the first keyframe when the animation starts.
			*/
			if (valueOffset[0] !== 0) {
				valueOffset.unshift(0);
				keyframes.unshift(keyframes[0]);
				valueEasing.unshift(defaultSegmentEasing);
			}
			/**
			* If the last keyframe doesn't land on offset: 1
			* provide one with a null wildcard value. This will ensure it
			* stays static until the end of the animation.
			*/
			if (valueOffset[valueOffset.length - 1] !== 1) {
				valueOffset.push(1);
				keyframes.push(null);
			}
			if (!animationDefinitions.has(element)) animationDefinitions.set(element, {
				keyframes: {},
				transition: {}
			});
			const definition = animationDefinitions.get(element);
			definition.keyframes[key] = keyframes;
			/**
			* Exclude `type` from defaultTransition since springs have been
			* converted to duration-based easing functions in resolveValueSequence.
			* Including `type: "spring"` would cause JSAnimation to error when
			* the merged keyframes array has more than 2 keyframes.
			*/
			const { type: _type, ...remainingDefaultTransition } = defaultTransition;
			definition.transition[key] = {
				...remainingDefaultTransition,
				duration: totalDuration,
				ease: valueEasing,
				times: valueOffset,
				mixer: valueSequence.mixer || defaultTransition.mixer,
				...sequenceTransition
			};
		}
	});
	return animationDefinitions;
}
function getSubjectSequence(subject, sequences) {
	!sequences.has(subject) && sequences.set(subject, {});
	return sequences.get(subject);
}
function getValueSequence(name, sequences) {
	if (!sequences[name]) sequences[name] = [];
	return sequences[name];
}
function keyframesAsList(keyframes) {
	return Array.isArray(keyframes) ? keyframes : [keyframes];
}
function getValueTransition(transition, key) {
	return transition && transition[key] ? {
		...transition,
		...transition[key]
	} : { ...transition };
}
var isNumber = (keyframe) => typeof keyframe === "number";
var isNumberKeyframesArray = (keyframes) => keyframes.every(isNumber);
// node_modules/framer-motion/dist/es/animation/animate/subject.mjs
function isSingleValue(subject, keyframes) {
	return isMotionValue(subject) || typeof subject === "number" || typeof subject === "string" && !isDOMKeyframes(keyframes);
}
/**
* Implementation
*/
function animateSubject(subject, keyframes, options, scope) {
	const animations = [];
	if (isSingleValue(subject, keyframes)) animations.push(animateSingleValue(subject, isDOMKeyframes(keyframes) ? keyframes.default || keyframes : keyframes, options ? options.default || options : options));
	else {
		if (subject == null) return animations;
		const subjects = resolveSubjects(subject, keyframes, scope);
		const numSubjects = subjects.length;
		process.env.NODE_ENV !== "production" && invariant(Boolean(numSubjects), "No valid elements provided.", "no-valid-elements");
		for (let i = 0; i < numSubjects; i++) {
			const thisSubject = subjects[i];
			const transition = { ...options };
			/**
			* Resolve stagger function if provided.
			*/
			if ("delay" in transition && typeof transition.delay === "function") transition.delay = transition.delay(i, numSubjects);
			if (thisSubject instanceof Element)
 /**
			* An element already owned by a VisualElement (a <motion.*>
			* component or animateLayout()) animates its values so they
			* share one renderer. Anything else is driven through
			* styleEffect (or svgEffect) and the DOM keyframe resolver,
			* without creating a VisualElement.
			*/
			animations.push(...animateElement(thisSubject, keyframes, transition, visualElementStore.get(thisSubject)));
			else
 /**
			* Registered effects (animate.addEffect) claim non-DOM
			* subjects before we fall back to writing plain properties.
			*/
			animations.push(...animateEffectSubject(findEffect(thisSubject) ?? propEffect, thisSubject, keyframes, transition));
		}
	}
	return animations;
}
// node_modules/framer-motion/dist/es/animation/animate/sequence.mjs
function animateSequence(sequence, options, scope, info) {
	const animations = [];
	createAnimationsFromSequence(sequence.map((segment) => {
		if (Array.isArray(segment) && typeof segment[0] === "function") {
			const callback = segment[0];
			const mv = motionValue(0);
			mv.on("change", callback);
			if (segment.length === 1) return [mv, [0, 1]];
			else if (segment.length === 2) return [
				mv,
				[0, 1],
				segment[1]
			];
			else return [
				mv,
				segment[1],
				segment[2]
			];
		}
		return segment;
	}), options, scope, { spring }, info).forEach(({ keyframes, transition }, subject) => {
		animations.push(...animateSubject(subject, keyframes, transition));
	});
	return animations;
}
// node_modules/framer-motion/dist/es/animation/timeline/index.mjs
var markerId = 0;
/**
* Copy a segment with a new `at`, adding a transition if it has none.
*/
function withAt(segment, at) {
	const copy = [...segment];
	const i = typeof copy[0] === "function" ? Math.max(1, copy.length - 1) : 2;
	copy[i] = {
		...copy[i],
		at
	};
	return copy;
}
var label = (name, at) => at === void 0 ? name : {
	name,
	at
};
/**
* Rewind to the start and stop, so every value is back at the value it
* started from and the next build reads those values as its origin.
*/
function rewind(animation) {
	animation.pause();
	animation.time = 0;
	animation.stop();
}
/**
* A sequence that can be changed after it's created. Segments, labels,
* callbacks, pauses and other timelines can be added, moved and removed
* at any point, including while it plays.
*
* Changes are batched and applied once per microtask. Each change
* rebuilds the underlying animations from the timeline's starting
* values, then restores the playhead, speed and play state, so changes
* made while playing take effect without a jump.
*/
var Timeline = class Timeline {
	/**
	* `animations` are already running animations of `items`, as
	* animate() makes them. The timeline plays these until it's first
	* changed, so it costs nothing over the animations themselves until
	* then.
	*/
	constructor(items = [], options = {}, animations) {
		this.options = options;
		this.entries = [];
		/**
		* The repeat the playhead is in, to detect when it starts another.
		*/
		this.repeatIndex = 0;
		this.prevTime = 0;
		this.markers = [];
		this.labels = /* @__PURE__ */ new Map();
		this.totalDuration = 0;
		this.isDirty = false;
		this.isDone = false;
		this.isRebuilding = false;
		this.playbackSpeed = 1;
		/**
		* The scopeMotion() scope this was created in. Rebuilds run in it, so
		* selectors resolve in its root and cancel() restores what they
		* animate.
		*/
		this.motionScope = activeScope.current;
		/**
		* Set when the scope stops, so later changes don't restart it.
		*/
		this.isKilled = false;
		/**
		* True while this plays the animations it was created with, before
		* any change compiles it as a sequence.
		*/
		this.isWrapped = false;
		this.stop = () => {
			this.flush();
			this.group?.stop();
		};
		this.isPaused = options.autoplay === false;
		this.newFinished();
		items.forEach((item) => this.add(item));
		if (animations) {
			this.isDirty = false;
			this.isWrapped = true;
			this.group = new GroupAnimationWithThen(animations);
			this.watch();
		} else {
			/**
			* Build now, like animate(), so selectors resolve while a
			* scope is attached. Later changes are batched.
			*/
			this.invalidate();
			this.flush();
		}
		/**
		* Register with the scope (for instance from useAnimate()) so it
		* stops when the scope is torn down.
		*/
		const { scope } = options;
		if (scope) {
			scope.animations.push(this);
			this.finished.then(() => removeItem(scope.animations, this));
		}
	}
	/**
	* Add a segment, label or timeline. `at` overrides any `at` already
	* on the segment. The item itself is the handle for `move()` and
	* `remove()`.
	*/
	add(item, at) {
		if (item instanceof Timeline) item.adopt(this);
		return this.push({
			item,
			at
		});
	}
	/**
	* Fire a callback when the playhead crosses `at`, in either direction.
	* It receives the direction: 1 forwards, -1 backwards.
	*/
	call(callback, at) {
		return this.push({
			item: callback,
			at,
			marker: {
				name: "_m" + markerId++,
				time: 0,
				callback
			}
		});
	}
	/**
	* Pause when the playhead reaches `at`.
	*/
	addPause(at, callback) {
		return this.push({
			item: callback || {},
			at,
			marker: {
				name: "_m" + markerId++,
				time: 0,
				callback,
				pause: true
			}
		});
	}
	/**
	* Change where an item starts.
	*/
	move(item, at) {
		this.entries.forEach((entry) => {
			if (entry.item === item) entry.at = at;
		});
		return this.invalidate();
	}
	/**
	* Remove a segment, label, callback or timeline.
	*/
	remove(item) {
		if (item instanceof Timeline) item.parent = void 0;
		this.entries = this.entries.filter((entry) => entry.item !== item);
		return this.invalidate();
	}
	clear() {
		this.entries = [];
		return this.invalidate();
	}
	/**
	* The time of a label in seconds, or `undefined` if there's no label
	* with this name.
	*/
	getLabelTime(name) {
		this.flush();
		return this.labels.get(name);
	}
	/**
	* Jump to a time in seconds or a label.
	*/
	seek(position) {
		this.time = this.resolve(position);
		return this;
	}
	/**
	* Play forwards or backwards to a time or label, then pause there.
	*/
	playTo(position) {
		const target = this.resolve(position);
		const speed = Math.abs(this.speed);
		this.speed = target < this.time ? -speed : speed;
		this.stopAt = target;
		this.clock || this.invalidate();
		this.play();
		return this;
	}
	reverse() {
		this.speed = -this.speed;
		this.play();
		return this;
	}
	get progress() {
		return this.duration ? this.time / this.duration : 0;
	}
	set progress(progress) {
		this.time = progress * this.duration;
	}
	get time() {
		return this.active()?.time ?? 0;
	}
	set time(time) {
		this.flush();
		this.prevTime = time;
		this.group && (this.group.time = time);
		this.repeatIndex = this.currentRepeat();
	}
	get speed() {
		return this.playbackSpeed;
	}
	set speed(speed) {
		this.playbackSpeed = speed;
		this.group && (this.group.speed = speed);
	}
	get duration() {
		this.flush();
		return this.isWrapped ? this.group.duration : this.totalDuration;
	}
	get iterationDuration() {
		this.flush();
		return this.isWrapped ? this.group.iterationDuration : this.totalDuration;
	}
	get state() {
		return this.active()?.state ?? "idle";
	}
	get startTime() {
		return this.active()?.startTime ?? null;
	}
	play() {
		this.flush();
		this.isPaused = false;
		this.group?.play();
		/**
		* Watch after playing, so it waits for the restarted animations
		* rather than the ones that already finished.
		*/
		if (this.isDone) {
			this.newFinished();
			this.watch();
		}
	}
	pause() {
		this.flush();
		this.isPaused = true;
		this.group?.pause();
	}
	cancel() {
		this.flush();
		this.group?.cancel();
	}
	complete() {
		this.flush();
		this.group?.complete();
	}
	attachTimeline(timeline) {
		this.flush();
		this.scrollTimeline = timeline;
		this.detachScroll = this.group?.attachTimeline(timeline);
		return () => {
			this.scrollTimeline = void 0;
			this.detachScroll?.();
		};
	}
	then(onResolve, onReject) {
		return this.finished.then(onResolve, onReject);
	}
	/**
	* The current animations, if any are running. Skipped animations
	* (skipAnimations, reduced motion) can leave the group empty.
	*/
	active() {
		this.flush();
		return this.group?.animations.length ? this.group : void 0;
	}
	push(entry) {
		this.entries.push(entry);
		return this.invalidate();
	}
	/**
	* Schedule a rebuild. A nested timeline passes changes up, as it's
	* built as part of its parent.
	*/
	invalidate() {
		if (this.parent) this.parent.invalidate();
		else if (!this.isDirty) {
			this.isDirty = true;
			queueMicrotask(() => this.flush());
		}
		return this;
	}
	/**
	* Apply pending changes now, so reads straight after a change
	* reflect it.
	*/
	flush() {
		this.isDirty && !this.parent && !this.isKilled && this.build();
	}
	adopt(parent) {
		if (this.group) {
			rewind(this.group);
			this.group = void 0;
		}
		this.isDirty = false;
		this.parent = parent;
	}
	build() {
		this.isDirty = false;
		this.isWrapped = false;
		const prev = this.group;
		let time = 0;
		if (prev) {
			this.isRebuilding = true;
			if (this.scrollTimeline) {
				/**
				* Scroll-linked animations can't be seeked in seconds.
				* Cancelling also returns them to their starting values,
				* and the new build is attached to scroll instead.
				*/
				this.detachScroll?.();
				prev.cancel();
			} else {
				time = prev.animations.length ? prev.time : 0;
				rewind(prev);
			}
			this.isRebuilding = false;
		}
		const { defaultTransition, onComplete, onUpdate, onRepeat, onReverseComplete, autoplay, scope, ...options } = this.options;
		/**
		* Inherit MotionConfig settings from a useAnimate() scope.
		*/
		const playback = {};
		if (scope?.reduceMotion !== void 0) playback.reduceMotion = scope.reduceMotion;
		if (scope?.skipAnimations !== void 0) playback.skipAnimations = scope.skipAnimations;
		Object.assign(playback, options);
		const markers = /* @__PURE__ */ new Map();
		const info = {};
		const prevScope = activeScope.current;
		activeScope.current = this.motionScope;
		let animations;
		try {
			animations = animateSequence(this.toSequence(markers), {
				defaultTransition,
				...playback
			}, scope, info);
		} finally {
			activeScope.current = prevScope;
		}
		const labels = info.labels;
		let duration = playback.duration ?? info.duration;
		/**
		* A `duration` option stretches every animation to fit, so scale
		* label and marker times to match.
		*/
		const scale = info.duration ? duration / info.duration : 1;
		labels.forEach((time, name) => labels.set(name, time * scale));
		/**
		* Markers are resolved as labels. Move them out of the label map
		* and extend the duration to reach any marker past the end.
		*/
		this.markers = [];
		markers.forEach((marker, name) => {
			marker.time = labels.get(name);
			labels.delete(name);
			duration = Math.max(duration, marker.time);
			this.markers.push(marker);
		});
		this.markers.sort((a, b) => a.time - b.time);
		this.labels = labels;
		this.totalDuration = duration;
		/**
		* Callbacks, pauses and playTo() watch a linear clock. Without
		* them, the timeline is only its animations.
		*/
		this.clock = this.clockAnimation = void 0;
		if (this.markers.length || this.stopAt !== void 0 || onUpdate || onRepeat) {
			const clock = this.clock = motionValue(0);
			clock.on("change", (t) => clock === this.clock && this.onClock(t));
			animations.unshift(this.clockAnimation = animateSingleValue(clock, [0, duration], {
				...playback,
				duration,
				ease: "linear"
			}));
		}
		const group = this.group = new GroupAnimationWithThen(animations);
		time = Math.min(time, duration);
		if (this.isDone && time < duration) this.newFinished();
		if (this.scrollTimeline) this.detachScroll = group.attachTimeline(this.scrollTimeline);
		else {
			group.speed = this.playbackSpeed;
			if (this.isPaused) group.pause();
			if (time) group.time = time;
		}
		this.repeatIndex = this.currentRepeat();
		/**
		* Treat a start from 0 as coming from just before it, so markers
		* at 0 fire.
		*/
		this.prevTime = time || -1;
		this.watch();
	}
	toSequence(markers) {
		return this.entries.map(({ item, at, marker }) => {
			if (marker) {
				markers.set(marker.name, marker);
				return label(marker.name, at);
			}
			if (item instanceof Timeline) return {
				sequence: item.toSequence(markers),
				at
			};
			if (typeof item === "string") return label(item, at);
			if (at === void 0) return item;
			return Array.isArray(item) ? withAt(item, at) : {
				...item,
				at
			};
		});
	}
	resolve(position) {
		this.flush();
		return typeof position === "number" ? position : calcLabelTime(position, this.labels) ?? this.time;
	}
	/**
	* The repeat the clock is in, from its time across all repeats.
	*/
	currentRepeat() {
		const { repeat = 0, repeatDelay = 0, delay = 0 } = this.options;
		const cycle = this.totalDuration + repeatDelay;
		const time = (this.clockAnimation?.time ?? 0) - delay;
		return cycle && time > 0 ? Math.min(repeat, Math.floor(time / cycle)) : 0;
	}
	onClock(time) {
		let prevTime = this.prevTime;
		this.prevTime = time;
		if (this.isRebuilding) return;
		const { onUpdate, onRepeat, repeatType = "loop" } = this.options;
		onUpdate?.(time);
		const repeatIndex = this.currentRepeat();
		if (repeatIndex !== this.repeatIndex) {
			this.repeatIndex = repeatIndex;
			onRepeat?.();
			/**
			* A loop jumps the playhead back to the start, or to the
			* end when playing backwards. Finish crossing the repeat
			* that ended, then cross the new one from its edge.
			*/
			if (repeatType === "loop") {
				const isForward = this.speed > 0;
				if (this.cross(prevTime, isForward ? this.totalDuration : 0)) return;
				prevTime = isForward ? -1 : Infinity;
			}
		}
		this.cross(prevTime, time);
	}
	/**
	* Fire markers between two playhead times. Returns `true` if it
	* paused.
	*/
	cross(from, to) {
		if (from === to) return;
		const isForward = to > from;
		const crossed = (t) => isForward ? t > from && t <= to : t < from && t >= to;
		const markers = isForward ? this.markers : [...this.markers].reverse();
		for (const marker of markers) {
			if (!crossed(marker.time)) continue;
			marker.callback?.(isForward ? 1 : -1);
			if (marker.pause) return this.pauseAt(marker.time);
		}
		if (this.stopAt !== void 0 && crossed(this.stopAt)) {
			this.pauseAt(this.stopAt);
			this.stopAt = void 0;
			return true;
		}
	}
	pauseAt(time) {
		this.pause();
		this.time = time;
		return true;
	}
	watch() {
		const group = this.group;
		group.finished.then(() => {
			if (group !== this.group || this.isDone) return;
			this.isDone = true;
			const { onComplete, onReverseComplete } = this.options;
			(this.speed < 0 && onReverseComplete || onComplete)?.();
			this.resolveFinished();
		});
	}
	newFinished() {
		this.isDone = false;
		this.finished = new Promise((resolve) => {
			this.resolveFinished = resolve;
		});
		/**
		* Stay in the scope while playing, including after a change
		* restarts a finished timeline.
		*/
		const remove = this.motionScope?.add(() => {
			this.isKilled = true;
			this.stop();
		});
		remove && this.finished.then(remove);
	}
};
// node_modules/framer-motion/dist/es/animation/animate/index.mjs
function isSequence(value) {
	return Array.isArray(value) && value.some(Array.isArray);
}
/**
* Creates an animation function that is optionally scoped
* to a specific element.
*/
function createScopedAnimate(options = {}) {
	const { scope, reduceMotion, skipAnimations } = options;
	/**
	* Implementation
	*/
	function scopedAnimate(subjectOrSequence, optionsOrKeyframes, options) {
		const scopeTransition = activeScope.current?.transition;
		const inherited = {};
		if (reduceMotion !== void 0) inherited.reduceMotion = reduceMotion;
		if (skipAnimations !== void 0) inherited.skipAnimations = skipAnimations;
		let timeline;
		if (isSequence(subjectOrSequence)) {
			const sequenceOptions = {
				...inherited,
				...optionsOrKeyframes,
				scope
			};
			if (scopeTransition) sequenceOptions.defaultTransition = {
				...scopeTransition,
				...sequenceOptions.defaultTransition
			};
			timeline = new Timeline(subjectOrSequence, sequenceOptions);
		} else {
			const { onComplete, ...rest } = options || {};
			const transition = {
				...inherited,
				...scopeTransition,
				...rest
			};
			/**
			* Play the animations directly, and only compile them as a
			* sequence if the timeline is changed. Values animated from a
			* number are animated via their onUpdate callback instead.
			*/
			const { onUpdate } = rest;
			timeline = new Timeline([typeof subjectOrSequence === "number" || typeof subjectOrSequence === "string" && (typeof optionsOrKeyframes === "string" || Array.isArray(optionsOrKeyframes)) ? [
				onUpdate || (() => {}),
				Array.isArray(optionsOrKeyframes) ? optionsOrKeyframes : [subjectOrSequence, optionsOrKeyframes],
				{
					...transition,
					onUpdate: void 0
				}
			] : [
				subjectOrSequence,
				optionsOrKeyframes,
				transition
			]], {
				...inherited,
				onComplete,
				scope
			}, animateSubject(subjectOrSequence, optionsOrKeyframes, transition, scope));
		}
		return timeline;
	}
	return scopedAnimate;
}
var animate = /* @__PURE__ */ Object.assign(/* @__PURE__ */ createScopedAnimate(), {
	/**
	* Register an effect so `animate()` can animate the subjects it
	* claims, for instance `animate.addEffect(threeEffect)`. The most
	* recently added effect is tested first. DOM elements are always
	* animated directly.
	*/
	addEffect,
	removeEffect
});
// src/smoothCaret.ts
function createSmoothCaret(host, measure, native) {
	const layer = document.createElement("div");
	layer.className = "smooth-caret-layer";
	layer.setAttribute("aria-hidden", "true");
	const caret = document.createElement("div");
	caret.className = "smooth-caret";
	layer.append(caret);
	document.body.append(layer);
	const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
	const forcedColors = window.matchMedia("(forced-colors: active)");
	let frame = 0;
	let visible = false;
	let composing = false;
	let disposed = false;
	let previous = null;
	let animation;
	const hide = () => {
		layer.hidden = true;
		animation?.stop();
		if (visible) {
			host.classList.remove("smooth-caret-active");
			native?.(false);
		}
		visible = false;
		previous = null;
	};
	const draw = () => {
		frame = 0;
		if (disposed) return;
		if (motion.matches || forcedColors.matches || composing || !document.hasFocus() || !host.contains(document.activeElement)) {
			hide();
			return;
		}
		const position = measure();
		if (!position) {
			hide();
			return;
		}
		let { left, top, right, bottom } = host.getBoundingClientRect();
		for (let parent = host.parentElement; parent; parent = parent.parentElement) {
			const style = getComputedStyle(parent);
			const rect = parent.getBoundingClientRect();
			if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) {
				left = Math.max(left, rect.left);
				right = Math.min(right, rect.right);
			}
			if (/(auto|scroll|hidden|clip)/.test(style.overflowY)) {
				top = Math.max(top, rect.top);
				bottom = Math.min(bottom, rect.bottom);
			}
		}
		if (right <= left || bottom <= top || position.left < left || position.left > right || position.top + position.height <= top || position.top >= bottom) {
			hide();
			return;
		}
		Object.assign(layer.style, {
			left: `${left}px`,
			top: `${top}px`,
			width: `${right - left}px`,
			height: `${bottom - top}px`
		});
		const next = {
			...position,
			left: position.left - left,
			top: position.top - top
		};
		caret.style.height = `${position.height}px`;
		caret.style.background = position.color || getComputedStyle(host).color;
		layer.hidden = false;
		if (!previous || next.left !== previous.left || next.top !== previous.top) {
			animation?.stop();
			animation = animate(caret, {
				x: next.left,
				y: next.top
			}, previous ? {
				type: "spring",
				stiffness: 500,
				damping: 30,
				mass: .5
			} : { duration: 0 });
		}
		previous = next;
		if (!visible) {
			visible = true;
			host.classList.add("smooth-caret-active");
			native?.(true);
		}
	};
	const update = () => {
		if (!disposed && !frame) frame = requestAnimationFrame(draw);
	};
	const startComposition = () => {
		composing = true;
		hide();
	};
	const endComposition = () => {
		composing = false;
		update();
	};
	const events = [
		"focusin",
		"focusout",
		"input",
		"keyup",
		"pointerup",
		"selectionchange",
		"scroll"
	];
	for (const event of events) document.addEventListener(event, update, true);
	host.addEventListener("compositionstart", startComposition);
	host.addEventListener("compositionend", endComposition);
	window.addEventListener("resize", update);
	window.addEventListener("focus", update);
	window.addEventListener("blur", hide);
	motion.addEventListener("change", update);
	forcedColors.addEventListener("change", update);
	document.fonts.addEventListener("loadingdone", update);
	const observer = new ResizeObserver(update);
	observer.observe(host);
	update();
	return {
		update,
		dispose: () => {
			disposed = true;
			cancelAnimationFrame(frame);
			hide();
			observer.disconnect();
			for (const event of events) document.removeEventListener(event, update, true);
			host.removeEventListener("compositionstart", startComposition);
			host.removeEventListener("compositionend", endComposition);
			window.removeEventListener("resize", update);
			window.removeEventListener("focus", update);
			window.removeEventListener("blur", hide);
			motion.removeEventListener("change", update);
			forcedColors.removeEventListener("change", update);
			document.fonts.removeEventListener("loadingdone", update);
			layer.remove();
		}
	};
}
function installInputCarets() {
	let current;
	const mirror = document.createElement("div");
	mirror.setAttribute("aria-hidden", "true");
	const focus = () => {
		current?.dispose();
		current = void 0;
		mirror.remove();
		const field = document.activeElement;
		if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) || field.closest(".xterm") || field.selectionStart === null) return;
		document.body.append(mirror);
		current = createSmoothCaret(field, () => {
			if (field.disabled || field.readOnly || field.selectionStart !== field.selectionEnd) return null;
			const style = getComputedStyle(field);
			for (const property of [
				"box-sizing",
				"font-family",
				"font-size",
				"font-style",
				"font-weight",
				"font-variant",
				"font-feature-settings",
				"font-variation-settings",
				"letter-spacing",
				"line-height",
				"text-align",
				"text-indent",
				"text-transform",
				"direction",
				"tab-size",
				"padding-top",
				"padding-right",
				"padding-bottom",
				"padding-left",
				"border-top-width",
				"border-right-width",
				"border-bottom-width",
				"border-left-width"
			]) mirror.style.setProperty(property, style.getPropertyValue(property));
			const multiline = field instanceof HTMLTextAreaElement;
			Object.assign(mirror.style, {
				position: "fixed",
				left: "0",
				top: "0",
				visibility: "hidden",
				pointerEvents: "none",
				boxSizing: "border-box",
				borderStyle: "solid",
				width: `${field.clientWidth + field.clientLeft + parseFloat(style.borderRightWidth)}px`,
				whiteSpace: multiline ? "pre-wrap" : "pre",
				overflowWrap: "break-word"
			});
			const index = field.selectionStart ?? 0;
			const value = field instanceof HTMLInputElement && field.type === "password" ? "•".repeat(field.value.length) : field.value;
			const marker = document.createElement("span");
			marker.textContent = value.slice(index) || "​";
			mirror.replaceChildren(document.createTextNode(value.slice(0, index)), marker);
			const rect = field.getBoundingClientRect();
			const point = marker.getClientRects()[0];
			if (!point) return null;
			const height = parseFloat(style.fontSize);
			return {
				left: rect.left + point.left - field.scrollLeft,
				top: multiline ? rect.top + point.top - field.scrollTop : rect.top + field.clientTop + (field.clientHeight - height) / 2,
				height,
				color: style.color
			};
		});
	};
	document.addEventListener("focusin", focus);
	document.addEventListener("focusout", focus);
	focus();
	return () => {
		document.removeEventListener("focusin", focus);
		document.removeEventListener("focusout", focus);
		current?.dispose();
		mirror.remove();
	};
}
// ../../AppData/Local/Temp/obsidian-caret-build-S7PWwy/entry.ts
var SmoothCaretPlugin = class extends obsidian.Plugin {
	onload() {
		this.register(installInputCarets());
		this.registerEditorExtension(_codemirror_view.ViewPlugin.define((view) => {
			const caret = createSmoothCaret(view.scrollDOM, () => {
				if (!view.hasFocus || view.compositionStarted || !view.state.selection.main.empty || view.state.selection.ranges.length !== 1) return null;
				const rect = view.coordsAtPos(view.state.selection.main.head);
				return rect && {
					left: rect.left,
					top: rect.top,
					height: rect.bottom - rect.top,
					color: getComputedStyle(view.contentDOM).color
				};
			});
			return {
				update: caret.update,
				destroy: caret.dispose
			};
		}));
		const editables = /* @__PURE__ */ new Map();
		this.registerDomEvent(document, "focusin", (event) => {
			const host = event.target;
			if (!(host instanceof HTMLElement) || !host.isContentEditable || host.closest(".cm-editor") || editables.has(host)) return;
			const caret = createSmoothCaret(host, () => {
				const selection = document.getSelection();
				if (!selection?.isCollapsed || !selection.rangeCount || !host.contains(selection.anchorNode)) return null;
				const rect = selection.getRangeAt(0).getBoundingClientRect();
				return rect.height ? {
					left: rect.left,
					top: rect.top,
					height: rect.height
				} : null;
			});
			editables.set(host, caret);
			host.addEventListener("blur", () => {
				caret.dispose();
				editables.delete(host);
			}, { once: true });
		});
		this.register(() => {
			for (const caret of editables.values()) caret.dispose();
			editables.clear();
		});
	}
};
module.exports = SmoothCaretPlugin;
