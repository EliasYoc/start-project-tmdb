import { SimpleGrid, Text } from "@mantine/core";
import type { CrewMember } from "../../../../utils/media-credits";

/**
 * Text only: the crew is a short list of names people scan for ("who directed
 * this?"), and crew photos on TMDB are too sparse to carry a layout.
 */
export function CrewList({ crew }: { crew: CrewMember[] }) {
	return (
		<SimpleGrid
			component="ul"
			cols={{ base: 2, sm: 3, lg: 4 }}
			spacing="lg"
			verticalSpacing="md"
		>
			{crew.map((person) => (
				<li key={person.id}>
					<Text size="sm" fw={600}>
						{person.name}
					</Text>
					<Text size="sm" c="dimmed">
						{person.jobs.join(", ")}
					</Text>
				</li>
			))}
		</SimpleGrid>
	);
}
