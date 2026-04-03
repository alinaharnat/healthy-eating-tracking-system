import { useCallback, useState } from "react";

export function useOptimisticList(initialItems = []) {
  const [items, setItems] = useState(initialItems);

  const runOptimistic = useCallback(
    async ({ apply, mutation }) => {
      let previousItemsSnapshot;

      setItems((previousItems) => {
        previousItemsSnapshot = previousItems;
        return apply(previousItems);
      });

      try {
        return await mutation();
      } catch (error) {
        setItems(previousItemsSnapshot || initialItems);
        throw error;
      }
    },
    [initialItems],
  );

  return {
    items,
    setItems,
    runOptimistic,
  };
}
