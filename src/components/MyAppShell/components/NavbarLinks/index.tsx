import { AppShell, NavLink } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { navLinks } from "../../nav-links";

export function NavbarLinks() {
	const links = navLinks.map((item) => (
		<NavLink
			component={Link}
			variant="filled"
			key={item.to}
			label={item.label}
			to={item.to}
		/>
	));

	return (
		<>
			<AppShell.Section p="md">TMDB</AppShell.Section>
			<AppShell.Section p="md">{links}</AppShell.Section>

			{/* <div className={classes.footer}>
				<a
					href="#"
					className={classes.link}
					onClick={(event) => event.preventDefault()}
				>
					<IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
					<span>Change account</span>
				</a>

				<a
					href="#"
					className={classes.link}
					onClick={(event) => event.preventDefault()}
				>
					<IconLogout className={classes.linkIcon} stroke={1.5} />
					<span>Logout</span>
				</a>
			</div> */}
		</>
	);
}
