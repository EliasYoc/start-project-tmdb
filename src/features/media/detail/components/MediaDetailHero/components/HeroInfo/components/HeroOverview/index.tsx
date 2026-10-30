import { Spoiler, Text } from "@mantine/core";

export function HeroOverview({ overview }: { overview: string }) {
	if (!overview) {
		return (
			<Text size="sm" c="dimmed" mt="sm" fs="italic">
				No synopsis available yet.
			</Text>
		);
	}

	return (
		<Spoiler
			maxHeight={88}
			showLabel="More"
			hideLabel="Less"
			mt="sm"
			className="max-w-3xl"
			classNames={{ control: "text-sm font-semibold" }}
		>
			<Text size="sm" className="leading-relaxed text-neutral-300 md:text-base">
				{overview}
			</Text>
		</Spoiler>
	);
}
