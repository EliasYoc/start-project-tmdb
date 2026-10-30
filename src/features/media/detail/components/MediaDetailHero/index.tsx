import {
	ActionIcon,
	Badge,
	Button,
	Container,
	Group,
	Skeleton,
	Spoiler,
	Text,
	Title,
} from "@mantine/core";
import {
	IconArrowLeft,
	IconPlayerPlay,
	IconPlayerPlayFilled,
	IconStar,
} from "@tabler/icons-react";
import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
	formatRating,
	languageName,
	releaseYear,
} from "#/features/media/cards-layouts/utils/media";
import { backdropUrl, posterUrl } from "#/integrations/tmdb/images";
import {
	formatRuntime,
	formatSeasons,
	type MediaDetail,
} from "../../utils/media-detail";
import { TrailerModal } from "../TrailerModal";

/**
 * Bleeds past `AppShell.Main`'s `md` padding so the art reaches the edges, the
 * way the rails do with their own gutters.
 */
const FULL_BLEED = "-mx-4 -mt-4";

/**
 * Poster column on the left, everything else to its right. On phones the
 * genres and the trailer button drop under both columns to get the full width.
 */
const LAYOUT =
	"grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] items-start gap-x-4 gap-y-6 sm:grid-cols-[11rem_minmax(0,1fr)] md:grid-cols-[15rem_minmax(0,1fr)] md:gap-x-10";

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

/**
 * Art direction: a tall poster fills a phone screen the way the 16:9 backdrop
 * cannot, so phones get the poster and wider screens get the backdrop. Each one
 * stands in for the other when TMDB only has one of them.
 */
function HeroArt({
	detail,
	children,
}: {
	detail: MediaDetail;
	children?: React.ReactNode;
}) {
	const backdrop = backdropUrl(detail.backdropPath, "w1280");
	const portrait = posterUrl(detail.posterPath, "w780") ?? backdrop;
	const landscape = backdrop ?? portrait;

	return (
		<div className="absolute inset-x-0 top-0 h-[78svh] overflow-hidden md:h-[80vh]">
			{landscape && portrait ? (
				<picture>
					<source media="(min-width: 48em)" srcSet={landscape} />
					{/* Decorative: the poster and the h1 below already identify the title. */}
					<img
						src={portrait}
						alt=""
						fetchPriority="high"
						className="size-full object-cover object-top"
					/>
				</picture>
			) : (
				<div className="size-full bg-linear-to-br from-(--mantine-color-brand-9) to-(--mantine-color-dark-7)" />
			)}

			{/* Fades the art into the page so the text below stays readable. */}
			<div
				aria-hidden
				className="absolute inset-0 bg-linear-to-b from-black/40 via-(--mantine-color-body)/50 via-50% to-(--mantine-color-body)"
			/>
			<div
				aria-hidden
				className="absolute inset-0 hidden bg-linear-to-r from-(--mantine-color-body)/80 via-transparent md:block"
			/>

			{children}
		</div>
	);
}

/**
 * Goes back when the user came from inside the app, so the list they were on
 * keeps its scroll position. A deep link has no history, so it falls back to
 * the matching section instead of leaving the site.
 */
function BackButton({ mediaType }: { mediaType: MediaDetail["mediaType"] }) {
	const router = useRouter();
	const canGoBack = useCanGoBack();

	const goBack = () => {
		if (canGoBack) {
			router.history.back();
			return;
		}
		router.navigate({ to: mediaType === "movie" ? "/movies" : "/tv-shows" });
	};

	return (
		<ActionIcon
			variant="filled"
			color="dark"
			radius="xl"
			size="xl"
			aria-label="Go back"
			onClick={goBack}
			className="absolute top-4 left-4 bg-black/40 backdrop-blur-md hover:bg-black/60 sm:left-6 lg:left-8"
		>
			<IconArrowLeft size={22} />
		</ActionIcon>
	);
}

/** For ids TMDB does not know, or a param that is not an id at all. */
export function MediaDetailNotFound({
	mediaType,
}: {
	mediaType: MediaDetail["mediaType"];
}) {
	const isMovie = mediaType === "movie";
	return (
		<Container size="sm" py="xl" className="text-center">
			<Title order={1} className="text-2xl text-white">
				{isMovie
					? "We could not find this movie"
					: "We could not find this series"}
			</Title>
			<Text c="dimmed" mt="sm">
				The link may be outdated, or TMDB no longer lists this title.
			</Text>
			<Button
				component={Link}
				to={isMovie ? "/movies" : "/tv-shows"}
				mt="lg"
				radius="xl"
			>
				{isMovie ? "Browse movies" : "Browse series"}
			</Button>
		</Container>
	);
}

/** Mirrors the hero's layout so the content does not jump when it arrives. */
export function MediaDetailSkeleton() {
	return (
		<div aria-busy className={`relative ${FULL_BLEED}`}>
			<Skeleton
				className="absolute inset-x-0 top-0 h-[78svh] md:h-[80vh]"
				radius={0}
			/>
			<Container
				size="xl"
				className="relative px-4 pt-[48svh] pb-10 sm:px-6 md:pt-[38vh] lg:px-8"
			>
				<div className={LAYOUT}>
					<Skeleton radius="lg" className="aspect-2/3 md:row-span-2" />
					<div>
						<Skeleton height={18} width={80} radius="sm" />
						<Skeleton height={32} width="80%" mt="md" radius="sm" />
						<Skeleton height={14} width="60%" mt="md" radius="sm" />
						<Skeleton height={12} mt="lg" radius="sm" />
						<Skeleton height={12} mt={8} radius="sm" />
						<Skeleton height={12} mt={8} width="70%" radius="sm" />
					</div>
					<div className="col-span-2 md:col-span-1 md:col-start-2">
						<Skeleton height={50} radius="xl" className="md:max-w-60" />
					</div>
				</div>
			</Container>
		</div>
	);
}
