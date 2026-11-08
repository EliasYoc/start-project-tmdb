import { AspectRatio, Modal } from "@mantine/core";
import type { Trailer } from "../../utils/media-detail";

/**
 * Mantine unmounts the modal body when it closes, so the iframe (and the video
 * it is playing) goes away with it instead of playing on in the background.
 */
export function TrailerModal({
	trailer,
	opened,
	onClose,
}: {
	trailer: Trailer;
	opened: boolean;
	onClose: () => void;
}) {
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={trailer.name}
			size="70rem"
			centered
			padding={0}
			radius="lg"
			classNames={{ header: "px-4", title: "truncate font-semibold" }}
		>
			<AspectRatio ratio={16 / 9}>
				<iframe
					src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0`}
					title={trailer.name}
					allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
					allowFullScreen
					className="border-0"
				/>
			</AspectRatio>
		</Modal>
	);
}
