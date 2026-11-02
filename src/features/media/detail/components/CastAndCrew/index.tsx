import { Text } from "@mantine/core";
import { type MediaDetail, railScrollId } from "../../utils/media-detail";
import { DetailSection } from "../DetailSection";
import { CastList } from "./components/CastList";
import { CrewList } from "./components/CrewList";

/**
 * Cast always gets its section, even empty, because a missing cast is worth
 * saying out loud. Crew is skipped when empty: on the titles where TMDB has no
 * cast it rarely has crew either, and one notice is enough.
 */
export function CastAndCrew({ detail }: { detail: MediaDetail }) {
	const { credits } = detail;

	return (
		<>
			<DetailSection title="Top cast">
				{credits.cast.length > 0 ? (
					<CastList
						cast={credits.cast}
						scrollRestorationId={railScrollId(detail, "cast")}
					/>
				) : (
					<Text size="sm" c="dimmed">
						TMDB has no cast listed for this title yet.
					</Text>
				)}
			</DetailSection>

			{credits.crew.length > 0 && (
				<DetailSection title="Crew">
					<CrewList crew={credits.crew} />
				</DetailSection>
			)}
		</>
	);
}
