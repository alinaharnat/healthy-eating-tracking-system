import { useCallback, useRef, useState } from "react";

export function useOptimisticList(initialItems = []) {
  const [items, setItems] = useState(initialItems);
  const initialItemsRef = useRef(initialItems);

  const runOptimistic = useCallback(async ({ apply, mutation }) => {
    let previousItemsSnapshot;

    setItems((previousItems) => {
      previousItemsSnapshot = previousItems;
      return apply(previousItems);
    });

    try {
      return await mutation();
    } catch (error) {
      setItems(previousItemsSnapshot || initialItemsRef.current);
      throw error;
    }
  }, []);

  return {
    items,
    setItems,
    runOptimistic,
  };
}
