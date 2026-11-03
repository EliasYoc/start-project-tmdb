import { ActionIcon } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useCanGoBack, useHydrated, useRouter } from "@tanstack/react-router";

/**
 * Goes back to the previous page, which keeps its scroll position. Renders
 * nothing when there is no in-app history, as after opening a shared link.
 * Waits for hydration: the server has no history, but after a reload the
 * browser still does, so both must first agree on rendering nothing.
 */
export function MyBackButton() {
	const router = useRouter();
	const canGoBack = useCanGoBack();
	const hydrated = useHydrated();

	if (!hydrated || !canGoBack) return null;

	return (
		<ActionIcon
			variant="subtle"
			color="gray"
			radius="xl"
			size="lg"
			aria-label="Go back"
			onClick={() => router.history.back()}
		>
			<IconArrowLeft size={22} />
		</ActionIcon>
	);
}
