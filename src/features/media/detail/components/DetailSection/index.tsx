import { Container, Title } from "@mantine/core";
import { useId } from "react";

/**
 * Shell for every block below the hero: same width and gutters as the hero's
 * content, an h2 under the page's h1, and the heading naming the landmark.
 */
export function DetailSection({
	title,
	action,
	children,
}: {
	title: string;
	/** Controls beside the heading, such as a rail's scroll buttons. */
	action?: React.ReactNode;
	children: React.ReactNode;
}) {
	const headingId = useId();

	return (
		<section aria-labelledby={headingId} className={`bg-black rounded-2xl`}>
			<Container size="xl" px={0} className="*:px-5 py-5">
				<div className="mb-4 flex items-center justify-between gap-4">
					<Title order={2} size="h3" id={headingId}>
						{title}
					</Title>
					{action}
				</div>
				{children}
			</Container>
		</section>
	);
}
