import { Container, Title } from "@mantine/core";
import { useId } from "react";

/**
 * Shell for every block below the hero: same width and gutters as the hero's
 * content, an h2 under the page's h1, and the heading naming the landmark.
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
		<section aria-labelledby={headingId} className={`bg-black rounded-2xl`}>
			<Container size="xl" px={0} className="*:px-5 py-5">
				<Title order={2} size="h3" id={headingId} mb="md">
					{title}
				</Title>
				{children}
			</Container>
		</section>
	);
}
