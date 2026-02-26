import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../shared/components/ui/Input";
import { Button } from "../shared/components/ui/Button";
import { useNavigate } from "react-router";
import { useCreateWebsite } from "../features/websites/hooks/useWebsite";
import {
  addWebsiteSchema,
  type AddWebsiteInput,
} from "../features/websites/schema";

const timezones = ["UTC", "Asia/Kolkata", "America/New_York", "Europe/London"];

export default function AddWebsitePage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateWebsite();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddWebsiteInput>({
    resolver: zodResolver(addWebsiteSchema),
  });

  const onSubmit = (data: AddWebsiteInput) => {
    mutate(data, {
      onSuccess: () => {
        navigate("/websites");
      },
    });
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-6">Add Website</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Website Name"
          placeholder="My SaaS"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <Input
          label="Domain"
          placeholder="example.com"
          {...register("domain")}
          error={!!errors.domain}
          helperText={errors.domain?.message}
        />

        {/* timezone */}
        <div>
          <label className="block text-sm mb-1">Timezone</label>
          <select
            {...register("timezone")}
            className="w-full border border-borderPrimary rounded-md px-3 py-2 text-sm bg-transparent"
          >
            <option value="">Select timezone</option>
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>

          {errors.timezone && (
            <p className="text-red-500 text-xs mt-1">
              {errors.timezone.message}
            </p>
          )}
        </div>

        <Button className="w-full" disabled={isPending}>
          {isPending ? "Creating..." : "Add Website"}
        </Button>
      </form>
    </div>
  );
}
