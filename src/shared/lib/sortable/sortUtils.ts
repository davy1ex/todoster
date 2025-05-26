/**
 * Assigns order values to items in an array based on their current position.
 * @param items Array of items to assign order values to
 * @returns The same array with updated order values
 */
export function assignOrder<T extends { id: number | string; order?: number }>(
  items: T[]
): T[] {
  return items.map((item, index) => ({
    ...item,
    order: index,
  }));
}

/**
 * Reorders items based on a source index and destination index.
 * @param items Array of items to reorder
 * @param sourceIndex The current index of the item being moved
 * @param destinationIndex The target index for the item
 * @returns A new array with the items reordered
 */
export function reorderItems<T>(
  items: T[],
  sourceIndex: number,
  destinationIndex: number
): T[] {
  const result = Array.from(items);
  const [removed] = result.splice(sourceIndex, 1);
  result.splice(destinationIndex, 0, removed);
  return result;
}

/**
 * Sorts items by their order property
 * @param items Array of items to sort
 * @returns A new sorted array
 */
export function sortByOrder<T extends { order?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    // Handle undefined order values
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
} 