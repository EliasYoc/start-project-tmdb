import { Container } from "@mantine/core";
import { useState } from "react";
import { FULL_BLEED, LAYOUT } from "../../utils/hero-layout";
import type { MediaDetail } from "../../utils/media-detail";
import { TrailerModal } from "../TrailerModal";
import { BackButton } from "./components/BackButton";
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

			<BackButton mediaType={detail.mediaType} />

			<Container size="lg" className="relative pt-[48svh] md:pt-[38vh]">
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
