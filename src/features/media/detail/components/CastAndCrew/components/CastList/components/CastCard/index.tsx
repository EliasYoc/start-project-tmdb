import { Avatar, Text } from "@mantine/core";
import { profileUrl } from "#/integrations/tmdb/images";
import {
	type CastMember,
	formatEpisodes,
} from "../../../../../../utils/media-credits";

/**
 * Not a link yet: the person page does not exist. When it does, wrap the
 * card's content in `<Link to="/people/$personId">` using `person.id`.
 */
export function CastCard({ person }: { person: CastMember }) {
	return (
		<li className="flex w-24 shrink-0 snap-start flex-col items-center gap-2 text-center md:w-auto md:flex-row md:gap-4 md:text-left">
			{/* Many people have no photo on TMDB; Avatar falls back to their initials. */}
			<Avatar
				src={profileUrl(person.profilePath)}
				alt={`Photo of ${person.name}`}
				name={person.name}
				color="initials"
				size={72}
				imageProps={{ loading: "lazy", decoding: "async" }}
				className="shrink-0"
			/>

			<div className="min-w-0">
				<Text size="sm" fw={600} lineClamp={2}>
					{person.name}
				</Text>
				{person.character && (
					<Text size="xs" c="dimmed" lineClamp={2} mt={2}>
						{person.character}
					</Text>
				)}
				{person.episodeCount !== null && (
					<Text size="xs" c="dimmed" mt={2}>
						{formatEpisodes(person.episodeCount)}
					</Text>
				)}
			</div>
		</li>
	);
}
