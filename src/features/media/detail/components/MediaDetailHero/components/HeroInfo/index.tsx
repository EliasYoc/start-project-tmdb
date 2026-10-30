import { Badge, Group, Text, Title } from "@mantine/core";
import {
	type MediaDetail,
	mediaDetailMeta,
} from "../../../../utils/media-detail";
import { HeroOverview } from "./components/HeroOverview";
import { HeroRating } from "./components/HeroRating";

export function HeroInfo({ detail }: { detail: MediaDetail }) {
	const meta = mediaDetailMeta(detail);

	return (
		<div className="min-w-0">
			<Group gap="xs">
				<Badge variant="light" color="brand" size="sm" radius="sm">
					{detail.mediaType === "movie" ? "Movie" : "Series"}
				</Badge>
				<HeroRating
					voteAverage={detail.voteAverage}
					voteCount={detail.voteCount}
				/>
			</Group>

			<Title
				order={1}
				mt="xs"
				className="text-2xl leading-tight text-balance text-white sm:text-3xl md:text-5xl"
			>
				{detail.title}
			</Title>

			{meta.length > 0 && (
				<Text size="sm" c="dimmed" mt={6} className="md:text-base">
					{meta.join(" · ")}
				</Text>
			)}

			{detail.tagline && (
				<Text fs="italic" c="dimmed" mt="md" className="hidden md:block">
					{detail.tagline}
				</Text>
			)}

			<HeroOverview overview={detail.overview} />
		</div>
	);
}
