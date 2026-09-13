import { AppShell, Burger, Group } from "@mantine/core";
import { useState } from "react";
import { NavbarLinks } from "./components/NavbarLinks";

const MyAppShell = ({ children }: { children: React.ReactNode }) => {
	const [isOpened, setOpened] = useState(false);

	const toggle = () => setOpened((o) => !o);
	return (
		<AppShell
			layout="alt"
			header={{ height: 60 }}
			// footer={{ height: 60 }}
			navbar={{
				width: 300,
				breakpoint: "sm",
				collapsed: { mobile: !isOpened },
			}}
			// aside={{
			// 	width: 300,
			// 	breakpoint: "md",
			// 	collapsed: { desktop: false, mobile: true },
			// }}
			padding="md"
		>
			<AppShell.Navbar>
				<Burger opened={isOpened} onClick={toggle} hiddenFrom="sm" size="sm" />

				<NavbarLinks />
			</AppShell.Navbar>
			<AppShell.Header>
				<Group h="100%" px="md">
					<Burger
						opened={isOpened}
						onClick={toggle}
						hiddenFrom="sm"
						size="sm"
					/>
					Header
				</Group>
			</AppShell.Header>
			<AppShell.Main>{children}</AppShell.Main>
			{/* <AppShell.Aside p="md">Aside</AppShell.Aside> */}
			{/* <AppShell.Footer p="md">Footer</AppShell.Footer> */}
		</AppShell>
	);
};

export default MyAppShell;
