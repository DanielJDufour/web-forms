import type { BaseNode } from '../../client/BaseNode.ts';
import type { TextRange } from '../../client/TextRange.ts';
import type { EngineClientState } from '../../lib/reactivity/engine-client-state.ts';
import type { AnyDescendantNodeDefinition } from '../../model/DescendentNodeDefinition.ts';
import type { AnyNodeDefinition } from '../../model/NodeDefinition.ts';
import type { RepeatInstanceDefinition } from '../../model/RepeatInstanceDefinition.ts';
import type { RepeatSequenceDefinition } from '../../model/RepeatSequenceDefinition.ts';
import type { RepeatRange } from '../RepeatRange.ts';
import type { AnyChildNode, GeneralParentNode } from '../hierarchy.ts';
import type { EvaluationContext } from '../internal-api/EvaluationContext.ts';
import type { SubscribableDependency } from '../internal-api/SubscribableDependency.ts';
import type { InstanceNodeState } from './InstanceNode.ts';
import { InstanceNode } from './InstanceNode.ts';

export interface DescendantNodeState extends InstanceNodeState {
	get reference(): string;
	get readonly(): boolean;
	get relevant(): boolean;
	get required(): boolean;
	get label(): TextRange<'label'> | null;
	get hint(): TextRange<'hint'> | null;
	get children(): readonly AnyChildNode[] | null;
	get valueOptions(): unknown;
	get value(): unknown;
}

// prettier-ignore
export type DescendantNodeDefinition = Extract<
	AnyNodeDefinition,
	AnyDescendantNodeDefinition
>;

// prettier-ignore
type DescendantNodeParent<Definition extends DescendantNodeDefinition> =
	Definition extends RepeatInstanceDefinition
		? RepeatRange
		: GeneralParentNode;

type DescendantContextNode<Definition extends DescendantNodeDefinition> =
	Definition extends RepeatSequenceDefinition ? Comment : Element;

export abstract class DescendantNode<
		Definition extends DescendantNodeDefinition,
		State extends DescendantNodeState,
	>
	extends InstanceNode<Definition, State>
	implements BaseNode, EvaluationContext, SubscribableDependency
{
	abstract override readonly contextNode: DescendantContextNode<Definition>;

	/**
	 * To be called when:
	 *
	 * - the node itself is removed
	 * - a parent/ancestor has been removed(?)
	 *
	 * Implies, at least, a call to `this.scope.dispose()`; possibly make an
	 * exception for repeat instances, which we might want to retain in case
	 * they're re-added. This came up as a behavior of Collect/JavaRosa, and we
	 * should investigate the details and ramifications of that, and whether it's
	 * the desired behavior.
	 */
	abstract remove(): void;

	constructor(
		override readonly parent: DescendantNodeParent<Definition>,
		override readonly definition: Definition,
		state?: EngineClientState<State>
	) {
		// Temporary, we'll deal with other node-specific aspects of state
		// initialization in subsequent commits.
		if (state == null) {
			throw new Error('Engine/client state bridge not implemented for node');
		}

		super(parent.engineConfig, definition, state);
	}
}
