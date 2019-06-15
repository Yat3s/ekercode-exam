import { spring, tween } from 'popmotion';

const COMMON_DURATION = 300;

export function springEnter(show, { min = 0.6 } = {}) {
  return show
    ? {
        scale: 1,
        opacity: 1,
        delay: 200,
        transition: props =>
          props.key === 'scale'
            ? spring({
                from: min,
                to: 1,
                stiffness: 1000,
                damping: 20,
              })
            : tween(props),
      }
    : {
        scale: min,
        opacity: 0,
      };
}

export function fadeIn(show) {
  return show
    ? {
        opacity: 1,
        transition: props =>
          tween({
            ...props,
            duration: COMMON_DURATION,
          }),
      }
    : {
        opacity: 0,
        transition: props =>
          tween({
            ...props,
            duration: COMMON_DURATION,
          }),
      };
}

export function springClick() {
  return {
    scale: 1,
    transition: () =>
      spring({
        from: 0.8,
        to: 1,
        stiffness: 1000,
        damping: 20,
      }),
  };
}

export function wrongShake() {
  return {
    x: 0,
    transition: () =>
      spring({
        from: -20,
        to: 0,
        stiffness: 1000,
        damping: 20,
        restSpeed: 1,
      }),
  };
}

export function scaleEnter(show) {
  return show
    ? {
        scale: 1,
      }
    : {
        scale: 0,
      };
}
