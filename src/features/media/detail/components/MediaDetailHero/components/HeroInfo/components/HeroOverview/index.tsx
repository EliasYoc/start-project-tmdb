import { Spoiler, Text } from "@mantine/core";

/**
 * The text grows from 14px to 16px but keeps a 24px line box, so the collapsed
 * height is exactly four lines at both sizes instead of cutting one in half.
 */
const LINE_HEIGHT = 24;
const COLLAPSED_LINES = 4;

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
			maxHeight={LINE_HEIGHT * COLLAPSED_LINES}
			showLabel="More"
			hideLabel="Less"
			mt="sm"
			className="max-w-3xl"
			styles={{
				control: { fontSize: "var(--mantine-font-size-sm)", fontWeight: 600 },
			}}
		>
			<Text
				fz={{ base: "sm", sm: "md" }}
				lh={`${LINE_HEIGHT}px`}
				className="text-neutral-300"
			>
				{overview}
			</Text>
		</Spoiler>
	);
}
