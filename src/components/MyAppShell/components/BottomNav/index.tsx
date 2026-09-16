import { Link } from "@tanstack/react-router";
import { navMeta, navOptions } from "../navigation";

/** The phone counterpart of the sidebar; hidden from `sm` up by the AppShell. */
export function BottomNav() {
	return (
		<nav
			aria-label="Main"
			className="flex h-full items-stretch justify-around px-2"
		>
			{navOptions.map((item) => {
				const { label, Icon } = navMeta[item.to];

				return (
					<Link
						key={item.to}
						{...item}
						className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium text-neutral-500 no-underline transition data-[status=active]:text-brand-400"
					>
						<Icon size={22} />
						{label}
					</Link>
				);
			})}
		</nav>
	);
}
