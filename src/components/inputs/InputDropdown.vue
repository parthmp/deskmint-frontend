<template>
	<div class="form-group" ref="dropdownWrapper">

		<button
			id="dropdown_default"
			ref="triggerBtn"
			class="transition-all duration-300 flex gap-1 items-center  py-[7px] px-[15px] rounded-lg w-full lg:w-[initial] cursor-pointer hover:bg-deskmint-original-dark-plus hover:text-deskmint-cyan-light dark:text-default-text!"
			type="button"
			@click="toggleMenu"
		>
			{{ modelValue }}
			<span class="transition-all duration-300" :class="{ 'rotate-180': show_menu }">
				<IconChevronDown :size="22" />
			</span>
		</button>

		<Teleport to="#autocomplete-portal">
			<transition name="fade-scale">
				<div
					v-if="show_menu"
					ref="dropdownEl"
					id="dropdown"
					class="z-[9999] fixed divide-y rounded-lg shadow-sm w-44"
					:style="dropdownStyle">
					<ul class="dropdown_ul bg-background-2" aria-labelledby="dropdown_default">
						<li
							v-for="(option, i) in options"
							:key="i"
							class="group">
							
							<a href="javascript:;"
								@click="updatePerPage(option)"
								class="hover:text-deskmint-cyan-light! dark:text-default-text hover:bg-deskmint-cyan dark:hover:text-default-text! rounded-lg">
								{{ option }}
							</a>
						</li>
					</ul>
				</div>
			</transition>`
		</Teleport>

	</div>
</template>

<style scoped>
	@reference "tailwindcss/theme";
	.dropdown_ul {
		@apply p-[10px] rounded-lg shadow-lg;
	}
	.dropdown_ul li a {
		@apply block p-[10px] transition-all duration-300;
	}
	.dropdown_ul li {
		@apply transition-all duration-300;
	}
</style>

<script lang="ts">

	export interface InputDropdownInterface {
		input_value: string;
		show_menu: boolean;
		dropdownStyle: Record<string, string>;
	}

	import common from '../../helpers/common';
	import { defineComponent } from 'vue';
	import { IconChevronDown } from '@tabler/icons-vue';

	export default defineComponent({

		name: 'InputDropdown',

		props: ['options', 'modelValue'],

		components: {
			IconChevronDown,
		},
		data(): InputDropdownInterface {
			return {
				input_value: '',
				show_menu: false,
				dropdownStyle: {},
			};
		},
		methods: {

			toggleMenu() {
				this.show_menu = !this.show_menu;
				if (this.show_menu) {
					this.$nextTick(() => this.recalculatePosition());
				}
			},
			recalculatePosition() {

				const btn = this.$refs.triggerBtn as HTMLElement;

				if (!btn) return;

				const rect = btn.getBoundingClientRect();
				const viewport_width = window.innerWidth;
				const viewport_height = window.innerHeight;
				const gap = 4;
				const edge_padding = 8;
				const dropdown_width = 176; // w-44 = 11rem = 176px
				const dropdown_height = 200;

				const opens_downward = rect.bottom + dropdown_height + gap <= viewport_height;

				const preferred_left = rect.right - dropdown_width;
				const clamped_left = Math.min(
					Math.max(preferred_left, edge_padding),
					viewport_width - dropdown_width - edge_padding
				);

				this.dropdownStyle = {
					left: `${clamped_left}px`,
					...(opens_downward
						? { top: `${rect.bottom + gap}px` }
						: { bottom: `${viewport_height - rect.top + gap}px` }
					),
				};
			},

			updatePerPage(pp: number): void {
				this.$emit('update:modelValue', pp);
				this.$emit('changed', pp);
				this.show_menu = false;
			},

			sanitizeInput(in_string: string): string {
				return common.stripTags(common.sanitize(in_string));
			},

			handleClickOutside(e: MouseEvent) {
				const target = e.target as Node;
				const wrapper = this.$refs.dropdownWrapper as HTMLElement;
				if (wrapper && !wrapper.contains(target)) {
					this.show_menu = false;
				}
			},

			handleScroll() {
				if (this.show_menu) this.recalculatePosition();
			},

		},

		mounted() {
			document.addEventListener('click', this.handleClickOutside);
			window.addEventListener('scroll', this.handleScroll, true); // capture phase catches nested scrollers
			window.addEventListener('resize', this.handleScroll);
		},

		beforeUnmount() {
			document.removeEventListener('click', this.handleClickOutside);
			window.removeEventListener('scroll', this.handleScroll, true);
			window.removeEventListener('resize', this.handleScroll);
		},

	});

</script>