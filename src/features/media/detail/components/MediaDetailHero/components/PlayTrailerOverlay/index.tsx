import { ActionIcon } from "@mantine/core";
import { IconPlayerPlayFilled } from "@tabler/icons-react";

export function PlayTrailerOverlay({
	title,
	onPlay,
}: {
	title: string;
	onPlay: () => void;
}) {
	return (
		<ActionIcon
			variant="white"
			color="dark"
			radius="xl"
			size={72}
			pos="absolute"
			aria-label={`Play trailer for ${title}`}
			onClick={onPlay}
			className="top-[38%] left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 shadow-xl transition-transform hover:scale-105"
		>
			<IconPlayerPlayFilled size={30} />
		</ActionIcon>
	);
}
