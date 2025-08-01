export * from 'alien-signals';

import {
  signal as _signal,
  computed as _computed,
  pauseTracking, resumeTracking,
} from 'alien-signals';

const defaults = { greedy: false };
export const computed = value => new Computed(value, defaults);
export const signal = (value, options = defaults) => new Signal(_signal, value, options);

/**
 * @template T
 * @param {function(): T} fn
 * @returns {T}
 */
export const untracked = fn => {
  pauseTracking();
  try { return fn() }
  finally { resumeTracking() }
};

/**
 * @template T
 */
export class Signal {
  /**
   * @param {(value: T) => T} fn
   * @param {T} value
   */
  constructor(fn, value, { greedy = false }) {
    this.$ = greedy;
    this._ = fn(greedy ? [value] : value);
  }

  /** @returns {T} */
  get value() {
    const value = this._();
    return this.$ ? value[0] : value;
  }

  /** @param {T} value */
  set value(value) {
    this._(this.$ ? [value] : value);
  }

  /** @returns {T} */
  peek() {
    const value = untracked(this._);
    return this.$ ? value[0] : value;
  }

  /** @returns {T} */
  valueOf() {
    return this.value;
  }
}

/**
 * @template T
 */
export class Computed extends Signal {
  /** @param {T} value */
  constructor(value, options) {
    super(_computed, value, options);
  }

  /** @returns {T} */
  get value() { return this._() }

  set value(_) { throw new Error('Computed values are read-only') }
}
