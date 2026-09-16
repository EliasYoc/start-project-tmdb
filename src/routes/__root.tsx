import { createTheme, MantineProvider } from "@mantine/core";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { getLocale } from "#/paraglide/runtime";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";
import "@mantine/core/styles.css";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async () => {
		// Other redirect strategies are possible; see
		// https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#offline-redirect
		if (typeof document !== "undefined") {
			document.documentElement.setAttribute("lang", getLocale());
		}
	},

	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				name: "theme-color",
				content: "#0f0f14",
			},
			{
				title: "CineRadar — find what to watch tonight",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
	notFoundComponent: () => <p>Lleguele, aqui no hay nada</p>,
});

const theme = createTheme({
	primaryColor: "brand",
	primaryShade: 6,
	defaultRadius: "md",
	fontFamily:
		"Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
	headings: { fontWeight: "700" },
	colors: {
		brand: [
			"#f6f0ff",
			"#e9dcff",
			"#d0b6ff",
			"#b68eff",
			"#a06bff",
			"#8b4bff",
			"#7c3aed",
			"#6a2dd1",
			"#5623ab",
			"#3f1a7d",
		],
		// Near-black surfaces so cards and the app background read as one dark sheet.
		dark: [
			"#e6e6ee",
			"#c7c7d4",
			"#9d9dae",
			"#76768a",
			"#4a4a5c",
			"#2b2b36",
			"#1f1f29",
			"#0f0f14",
			"#0b0b0f",
			"#08080b",
		],
	},
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		// The scheme is written straight onto the markup rather than injected by
		// `ColorSchemeScript`: the script runs before hydration, so React would
		// find an attribute on <html> that its own SSR output does not have and
		// report a hydration mismatch. Forced dark needs no script anyway.
		<html lang={getLocale()} data-mantine-color-scheme="dark">
			<head>
				<HeadContent />
			</head>
			<body>
				<MantineProvider forceColorScheme="dark" theme={theme}>
					{children}
				</MantineProvider>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
