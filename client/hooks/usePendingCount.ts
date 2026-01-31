import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getApiUrl, getAuthHeaders } from "@/lib/query-client";

export function usePendingCount() {
  const { user } = useAuth();

  const { data: pendingCount = 0 } = useQuery({
    queryKey: ["/api/submissions/pending", "count"],
    queryFn: async () => {
      const response = await fetch(`${getApiUrl()}api/submissions/pending`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) return 0;
      const submissions = await response.json();
      return Array.isArray(submissions) ? submissions.length : 0;
    },
    enabled: !!user?.isAdmin,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  return user?.isAdmin ? pendingCount : 0;
}
