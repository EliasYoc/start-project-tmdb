import { AppShell, NavLink } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import glassClasses from "../../glass.module.css";
import { navLinks } from "../../nav-links";
import classes from "./SidebarNav.module.css";

/**
 * The side navigation from `sm` up: a glass panel floating inset from the
 * screen edges, the desktop counterpart of the phone's floating tab bar.
 */
export function SidebarNav() {
	return (
		<AppShell.Navbar
			visibleFrom="sm"
			withBorder={false}
			aria-label="Main"
			className={classes.navbar}
		>
			<div className={`${glassClasses.surface} ${classes.panel}`}>
				<AppShell.Section p="md">TMDB</AppShell.Section>
				<AppShell.Section p="md">
					{navLinks.map(({ label, icon, activeIcon, ...link }) => (
						<NavLink
							key={link.to}
							variant="filled"
							component={Link}
							label={label}
							className={classes.link}
							{...link}
						/>
					))}
				</AppShell.Section>
			</div>
		</AppShell.Navbar>
	);
}
