<template>
		<div class="container-fluid" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">	
			<div class="big-content">
				<aside class="relative">
					<div class="sidebar" @mouseover="hover_sidebar = true" @mouseleave="hover_sidebar = false" :class="{'closed':!sidebar_full, 'phone': phone_show}">
						<div class="sidebar-logo-area">
							<div class="flex items-center">
								<a v-show="sidebar_full || (hover_sidebar && !is_mobile)" href="javascript:;"><img src="./../assets/images/deskmit-logo.svg" class="logo" alt=""></a>
								<a v-show="!sidebar_full && !hover_sidebar && !is_mobile" href="javascript:;"><img src="./../assets/images/deskmit-logo-icon.svg" class="logo-icon" alt=""></a>
								<div v-show="sidebar_full || (hover_sidebar && !is_mobile)" class="grow">
									<a v-if="!sidebar_full && !is_mobile" href="javascript:;" @click="sidebar_full = !sidebar_full" class="close-sidebar-icon float-end"><IconCircle></IconCircle></a>
									<a v-if="sidebar_full && !is_mobile" href="javascript:;" @click="sidebar_full = !sidebar_full" class="close-sidebar-icon float-end"><IconCircleDot></IconCircleDot></a>
								</div>
								<div v-show="sidebar_full && is_mobile" class="grow">
									<a href="javascript:;" @click="phone_show = false" class="close-sidebar-icon float-end"><IconX></IconX></a>
								</div>
							</div>
						</div>
						
						<div class="overflow-auto styled-scrollbar h-[100vh]">
							<a href="javascript:;" class="md:hidden" @click="phone_show = !phone_show">Phone Launcher</a>
							<div class="sidebar-menu-items">
								<ul>
									<li>
										<a href="" class="block">
											<span class="flex items-center">
												<IconDashboard :size="22"></IconDashboard>
												<span class="menu-item-text">&nbsp;&nbsp;Dashboard</span>
												<span class="grow justify-items-end"><IconChevronRight :size="22" class=""></IconChevronRight></span>
												
											</span>
										</a>
									</li>
									<li>
										<a href="" class="block">
											<span class="flex items-center">
												<IconDashboard :size="28"></IconDashboard>
												<span class="menu-item-text">&nbsp;Dashboard</span>
												<span class="grow justify-items-end"><IconChevronRight :size="22" class=""></IconChevronRight></span>
												
											</span>
										</a>
									</li>
								</ul>
							</div>
						</div>
						
					
					</div>
				</aside>
				<main class="main-content" :class="{'md:ml-[var(--sidebar-close-width)]':!sidebar_full, 'md:ml-[var(--sidebar-open-width)]':sidebar_full}">
					<div class="topbar">
						<a href="javascript:;" class="md:hidden" @click="phone_show = !phone_show">Phone Launcher</a>
						123
					</div>
					<section>
						this is content section
						<p v-for="(i, z) in 500" :key="i">test aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
					</section>
				</main>
			</div>
		</div>
</template>
<script>

import { IconCircle } from '@tabler/icons-vue';
import { IconCircleDot } from '@tabler/icons-vue';
import { IconX } from '@tabler/icons-vue';
import { IconDashboard } from '@tabler/icons-vue';
import { IconChevronRight } from '@tabler/icons-vue';


export default {

	name: 'PanelLayout',
	components: {
		IconCircle,
		IconCircleDot,
		IconX,
		IconChevronRight,
		IconDashboard
	},
	data : function(){
		return {
			sidebar_full : true,
			phone_show: false,
			touchStartX: 0,
			touchStartY: 0,
			minSwipeDistance: 30,
			is_mobile: false,
			hover_sidebar: false
		}
	},
	methods:{
		handleTouchStart: function(e) {
			this.touchStartX = e.touches[0].clientX;
			this.touchStartY = e.touches[0].clientY;
		},

		handleTouchEnd: function(e){
			const touchEndX = e.changedTouches[0].clientX;
			const touchEndY = e.changedTouches[0].clientY;
			
			const deltaX = touchEndX - this.touchStartX;
			const deltaY = Math.abs(touchEndY - this.touchStartY);
			
			if (deltaY < 100) {
				
				if (deltaX > this.minSwipeDistance && this.touchStartX < 50) {
					this.phone_show = true;
				}else if (deltaX < -this.minSwipeDistance && this.phone_show) {
					this.phone_show = false;
				}
			}
		},
		handleTouchMove: function(e) {
			if (this.touchStartX < 50) {
				e.preventDefault();
			}
		},

		handleOutsideClick: function(e) {
			if (this.phone_show && window.innerWidth < 768) {
				const sidebar = this.$el.querySelector('.sidebar.phone');
				const launcher = e.target.closest('a[href="javascript:;"]');
				
				if (sidebar && !sidebar.contains(e.target) && !launcher) {
					this.phone_show = false;
				}
			}
		},
		updateScreenSize : function(){
			this.is_mobile = window.innerWidth <= 767;
		}
		
	},
	watch:{

	},
	updated(){

	
	},
	mounted(){
		document.addEventListener('click', this.handleOutsideClick);
		window.addEventListener('resize', this.updateScreenSize);
		this.updateScreenSize();
	},
	beforeUnmount() {
		document.removeEventListener('click', this.handleOutsideClick);
		window.removeEventListener('resize', this.updateScreenSize);
	}

}


</script>