// seed.js
// Run from BACKEND_LC/Day8:
// node seed.js

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./src/models/user');
const Problem = require('./src/models/problem');

const ADMIN_EMAIL = 'seed-admin@codearena.dev';
const ADMIN_PASSWORD = 'SeedAdmin123';

// ----------------------------------------------------
// Starter / Reference Code
// ----------------------------------------------------

const jsStub = (fn = 'solve') => `
function ${fn}() {
    // Write your solution here
}
`;

const cppStub = () => `
#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your solution here
    return 0;
}
`;

const javaStub = () => `
class Solution {
    public static void main(String[] args) {
        // Write your solution here
    }
}
`;

// ----------------------------------------------------
// Helper
// ----------------------------------------------------

function createProblem({
    title,
    description,
    difficulty,
    tags,
    input,
    output,
    explanation,
    hiddenInput,
    hiddenOutput
}) {
    return {
        title,
        description,
        difficulty,
        tags,

        visibleTestCases: [
            {
                input,
                output,
                explanation
            }
        ],

        hiddenTestCases: [
            {
                input: hiddenInput,
                output: hiddenOutput
            }
        ],

        startCode: [
            {
                language: 'C++',
                initialCode: cppStub()
            },
            {
                language: 'Java',
                initialCode: javaStub()
            },
            {
                language: 'JavaScript',
                initialCode: jsStub('solve')
            }
        ],

        referenceSolution: [
            {
                language: 'C++',
                completeCode: cppStub()
            },
            {
                language: 'Java',
                completeCode: javaStub()
            },
            {
                language: 'JavaScript',
                completeCode: jsStub('solve')
            }
        ]
    };
}

// ====================================================
// PROBLEMS
// ====================================================

