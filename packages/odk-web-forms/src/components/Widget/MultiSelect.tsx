import { createMemo, For, Show } from 'solid-js';
import { Checkbox, FormControlLabel, FormGroup } from 'suid/material';
import type { SelectState } from '../../lib/xform/state/value/SelectState.ts';
import type { SelectNDefinition } from '../XForm/controls/SelectControl.tsx';
import { XFormControlLabel } from '../XForm/controls/XFormControlLabel.tsx';

export interface MultiSelectProps {
	readonly control: SelectNDefinition;
	readonly state: SelectState;
}

export const MultiSelect = (props: MultiSelectProps) => {
	const selectState = props.state.createSelect(props.control);
	const isDisabled = createMemo(() => {
		return props.state.isReadonly() === true || props.state.isRelevant() === false;
	});

	return (
		<FormGroup role="group">
			<Show when={props.control.label} keyed={true}>
				{(label) => {
					return <XFormControlLabel state={props.state} label={label} />;
				}}
			</Show>
			<For each={selectState.items()}>
				{(item) => {
					return (
						<FormControlLabel
							label={item.label()}
							disabled={isDisabled()}
							control={
								<Checkbox
									checked={selectState.isSelected(item)}
									onChange={(_, checked) => {
										if (checked) {
											selectState.select(item);
										} else {
											selectState.deselect(item);
										}
									}}
								/>
							}
						/>
					);
				}}
			</For>
		</FormGroup>
	);
};
