'use strict';
function maxSlidingWindow(nums: number[], k: number): number[] {
    if (k === 1) return nums;
    const [maxNums, arr]: [number[], number[]] = [[], [0]];
    // maxNums → n - k + 1
    // arr → k
    // 

    for (let x = 1; x < nums.length; ++x) { // x → n
        if (arr[0] < x - k + 1) arr.shift();
        while (nums[x] >= nums[arr[arr.length - 1]]) arr.pop(); // worst case: k - 1
        arr.push(x);
        if (x < k - 1) continue;
        maxNums.push(nums[arr[0]])
    }

    return maxNums;
};

// Time → O(n * k)
// Space → O(n + 1)



