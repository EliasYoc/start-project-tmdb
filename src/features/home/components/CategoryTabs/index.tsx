import { Link } from "@tanstack/react-router";
import type { TrendingCategory } from "#/features/media/utils/trending";
import {
	DEFAULT_CATEGORY,
	TRENDING_CATEGORIES,
} from "#/features/media/utils/trending";

/**
 * The selected category is a search param, not component state, so the view a
 * user lands on is the view they can share.
 */
export function CategoryTabs({ active }: { active: TrendingCategory }) {
	return (
		<nav
			aria-label="Browse categories"
			className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8"
		>
			{TRENDING_CATEGORIES.map((category) => {
				const isActive = category.value === active;

				return (
					<Link
						key={category.value}
						to="/"
						// The default tab is the bare URL, not `?category=all`.
						search={{
							category:
								category.value === DEFAULT_CATEGORY
									? undefined
									: category.value,
						}}
						aria-current={isActive ? "page" : undefined}
						className={`shrink-0 rounded-full px-6 py-2.5 text-sm font-bold tracking-wide uppercase no-underline transition ${
							isActive
								? "bg-brand-600 text-white"
								: "text-neutral-400 hover:bg-surface-2 hover:text-white"
						}`}
					>
						{category.label}
					</Link>
				);
			})}
		</nav>
	);
}
