import { mergeSort } from '../../src/js/mergeSort/mergeSort';

describe('mergeSort', () => {
    it('sort', () => {
        expect(mergeSort([3,2,5], (a,b) => a < b )).toEqual([2,3,5]);
    });
});