const problems = [

    // ==================================================
    // ARRAYS
    // ==================================================

    createProblem({
        title: 'Two Sum',
        description:
            'Given an array of integers and a target value, find two different positions whose values add up to the target.',
        difficulty: 'easy',
        tags: 'array',
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'The values 2 and 7 add up to 9.',
        hiddenInput: 'nums = [3,2,4], target = 6',
        hiddenOutput: '[1,2]'
    }),

    createProblem({
        title: 'Best Time to Buy and Sell Stock',
        description:
            'Given daily stock prices, find the maximum profit possible by buying once and selling once later.',
        difficulty: 'easy',
        tags: 'array',
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy at 1 and sell at 6.',
        hiddenInput: 'prices = [7,6,4,3,1]',
        hiddenOutput: '0'
    }),

    createProblem({
        title: 'Maximum Subarray',
        description:
            'Find the contiguous subarray having the largest possible sum.',
        difficulty: 'medium',
        tags: 'array',
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has sum 6.',
        hiddenInput: 'nums = [5,4,-1,7,8]',
        hiddenOutput: '23'
    }),

    createProblem({
        title: 'Move Zeroes',
        description:
            'Move every zero in an integer array to the end while keeping the relative order of non-zero values.',
        difficulty: 'easy',
        tags: 'array',
        input: 'nums = [0,1,0,3,12]',
        output: '[1,3,12,0,0]',
        explanation: 'Non-zero elements retain their original order.',
        hiddenInput: 'nums = [0,0,1]',
        hiddenOutput: '[1,0,0]'
    }),

    createProblem({
        title: 'Majority Element',
        description:
            'Find the value that appears more than half the number of times in an integer array.',
        difficulty: 'easy',
        tags: 'array',
        input: 'nums = [2,2,1,1,1,2,2]',
        output: '2',
        explanation: '2 occurs more than n/2 times.',
        hiddenInput: 'nums = [3,3,4]',
        hiddenOutput: '3'
    }),

    createProblem({
        title: 'Product of Array Except Self',
        description:
            'For every position, return the product of all array values except the value at that position.',
        difficulty: 'medium',
        tags: 'array',
        input: 'nums = [1,2,3,4]',
        output: '[24,12,8,6]',
        explanation: 'Each result excludes the value at its own index.',
        hiddenInput: 'nums = [-1,1,0,-3,3]',
        hiddenOutput: '[0,0,9,0,0]'
    }),

    createProblem({
        title: 'Rotate Array',
        description:
            'Rotate an array to the right by k positions.',
        difficulty: 'medium',
        tags: 'array',
        input: 'nums = [1,2,3,4,5,6,7], k = 3',
        output: '[5,6,7,1,2,3,4]',
        explanation: 'The last three values move to the front.',
        hiddenInput: 'nums = [1,2,3], k = 1',
        hiddenOutput: '[3,1,2]'
    }),

    createProblem({
        title: 'Container With Most Water',
        description:
            'Given vertical lines represented by heights, find two lines that form the container holding the maximum amount of water.',
        difficulty: 'medium',
        tags: 'array',
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation: 'The best pair forms an area of 49.',
        hiddenInput: 'height = [1,1]',
        hiddenOutput: '1'
    }),

    // ==================================================
    // STRINGS
    // ==================================================

    createProblem({
        title: 'Valid Anagram',
        description:
            'Determine whether two strings contain the same characters with the same frequencies.',
        difficulty: 'easy',
        tags: 'string',
        input: 's = "anagram", t = "nagaram"',
        output: 'true',
        explanation: 'Both strings contain identical character frequencies.',
        hiddenInput: 's = "rat", t = "car"',
        hiddenOutput: 'false'
    }),

    createProblem({
        title: 'Valid Palindrome',
        description:
            'Check whether a string is a palindrome after ignoring non-alphanumeric characters and letter case.',
        difficulty: 'easy',
        tags: 'string',
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: 'After normalization the string reads the same forwards and backwards.',
        hiddenInput: 's = "race a car"',
        hiddenOutput: 'false'
    }),

    createProblem({
        title: 'Longest Common Prefix',
        description:
            'Find the longest prefix shared by every string in an array.',
        difficulty: 'easy',
        tags: 'string',
        input: 'strs = ["flower","flow","flight"]',
        output: '"fl"',
        explanation: 'All strings begin with "fl".',
        hiddenInput: 'strs = ["dog","racecar","car"]',
        hiddenOutput: '""'
    }),

    createProblem({
        title: 'First Unique Character',
        description:
            'Find the index of the first character that appears exactly once in a string.',
        difficulty: 'easy',
        tags: 'string',
        input: 's = "leetcode"',
        output: '0',
        explanation: 'l is the first non-repeating character.',
        hiddenInput: 's = "loveleetcode"',
        hiddenOutput: '2'
    }),

    createProblem({
        title: 'Longest Substring Without Repeating Characters',
        description:
            'Find the length of the longest substring containing no repeated characters.',
        difficulty: 'medium',
        tags: 'string',
        input: 's = "abcabcbb"',
        output: '3',
        explanation: '"abc" is the longest substring without repetition.',
        hiddenInput: 's = "pwwkew"',
        hiddenOutput: '3'
    }),

    createProblem({
        title: 'Group Anagrams',
        description:
            'Group strings together when they contain the same characters with the same frequencies.',
        difficulty: 'medium',
        tags: 'string',
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
        explanation: 'Strings belonging to the same anagram group are placed together.',
        hiddenInput: 'strs = [""]',
        hiddenOutput: '[[""]]'
    }),

    // ==================================================
    // LINKED LIST
    // ==================================================

    createProblem({
        title: 'Reverse Linked List',
        description:
            'Reverse a singly linked list and return the new head.',
        difficulty: 'easy',
        tags: 'linkedList',
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]',
        explanation: 'Every next pointer is reversed.',
        hiddenInput: 'head = [1,2]',
        hiddenOutput: '[2,1]'
    }),

    createProblem({
        title: 'Merge Two Sorted Lists',
        description:
            'Combine two sorted linked lists into one sorted linked list.',
        difficulty: 'easy',
        tags: 'linkedList',
        input: 'list1 = [1,2,4], list2 = [1,3,4]',
        output: '[1,1,2,3,4,4]',
        explanation: 'Nodes are merged in sorted order.',
        hiddenInput: 'list1 = [], list2 = [0]',
        hiddenOutput: '[0]'
    }),

    createProblem({
        title: 'Middle of Linked List',
        description:
            'Return the middle node of a singly linked list. For an even-sized list, return the second middle node.',
        difficulty: 'easy',
        tags: 'linkedList',
        input: 'head = [1,2,3,4,5]',
        output: '[3,4,5]',
        explanation: 'Node 3 is the middle node.',
        hiddenInput: 'head = [1,2,3,4,5,6]',
        hiddenOutput: '[4,5,6]'
    }),

    createProblem({
        title: 'Detect Cycle in Linked List',
        description:
            'Determine whether a linked list contains a cycle.',
        difficulty: 'medium',
        tags: 'linkedList',
        input: 'head = [3,2,0,-4], pos = 1',
        output: 'true',
        explanation: 'The last node points back to the node at index 1.',
        hiddenInput: 'head = [1,2], pos = -1',
        hiddenOutput: 'false'
    }),

    createProblem({
        title: 'Remove Nth Node From End',
        description:
            'Remove the nth node counted from the end of a linked list.',
        difficulty: 'medium',
        tags: 'linkedList',
        input: 'head = [1,2,3,4,5], n = 2',
        output: '[1,2,3,5]',
        explanation: 'The node containing 4 is removed.',
        hiddenInput: 'head = [1], n = 1',
        hiddenOutput: '[]'
    }),

    // ==================================================
    // STACK
    // ==================================================

    createProblem({
        title: 'Valid Parentheses',
        description:
            'Determine whether brackets in a string are correctly opened and closed.',
        difficulty: 'easy',
        tags: 'stack',
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'Every opening bracket has a correctly ordered closing bracket.',
        hiddenInput: 's = "([)]"',
        hiddenOutput: 'false'
    }),

    createProblem({
        title: 'Min Stack',
        description:
            'Design a stack supporting push, pop, top, and retrieving the minimum value in constant time.',
        difficulty: 'medium',
        tags: 'stack',
        input: 'operations = ["push","push","getMin","pop","getMin"], values = [3,1,null,null,null]',
        output: '[1,3]',
        explanation: 'The minimum changes after removing 1.',
        hiddenInput: 'operations = ["push","push","getMin"], values = [2,0,null]',
        hiddenOutput: '[0]'
    }),

    createProblem({
        title: 'Next Greater Element',
        description:
            'For every array element, find the first greater value appearing to its right.',
        difficulty: 'medium',
        tags: 'stack',
        input: 'nums = [2,1,2,4,3]',
        output: '[4,2,4,-1,-1]',
        explanation: 'A monotonic stack can efficiently find the next greater values.',
        hiddenInput: 'nums = [1,3,2,4]',
        hiddenOutput: '[3,4,4,-1]'
    }),

    createProblem({
        title: 'Largest Rectangle in Histogram',
        description:
            'Given bar heights of a histogram, find the largest rectangular area that can be formed.',
        difficulty: 'hard',
        tags: 'stack',
        input: 'heights = [2,1,5,6,2,3]',
        output: '10',
        explanation: 'Bars 5 and 6 form the maximum rectangle with area 10.',
        hiddenInput: 'heights = [2,4]',
        hiddenOutput: '4'
    }),

    // ==================================================
    // QUEUE / DEQUE
    // ==================================================

    createProblem({
        title: 'Implement Queue Using Stacks',
        description:
            'Implement queue operations using two stacks while preserving FIFO behavior.',
        difficulty: 'easy',
        tags: 'queue',
        input: 'operations = ["push","push","peek","pop"], values = [1,2,null,null]',
        output: '[1,1]',
        explanation: 'The oldest inserted value is returned first.',
        hiddenInput: 'operations = ["push","pop","empty"], values = [5,null,null]',
        hiddenOutput: '[5,true]'
    }),

    createProblem({
        title: 'Sliding Window Maximum',
        description:
            'For every window of size k in an array, return the maximum value in that window.',
        difficulty: 'hard',
        tags: 'queue',
        input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
        output: '[3,3,5,5,6,7]',
        explanation: 'A deque can maintain candidates for the maximum.',
        hiddenInput: 'nums = [1], k = 1',
        hiddenOutput: '[1]'
    }),

    // ==================================================
    // SORTING
    // ==================================================

    createProblem({
        title: 'Merge Sort',
        description:
            'Sort an integer array in ascending order using the merge sort algorithm.',
        difficulty: 'easy',
        tags: 'sorting',
        input: 'nums = [5,2,3,1]',
        output: '[1,2,3,5]',
        explanation: 'The array is recursively divided and merged in sorted order.',
        hiddenInput: 'nums = [4,1,3,2]',
        hiddenOutput: '[1,2,3,4]'
    }),

    createProblem({
        title: 'Quick Sort',
        description:
            'Sort an integer array in ascending order using the quick sort technique.',
        difficulty: 'medium',
        tags: 'sorting',
        input: 'nums = [10,7,8,9,1,5]',
        output: '[1,5,7,8,9,10]',
        explanation: 'Partitioning is repeatedly applied around pivot values.',
        hiddenInput: 'nums = [3,1,2]',
        hiddenOutput: '[1,2,3]'
    }),

    createProblem({
        title: 'Kth Largest Element',
        description:
            'Find the kth largest value in an unsorted integer array.',
        difficulty: 'medium',
        tags: 'sorting',
        input: 'nums = [3,2,1,5,6,4], k = 2',
        output: '5',
        explanation: 'The sorted order is [1,2,3,4,5,6].',
        hiddenInput: 'nums = [3,2,3,1,2,4,5,5,6], k = 4',
        hiddenOutput: '4'
    }),

    createProblem({
        title: 'Sort Colors',
        description:
            'Sort an array containing only 0, 1, and 2 without using a general-purpose sorting function.',
        difficulty: 'medium',
        tags: 'sorting',
        input: 'nums = [2,0,2,1,1,0]',
        output: '[0,0,1,1,2,2]',
        explanation: 'The Dutch National Flag approach can sort the values in one pass.',
        hiddenInput: 'nums = [2,0,1]',
        hiddenOutput: '[0,1,2]'
    }),

    // ==================================================
    // BINARY SEARCH
    // ==================================================

    createProblem({
        title: 'Binary Search',
        description:
            'Find the index of a target value in a sorted array using binary search.',
        difficulty: 'easy',
        tags: 'binarySearch',
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: 'The target 9 is located at index 4.',
        hiddenInput: 'nums = [-1,0,3,5,9,12], target = 2',
        hiddenOutput: '-1'
    }),

    createProblem({
        title: 'Search Insert Position',
        description:
            'Find the index where a target should be inserted into a sorted array.',
        difficulty: 'easy',
        tags: 'binarySearch',
        input: 'nums = [1,3,5,6], target = 5',
        output: '2',
        explanation: '5 already exists at index 2.',
        hiddenInput: 'nums = [1,3,5,6], target = 2',
        hiddenOutput: '1'
    }),

    createProblem({
        title: 'First and Last Position',
        description:
            'Find the first and last positions of a target value in a sorted array.',
        difficulty: 'medium',
        tags: 'binarySearch',
        input: 'nums = [5,7,7,8,8,10], target = 8',
        output: '[3,4]',
        explanation: '8 occurs from index 3 through index 4.',
        hiddenInput: 'nums = [5,7,7,8,8,10], target = 6',
        hiddenOutput: '[-1,-1]'
    }),

    createProblem({
        title: 'Search in Rotated Sorted Array',
        description:
            'Search for a target in an ascending array that has been rotated at an unknown position.',
        difficulty: 'hard',
        tags: 'binarySearch',
        input: 'nums = [4,5,6,7,0,1,2], target = 0',
        output: '4',
        explanation: 'The target 0 is at index 4.',
        hiddenInput: 'nums = [4,5,6,7,0,1,2], target = 3',
        hiddenOutput: '-1'
    }),

    createProblem({
        title: 'Find Minimum in Rotated Array',
        description:
            'Find the smallest value in a sorted array that has been rotated.',
        difficulty: 'medium',
        tags: 'binarySearch',
        input: 'nums = [3,4,5,1,2]',
        output: '1',
        explanation: '1 is the minimum element.',
        hiddenInput: 'nums = [4,5,6,7,0,1,2]',
        hiddenOutput: '0'
    }),

    // ==================================================
    // HASHING
    // ==================================================

    createProblem({
        title: 'Contains Duplicate',
        description:
            'Determine whether an integer array contains at least one repeated value.',
        difficulty: 'easy',
        tags: 'hashing',
        input: 'nums = [1,2,3,1]',
        output: 'true',
        explanation: '1 appears more than once.',
        hiddenInput: 'nums = [1,2,3,4]',
        hiddenOutput: 'false'
    }),

    createProblem({
        title: 'Intersection of Two Arrays',
        description:
            'Return the distinct values that occur in both integer arrays.',
        difficulty: 'easy',
        tags: 'hashing',
        input: 'nums1 = [1,2,2,1], nums2 = [2,2]',
        output: '[2]',
        explanation: '2 is the only common distinct value.',
        hiddenInput: 'nums1 = [4,9,5], nums2 = [9,4,9,8,4]',
        hiddenOutput: '[4,9]'
    }),

    createProblem({
        title: 'Top K Frequent Elements',
        description:
            'Return the k values that occur most frequently in an integer array.',
        difficulty: 'medium',
        tags: 'hashing',
        input: 'nums = [1,1,1,2,2,3], k = 2',
        output: '[1,2]',
        explanation: '1 occurs three times and 2 occurs twice.',
        hiddenInput: 'nums = [1], k = 1',
        hiddenOutput: '[1]'
    }),

    createProblem({
        title: 'Subarray Sum Equals K',
        description:
            'Count the number of contiguous subarrays whose sum is equal to k.',
        difficulty: 'medium',
        tags: 'hashing',
        input: 'nums = [1,1,1], k = 2',
        output: '2',
        explanation: 'There are two subarrays with sum 2.',
        hiddenInput: 'nums = [1,2,3], k = 3',
        hiddenOutput: '2'
    }),

    // ==================================================
    // TREES
    // ==================================================

    createProblem({
        title: 'Maximum Depth of Binary Tree',
        description:
            'Find the maximum number of nodes along any root-to-leaf path in a binary tree.',
        difficulty: 'easy',
        tags: 'tree',
        input: 'root = [3,9,20,null,null,15,7]',
        output: '3',
        explanation: 'The longest root-to-leaf path contains 3 nodes.',
        hiddenInput: 'root = [1,null,2]',
        hiddenOutput: '2'
    }),

    createProblem({
        title: 'Binary Tree Inorder Traversal',
        description:
            'Return the inorder traversal of a binary tree.',
        difficulty: 'easy',
        tags: 'tree',
        input: 'root = [1,null,2,3]',
        output: '[1,3,2]',
        explanation: 'Inorder traversal visits left subtree, root, then right subtree.',
        hiddenInput: 'root = []',
        hiddenOutput: '[]'
    }),

    createProblem({
        title: 'Binary Tree Level Order Traversal',
        description:
            'Return the values of a binary tree level by level from top to bottom.',
        difficulty: 'medium',
        tags: 'tree',
        input: 'root = [3,9,20,null,null,15,7]',
        output: '[[3],[9,20],[15,7]]',
        explanation: 'Breadth-first traversal processes one level at a time.',
        hiddenInput: 'root = [1]',
        hiddenOutput: '[[1]]'
    }),

    createProblem({
        title: 'Validate Binary Search Tree',
        description:
            'Determine whether a binary tree satisfies the ordering rules of a binary search tree.',
        difficulty: 'medium',
        tags: 'tree',
        input: 'root = [2,1,3]',
        output: 'true',
        explanation: 'Every left value is smaller and every right value is larger.',
        hiddenInput: 'root = [5,1,4,null,null,3,6]',
        hiddenOutput: 'false'
    }),

    createProblem({
        title: 'Lowest Common Ancestor of BST',
        description:
            'Find the lowest node in a binary search tree that is an ancestor of two given nodes.',
        difficulty: 'medium',
        tags: 'tree',
        input: 'root = [6,2,8,0,4,7,9], p = 2, q = 8',
        output: '6',
        explanation: '6 is the first node where the paths to 2 and 8 split.',
        hiddenInput: 'root = [6,2,8,0,4,7,9], p = 2, q = 4',
        hiddenOutput: '2'
    }),

    createProblem({
        title: 'Serialize and Deserialize Binary Tree',
        description:
            'Design a method to convert a binary tree into a string and reconstruct the same tree from that string.',
        difficulty: 'hard',
        tags: 'tree',
        input: 'root = [1,2,3,null,null,4,5]',
        output: '[1,2,3,null,null,4,5]',
        explanation: 'Serialization followed by deserialization should preserve the tree.',
        hiddenInput: 'root = []',
        hiddenOutput: '[]'
    }),

    // ==================================================
    // GRAPH
    // ==================================================

    createProblem({
        title: 'Number of Islands',
        description:
            'Count connected groups of land cells in a binary grid.',
        difficulty: 'medium',
        tags: 'graph',
        input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]',
        output: '2',
        explanation: 'There are two disconnected groups of land.',
        hiddenInput: 'grid = [["1","1"],["1","1"]]',
        hiddenOutput: '1'
    }),

    createProblem({
        title: 'Clone Graph',
        description:
            'Create a deep copy of an undirected graph given a reference to one node.',
        difficulty: 'medium',
        tags: 'graph',
        input: 'graph = [[2,4],[1,3],[2,4],[1,3]]',
        output: '[[2,4],[1,3],[2,4],[1,3]]',
        explanation: 'The cloned graph has the same structure but different nodes.',
        hiddenInput: 'graph = [[]]',
        hiddenOutput: '[[]]'
    }),

    createProblem({
        title: 'Course Schedule',
        description:
            'Given course prerequisites, determine whether all courses can be completed without encountering a dependency cycle.',
        difficulty: 'medium',
        tags: 'graph',
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        output: 'true',
        explanation: 'Course 0 can be completed before course 1.',
        hiddenInput: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
        hiddenOutput: 'false'
    }),

    createProblem({
        title: 'Course Schedule II',
        description:
            'Return an ordering of courses that satisfies all prerequisite relationships, or return an empty result if impossible.',
        difficulty: 'hard',
        tags: 'graph',
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        output: '[0,1]',
        explanation: 'Course 0 must be taken before course 1.',
        hiddenInput: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
        hiddenOutput: '[]'
    }),

    createProblem({
        title: 'Detect Cycle in Undirected Graph',
        description:
            'Determine whether an undirected graph contains at least one cycle.',
        difficulty: 'medium',
        tags: 'graph',
        input: 'V = 3, edges = [[0,1],[1,2],[2,0]]',
        output: 'true',
        explanation: 'The three vertices form a cycle.',
        hiddenInput: 'V = 3, edges = [[0,1],[1,2]]',
        hiddenOutput: 'false'
    }),

    createProblem({
        title: 'Shortest Path in Unweighted Graph',
        description:
            'Find the minimum number of edges needed to travel from a source vertex to a destination in an unweighted graph.',
        difficulty: 'medium',
        tags: 'graph',
        input: 'V = 5, edges = [[0,1],[1,2],[0,3],[3,4]], source = 0, destination = 2',
        output: '2',
        explanation: 'The shortest route is 0 -> 1 -> 2.',
        hiddenInput: 'V = 4, edges = [[0,1],[1,2]], source = 0, destination = 3',
        hiddenOutput: '-1'
    }),

    createProblem({
        title: 'Dijkstra Shortest Path',
        description:
            'Find the shortest distances from a source vertex to every other vertex in a graph with non-negative edge weights.',
        difficulty: 'hard',
        tags: 'graph',
        input: 'V = 4, edges = [[0,1,4],[0,2,1],[2,1,2],[1,3,1]], source = 0',
        output: '[0,3,1,4]',
        explanation: 'The shortest distance to vertex 3 is 4.',
        hiddenInput: 'V = 3, edges = [[0,1,5],[1,2,2]], source = 0',
        hiddenOutput: '[0,5,7]'
    }),

    // ==================================================
    // DYNAMIC PROGRAMMING
    // ==================================================

    createProblem({
        title: 'Climbing Stairs',
        description:
            'You can climb either one or two steps at a time. Find the number of distinct ways to reach the top of n steps.',
        difficulty: 'easy',
        tags: 'dynamicProgramming',
        input: 'n = 5',
        output: '8',
        explanation: 'The number of ways follows the Fibonacci sequence.',
        hiddenInput: 'n = 3',
        hiddenOutput: '3'
    }),

    createProblem({
        title: 'House Robber',
        description:
            'Given money stored in houses, find the maximum amount that can be stolen without robbing adjacent houses.',
        difficulty: 'medium',
        tags: 'dynamicProgramming',
        input: 'nums = [1,2,3,1]',
        output: '4',
        explanation: 'Rob houses containing 1 and 3.',
        hiddenInput: 'nums = [2,7,9,3,1]',
        hiddenOutput: '12'
    }),

    createProblem({
        title: 'Coin Change',
        description:
            'Given coin denominations and a target amount, find the minimum number of coins required to form the amount.',
        difficulty: 'medium',
        tags: 'dynamicProgramming',
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 can be formed using 5 + 5 + 1.',
        hiddenInput: 'coins = [2], amount = 3',
        hiddenOutput: '-1'
    }),

    createProblem({
        title: 'Longest Increasing Subsequence',
        description:
            'Find the length of the longest strictly increasing subsequence of an integer array.',
        difficulty: 'medium',
        tags: 'dynamicProgramming',
        input: 'nums = [10,9,2,5,3,7,101,18]',
        output: '4',
        explanation: 'One longest subsequence is [2,3,7,101].',
        hiddenInput: 'nums = [0,1,0,3,2,3]',
        hiddenOutput: '4'
    }),

    createProblem({
        title: '0/1 Knapsack',
        description:
            'Given item weights and values and a maximum capacity, maximize total value by selecting each item at most once.',
        difficulty: 'hard',
        tags: 'dynamicProgramming',
        input: 'weights = [1,3,4,5], values = [1,4,5,7], capacity = 7',
        output: '9',
        explanation: 'Selecting weights 3 and 4 gives value 9.',
        hiddenInput: 'weights = [2,3,4], values = [4,5,7], capacity = 5',
        hiddenOutput: '9'
    }),

    createProblem({
        title: 'Unique Paths',
        description:
            'Count the number of ways to travel from the top-left to bottom-right of a grid when movement is only right or down.',
        difficulty: 'medium',
        tags: 'dynamicProgramming',
        input: 'm = 3, n = 7',
        output: '28',
        explanation: 'There are 28 unique paths.',
        hiddenInput: 'm = 3, n = 2',
        hiddenOutput: '3'
    }),

    createProblem({
        title: 'Edit Distance',
        description:
            'Find the minimum number of insertions, deletions, and replacements needed to transform one string into another.',
        difficulty: 'hard',
        tags: 'dynamicProgramming',
        input: 'word1 = "horse", word2 = "ros"',
        output: '3',
        explanation: 'Three edits are sufficient to transform horse into ros.',
        hiddenInput: 'word1 = "intention", word2 = "execution"',
        hiddenOutput: '5'
    }),

    // ==================================================
    // GREEDY
    // ==================================================

    createProblem({
        title: 'Jump Game',
        description:
            'Determine whether the last index of an array can be reached when each value represents the maximum jump length.',
        difficulty: 'medium',
        tags: 'greedy',
        input: 'nums = [2,3,1,1,4]',
        output: 'true',
        explanation: 'The last index can be reached.',
        hiddenInput: 'nums = [3,2,1,0,4]',
        hiddenOutput: 'false'
    }),

    createProblem({
        title: 'Gas Station',
        description:
            'Given gas available and travel cost between stations, determine the station from which a complete circular journey is possible.',
        difficulty: 'medium',
        tags: 'greedy',
        input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]',
        output: '3',
        explanation: 'Starting at station 3 allows completing the circuit.',
        hiddenInput: 'gas = [2,3,4], cost = [3,4,3]',
        hiddenOutput: '-1'
    }),

    createProblem({
        title: 'Assign Cookies',
        description:
            'Assign cookies to children so that the maximum number of children receive a cookie satisfying their minimum requirement.',
        difficulty: 'easy',
        tags: 'greedy',
        input: 'g = [1,2,3], s = [1,1]',
        output: '1',
        explanation: 'Only one child can be satisfied.',
        hiddenInput: 'g = [1,2], s = [1,2,3]',
        hiddenOutput: '2'
    }),

    createProblem({
        title: 'Activity Selection',
        description:
            'Select the maximum number of non-overlapping activities given their start and finish times.',
        difficulty: 'medium',
        tags: 'greedy',
        input: 'start = [1,3,0,5,8,5], finish = [2,4,6,7,9,9]',
        output: '4',
        explanation: 'Choosing activities by earliest finish time maximizes the count.',
        hiddenInput: 'start = [1,2,3], finish = [2,3,4]',
        hiddenOutput: '3'
    }),

    // ==================================================
    // HEAP / PRIORITY QUEUE
    // ==================================================

    createProblem({
        title: 'Kth Smallest Element in Sorted Matrix',
        description:
            'Find the kth smallest value in a matrix where every row and column is sorted in ascending order.',
        difficulty: 'medium',
        tags: 'heap',
        input: 'matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8',
        output: '13',
        explanation: '13 is the eighth smallest value.',
        hiddenInput: 'matrix = [[1,2],[3,4]], k = 2',
        hiddenOutput: '2'
    }),

    createProblem({
        title: 'Merge K Sorted Lists',
        description:
            'Merge k sorted linked lists into a single sorted linked list.',
        difficulty: 'hard',
        tags: 'heap',
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
        explanation: 'All nodes are combined while preserving sorted order.',
        hiddenInput: 'lists = []',
        hiddenOutput: '[]'
    }),

    createProblem({
        title: 'Find Median from Data Stream',
        description:
            'Design a data structure that supports inserting numbers and finding the median of all inserted values.',
        difficulty: 'hard',
        tags: 'heap',
        input: 'operations = ["add","add","findMedian"], values = [1,2,null]',
        output: '1.5',
        explanation: 'The median of 1 and 2 is 1.5.',
        hiddenInput: 'operations = ["add","add","add","findMedian"], values = [2,3,4,null]',
        hiddenOutput: '3'
    }),

    // ==================================================
    // BACKTRACKING
    // ==================================================

    createProblem({
        title: 'Subsets',
        description:
            'Generate all possible subsets of a given array of distinct integers.',
        difficulty: 'medium',
        tags: 'backtracking',
        input: 'nums = [1,2,3]',
        output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]',
        explanation: 'Every element can either be selected or skipped.',
        hiddenInput: 'nums = [0]',
        hiddenOutput: '[[],[0]]'
    }),

    createProblem({
        title: 'Permutations',
        description:
            'Generate every possible ordering of an array containing distinct integers.',
        difficulty: 'medium',
        tags: 'backtracking',
        input: 'nums = [1,2,3]',
        output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
        explanation: 'Three distinct values produce six permutations.',
        hiddenInput: 'nums = [1,2]',
        hiddenOutput: '[[1,2],[2,1]]'
    }),

    createProblem({
        title: 'Combination Sum',
        description:
            'Find all unique combinations of candidate values that add up to a target. A value may be reused.',
        difficulty: 'medium',
        tags: 'backtracking',
        input: 'candidates = [2,3,6,7], target = 7',
        output: '[[2,2,3],[7]]',
        explanation: 'Both combinations sum to 7.',
        hiddenInput: 'candidates = [2,3,5], target = 8',
        hiddenOutput: '[[2,2,2,2],[2,3,3],[3,5]]'
    }),

    createProblem({
        title: 'N Queens',
        description:
            'Place n queens on an n x n chessboard so that no two queens attack each other.',
        difficulty: 'hard',
        tags: 'backtracking',
        input: 'n = 4',
        output: '2',
        explanation: 'There are two valid arrangements for four queens.',
        hiddenInput: 'n = 1',
        hiddenOutput: '1'
    }),

    // ==================================================
    // BIT MANIPULATION
    // ==================================================

    createProblem({
        title: 'Single Number',
        description:
            'Every value in an array appears twice except one value. Find the value that appears once.',
        difficulty: 'easy',
        tags: 'bitManipulation',
        input: 'nums = [4,1,2,1,2]',
        output: '4',
        explanation: 'Using XOR cancels equal pairs.',
        hiddenInput: 'nums = [2,2,1]',
        hiddenOutput: '1'
    }),

    createProblem({
        title: 'Counting Set Bits',
        description:
            'Count the number of 1 bits in the binary representation of a non-negative integer.',
        difficulty: 'easy',
        tags: 'bitManipulation',
        input: 'n = 11',
        output: '3',
        explanation: '11 is binary 1011 and contains three set bits.',
        hiddenInput: 'n = 128',
        hiddenOutput: '1'
    }),

    createProblem({
        title: 'Power of Two',
        description:
            'Determine whether a positive integer can be represented as a power of two.',
        difficulty: 'easy',
        tags: 'bitManipulation',
        input: 'n = 16',
        output: 'true',
        explanation: '16 = 2^4.',
        hiddenInput: 'n = 18',
        hiddenOutput: 'false'
    }),

    createProblem({
        title: 'Missing Number',
        description:
            'An array contains distinct numbers from 0 through n with exactly one number missing. Find the missing value.',
        difficulty: 'easy',
        tags: 'bitManipulation',
        input: 'nums = [3,0,1]',
        output: '2',
        explanation: '2 is missing from the range 0 through 3.',
        hiddenInput: 'nums = [0,1]',
        hiddenOutput: '2'
    }),

    // ==================================================
    // PREFIX SUM / SLIDING WINDOW
    // ==================================================

    createProblem({
        title: 'Range Sum Query',
        description:
            'Given an integer array, answer multiple queries asking for the sum between two indices.',
        difficulty: 'easy',
        tags: 'array',
        input: 'nums = [1,2,3,4], query = [1,3]',
        output: '9',
        explanation: '2 + 3 + 4 = 9.',
        hiddenInput: 'nums = [5,4,3,2,1], query = [0,2]',
        hiddenOutput: '12'
    }),

    createProblem({
        title: 'Maximum Average Subarray',
        description:
            'Find the maximum average of any contiguous subarray having exactly k elements.',
        difficulty: 'medium',
        tags: 'array',
        input: 'nums = [1,12,-5,-6,50,3], k = 4',
        output: '12.75',
        explanation: 'The best window is [12,-5,-6,50].',
        hiddenInput: 'nums = [5], k = 1',
        hiddenOutput: '5'
    }),

    createProblem({
        title: 'Minimum Size Subarray Sum',
        description:
            'Find the smallest length of a contiguous subarray whose sum is at least a target value.',
        difficulty: 'medium',
        tags: 'array',
        input: 'target = 7, nums = [2,3,1,2,4,3]',
        output: '2',
        explanation: '[4,3] is the shortest qualifying subarray.',
        hiddenInput: 'target = 15, nums = [1,2,3,4,5]',
        hiddenOutput: '5'
    }),

    // ==================================================
    // MATRIX
    // ==================================================

    createProblem({
        title: 'Rotate Image',
        description:
            'Rotate an n x n matrix 90 degrees clockwise in place.',
        difficulty: 'medium',
        tags: 'matrix',
        input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
        output: '[[7,4,1],[8,5,2],[9,6,3]]',
        explanation: 'The matrix is rotated clockwise.',
        hiddenInput: 'matrix = [[1,2],[3,4]]',
        hiddenOutput: '[[3,1],[4,2]]'
    }),

    createProblem({
        title: 'Spiral Matrix',
        description:
            'Return all values of a matrix in clockwise spiral order.',
        difficulty: 'medium',
        tags: 'matrix',
        input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
        output: '[1,2,3,6,9,8,7,4,5]',
        explanation: 'The matrix is traversed layer by layer.',
        hiddenInput: 'matrix = [[1,2],[3,4]]',
        hiddenOutput: '[1,2,4,3]'
    }),

    createProblem({
        title: 'Set Matrix Zeroes',
        description:
            'If a matrix cell contains zero, set its entire row and column to zero.',
        difficulty: 'medium',
        tags: 'matrix',
        input: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]',
        output: '[[1,0,1],[0,0,0],[1,0,1]]',
        explanation: 'The row and column containing the zero are cleared.',
        hiddenInput: 'matrix = [[0,1],[1,1]]',
        hiddenOutput: '[[0,0],[0,1]]'
    }),

    // ==================================================
    // MATH / NUMBER THEORY
    // ==================================================

    createProblem({
        title: 'Fizz Buzz',
        description:
            'For numbers from 1 to n, output Fizz for multiples of 3, Buzz for multiples of 5, and FizzBuzz for both.',
        difficulty: 'easy',
        tags: 'math',
        input: 'n = 5',
        output: '["1","2","Fizz","4","Buzz"]',
        explanation: '3 is divisible by 3 and 5 is divisible by 5.',
        hiddenInput: 'n = 15',
        hiddenOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]'
    }),

    createProblem({
        title: 'Reverse Integer',
        description:
            'Reverse the digits of a signed integer while handling overflow.',
        difficulty: 'medium',
        tags: 'math',
        input: 'x = 123',
        output: '321',
        explanation: 'The digits of 123 reversed form 321.',
        hiddenInput: 'x = -120',
        hiddenOutput: '-21'
    }),

    createProblem({
        title: 'GCD of Two Numbers',
        description:
            'Find the greatest common divisor of two positive integers.',
        difficulty: 'easy',
        tags: 'math',
        input: 'a = 48, b = 18',
        output: '6',
        explanation: '6 is the largest number dividing both values.',
        hiddenInput: 'a = 100, b = 25',
        hiddenOutput: '25'
    }),

    createProblem({
        title: 'Power of a Number',
        description:
            'Calculate x raised to the integer power n efficiently.',
        difficulty: 'medium',
        tags: 'math',
        input: 'x = 2, n = 10',
        output: '1024',
        explanation: '2^10 equals 1024.',
        hiddenInput: 'x = 3, n = 4',
        hiddenOutput: '81'
    })
];

