export * from 'alien-signals';

import {
  signal as _signal,
  computed as _computed,
  pauseTracking, resumeTracking,
  startBatch, endBatch,
} from 'alien-signals';

const { assign } = Object;
const defaults = { deep: false, greedy: false };
export const computed = value => new Computed(value);
export const signal = (value, { deep = false, greedy = false } = defaults) => {
  if (deep) return new Deep(value);
  if (greedy) return new Greedy(value);
  return new Signal(_signal, value);
};

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
  constructor(fn, value) {
    this._ = fn(value);
  }

  /** @returns {T} */
  get value() {
    return this._();
  }

  /** @param {T} value */
  set value(value) {
    this._(value);
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
export class Computed extends Signal {
  /** @param {T} value */
  constructor(value) { super(_computed, value) }

  /** @returns {T} */
  get value() { return this._() }

  set value(_) { throw new Error('Computed values are read-only') }
}

class Greedy extends Signal {
  constructor(value) { super(_signal, [value]) }

  get value() { return super.value[0] }

  set value(value) { super.value = [value] }

  peek() { return super.peek()[0] }
}

class Deep extends Greedy {
  constructor(value) { super(_signal, new Proxy(value, this)) }

  set(ref, prop, value) {
    if (ref[prop] !== value) {
      ref[prop] = value;
      this.value = ref;
    }
    return true;
  }

  update(batch) {
    pauseTracking();
    const value = this.value;
    resumeTracking();
    startBatch();
    assign(value, batch);
    endBatch();
    return this;
  }
}
