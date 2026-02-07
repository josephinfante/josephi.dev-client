import { useEffect, useMemo, useState } from "react";
import axios from "axios";

type ContributionDay = {
  date: string;
  count: number;
};

type ContributionsPayload = {
  totalContributions: number;
  days: ContributionDay[];
};

type ContributionsResponse = {
  success: boolean;
  data: ContributionsPayload;
};

const API_BASE = (import.meta.env.API ?? '').trim().replace(/\/+$/, '');
const ENDPOINT = `${API_BASE}/github/contributions`;

export const useGitHubContributions = () => {
  const [data, setData] = useState<ContributionsPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get<ContributionsResponse>(ENDPOINT, {
          signal: controller.signal,
        });
        if (response.data?.success) {
          setData(response.data.data);
        } else {
          setError("Invalid response");
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError("Unable to load contributions");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => controller.abort();
  }, []);

  const total = useMemo(() => data?.totalContributions ?? 0, [data]);
  const days = useMemo(() => data?.days ?? [], [data]);

  return {
    total,
    days,
    isLoading,
    error,
  };
};
