<template>
		<div :data-theme="current_theme_name" class="container-fluid" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">	
			<div class="big-content">
				<aside class="relative">
					<div class="sidebar" @mouseenter="hover_sidebar = true" @mouseleave="hover_sidebar = false" :class="{'closed':!sidebar_full, 'phone': phone_show}">
						<div class="sidebar-logo-area">
							<div class="flex items-center">
								<a v-show="(((sidebar_full) || (hover_sidebar && !is_mobile)) && current_theme_name == 'light')" href="javascript:;"><img src="./../assets/images/deskmit-logo.svg" class="logo" alt=""></a>
								<a v-show="(((sidebar_full) || (hover_sidebar && !is_mobile)) && current_theme_name == 'dark')" href="javascript:;"><img src="./../assets/images/deskmit-logo-white.svg" class="logo" alt=""></a>
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
							
							<div class="sidebar-menu-items">
								<ul class="main-menu-list">
									<li v-for="(menu_item, i) in menu_items" :key="i">
										<router-link :to="menu_item.path" class="block" @click="resetMenuItems(i)" :class="{'active-menu-link': menu_item.is_active}">
											<span class="flex items-center">
												<component v-if="sidebar_full || hover_sidebar" :is="menu_item.icon" :size="menu_item.icon_size"></component>
												<component v-if="!sidebar_full && !hover_sidebar" :is="menu_item.icon" :size="36"></component>
												<span v-if="hover_sidebar || sidebar_full" class="menu-item-text">&nbsp;&nbsp;{{ menu_item.menu_text }}</span>
												<span data-exclude="true" v-if="menu_item.has_submenu && (hover_sidebar || sidebar_full)" class="grow justify-items-end">
													<!--<IconChevronRight :class="{'chevron-rotated':menu_item.show_submenu}" :size="22" class="chevron-icon"></IconChevronRight>-->
												</span>
												
											</span>
										</router-link>
										<transition name="slide">
											<ul v-if="hover_sidebar || sidebar_full" v-show="menu_item.show_submenu" class="submenu">
												
												<li v-for="(menu_sub_item, z) in menu_item.submenu" :key="z">
													<router-link :to="menu_sub_item.path" class="block" :class="{'active-menu-link': menu_sub_item.is_active}"  @click="setSubActiveItem(i, z)">
														<span class="flex items-center">
															<component :is="menu_sub_item.icon" :size="menu_sub_item.icon_size"></component>
															<span class="menu-item-text">&nbsp;&nbsp;Dashboard</span>
														</span>
													</router-link>
												</li>
												
											</ul>
											
										</transition>
									</li>
									
								</ul>
							</div>
						</div>
						
					
					</div>
				</aside>
				<main class="main-content" :class="{'md:ml-[var(--sidebar-close-width)]':!sidebar_full, 'md:ml-[var(--sidebar-open-width)]':sidebar_full}">
					<div class="topbar">
						<a href="javascript:;" class="md:hidden" @click="phone_show = !phone_show"><IconAlignLeft></IconAlignLeft></a>
						<div class="row">
							<div class="col-md-8">1</div>
							<div class="col-md-4 flex items-center gap-6">
								
								<div class="relative">
									<a href="javascript:;" class="theme_launcher" @click="show_theme_menu = !show_theme_menu"><component :is="theme_icon"></component></a>
									<div class="barcard" v-show="show_theme_menu">
										<ul>
											<li>
												<a class="flex items-center gap-2" @click="setCurrentTheme('light')" :class="{'active_theme_tab':(current_theme_name == 'light')}" href="javascript:;"><IconSun></IconSun>&nbsp;Light</a>
											</li>
											<li>
												<a class="flex items-center gap-2" @click="setCurrentTheme('dark')" :class="{'active_theme_tab':(current_theme_name == 'dark')}" href="javascript:;"><IconMoon></IconMoon>&nbsp;Dark</a>
											</li>
											<li>
												<a class="flex items-center gap-2" @click="setCurrentTheme('system')" :class="{'active_theme_tab':(current_theme_name == 'system')}" href="javascript:;"><IconDeviceImac></IconDeviceImac>&nbsp;System</a>
											</li>
										</ul>
									</div>
								</div>
								<div class="relative">
									
									<a href="javascript:;" class="shortcuts_launcher" @click="show_shortcuts_menu = !show_shortcuts_menu"><IconTableShortcut></IconTableShortcut></a>
									<div v-show="show_shortcuts_menu" class="barcard-shortcut styled-scrollbar">
										<div class="flex gap-4">
											<div>
												<a href="javascript:;" @click="show_shortcuts_menu = false">
													<div class="shortcut-card">
														<IconCarSuv :size="36"></IconCarSuv>
														<p>Shortcut</p>	
													</div>
												</a>
											</div>
											
											<div>
												<a href="javascript:;" @click="show_shortcuts_menu = false">
													<div class="shortcut-card">
														<IconCarSuv :size="36"></IconCarSuv>
														<p>Shortcut</p>	
													</div>
												</a>
											</div>
											<div>
												<a href="javascript:;" @click="show_shortcuts_menu = false">
													<div class="shortcut-card">
														<IconCarSuv :size="36"></IconCarSuv>
														<p>Shortcut</p>	
													</div>
												</a>
											</div>
										</div>
										<br>
										<div class="flex gap-4">
											<div>
												<a href="javascript:;">
													<div class="shortcut-card">
														<IconCarSuv :size="36"></IconCarSuv>
														<p>Shortcut</p>	
													</div>
												</a>
											</div>
											
											<div>
												<a href="javascript:;">
													<div class="shortcut-card">
														<IconCarSuv :size="36"></IconCarSuv>
														<p>Shortcut</p>	
													</div>
												</a>
											</div>
											<div>
												<a href="javascript:;">
													<div class="shortcut-card">
														<IconCarSuv :size="36"></IconCarSuv>
														<p>Shortcut</p>	
													</div>
												</a>
											</div>
										</div>
										<br>
										<div class="flex gap-4">
											<div>
												<a href="javascript:;">
													<div class="shortcut-card">
														<IconCarSuv :size="36"></IconCarSuv>
														<p>Shortcut</p>	
													</div>
												</a>
											</div>
											
											<div>
												<a href="javascript:;">
													<div class="shortcut-card">
														<IconCarSuv :size="36"></IconCarSuv>
														<p>Shortcut</p>	
													</div>
												</a>
											</div>
											<div>
												<a href="javascript:;">
													<div class="shortcut-card">
														<IconCarSuv :size="36"></IconCarSuv>
														<p>Shortcut</p>	
													</div>
												</a>
											</div>
										</div>
									</div>
								</div>

								<div class="relative">
									
									<a href="javascript:;" class="notifications_launcher relative" @click="show_notifications_menu = !show_notifications_menu"><IconBell></IconBell>
										<span class="red-pill-notification-alert"></span>
									</a>
									<div v-show="show_notifications_menu" class="notifications-area styled-scrollbar">
										
										<div class="notification">
											<a href="javascript:;" class="flex gap-3">
												<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at neque posuere, feugiat nunc sit amet, porttitor mi. Interdum et malesuada fames </p>
												<IconX class="grow" :size="66"></IconX>
											</a>
										</div>
										<hr>
										<div class="notification">
											<a href="javascript:;" class="flex gap-3">
												<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at neque posuere, feugiat nunc sit amet, porttitor mi. Interdum et malesuada fames </p>
												<IconX class="grow" :size="66"></IconX>
											</a>
										</div>
										<hr>
										<div class="notification">
											<a href="javascript:;" class="flex gap-3">
												<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at neque posuere, feugiat nunc sit amet, porttitor mi. Interdum et malesuada fames </p>
												<IconX class="grow" :size="66"></IconX>
											</a>
										</div>
										<hr>
										<div class="notification">
											<a href="javascript:;" class="flex gap-3">
												<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at neque posuere, feugiat nunc sit amet, porttitor mi. Interdum et malesuada fames </p>
												<IconX class="grow" :size="66"></IconX>
											</a>
										</div>
										<hr>
										
										
									</div>
								</div>
								
							</div>
						</div>
					</div>
					<section>
						this is content section
						<br>
						<br>
						<br>
						<br>
						<br>
						<br>
						<br>
						<br>
						<br>
						<br>
						<br>
						<br>
						<br>
						<br>
						<br>
						<br>
						<br>
						<div class="row gap-4 m-[15px]!">
							<div class="col-md-4">
								<div class="card p-[35px]! rounded-lg" style="box-shadow: 0px 0px 50px green;">
									<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at neque posuere, feugiat nunc sit amet, porttitor mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam eget blandit dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer lobortis in est ac scelerisque. Etiam varius pharetra lorem, fringilla laoreet nisl ornare hendrerit. Morbi sodales lorem sed auctor bibendum. Phasellus ornare facilisis risus nec pretium. Morbi tincidunt pulvinar ornare. Sed consequat metus justo, id condimentum lectus aliquam a. Donec velit massa, fermentum a felis in, imperdiet aliquam nisi. Pellentesque iaculis finibus est, sit amet ultrices dolor. Maecenas lorem arcu, commodo vel risus vitae, vestibulum lobortis urna. In sit amet augue vitae augue varius semper et dictum ante. Curabitur sed nibh augue. Nullam fringilla interdum urna, in porta dui mollis in.</p>

									<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at neque posuere, feugiat nunc sit amet, porttitor mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam eget blandit dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer lobortis in est ac scelerisque. Etiam varius pharetra lorem, fringilla laoreet nisl ornare hendrerit. Morbi sodales lorem sed auctor bibendum. Phasellus ornare facilisis risus nec pretium. Morbi tincidunt pulvinar ornare. Sed consequat metus justo, id condimentum lectus aliquam a. Donec velit massa, fermentum a felis in, imperdiet aliquam nisi. Pellentesque iaculis finibus est, sit amet ultrices dolor. Maecenas lorem arcu, commodo vel risus vitae, vestibulum lobortis urna. In sit amet augue vitae augue varius semper et dictum ante. Curabitur sed nibh augue. Nullam fringilla interdum urna, in porta dui mollis in.</p>

								</div>
							</div>

							<div class="col-md-4">
								<div class="card p-[35px]! rounded-lg" style="box-shadow: 0px 0px 50px green;">
									<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at neque posuere, feugiat nunc sit amet, porttitor mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam eget blandit dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer lobortis in est ac scelerisque. Etiam varius pharetra lorem, fringilla laoreet nisl ornare hendrerit. Morbi sodales lorem sed auctor bibendum. Phasellus ornare facilisis risus nec pretium. Morbi tincidunt pulvinar ornare. Sed consequat metus justo, id condimentum lectus aliquam a. Donec velit massa, fermentum a felis in, imperdiet aliquam nisi. Pellentesque iaculis finibus est, sit amet ultrices dolor. Maecenas lorem arcu, commodo vel risus vitae, vestibulum lobortis urna. In sit amet augue vitae augue varius semper et dictum ante. Curabitur sed nibh augue. Nullam fringilla interdum urna, in porta dui mollis in.</p>

									<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at neque posuere, feugiat nunc sit amet, porttitor mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam eget blandit dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer lobortis in est ac scelerisque. Etiam varius pharetra lorem, fringilla laoreet nisl ornare hendrerit. Morbi sodales lorem sed auctor bibendum. Phasellus ornare facilisis risus nec pretium. Morbi tincidunt pulvinar ornare. Sed consequat metus justo, id condimentum lectus aliquam a. Donec velit massa, fermentum a felis in, imperdiet aliquam nisi. Pellentesque iaculis finibus est, sit amet ultrices dolor. Maecenas lorem arcu, commodo vel risus vitae, vestibulum lobortis urna. In sit amet augue vitae augue varius semper et dictum ante. Curabitur sed nibh augue. Nullam fringilla interdum urna, in porta dui mollis in.</p>

								</div>
							</div>

							<div class="col-md-4">
								<div class="card p-[35px]! rounded-lg" style="box-shadow: 0px 0px 50px green;">
									<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at neque posuere, feugiat nunc sit amet, porttitor mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam eget blandit dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer lobortis in est ac scelerisque. Etiam varius pharetra lorem, fringilla laoreet nisl ornare hendrerit. Morbi sodales lorem sed auctor bibendum. Phasellus ornare facilisis risus nec pretium. Morbi tincidunt pulvinar ornare. Sed consequat metus justo, id condimentum lectus aliquam a. Donec velit massa, fermentum a felis in, imperdiet aliquam nisi. Pellentesque iaculis finibus est, sit amet ultrices dolor. Maecenas lorem arcu, commodo vel risus vitae, vestibulum lobortis urna. In sit amet augue vitae augue varius semper et dictum ante. Curabitur sed nibh augue. Nullam fringilla interdum urna, in porta dui mollis in.</p>

									<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at neque posuere, feugiat nunc sit amet, porttitor mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam eget blandit dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer lobortis in est ac scelerisque. Etiam varius pharetra lorem, fringilla laoreet nisl ornare hendrerit. Morbi sodales lorem sed auctor bibendum. Phasellus ornare facilisis risus nec pretium. Morbi tincidunt pulvinar ornare. Sed consequat metus justo, id condimentum lectus aliquam a. Donec velit massa, fermentum a felis in, imperdiet aliquam nisi. Pellentesque iaculis finibus est, sit amet ultrices dolor. Maecenas lorem arcu, commodo vel risus vitae, vestibulum lobortis urna. In sit amet augue vitae augue varius semper et dictum ante. Curabitur sed nibh augue. Nullam fringilla interdum urna, in porta dui mollis in.</p>

								</div>
							</div>
							
						</div>
					</section>
				</main>
			</div>
		</div>
