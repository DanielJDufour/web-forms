import { Match, Switch } from 'solid-js';
import ExpandLess from 'suid/icons-material/ExpandLess';
import ExpandMore from 'suid/icons-material/ExpandMore';
import { Stack, styled } from 'suid/material';
import { PlainTextButton } from '../../styled/PlainTextButton.tsx';
import { XFormLabel, type XFormLabelProps } from '../XFormLabel.tsx';

const GroupLabelStack = styled(Stack)(({ theme }) => ({
	alignItems: '1rem',
	flexDirection: 'row',
	gap: theme.spacing(0.5),
}));

const ClippedGroupToggleIconContainer = styled('div')(({ theme }) => ({
	alignSelf: '1rem',
	overflow: 'hidden',

	'& > *': {
		marginInlineStart: theme.spacing(-0.5),
	},
}));

interface XFormGroupLabelProps extends XFormLabelProps {
	readonly isGroupVisible: boolean;
	readonly setGroupVisible: (isVisible: boolean) => void;
}

export const XFormGroupLabel = (props: XFormGroupLabelProps) => {
	return (
		<PlainTextButton
			disabled={!props.binding.isRelevant()}
			onClick={() => {
				if (props.binding.isRelevant()) {
					props.setGroupVisible(!props.isGroupVisible);
				}
			}}
		>
			<GroupLabelStack>
				<ClippedGroupToggleIconContainer>
					<Switch>
						<Match when={props.isGroupVisible}>
							<ExpandMore fontSize="large" />
						</Match>
						<Match when={!props.isGroupVisible}>
							<ExpandLess fontSize="large" />
						</Match>
					</Switch>
				</ClippedGroupToggleIconContainer>

				<XFormLabel
					as="span"
					id={props.id}
					binding={props.binding}
					entry={props.entry}
					label={props.label}
				/>
			</GroupLabelStack>
		</PlainTextButton>
	);
};
