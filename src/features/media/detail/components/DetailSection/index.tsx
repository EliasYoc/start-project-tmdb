import { Title } from "@mantine/core";
import { useId } from "react";

/**
 * Card for every block below the hero: an h2 under the page's h1, and the
 * heading naming the landmark. Its width comes from the route's `Container`.
 * The side padding goes on each child (`*:px-5`), so a rail inside can scroll
 * out to the card's edge.
 */
export function DetailSection({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	const headingId = useId();

	return (
		<section
			aria-labelledby={headingId}
			className="rounded-2xl bg-black py-5 *:px-5"
		>
			<Title order={2} size="h3" id={headingId} mb="md">
				{title}
			</Title>
			{children}
		</section>
	);
}
