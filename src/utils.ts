// Return a promise that doesn't resolve until the specified time has passed
export function wait(delayMillis: number) {
    return new Promise(resolve => setTimeout(resolve, delayMillis));
}

export function deepCopy<T>(item: T): T {
    return JSON.parse(JSON.stringify(item));
}

/* 
    Return the set of natural numbers up until a specified limit
    Example: naturalNumberSetUntilN(5) = {0, 1, 2, 3, 4}
*/
export function naturalNumberSetUntilN(N: number) {
    const nums = new Set<number>();

    for (let num = 0; num < N; num++) {
        nums.add(num);
    }

    return nums;
}

export function naturalNumberListUntilN(N: number) {
    return Array.from(naturalNumberSetUntilN(N));
}
