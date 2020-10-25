<template>
	<div class="v-diff">
		<div v-for="{ field, diff } in diffs" :key="field" class="change">
			<p>{{ $helpers.formatTitle(field) }}</p>
			<div class="diff">
				<span
					v-for="(part, index) in diff"
					:key="index"
					:class="{ added: part.added, removed: part.removed }"
				>
					<span v-if="part.added || part.removed || part.value.length < 30 || expanded">
						{{ part.value }}
					</span>
					<span v-else>
						<span>{{ part.value.substring(0, 10) }}</span>
						<div @click="expanded = true" class="compacted"><div /></div>
						<span>
							{{ part.value.substring(part.value.length - 10, part.value.length) }}
						</span>
					</span>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import { diffWordsWithSpace } from 'diff';

export default {
	name: 'VDiff',
	props: {
		changes: {
			type: Object,
			required: true
		}
	},
	computed: {
		diffs() {
			return Object.keys(this.changes).map(key => {
				let { field, before, after } = this.changes[key];
				if (before === null || typeof before === 'undefined') {
					before = '';
				}
				if (after === null || typeof after === 'undefined') {
					after = '';
				}
				return {
					field,
					diff: diffWordsWithSpace(String(before), String(after))
				};
			});
		}
	},
	data() {
		return {
			expanded: false
		};
	}
};
</script>

<style lang="scss" scoped>
.change {
	width: 100%;
	margin-top: 16px;

	p {
		margin-bottom: 4px;
		// color: var(--blue-grey-300);
	}

	.diff {
		width: 100%;
		border-radius: var(--border-radius);
		overflow: hidden;
		font-size: 13px;
		word-break: break-word;
		background-color: var(--page-background-color);
		padding: 2px;
		.added,
		.removed {
			margin: 0 2px;
		}
		.added {
			background-color: var(--success);
		}
		.removed {
			background-color: var(--danger);
		}
	}

	.compacted {
		cursor: pointer;
		&:hover {
			color: var(--note-text-color);
		}
		div {
			position: relative;
			&,
			&:before,
			&:after {
				content: '';
				width: 5px;
				height: 5px;
				border-radius: 3px;
				background-color: currentColor;
			}
			&:before {
				position: absolute;
				left: 12px;
			}
			&:after {
				position: absolute;
				right: 12px;
			}
			margin: 8px auto;
		}
	}
}
</style>
