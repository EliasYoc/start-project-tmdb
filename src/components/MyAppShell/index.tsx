import { AppShell, Group } from "@mantine/core";
import { FooterNav } from "./components/FooterNav";
import { NavbarLinks } from "./components/NavbarLinks";

/** App frame: a bottom tab bar on phones, the side navbar from `sm` up. */
const MyAppShell = ({ children }: { children: React.ReactNode }) => {
	return (
		<AppShell
			layout="alt"
			header={{ height: 60 }}
			footer={{ height: { base: 64, sm: 0 } }}
			navbar={{
				width: 300,
				breakpoint: "sm",
				collapsed: { mobile: true },
			}}
			// aside={{
			// 	width: 300,
			// 	breakpoint: "md",
			// 	collapsed: { desktop: false, mobile: true },
			// }}
			padding="md"
		>
			<AppShell.Navbar visibleFrom="sm">
				<NavbarLinks />
			</AppShell.Navbar>
			<AppShell.Header>
				<Group h="100%" px="md">
					Header
				</Group>
			</AppShell.Header>
			<AppShell.Main className="space-y-6">{children}</AppShell.Main>
			{/* <AppShell.Aside p="md">Aside</AppShell.Aside> */}
			<FooterNav />
		</AppShell>
	);
};

export default MyAppShell;
