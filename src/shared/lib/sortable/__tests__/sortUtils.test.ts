import { assignOrder, reorderItems, sortByOrder } from '../sortUtils';

interface TestItem {
  id: number;
  name: string;
  order?: number;
}

describe('Sorting Utilities', () => {
  describe('assignOrder', () => {
    it('assigns consecutive order values to items', () => {
      const items: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ];

      const result = assignOrder(items);

      expect(result[0].order).toBe(0);
      expect(result[1].order).toBe(1);
      expect(result[2].order).toBe(2);
    });

    it('overwrites existing order values', () => {
      const items: TestItem[] = [
        { id: 1, name: 'Item 1', order: 5 },
        { id: 2, name: 'Item 2', order: 10 },
        { id: 3, name: 'Item 3', order: 15 },
      ];

      const result = assignOrder(items);

      expect(result[0].order).toBe(0);
      expect(result[1].order).toBe(1);
      expect(result[2].order).toBe(2);
    });
  });

  describe('reorderItems', () => {
    it('moves an item from source to destination index', () => {
      const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
      
      // Move 'Item 2' to position 3 (after 'Item 3')
      const result = reorderItems(items, 1, 3);
      
      expect(result).toEqual(['Item 1', 'Item 3', 'Item 4', 'Item 2']);
    });

    it('returns a new array without modifying the original', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];
      const originalItems = [...items];
      
      reorderItems(items, 0, 2);
      
      // Original array should be unchanged
      expect(items).toEqual(originalItems);
    });
  });

  describe('sortByOrder', () => {
    it('sorts items by their order property', () => {
      const items: TestItem[] = [
        { id: 1, name: 'Item 1', order: 2 },
        { id: 2, name: 'Item 2', order: 0 },
        { id: 3, name: 'Item 3', order: 1 },
      ];

      const result = sortByOrder(items);

      expect(result[0].id).toBe(2); // order 0
      expect(result[1].id).toBe(3); // order 1
      expect(result[2].id).toBe(1); // order 2
    });

    it('puts items with undefined order at the end', () => {
      const items: TestItem[] = [
        { id: 1, name: 'Item 1', order: undefined },
        { id: 2, name: 'Item 2', order: 0 },
        { id: 3, name: 'Item 3', order: 1 },
        { id: 4, name: 'Item 4', order: undefined },
      ];

      const result = sortByOrder(items);

      expect(result[0].id).toBe(2); // order 0
      expect(result[1].id).toBe(3); // order 1
      // Items with undefined order should be at the end
      expect(result[2].id).toBe(1);
      expect(result[3].id).toBe(4);
    });

    it('returns a new array without modifying the original', () => {
      const items: TestItem[] = [
        { id: 1, name: 'Item 1', order: 2 },
        { id: 2, name: 'Item 2', order: 0 },
        { id: 3, name: 'Item 3', order: 1 },
      ];
      const originalItems = [...items];
      
      sortByOrder(items);
      
      // Original array should be unchanged
      expect(items).toEqual(originalItems);
    });
  });
}); 