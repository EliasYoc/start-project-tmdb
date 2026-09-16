import { AppShell } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { navMeta, navOptions } from "../navigation";

export function NavbarLinks() {
	return (
		<AppShell.Section grow component="nav" aria-label="Main" p="sm">
			{navOptions.map((item) => {
				const { label, Icon } = navMeta[item.to];

				return (
					<Link
						key={item.to}
						{...item}
						className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 no-underline transition hover:bg-surface-2 hover:text-white data-[status=active]:bg-brand-600 data-[status=active]:text-white"
					>
						<Icon size={18} />
						{label}
					</Link>
				);
			})}
		</AppShell.Section>
	);
}
