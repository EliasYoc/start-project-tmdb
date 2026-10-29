import { AppShell, Group } from "@mantine/core";
import { FooterNav } from "./components/FooterNav";
import { NavbarLinks } from "./components/NavbarLinks";

const MyAppShell = ({ children }: { children: React.ReactNode }) => {
	return (
		<AppShell
			layout="alt"
			header={{ height: 60 }}
			// Mobile tab bar only; from sm up the navbar takes over and the footer
			// releases its offset.
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
			<AppShell.Main>{children}</AppShell.Main>
			{/* <AppShell.Aside p="md">Aside</AppShell.Aside> */}
			<FooterNav />
		</AppShell>
	);
};

export default MyAppShell;
