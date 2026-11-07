import { Text } from "@mantine/core";
import { posterUrl } from "#/integrations/tmdb/images";
import {
	type Season,
	seasonMeta,
} from "../../../../../../utils/series-seasons";

/**
 * Not a link: there is no season page yet. Without a poster, the season's name
 * stands in on a plain tile so the rail keeps its rhythm.
 */
export function SeasonCard({
	season,
	seriesTitle,
}: {
	season: Season;
	/** For the poster's alt text. */
	seriesTitle: string;
}) {
	const poster = posterUrl(season.posterPath);

	return (
		<li className="w-28 shrink-0 snap-start sm:w-32 lg:w-36">
			<div className="aspect-2/3 overflow-hidden rounded-lg bg-(--mantine-color-dark-6)">
				{poster ? (
					<img
						src={poster}
						alt={`Poster for ${seriesTitle}, ${season.name}`}
						loading="lazy"
						decoding="async"
						className="size-full object-cover"
					/>
				) : (
					<div
						aria-hidden
						className="flex size-full items-center justify-center bg-linear-to-br from-(--mantine-color-dark-6) to-(--mantine-color-brand-9) px-3 text-center text-sm font-semibold text-neutral-300"
					>
						{season.name}
					</div>
				)}
			</div>
			<Text size="sm" fw={600} mt="xs" lineClamp={2}>
				{season.name}
			</Text>
			<Text size="xs" c="dimmed" mt={2}>
				{seasonMeta(season).join(" · ")}
			</Text>
		</li>
	);
}
