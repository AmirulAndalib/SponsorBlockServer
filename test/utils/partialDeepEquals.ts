import { Logger } from "../../src/utils/logger";

function printActualExpected(actual: Record<string, any>, expected: Record<string, any>, failedKey: string): void {
    Logger.error(`Actual: ${JSON.stringify(actual)}`);
    Logger.error(`Expected: ${JSON.stringify(expected)}`);
    Logger.error(`Failed on key: ${failedKey}`);
}

export const partialDeepEquals = (actual: Record<string, any>, expected: Record<string, any>, print = true): boolean => {
    // loop over key, value of expected
    for (const [key, value] of Object.entries(expected)) {
        // if value is object or array, recurse
        if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
            if (!partialDeepEquals(actual?.[key], value, false)) {
                if (print) printActualExpected(actual, expected, key);
                return false;
            }
        } else if (actual?.[key] !== value) {
            if (print) printActualExpected(actual, expected, key);
            return false;
        }
    }
    return true;
};

export const arrayPartialDeepEquals = (actual: Array<any>, expected: Array<any>): boolean => {
    for (const value of expected)
        if (!actual.some(a => partialDeepEquals(a, value, false))) return false;
    return true;
};

export const arrayDeepEquals = (actual: Record<string, any>, expected: Record<string, any>, print = true): boolean => {
    if (actual.length !== expected.length) return false;
    let flag = true;
    let failedKey = "";
    const actualString = JSON.stringify(actual);
    const expectedString = JSON.stringify(expected);
    // check every value in arr1 for match in arr2
    actual.every((value: any) => {
        if (flag && !expectedString.includes(JSON.stringify(value))) {
            flag = false;
            failedKey = value;
        }
    });
    // check arr2 for match in arr1
    expected.every((value: any) => {
        if (flag && !actualString.includes(JSON.stringify(value))) {
            flag = false;
            failedKey = value;
        }
    });

    if (!flag && print) printActualExpected(actual, expected, failedKey);
    return flag;
};

export const mixedDeepEquals = (actual: Record<string, any>, expected: Record<string, any>, print = true): boolean => {
    for (const [key, value] of Object.entries(expected)) {
        // if value is object or array, recurse
        if (Array.isArray(value)) {
            if (!arrayDeepEquals(actual?.[key], value, false)) {
                if (print) printActualExpected(actual, expected, key);
                return false;
            }
        }
        else if (actual?.[key] !== value) {
            if (print) printActualExpected(actual, expected, key);
            return false;
        }
    }
    return true;
};
