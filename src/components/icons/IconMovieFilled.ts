import { createReactComponent } from "@tabler/icons-react";

// Tabler ships IconMovie only as outline. This is its filled counterpart: the same
// film-strip silhouette, solid, with the side perforations punched out.
// Holes are drawn counter-clockwise so the nonzero fill rule cuts them.
export const IconMovieFilled = createReactComponent(
	"filled",
	"movie-filled",
	"MovieFilled",
	[
		[
			"path",
			{
				d: "M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3z M5 5v2h2v-2z M5 9v2h2v-2z M5 13v2h2v-2z M5 17v2h2v-2z M17 5v2h2v-2z M17 9v2h2v-2z M17 13v2h2v-2z M17 17v2h2v-2z",
				key: "svg-0",
			},
		],
	],
);
