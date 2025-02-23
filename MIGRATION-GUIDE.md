# Migration Guide

Scroll down to your previous version and then follow all the steps upwards in order until the version you're targeting.

## [0.2.x to 0.3.0](https://github.com/OfficialHalfwayDead/assertie/compare/v0.2.0...v0.3.0)

* New features mean assertie >= 0.3.0 requires TypeScript 4.7.0 or higher in your project. (Previous minimum version was 3.7.0)
* Ensure that you aren't passing things that aren't objects to `assertPropsNonNullable`. It never made sense, but the TS type previously allowed it.

## [0.1.x to 0.2.0](https://github.com/OfficialHalfwayDead/assertie/compare/v0.1.0...v0.2.0)

* All functions which had `Typeof` in the name changed capitalization to `TypeOf` for consistency. Change all existing calls to the new spelling.
