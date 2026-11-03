import { Container } from "@mantine/core";
import { useState } from "react";
import { MyBackButton } from "#/components/MyBackButton";
import { FULL_BLEED, LAYOUT } from "../../utils/hero-layout";
import type { MediaDetail } from "../../utils/media-detail";
import { TrailerModal } from "../TrailerModal";
import { HeroActions } from "./components/HeroActions";
import { HeroArt } from "./components/HeroArt";
import { HeroInfo } from "./components/HeroInfo";
import { HeroPoster } from "./components/HeroPoster";
import { PlayTrailerOverlay } from "./components/PlayTrailerOverlay";

export function MediaDetailHero({ detail }: { detail: MediaDetail }) {
	const [isTrailerOpen, setTrailerOpen] = useState(false);
	const { trailer } = detail;
	const openTrailer = () => setTrailerOpen(true);

	return (
		<article className={`relative ${FULL_BLEED}`}>
			<HeroArt detail={detail}>
				{trailer && (
					<PlayTrailerOverlay title={detail.title} onPlay={openTrailer} />
				)}
			</HeroArt>

			<div className="absolute top-4 left-4 z-10">
				<MyBackButton
					fallback={{
						to: detail.mediaType === "movie" ? "/movies" : "/tv-shows",
					}}
				/>
			</div>

			<Container size="lg" px={0} className="relative pt-[48svh] md:pt-[38vh]">
				<div className={LAYOUT}>
					<HeroPoster posterPath={detail.posterPath} title={detail.title} />
					<HeroInfo detail={detail} />
					<HeroActions
						genres={detail.genres}
						hasTrailer={Boolean(trailer)}
						onPlayTrailer={openTrailer}
					/>
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
