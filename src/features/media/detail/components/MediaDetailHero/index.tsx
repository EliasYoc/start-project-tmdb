import {
	ActionIcon,
	Badge,
	Button,
	Container,
	Group,
	Spoiler,
	Text,
	Title,
} from "@mantine/core";
import {
	IconPlayerPlay,
	IconPlayerPlayFilled,
	IconStar,
} from "@tabler/icons-react";
import { useState } from "react";
import {
	formatRating,
	languageName,
	releaseYear,
} from "#/features/media/cards-layouts/utils/media";
import { posterUrl } from "#/integrations/tmdb/images";
import { FULL_BLEED, LAYOUT } from "../../utils/hero-layout";
import {
	formatRuntime,
	formatSeasons,
	type MediaDetail,
} from "../../utils/media-detail";
import { TrailerModal } from "../TrailerModal";
import { BackButton } from "./components/BackButton";
import { HeroArt } from "./components/HeroArt";

export function MediaDetailHero({ detail }: { detail: MediaDetail }) {
	const [isTrailerOpen, setTrailerOpen] = useState(false);
	const { trailer } = detail;

	const poster = posterUrl(detail.posterPath, "w500");
	const meta = [
		detail.runtime ? formatRuntime(detail.runtime) : null,
		detail.seasonCount ? formatSeasons(detail.seasonCount) : null,
		languageName(detail.originalLanguage),
		releaseYear(detail.date),
	].filter((part): part is string => Boolean(part));
	// An unrated title averages 0, which would read as the worst score possible.
	const hasRating = detail.voteCount > 0;

	return (
		<article className={`relative ${FULL_BLEED}`}>
			<HeroArt detail={detail}>
				{trailer && (
					<ActionIcon
						variant="white"
						color="dark"
						radius="xl"
						size={72}
						aria-label={`Play trailer for ${detail.title}`}
						onClick={() => setTrailerOpen(true)}
						className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-xl transition-transform hover:scale-105"
					>
						<IconPlayerPlayFilled size={30} />
					</ActionIcon>
				)}
			</HeroArt>

			<BackButton mediaType={detail.mediaType} />

			<Container
				size="xl"
				className="relative px-4 pt-[48svh] pb-10 sm:px-6 md:pt-[38vh] lg:px-8"
			>
				<div className={LAYOUT}>
					<div className="aspect-2/3 overflow-hidden rounded-xl bg-(--mantine-color-dark-6) shadow-2xl ring-1 ring-white/10 md:row-span-2">
						{poster ? (
							<img
								src={poster}
								alt={`Poster for ${detail.title}`}
								decoding="async"
								className="size-full object-cover"
							/>
						) : (
							// Visual stand-in only; the h1 carries the title for assistive tech.
							<div
								aria-hidden
								className="flex size-full items-center justify-center bg-linear-to-br from-(--mantine-color-dark-6) to-(--mantine-color-brand-9) p-3 text-center text-sm font-semibold text-neutral-300"
							>
								{detail.title}
							</div>
						)}
					</div>

					<div className="min-w-0">
						<Group gap="xs">
							<Badge variant="light" color="brand" size="sm" radius="sm">
								{detail.mediaType === "movie" ? "Movie" : "Series"}
							</Badge>
							{hasRating && (
								<Text
									component="span"
									size="sm"
									fw={600}
									className="inline-flex items-center gap-1 text-white"
								>
									<IconStar
										size={14}
										className="text-yellow-400"
										fill="currentColor"
										aria-hidden
									/>
									<span className="sr-only">Rating: </span>
									{formatRating(detail.voteAverage)}
									<span className="sr-only"> out of 10</span>
								</Text>
							)}
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

						{detail.overview ? (
							<Spoiler
								maxHeight={88}
								showLabel="More"
								hideLabel="Less"
								mt="sm"
								className="max-w-3xl"
								classNames={{ control: "text-sm font-semibold" }}
							>
								<Text
									size="sm"
									className="leading-relaxed text-neutral-300 md:text-base"
								>
									{detail.overview}
								</Text>
							</Spoiler>
						) : (
							<Text size="sm" c="dimmed" mt="sm" fs="italic">
								No synopsis available yet.
							</Text>
						)}
					</div>

					<div className="col-span-2 flex flex-col gap-6 md:col-span-1 md:col-start-2">
						{detail.genres.length > 0 && (
							<ul aria-label="Genres" className="flex flex-wrap gap-2">
								{detail.genres.map((genre) => (
									<li key={genre.id}>
										<Badge
											variant="default"
											size="lg"
											radius="md"
											tt="none"
											fw={500}
											className="bg-white/10 backdrop-blur-sm"
										>
											{genre.name}
										</Badge>
									</li>
								))}
							</ul>
						)}

						<Button
							size="lg"
							radius="xl"
							disabled={!trailer}
							leftSection={trailer && <IconPlayerPlay size={20} />}
							onClick={() => setTrailerOpen(true)}
							className="w-full md:w-fit md:px-10"
						>
							{trailer ? "Watch Trailer" : "No trailer available"}
						</Button>
					</div>
				</div>
			</Container>

			{trailer && (
				<TrailerModal
					trailer={trailer}
					opened={isTrailerOpen}
					onClose={() => setTrailerOpen(false)}
				/>
			)}
		</article>
	);
}
