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

			{/* 48px waits for `lg`: from `sm` the navbar narrows this column to ~170px. */}
			<Title
				order={1}
				mt="xs"
				fz={{ base: 24, xs: 30, lg: 48 }}
				lh={1.25}
				textWrap="balance"
				className="text-white"
			>
				{detail.title}
			</Title>

			{meta.length > 0 && (
				<Text fz={{ base: "sm", sm: "md" }} c="dimmed" mt={6}>
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
