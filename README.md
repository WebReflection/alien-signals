# @webreflection/alien-signals

[alien-signals](https://github.com/stackblitz/alien-signals) with a [Preact signals](https://preactjs.com/guide/v10/signals/) like API and a class based approach for easy brand check.

```js
import {
  Signal,
  signal, computed,
  effect, untracked,
  // all other alien-signals exports
} from '@webreflection/alien-signals';

const count = signal(0);
const double = computed(() => count * 2);
//               implicit count.valueOf()

console.assert(count instanceof Signal);  // true
console.assert(double instanceof Signal); // true

effect(() => {
  console.log('count', count.peek());
  //                  no subscription

  console.log('double', double.value);
});

count.value++;
```

# Extra Feature

A signal created via `signal(value, { greedy: true })` will effect any time the same value is set again, as opposite of ignoring the explicit *set* operation.

Follow this discussion if interest in upstream feedbacks: https://github.com/stackblitz/alien-signals/issues/83
