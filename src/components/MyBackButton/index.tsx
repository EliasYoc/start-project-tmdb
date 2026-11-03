import { ActionIcon } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import {
	type RegisteredRouter,
	useCanGoBack,
	useNavigate,
	useRouter,
	type ValidateNavigateOptions,
} from "@tanstack/react-router";

type MyBackButtonProps<
	TRouter extends RegisteredRouter = RegisteredRouter,
	TOptions = unknown,
> = {
	/** Where to go when there is no in-app history, as after opening a shared link. */
	fallback: ValidateNavigateOptions<TRouter, TOptions>;
};

/**
 * Goes back when the user came from inside the app, so the page they were on
 * keeps its scroll position. A deep link has no history, so it goes to
 * `fallback` instead of leaving the site. Translucent so it reads over images;
 * the caller positions it.
 */
export function MyBackButton<TRouter extends RegisteredRouter, TOptions>(
	props: MyBackButtonProps<TRouter, TOptions>,
): React.ReactNode;
export function MyBackButton({ fallback }: MyBackButtonProps) {
	const router = useRouter();
	const navigate = useNavigate();
	const canGoBack = useCanGoBack();

	const goBack = () => {
		if (canGoBack) {
			router.history.back();
			return;
		}
		navigate(fallback);
	};

	return (
		<ActionIcon
			variant="filled"
			color="dark"
			radius="xl"
			size="xl"
			vars={() => ({
				root: {
					"--ai-bg": "rgb(0 0 0 / 0.4)",
					"--ai-hover": "rgb(0 0 0 / 0.6)",
				},
			})}
			aria-label="Go back"
			onClick={goBack}
			className="backdrop-blur-md"
		>
			<IconArrowLeft size={22} />
		</ActionIcon>
	);
}
