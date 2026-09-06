import { TMDB } from "@lorenzopant/tmdb";
import { env } from "#/env";

if (!env.TMDB_ACCESS_TOKEN) {
	throw new Error("Falta la variable de entorno TMDB_ACCESS_TOKEN");
}

export const tmdb = new TMDB(env.TMDB_ACCESS_TOKEN);