// ====================================================
// SEED DATABASE
// ====================================================

async function run() {

    if (!process.env.DB_CONNECTION_STRING) {
        console.error(
            '❌ DB_CONNECTION_STRING not found. Check your .env file.'
        );
        process.exit(1);
    }

    try {

        // ------------------------------------------------
        // Connect MongoDB
        // ------------------------------------------------

        await mongoose.connect(process.env.DB_CONNECTION_STRING);

        console.log('✅ Connected to MongoDB');

        // ------------------------------------------------
        // Ensure Admin Exists
        // ------------------------------------------------

        let admin = await User.findOne({
            emailId: ADMIN_EMAIL
        });

        if (!admin) {

            const hashedPassword = await bcrypt.hash(
                ADMIN_PASSWORD,
                10
            );

            admin = await User.create({
                firstName: 'Seed',
                emailId: ADMIN_EMAIL,
                password: hashedPassword,
                role: 'admin',
                age: 25
            });

            console.log(
                `✅ Created seed admin: ${ADMIN_EMAIL}`
            );

        } else {

            console.log(
                `ℹ️ Using existing seed admin: ${ADMIN_EMAIL}`
            );
        }

        // ------------------------------------------------
        // Insert Problems
        // ------------------------------------------------

        let inserted = 0;
        let skipped = 0;

        for (const problem of problems) {

            const exists = await Problem.findOne({
                title: problem.title
            });

            if (exists) {

                console.log(
                    `⏭️ Skipping existing: ${problem.title}`
                );

                skipped++;
                continue;
            }

            await Problem.create({
                ...problem,
                problemCreator: admin._id
            });

            inserted++;

            console.log(
                `✅ Inserted: ${problem.title} | ${problem.difficulty} | ${problem.tags}`
            );
        }

        // ------------------------------------------------
        // Summary
        // ------------------------------------------------

        console.log('\n====================================');
        console.log('          SEED COMPLETE');
        console.log('====================================');

        console.log(`Total problems in seed: ${problems.length}`);
        console.log(`New problems inserted:  ${inserted}`);
        console.log(`Already existed:        ${skipped}`);

        // Difficulty count
        const easy = problems.filter(
            p => p.difficulty === 'easy'
        ).length;

        const medium = problems.filter(
            p => p.difficulty === 'medium'
        ).length;

        const hard = problems.filter(
            p => p.difficulty === 'hard'
        ).length;

        console.log('\nDifficulty distribution:');
        console.log(`Easy:   ${easy}`);
        console.log(`Medium: ${medium}`);
        console.log(`Hard:   ${hard}`);

        console.log('\nTopics covered:');

        const topicCounts = {};

        problems.forEach(p => {
            topicCounts[p.tags] =
                (topicCounts[p.tags] || 0) + 1;
        });

        Object.entries(topicCounts).forEach(
            ([topic, count]) => {
                console.log(`- ${topic}: ${count}`);
            }
        );

        console.log('====================================\n');

    } catch (err) {

        console.error('❌ Seed failed:', err);

    } finally {

        await mongoose.disconnect();

        console.log('🔌 MongoDB disconnected');

        process.exit(0);
    }
}

run();