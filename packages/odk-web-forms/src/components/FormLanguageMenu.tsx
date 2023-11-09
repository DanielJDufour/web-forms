// TODO: lots of this should get broken out

import { createSignal } from 'solid-js';
import { For, Show } from 'solid-js/web';
import Check from 'suid/icons-material/Check';
import ExpandMore from 'suid/icons-material/ExpandMore';
import Language from 'suid/icons-material/Language';
import {
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Stack,
	Typography,
	styled,
} from 'suid/material';
import type { XFormEntry } from '../lib/xform/XFormEntry.ts';
import { PageMenuButton } from './styled/PageMenuButton.tsx';

const FormLanguageMenuButtonIcon = styled(Language)(({ theme }) => ({
	paddingInlineEnd: theme.spacing(0.5),
}));

const FormLanguageMenuExpandMoreIcon = styled(ExpandMore)(({ theme }) => ({
	paddingInlineStart: theme.spacing(0.25),
}));

const MenuItemSmallTypography = styled(Typography)({
	fontSize: '0.875rem',
});

interface FormLanguageMenuProps {
	readonly entry: XFormEntry | null;
}

export const FormLanguageMenu = (props: FormLanguageMenuProps) => {
	let buttonRef: HTMLButtonElement;

	const [isOpen, setIsOpen] = createSignal(false);
	const closeMenu = () => {
		setIsOpen(false);
	};

	return (
		<Show when={props.entry?.isTranslated && props.entry} keyed={true}>
			{(entry) => {
				const currentLanguage = () => entry.getCurrentLanguage();

				return (
					<div>
						<PageMenuButton
							id="form-language-menu-button"
							ref={buttonRef}
							aria-controls={isOpen() ? 'form-language-menu' : ''}
							aria-expanded={isOpen()}
							aria-aria-haspopup={true}
							onClick={() => {
								setIsOpen((current) => !current);
							}}
							variant="contained"
						>
							<Stack alignItems="center" direction="row">
								<FormLanguageMenuButtonIcon fontSize="small" />
								<span style={{ 'line-height': 1 }}>{currentLanguage()}</span>
								<FormLanguageMenuExpandMoreIcon fontSize="small" />
							</Stack>
						</PageMenuButton>
						<Menu
							id="form-language-menu"
							MenuListProps={{ 'aria-labelledby': 'form-language-menu-button', dense: true }}
							// TODO: what to do on resize while menu open?
							anchorEl={buttonRef}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'right',
							}}
							open={isOpen()}
							onClose={closeMenu}
							PaperProps={{
								sx: {
									minWidth: '20ch',
								},
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
						>
							<For each={entry.getLanguages()}>
								{(language) => {
									const isSelected = () => language === currentLanguage();

									return (
										<MenuItem
											dense={true}
											selected={isSelected()}
											onClick={() => {
												entry.setCurrentLanguage(language);
												closeMenu();
											}}
										>
											<Show when={isSelected()}>
												<ListItemIcon>
													<Check fontSize="small" />
												</ListItemIcon>
											</Show>

											<ListItemText inset={!isSelected()} disableTypography={true}>
												<MenuItemSmallTypography>{language}</MenuItemSmallTypography>
											</ListItemText>
										</MenuItem>
									);
								}}
							</For>
						</Menu>
					</div>
				);
			}}
		</Show>
	);
};
