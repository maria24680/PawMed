const ROLE_STYLES: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  veterinarian: "bg-blue-100 text-blue-700",
  client: "bg-gray-100 text-gray-700",
};

export default function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        ROLE_STYLES[role] ?? ROLE_STYLES.client
      }`}
    >
      {role}
    </span>
  );
}
