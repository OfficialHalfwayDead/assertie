# Changelog

## [0.3.2](https://github.com/OfficialHalfwayDead/assertie/compare/v0.3.1...v0.3.2) (2025-02-27)

* [`0814dd2`](https://github.com/OfficialHalfwayDead/assertie/commit/0814dd2a6b9daf2bbeb99e2925710cc8a76caf07) Bugfix: Constructor type wasn't properly typed and prevent `assertInstanceOf` and `assertType` from accepting many construcable types.
* [`940e4e4`](https://github.com/OfficialHalfwayDead/assertie/commit/940e4e424c14db20734ed4e2ec2b8a6eeae3aef3) Clarify SSR vite settings and Svelte/Proxy pitfalls in the README.


## [0.3.1](https://github.com/OfficialHalfwayDead/assertie/compare/v0.3.0...v0.3.1) (2025-02-23)

* [`0d59837`](https://github.com/OfficialHalfwayDead/assertie/commit/0d59837841707c963ce174e79a527fcb1379ac4f) Add array and tuple assertions to the README.


## [0.3.0](https://github.com/OfficialHalfwayDead/assertie/compare/v0.2.0...v0.3.0) (2025-02-23)

### Breaking Changes

* [`9906290`](https://github.com/OfficialHalfwayDead/assertie/commit/990629053a10e519c4d73ece8825f8edf7003489) assertie >= 0.3.0 requires TypeScript 4.7.0 or higher in your project.
* [`b8ca296`](https://github.com/OfficialHalfwayDead/assertie/commit/b8ca296cb80c8e46db49af8256ea8bc1f76532e4) `assertPropsNonNullable` now only accepts objects as the first argument. This is technically a breaking change because TypeScript would have previously allowed passing anything to it, but it never made sense.

### Features

* [`7188088`](https://github.com/OfficialHalfwayDead/assertie/commit/71880883ecc0ecc110a6074b955dc2fc5fe806a5) More accurate print of the actual type of items when an assertion fails and significantly improved error messages overall.
* [`7188088`](https://github.com/OfficialHalfwayDead/assertie/commit/71880883ecc0ecc110a6074b955dc2fc5fe806a5) Add type and non-null assertions for arrays that check all elements in one call and provide better typing and error messages: `assertArrayType`, `assertArrayNonNullable`.
* [`9906290`](https://github.com/OfficialHalfwayDead/assertie/commit/990629053a10e519c4d73ece8825f8edf7003489) Add assertions for tuples that can narrow types of arrays or tuples with unknown types: `assertIsTuple`, `assertTupleTypes`, `assertTupleNonNullable`.

### Other

* [`075fecd`](https://github.com/OfficialHalfwayDead/assertie/commit/075fecd105030191eac671d8731765f4f5af2cd4) Add JSDoc comments to all functions and improve documentation overall.


## [0.2.0](https://github.com/OfficialHalfwayDead/assertie/compare/v0.1.0...v0.2.0) (2025-02-17)

### Breaking Changes

* [`a721e02`](https://github.com/OfficialHalfwayDead/assertie/commit/a721e02b2e8b7378f4dc017e02c2dd48ba899bfb) Renamed all `assertTypeof` to `assertTypeOf` for readability and consistency with `assertInstanceOf`. Sorry for the instant breaking change if anyone was already using it. Better now than carrying that inconsistency around forever.

### Features

* [`76ff555`](https://github.com/OfficialHalfwayDead/assertie/commit/76ff555cbb3a17d27c07642b078f96cd807812ba) Add `assertNull` as it was the only option in `assertType(val, null)` that didn't have an individual function counterpart.
