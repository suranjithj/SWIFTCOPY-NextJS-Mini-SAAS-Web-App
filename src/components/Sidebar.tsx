export function Sidebar() {
  return (
    <aside className="w-60 border-r p-4 hidden md:block">
      <div className="font-semibold mb-4">Menu</div>
      <ul className="space-y-2 text-sm">
        <li>Uploads</li>
        <li>Generations</li>
        <li>Billing</li>
      </ul>
    </aside>
  );
} 