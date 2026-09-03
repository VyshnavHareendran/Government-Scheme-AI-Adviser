import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../utils/errors";

interface AsyncState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  reload: () => Promise<void>;
}

export function useAsyncData<T>(
  loader: () => Promise<T>,
  fallbackError: string,
  immediate = true,
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(immediate);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loader();
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err, fallbackError));
    } finally {
      setLoading(false);
    }
  }, [fallbackError, loader]);

  useEffect(() => {
    if (immediate) {
      void reload();
    }
  }, [immediate, reload]);

  return { data, error, loading, reload };
}
