import { inspect } from "node:util";
import type { InspectOptions } from "node:util";
import { AssertionError } from "../../src/index";

// For grouping and executing a test case
type GroupingClosure = () => void;

type TestCase = {
    name: string;
    groups: string[];
    closure: GroupingClosure;
};

const GROUP_STACK: string[] = [];
const TESTS: TestCase[] = [];
const INSPECT_OPTIONS: InspectOptions = { depth: 4, colors: false };

class TestFailure extends Error {
    constructor(message: string) {
        super(message);
        this.name = TestFailure.name;
    }
}

function fail(message: string): never {
    throw new TestFailure(message);
}

function limitStack(stackStr: string): string {
    const lines = stackStr.split("\n");
    for (let i = 0; i < lines.length; i++) {
        // lines below this are noise from the POV of figuring out the test failure
        if (lines[i].includes("Object.closure")) {
            return lines.slice(0, i+1).join("\n");
        }
    }
    return stackStr;
}

/**
 * Groups related runtime tests under a shared name.
 * @param {string} name - The name of the group.
 * @param {GroupingClosure} closure - The closure that registers nested groups and tests.
 */
export function group(name: string, closure: GroupingClosure): void {
    if (name.includes("SKIP")) return;
    GROUP_STACK.push(name);
    try {
        closure();
    } finally {
        GROUP_STACK.pop();
    }
}

/**
 * Registers a runtime test case.
 * @param {string} name - The name of the test.
 * @param {GroupingClosure} closure - The closure that executes the test assertions.
 */
export function test(name: string, closure: GroupingClosure): void {
    if (name.includes("SKIP")) return;
    TESTS.push({
        name,
        groups: [...GROUP_STACK],
        closure,
    });
}

/**
 * Asserts that the provided closure does not throw.
 * @param {TestFn} fn - The closure that should complete without throwing.
 * @throws {TestFailure} if the closure throws.
 */
export function mustNotThrow(fn: () => unknown): void {
    try {
        fn();
    } catch (error: unknown) {
        fail(`Expected no throw, got: ${inspect(error, INSPECT_OPTIONS)}`);
    }
}

/**
 * Asserts that the provided closure throws an AssertionError.
 * @param {TestFn} fn - The closure that should throw.
 * @param {RegExp} matcher - Optional regex that must match the thrown error message.
 * @throws {TestFailure} if no error is thrown, a non-AssertionError is thrown, or the message does not match.
 */
export function mustThrow(fn: () => unknown, matcher?: RegExp): void {
    try {
        fn();
    } catch (error: unknown) {
        if (!(error instanceof AssertionError)) {
            fail(`Expected thrown value to be ${AssertionError.name}, got: ${inspect(error, INSPECT_OPTIONS)}`);
        }
        if (matcher !== undefined && !matcher.test(error.message)) {
            fail(`Expected error message to match ${matcher}, got: "${error.message}"`);
        }
        return;
    }

    fail("Expected throw, but function completed successfully");
}

/**
 * Asserts that two strings are strictly equal.
 * @param {string} actual - The actual string value.
 * @param {string} expected - The expected string value.
 * @throws {TestFailure} if the values are not equal.
 */
export function mustEqual(actual: string, expected: string): void {
    if (actual !== expected) {
        fail(`Expected "${expected}", got "${actual}"`);
    }
}

/**
 * Asserts that the provided boolean is true.
 * @param {boolean} value - The boolean value to assert.
 * @throws {TestFailure} if the value is false.
 */
export function mustBeTrue(value: boolean): void {
    if (!value) {
        fail("Expected true, got false");
    }
}

/**
 * Asserts that the provided boolean is false.
 * @param {boolean} value - The boolean value to assert.
 * @throws {TestFailure} if the value is true.
 */
export function mustBeFalse(value: boolean): void {
    if (value) {
        fail("Expected false, got true");
    }
}

/**
 * Executes all registered runtime tests and prints pass/fail output.
 */
export function executeTests(): void {
    let passed = 0;
    let failed = 0;

    for (const testCase of TESTS) {
        const name = [...testCase.groups, testCase.name].join(" > ");
        try {
            testCase.closure();
            ++passed;
            console.log(`PASS ${name}`);
        } catch (error: unknown) {
            ++failed;
            console.error(`\nFAIL ${name}`);
            if (error instanceof Error && error.stack !== undefined) {
                console.error(`    ${limitStack(error.stack)}\n`);
            } else {
                console.error(`    ${inspect(error, INSPECT_OPTIONS)}\n`);
            }
        }
    }

    const total = passed + failed;
    console.log(`\nRuntime tests finished: ${passed}/${total} passed, ${failed} failed\n`);

    if (failed > 0) {
        process.exitCode = 1;
    }
}
