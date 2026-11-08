import type {
	WatchMonetizationType,
	WatchProvider,
	WatchProviderItem,
} from "@lorenzopant/tmdb";
import { sortBy } from "es-toolkit";
import { getLocale } from "#/paraglide/runtime";

/** A streaming service, store or channel, shown as its logo. */
export type WatchService = { id: number; name: string; logoPath: string };

export type WatchOffer = {
	type: WatchMonetizationType;
	services: WatchService[];
};

/**
 * Where a title can be watched in one country. The data is JustWatch's, passed
 * on by TMDB, and its terms require crediting JustWatch wherever it is shown.
 */
export type WatchAvailability = {
	/** ISO 3166-1 code, such as "MX". */
	region: string;
	/** TMDB's page with every option in that country; null when there are none. */
	link: string | null;
	/** Only the types with services, in `OFFER_ORDER`. */
	offers: WatchOffer[];
};

/**
 * What a viewer checks first: the services they may already pay for, then the
 * free ones, then paying for this one title.
 */
const OFFER_ORDER = [
	"flatrate",
	"free",
	"ads",
	"rent",
	"buy",
] as const satisfies WatchMonetizationType[];

const FALLBACK_REGION = "US";

/**
 * The viewer's country, from the first language their browser asks for:
 * "es-MX" gives MX, and a bare "es" gives the most likely country, ES. TMDB
 * splits availability by country, and the app has no better source for it.
 */
export function regionFromAcceptLanguage(header: string | undefined): string {
	const tag = header?.split(",")[0]?.split(";")[0]?.trim();
	if (!tag) return FALLBACK_REGION;

	try {
		const { region } = new Intl.Locale(tag).maximize();
		// Areas such as "419" (Latin America) are not countries TMDB knows.
		return region && /^[A-Z]{2}$/.test(region) ? region : FALLBACK_REGION;
	} catch {
		return FALLBACK_REGION; // "*" or a malformed tag
	}
}

function fromProviderItem(item: WatchProviderItem): WatchService {
	return {
		id: item.provider_id,
		// Some names arrive with trailing spaces ("Movistar Plus+ Ficción Total ").
		name: item.provider_name.trim(),
		logoPath: item.logo_path,
	};
}

/**
 * Keeps only the viewer's country: TMDB sends every country at once, around
 * 40 KB for a popular movie, and the page shows one.
 */
export function pickWatchAvailability(
	byRegion: Partial<Record<string, WatchProvider>>,
	region: string,
): WatchAvailability {
	const options = byRegion[region];

	return {
		region,
		link: options?.link ?? null,
		offers: OFFER_ORDER.flatMap((type) => {
			const items = options?.[type] ?? [];
			if (items.length === 0) return [];
			const services = sortBy(items, ["display_priority"]).map(
				fromProviderItem,
			);
			return [{ type, services }];
		}),
	};
}

export function regionName(code: string): string {
	try {
		return (
			new Intl.DisplayNames([getLocale()], { type: "region" }).of(code) ?? code
		);
	} catch {
		return code;
	}
}
