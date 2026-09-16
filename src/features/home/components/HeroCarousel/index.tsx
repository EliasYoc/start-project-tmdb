import { Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	FlameIcon,
	PlayIcon,
	StarIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	genreNames,
	getGenresQueryOptions,
} from "#/features/media/utils/genres";
import type { MediaItem } from "#/features/media/utils/media";
import {
	formatRating,
	formatVoteCount,
	languageName,
	releaseYear,
	tmdbWebUrl,
} from "#/features/media/utils/media";
import type { TrendingCategory } from "#/features/media/utils/trending";
import { getTrendingQueryOptions } from "#/features/media/utils/trending";
import { backdropUrl, posterUrl } from "#/integrations/tmdb/images";

const SLIDE_COUNT = 5;
const AUTOPLAY_MS = 7000;

/** Portrait crop on phones, cinematic on wide screens. */
const FRAME =
	"relative aspect-4/5 w-full shrink-0 snap-center overflow-hidden sm:aspect-video xl:aspect-[2.4/1]";

export function HeroCarousel({ category }: { category: TrendingCategory }) {
	const { data, isPending, isError } = useQuery(
		getTrendingQueryOptions(category),
	);
	const { data: genres } = useQuery(getGenresQueryOptions());

	const scrollerRef = useRef<HTMLDivElement>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const [isPaused, setPaused] = useState(false);

	const slides = data?.slice(0, SLIDE_COUNT) ?? [];

	const goTo = (index: number) => {
		const scroller = scrollerRef.current;
		if (!scroller) return;
		scroller.scrollTo({
			left: index * scroller.clientWidth,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		if (slides.length < 2 || isPaused) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const timer = window.setInterval(() => {
			const scroller = scrollerRef.current;
			if (!scroller) return;
			const current = Math.round(scroller.scrollLeft / scroller.clientWidth);
			const next = current + 1 >= slides.length ? 0 : current + 1;
			scroller.scrollTo({
				left: next * scroller.clientWidth,
				behavior: "smooth",
			});
		}, AUTOPLAY_MS);

		return () => window.clearInterval(timer);
	}, [slides.length, isPaused]);

	if (isError) {
		return (
			<div className="px-4 py-10 text-center text-sm text-neutral-400 sm:px-6">
				We could not load what is trending right now.
			</div>
		);
	}

	if (isPending || slides.length === 0) {
		return <Skeleton className={FRAME} radius={0} animate={isPending} />;
	}

	return (
		<section
			aria-roledescription="carousel"
			aria-label="Trending now"
			className="relative"
			onPointerEnter={() => setPaused(true)}
			onPointerLeave={() => setPaused(false)}
			onFocusCapture={() => setPaused(true)}
			onBlurCapture={() => setPaused(false)}
		>
			<div
				ref={scrollerRef}
				onScroll={(event) => {
					const scroller = event.currentTarget;
					setActiveIndex(
						Math.round(scroller.scrollLeft / scroller.clientWidth),
					);
				}}
				className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
			>
				{slides.map((item, index) => (
					<HeroSlide
						key={`${item.mediaType}-${item.id}`}
						item={item}
						genres={genreNames(item, genres, 2)}
						isFirst={index === 0}
						position={`${index + 1} of ${slides.length}`}
					/>
				))}
			</div>

			<div className="pointer-events-none absolute inset-y-0 right-0 left-0 hidden items-center justify-between px-3 md:flex">
				<HeroArrow
					label="Previous slide"
					onClick={() => goTo(Math.max(activeIndex - 1, 0))}
					disabled={activeIndex === 0}
				>
					<ChevronLeftIcon size={20} />
				</HeroArrow>
				<HeroArrow
					label="Next slide"
					onClick={() => goTo(Math.min(activeIndex + 1, slides.length - 1))}
					disabled={activeIndex === slides.length - 1}
				>
					<ChevronRightIcon size={20} />
				</HeroArrow>
			</div>

			<div className="flex justify-center gap-2 py-4">
				{slides.map((item, index) => (
					<button
						key={`dot-${item.mediaType}-${item.id}`}
						type="button"
						onClick={() => goTo(index)}
						aria-label={`Go to slide ${index + 1}`}
						aria-current={index === activeIndex}
						className={`h-2 rounded-full transition-all ${
							index === activeIndex
								? "w-5 bg-brand-500"
								: "w-2 bg-neutral-700 hover:bg-neutral-600"
						}`}
					/>
				))}
			</div>
		</section>
	);
}

function HeroArrow({
	label,
	onClick,
	disabled,
	children,
}: {
	label: string;
	onClick: () => void;
	disabled: boolean;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={label}
			className="pointer-events-auto grid size-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/70 disabled:pointer-events-none disabled:opacity-0"
		>
			{children}
		</button>
	);
}

function HeroSlide({
	item,
	genres,
	isFirst,
	position,
}: {
	item: MediaItem;
	genres: string[];
	isFirst: boolean;
	position: string;
}) {
	// Phones get the portrait poster; from `sm` up the 16:9 backdrop fills the frame.
	const poster = posterUrl(item.posterPath, "w780");
	const backdrop = backdropUrl(item.backdropPath, "w1280");
	const year = releaseYear(item.date);
	const language = languageName(item.originalLanguage);

	const meta = [
		item.mediaType === "tv" ? "Series" : "Movie",
		year,
		language,
		...genres,
	].filter((entry): entry is string => Boolean(entry));

	return (
		// biome-ignore lint/a11y/useSemanticElements: the carousel-slide pattern calls for role="group", not a fieldset
		<div
			className={FRAME}
			role="group"
			aria-roledescription="slide"
			aria-label={`${item.title}, ${position}`}
		>
			{poster || backdrop ? (
				<picture>
					{backdrop && <source media="(min-width: 640px)" srcSet={backdrop} />}
					<img
						src={poster ?? backdrop ?? ""}
						alt={`${item.title} artwork`}
						loading={isFirst ? "eager" : "lazy"}
						fetchPriority={isFirst ? "high" : "auto"}
						decoding="async"
						className="absolute inset-0 size-full object-cover"
					/>
				</picture>
			) : (
				<div className="absolute inset-0 bg-linear-to-br from-surface-2 to-brand-900" />
			)}

			{/* Keeps the copy legible over whatever artwork TMDB returns. */}
			<div className="absolute inset-0 bg-linear-to-t from-surface-1 via-surface-1/55 to-surface-1/10" />

			<div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 sm:p-6 lg:max-w-2xl lg:p-10">
				<p className="flex items-center gap-1.5 text-sm font-medium text-neutral-200">
					Trending
					<FlameIcon size={15} className="text-orange-400" />
				</p>

				<h2 className="text-3xl leading-tight font-extrabold text-balance text-white sm:text-4xl lg:text-5xl">
					{item.title}
				</h2>

				<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-300">
					<p className="flex flex-wrap items-center gap-2">
						{meta.map((entry, index) => (
							<span key={entry} className="flex items-center gap-2">
								{index > 0 && (
									<span aria-hidden className="text-neutral-500">
										&bull;
									</span>
								)}
								{entry}
							</span>
						))}
					</p>

					<p className="flex items-center gap-1.5 font-semibold text-white">
						<StarIcon
							size={15}
							className="text-yellow-400"
							fill="currentColor"
						/>
						{formatRating(item.voteAverage)}
						<span className="font-normal text-neutral-400">
							({formatVoteCount(item.voteCount)})
						</span>
					</p>
				</div>

				<a
					href={tmdbWebUrl(item)}
					target="_blank"
					rel="noreferrer"
					className="mt-1 inline-flex w-fit items-center gap-3 rounded-full bg-white py-2 pr-6 pl-2 text-base font-semibold text-surface-1 no-underline transition hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
				>
					<span className="grid size-9 place-items-center rounded-full bg-brand-600 text-white">
						<PlayIcon size={16} fill="currentColor" strokeWidth={0} />
					</span>
					View details
				</a>
			</div>
		</div>
	);
}
