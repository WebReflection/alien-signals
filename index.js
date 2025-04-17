export * from 'alien-signals';
import { signal, computed, pauseTracking, resumeTracking } from 'alien-signals';

/**
 * @template T
 * @param {function(): T} fn
 * @returns {T}
 */
export const untracked = fn => {
  pauseTracking();
  try {
    return fn();
  } finally {
    resumeTracking();
  }
};

/**
 * @template T
 */
export class Reactive {
  /**
   * @param {(value: T) => T} fn
   * @param {T} value
   */
  constructor(fn, value) {
    this._ = fn(value);
  }

  /** @returns {T} */
  peek() {
    return untracked(this._);
  }

  /** @returns {T} */
  valueOf() {
    return this.value;
  }
}

/**
 * @template T
 */
export class Signal extends Reactive {
  /**
   * @param {T} value
   */
  constructor(value) {
    super(signal, value);
  }

  /** @returns {T} */
  get value() {
    return this._();
  }

  /** @param {T} value */
  set value(value) {
    this._(value);
  }
}

/**
 * @template T
 */
export class Computed extends Reactive {
  /** @param {T} value */
  constructor(value) {
    super(computed, value);
  }

  /** @returns {T} */
  get value() {
    return this._();
  }
}
