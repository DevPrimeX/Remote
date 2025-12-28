import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertInquiry } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useInquiries() {
  return useQuery({
    queryKey: [api.inquiries.list.path],
    queryFn: async () => {
      const res = await fetch(api.inquiries.list.path);
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      return api.inquiries.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateInquiry() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertInquiry) => {
      const res = await fetch(api.inquiries.create.path, {
        method: api.inquiries.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to submit inquiry");
      return api.inquiries.create.responses[201].parse(await res.json());
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  });
}
