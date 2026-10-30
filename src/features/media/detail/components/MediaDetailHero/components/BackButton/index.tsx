import { ActionIcon } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import type { MediaDetail } from "../../../../utils/media-detail";

/**
 * Goes back when the user came from inside the app, so the list they were on
 * keeps its scroll position. A deep link has no history, so it falls back to
 * the matching section instead of leaving the site.
 */
export function BackButton({
	mediaType,
}: {
	mediaType: MediaDetail["mediaType"];
}) {
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