</template>
<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: 500px; /* Adjust based on expected submenu size */
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.chevron-icon {
  transition: transform 0.3s ease;
}

.chevron-rotated {
  transform: rotate(90deg);
}
</style>
<script>

import { IconCircle, IconXPowerY } from '@tabler/icons-vue';
import { IconCircleDot } from '@tabler/icons-vue';
import { IconX } from '@tabler/icons-vue';
import { IconDashboard } from '@tabler/icons-vue';
import { IconChevronRight } from '@tabler/icons-vue';
import { IconChevronDown } from '@tabler/icons-vue';
import { IconAlignLeft } from '@tabler/icons-vue';
import { IconMoon } from '@tabler/icons-vue';
import { IconSun } from '@tabler/icons-vue';
import { IconDeviceImac } from '@tabler/icons-vue';
import { IconTableShortcut } from '@tabler/icons-vue';
import { IconCarSuv } from '@tabler/icons-vue';
import { IconBell } from '@tabler/icons-vue';


export default {

	name: 'PanelLayout',
	components: {
		IconCircle,
		IconCircleDot,
		IconX,
		IconChevronRight,
		IconChevronDown,
		IconAlignLeft,
		IconSun,
		IconMoon,
		IconDeviceImac,
		IconTableShortcut,
		IconCarSuv,
		IconBell,
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
			hover_sidebar: false,
			show_theme_menu: false,
			show_shortcuts_menu: false,
			show_notifications_menu: false,
			current_theme_name: 'light',
			system_theme_name: '',
			theme_icon: 'IconMoon',
			phone_breakpoint: 768,
			menu_items : [
					{
						path: '/',
						icon: 'IconDashboard',
						icon_size: 22,
						menu_text: 'Dashboard',
						has_submenu : true,
						show_submenu : false,
						is_active: false,
						submenu: [
							{
								path: '/',
								icon: 'IconCircle',
								icon_size: 18,
								menu_text: 'Dashboard',
								is_active: false,
								path: ''
							}
						]
					},
					{
						path: '/',
						icon: 'IconDashboard',
						icon_size: 22,
						menu_text: 'Dashboard ns',
						has_submenu : false,
						show_submenu : false,
						is_active: false,
						submenu: []
					},
					{
						path: '/',
						icon: 'IconDashboard',
						icon_size: 22,
						menu_text: 'Dashboard 2',
						has_submenu : true,
						show_submenu : false,
						is_active: false,
						submenu: [
							{
								path: '/',
								icon: 'IconDashboard',
								icon_size: 22,
								is_active: false,
								menu_text: 'Dashboard'
							},
							{
								path: '/',
								icon: 'IconDashboard',
								icon_size: 22,
								is_active: false,
								menu_text: 'Dashboard sub'
							}
						]
					},
					{
						path: '/',
						icon: 'IconDashboard',
						icon_size: 22,
						menu_text: 'Dashboard 3',
						has_submenu : true,
						show_submenu : false,
						is_active: false,
						submenu: [
							{
								path: '/',
								icon: 'IconDashboard',
								icon_size: 22,
								is_active: false,
								menu_text: 'Dashboard 5'
							},
							{
								path: '/',
								icon: 'IconDashboard',
								icon_size: 22,
								is_active: false,
								menu_text: 'Dashboard sub 5'
							}
						]
					}
				]
			

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
			if (this.phone_show && window.innerWidth < this.phone_breakpoint) {
				
				const sidebar = this.$el.querySelector('.sidebar.phone');
				const launcher = e.target.closest('a[href="javascript:;"]');
				const excludeme = e.target.closest('span[data-exclude="true"]');
				
				if (sidebar && !sidebar.contains(e.target) && !launcher && !excludeme) {
					this.phone_show = false;
					
				}
				
			}
			const theme_launcher = e.target.closest('a[class="theme_launcher"]');
				
			if (!theme_launcher) {
				this.show_theme_menu = false;
			}

			const shortcuts_launcher = e.target.closest('a[class="shortcuts_launcher"]');
				
			if (!shortcuts_launcher) {
				this.show_shortcuts_menu = false;
			}

			const notifications_launcher = e.target.closest('a[class="notifications_launcher relative"]');
				
			if (!notifications_launcher) {
				this.show_notifications_menu = false;
			}
			
		},
		updateScreenSize : function(){
			this.is_mobile = window.innerWidth < this.phone_breakpoint;
		},

		resetMenuItems : function(index, mtype = ''){
			
			
			for(let z = 0 ; z < this.menu_items.length ; z++){

				this.menu_items[z].is_active = false;

				if(this.menu_items[z].has_submenu == true){
					for(let x = 0 ; x < this.menu_items[z].submenu.length ; x++){
						this.menu_items[z].submenu[x].is_active = false;
					}
				}

			}

			if(mtype == ''){
				this.setActiveMenu(index);
			}
			
			
			
		},
		
		setActiveMenu : function(index){
			this.menu_items[index].show_submenu = !this.menu_items[index].show_submenu;
			this.menu_items[index].is_active = true;
		},

		setSubActiveItem : function(i, z){

			this.resetMenuItems(i, 'sub');

			this.menu_items[i].submenu[z].is_active = true;

		},

		setCurrentTheme : function(theme_name){
			
			if(theme_name == 'system'){
				this.current_theme_name = this.system_theme_name;
				
			}else{
				this.current_theme_name = theme_name;
			}

			if(this.current_theme_name == 'dark'){
				this.theme_icon = 'IconMoon';
			}else{
				this.theme_icon = 'IconSun';
			}
		
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
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			this.system_theme_name = 'dark'
		}else{
			this.system_theme_name = 'light'
		}
		this.setCurrentTheme('light');
	},
	beforeUnmount() {
		document.removeEventListener('click', this.handleOutsideClick);
		window.removeEventListener('resize', this.updateScreenSize);
	}

}


</script>