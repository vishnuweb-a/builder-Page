/**
 * Motion layer.
 *
 * Components import from here and never from 'animejs' directly. That keeps the
 * motion vocabulary consistent, guarantees scope cleanup, and means reduced-
 * motion handling cannot be forgotten in one component.
 */

export * from './presets.ts';
export * from './useReducedMotion.ts';
export * from './useAnimeScope.ts';
export * from './animations.ts';
