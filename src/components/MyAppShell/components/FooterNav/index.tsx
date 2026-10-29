import { AppShell } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { navLinks } from "../../nav-links";
import classes from "./FooterNav.module.css";

export function FooterNav() {
	return (
		<AppShell.Footer hiddenFrom="sm" className={classes.footer}>
			<nav aria-label="Main" className={classes.nav}>
				{navLinks.map(
					({ label, icon: Icon, activeIcon: ActiveIcon, ...link }) => (
						<Link key={link.to} {...link} className={classes.tab}>
							{({ isActive }) => (
								<>
									{isActive ? (
										<ActiveIcon
											className={classes.icon}
											size={24}
											aria-hidden
										/>
									) : (
										<Icon
											className={classes.icon}
											size={24}
											stroke={1.5}
											aria-hidden
										/>
									)}
									<span className={classes.label}>{label}</span>
								</>
							)}
						</Link>
					),
				)}
			</nav>
		</AppShell.Footer>
	);
}
