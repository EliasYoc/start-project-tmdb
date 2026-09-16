import { AppShell } from "@mantine/core";
import { AppHeader } from "./components/AppHeader";
import { BottomNav } from "./components/BottomNav";
import { NavbarLinks } from "./components/NavbarLinks";

const MyAppShell = ({ children }: { children: React.ReactNode }) => {
	return (
		<AppShell
			header={{ height: { base: 72, sm: 76 } }}
			// The sidebar is the desktop navigation; phones get the bottom bar instead,
			// so there is no burger and nothing to toggle.
			navbar={{ width: 240, breakpoint: "sm", collapsed: { mobile: true } }}
			footer={{ height: { base: 72, sm: 0 } }}
			padding={0}
			withBorder={false}
		>
			<AppShell.Header className="border-b border-white/5 bg-surface-1">
				<AppHeader />
			</AppShell.Header>

			<AppShell.Navbar className="border-r border-white/5 bg-surface-1">
				<NavbarLinks />
				<AppShell.Section p="sm">
					<TmdbAttribution />
				</AppShell.Section>
			</AppShell.Navbar>

			<AppShell.Main>
				{children}
				{/* On desktop the attribution lives at the foot of the sidebar; phones
				    have no sidebar, so every page carries it here instead. */}
				<footer className="px-4 pb-6 sm:hidden">
					<TmdbAttribution />
				</footer>
			</AppShell.Main>

			<AppShell.Footer
				hiddenFrom="sm"
				className="border-t border-white/5 bg-surface-1"
			>
				<BottomNav />
			</AppShell.Footer>
		</AppShell>
	);
};

/** Required by the TMDB API terms of use. */
export function TmdbAttribution() {
	return (
		<p className="text-[11px] leading-relaxed text-neutral-500">
			This product uses the{" "}
			<a
				href="https://www.themoviedb.org/"
				target="_blank"
				rel="noreferrer"
				className="text-neutral-400 underline underline-offset-2 hover:text-neutral-300"
			>
				TMDB
			</a>{" "}
			API but is not endorsed or certified by TMDB.
		</p>
	);
}

export default MyAppShell;
