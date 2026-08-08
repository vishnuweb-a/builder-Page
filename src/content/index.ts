/**
 * Content layer — the single source of truth for every project fact on this
 * page. No component may hard-code a project claim; it imports from here.
 *
 * Provenance rules live in ./_source.ts. Anything marked `unverified` is
 * blocked from rendering by `publish()`.
 */

export * from './_source.ts';
export * from './project.ts';
export * from './residences.ts';
export * from './amenities.ts';
export * from './location.ts';
export * from './developer.ts';
export * from './copy.ts';
