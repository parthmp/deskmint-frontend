<template>
	<div class="fixed  bg-deskmint-cyan/25 h-full w-full z-20 top-0 left-0" v-show="phone_show" @click="phone_show = false" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"></div>
	<div id="autocomplete-portal"></div>
		
		<div class="container-fluid" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">	
			<div class="big-content">
				<aside>
					<div class="sidebar" @mouseenter="hover_sidebar = true" @mouseleave="hover_sidebar = false" :class="{'closed':!sidebar_full,'phone': phone_show}">
						<div class="sidebar-logo-area">
							<div class="flex items-center">
								<a v-show="(((sidebar_full) || (hover_sidebar && !is_mobile)) && current_theme_name == 'light')" href="javascript:;"><img src="./../assets/images/deskmit-logo.svg" class="logo" alt=""></a>
								<a v-show="(((sidebar_full) || (hover_sidebar && !is_mobile)) && current_theme_name == 'dark')" href="javascript:;"><img src="./../assets/images/deskmit-logo-white.svg" class="logo" alt=""></a>
								<a v-show="!sidebar_full && !hover_sidebar && !is_mobile" href="javascript:;"><img src="./../assets/images/deskmit-logo-icon.svg" class="logo-icon" alt=""></a>
								<div v-show="sidebar_full || (hover_sidebar && !is_mobile)" class="grow">
									<a v-if="!sidebar_full && !is_mobile" href="javascript:;" @click="updateSidebar()" class="close-sidebar-icon float-end"><IconCircle></IconCircle></a>
									<a v-if="sidebar_full && !is_mobile" href="javascript:;" @click="updateSidebar()" class="close-sidebar-icon float-end"><IconCircleDot></IconCircleDot></a>
								</div>
								<div v-show="sidebar_full && is_mobile" class="grow">
									<a href="javascript:;" @click="phone_show = false" class="close-sidebar-icon float-end"><IconX></IconX></a>
								</div>
							</div>
						</div>
						
						<div class="overflow-auto styled-scrollbar h-[100vh]">
							
							<div class="sidebar-menu-items">
								<ul class="main-menu-list">
									<li v-for="(menu_item, i) in menu_items" :key="i" :class="{'bg-background-card':(menu_item.has_submenu && menu_item.show_submenu && menu_item.submenu.length > 0), 'rounded-lg': menu_item.has_submenu}">
										<router-link :to="menu_item.path" class="block" @click="resetMenuItems(i, menu_item.submenu.length)" :class="{'active-menu-link': menu_item.is_active, 'fix-collapsed-icon': (hover_sidebar == false && sidebar_full == false)}">
											<span class="flex items-center">
												<component v-if="sidebar_full || hover_sidebar" :is="menu_item.icon" :size="menu_item.icon_size"></component>
												<component v-if="!sidebar_full && !hover_sidebar" :is="menu_item.icon" :size="28"></component>
												<transition name="fade-delay">
													<span v-if="sidebar_full || hover_sidebar" class="menu-item-text">&nbsp;&nbsp;{{ menu_item.menu_text }}</span>
												</transition>
												<span data-exclude="true" v-if="menu_item.has_submenu && (hover_sidebar || sidebar_full)" class="grow justify-items-end">
													<IconChevronRight :class="{'chevron-rotated':menu_item.show_submenu}" :size="22" class="chevron-icon"></IconChevronRight>
												</span>
												
											</span>
										</router-link>
										<transition name="slide">
											<ul v-if="(hover_sidebar || sidebar_full)" v-show="menu_item.show_submenu && menu_item.submenu.length > 0" class="submenu">
												
												<li v-for="(menu_sub_item, z) in menu_item.submenu" :key="z" class="">
													<router-link :to="menu_sub_item.path" class="block text-deskmint-original-light" :class="{'active-menu-link': menu_sub_item.is_active}"  @click="setSubActiveItem(i, z)">
														<span class="flex items-center">
															<component :is="menu_sub_item.icon" :size="menu_sub_item.icon_size"></component>
															<span class="menu-item-text">&nbsp;&nbsp;{{ menu_sub_item.menu_text }}</span>
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
				<main class="main-content" :class="{'lg:ml-[var(--sidebar-close-width)]':!sidebar_full, 'lg:ml-[var(--sidebar-open-width)]':sidebar_full}">
					<div class="topbar w-full" :class="{'lg:left-[var(--sidebar-close-width)] lg:w-[calc(100%-var(--sidebar-close-width))]': !sidebar_full, 'lg:left-[var(--sidebar-open-width)] lg:w-[calc(100%-var(--sidebar-open-width))]': sidebar_full }"
>

						
						<div class="flex items-center mr-[5px] lg:mr-[15px]! ml-[10px]!">
							<div class=""><a href="javascript:;" class="lg:hidden" @click="phone_show = !phone_show"><IconAlignLeft :size="30"></IconAlignLeft></a></div>
							<div class="grow self-end flex items-center justify-end gap-6">
								
								<div class="lg:relative">
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
								<div class="lg:relative">
									
									<a href="javascript:;" class="shortcuts_launcher" @click="show_shortcuts_menu = !show_shortcuts_menu"><IconTableShortcut></IconTableShortcut></a>
									<div v-show="show_shortcuts_menu" class="barcard-shortcut styled-scrollbar">
										<div class="flex gap-4">
											<div class="grow">
												<a href="javascript:;" @click="show_shortcuts_menu = false">
													<div class="shortcut-card">
														<IconCarSuv :size="36"></IconCarSuv>
														<p>Shortcut</p>	
													</div>
												</a>
											</div>
											
											<div class="grow">
												<a href="javascript:;" @click="show_shortcuts_menu = false">
													<div class="shortcut-card">
														<IconCarSuv :size="36"></IconCarSuv>
														<p>Shortcut</p>	
													</div>
												</a>
											</div>
											<div class="grow">
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
											<div class="grow">
												<a href="javascript:;">
													<div class="shortcut-card">
														<IconCarSuv :size="36"></IconCarSuv>
														<p>Shortcut</p>	
													</div>
												</a>
											</div>
											
											<div class="grow">
												<a href="javascript:;">
													<div class="shortcut-card">
														<IconCarSuv :size="36"></IconCarSuv>
														<p>Shortcut</p>	
													</div>
												</a>
											</div>
											<div class="grow">
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
											<div class="grow">
												<a href="javascript:;">
													<div class="shortcut-card">
														<IconCarSuv :size="36"></IconCarSuv>
														<p>Shortcut</p>	
													</div>
												</a>
											</div>
											
											<div class="grow">
												<a href="javascript:;">
													<div class="shortcut-card">
														<IconCarSuv :size="36"></IconCarSuv>
														<p>Shortcut</p>	
													</div>
												</a>
											</div>
											<div class="grow">
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

								<div class="lg:relative">
									
									<a href="javascript:;" class="notifications_launcher relative" @click="showNotificationsMenu"><IconBell></IconBell>
										<span v-if="show_notification_pill_alert" class="red-pill-notification-alert"></span>
									</a>
									<div v-show="show_notifications_menu" class="notifications-area styled-scrollbar">
										<span v-for="(notification, key) in notifications" :key="key">
											<div class="notification">
												<div class="flex gap-2">
													<router-link :to="notification.path" class="grow">
														<p>{{ notification.notification_text }}</p>
													</router-link>
													<a href="javascript:;" ref="notifications-close" class="justify-end rounded-sm" @click.stop.prevent="removeNotification(key)">
														<IconX :size="22"></IconX>
													</a>
												</div>
											</div>
											<hr>
										</span>

										<span v-if="notifications.length === 0">
											<div class="notification">
												<a href="javascript:;" class="flex gap-2">
													<p class="grow">No new notifications</p>
													
												</a>
											</div>
											<hr>
										</span>
									
										
										
									</div>
								</div>

								<div class="lg:relative">
									
									<a href="javascript:;" class="profile_menu_launcher relative" @click="show_profile_menu = !show_profile_menu">
										<img src="./../assets/images/profile-picture.png" class="profile-picture-topbar">
										<span class="green-pill-alert"></span>
									</a>
									<div v-show="show_profile_menu" class="profile-area">
										
										<a href="javascript:;" class="profile-item">
											<IconUser :size="26"></IconUser>
											<span class="grow ml-[5px]!">&nbsp;My Profile</span>
										</a>
										<hr>
										<a href="javascript:;" class="profile-item">
											<IconSettings :size="26"></IconSettings>
											<span class="grow ml-[5px]!">&nbsp;Settings</span>
										</a>
										<hr>
										<a href="javascript:;" class="profile-item">
											<IconLogout :size="26"></IconLogout>
											<span class="grow ml-[5px]!">&nbsp;Logout</span>
										</a>
									</div>
								</div>
								
							</div>
						</div>
					</div>
					<section class="main-section">
						
						<router-view></router-view>
						
						
					</section>
					
					
					<br>
					<Footer></Footer>
					<br>
					<br>
					<br>
				</main>
			</div>
		</div>
</template>
<style scoped>
/*@reference "tailwindcss/theme";*/
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
/*
.card{
	@apply text-yellow-800;
}*/
.fade-delay-enter-active,
.fade-delay-leave-active {
  transition: opacity 0.1s ease;
}

.fade-delay-enter-from,
.fade-delay-leave-to {
  opacity: 0;
}

.fade-delay-enter-active {
  transition-delay: 0.1s; /* This is your delay */
}

</style>
<script lang="ts">

import { IconCircle, IconCircleDot, IconX, IconDashboard, IconChevronRight, IconChevronDown, IconAlignLeft, IconMoon, IconSun, IconDeviceImac, IconTableShortcut, IconCarSuv, IconBell, IconUser, IconSettings, IconLogout, IconUsersGroup, IconUserShield, IconSquarePlus2, IconCircleDotted, IconPackages, IconFileDollar, IconScript, IconUsers, IconBuildingFactory, IconFileReport, IconMail, IconCoin } from '@tabler/icons-vue';

import { useThemeOptions } from '../stores/theme';
import { defineComponent } from 'vue';

import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

import Footer from './blocks/Footer.vue';
import api from '../helpers/api';

import common from '../helpers/common';



export interface PanelData {
	sidebar_full: boolean,
	phone_show: boolean,
	touchStartX: number,
	touchStartY: number,
	minSwipeDistance: number,
	is_mobile: boolean,
	hover_sidebar: boolean,
	show_theme_menu: boolean,
	show_shortcuts_menu: boolean,
	show_notifications_menu: boolean,
	show_profile_menu: boolean,
	system_theme_name: string,
	theme_icon: string,
	phone_breakpoint: number,
	menu_items: any,
	notifications: any,
	show_notification_pill_alert: boolean
}
export default defineComponent({

	name: 'PanelLayout',
	components: {
		IconCircle:IconCircle,
		IconCircleDot:IconCircleDot,
		IconX:IconX,
		IconChevronRight:IconChevronRight,
		IconChevronDown:IconChevronDown,
		IconAlignLeft:IconAlignLeft,
		IconSun:IconSun,
		IconMoon:IconMoon,
		IconDeviceImac:IconDeviceImac,
		IconTableShortcut:IconTableShortcut,
		IconCarSuv:IconCarSuv,
		IconBell:IconBell,
		IconUser:IconUser,
		IconSettings:IconSettings,
		IconLogout:IconLogout,
		IconDashboard:IconDashboard,
		Footer:Footer,
		IconUsersGroup:IconUsersGroup,
		IconUserShield:IconUserShield,
		IconSquarePlus2:IconSquarePlus2,
		IconCircleDotted:IconCircleDotted,
		IconPackages:IconPackages,
		IconFileDollar:IconFileDollar,
		IconScript:IconScript,
		IconUsers:IconUsers,
		IconBuildingFactory:IconBuildingFactory,
		IconFileReport:IconFileReport,
		IconCoin:IconCoin,
		IconMail:IconMail
	},
	data() : PanelData{
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
			show_profile_menu: false,
			/*current_theme_name: 'light',*/
			system_theme_name: '',
			theme_icon: 'IconMoon',
			phone_breakpoint: 1024,
			menu_items : [
					{
						path: '/panel',
						icon: 'IconDashboard',
						icon_size: 22,
						menu_text: 'Dashboard',
						has_submenu : false,
						show_submenu : false,
						is_active: true,
						submenu : []
					},
					{
						path: '/clients',
						icon: 'IconUsersGroup',
						icon_size: 22,
						menu_text: 'Clients',
						has_submenu : false,
						show_submenu : false,
						is_active: false,
						submenu: []
					},
					{
						path: '/products',
						icon: 'IconPackages',
						icon_size: 22,
						menu_text: 'Products',
						has_submenu : false,
						show_submenu : false,
						is_active: false,
						submenu: []
					},
					{
						path: '/invoices',
						icon: 'IconFileDollar',
						icon_size: 22,
						menu_text: 'Invoices',
						has_submenu : false,
						show_submenu : false,
						is_active: false,
						submenu: []
					},
					{
						path: '/recurring-invoices',
						icon: 'IconFileReport',
						icon_size: 22,
						menu_text: 'Recurring Invoices',
						has_submenu : false,
						show_submenu : false,
						is_active: false,
						submenu: []
					},
					{
						path: '',
						icon: 'IconSquarePlus2',
						icon_size: 22,
						menu_text: 'Custom Fields',
						has_submenu : true,
						show_submenu : false,
						is_active: false,
						submenu: [
							{
								path: '/custom-fields/clients',
								icon: 'IconUsers',
								icon_size: 22,
								is_active: false,
								menu_text: 'Clients'
							},
							{
								path: '/custom-fields/invoices',
								icon: 'IconFileDollar',
								icon_size: 22,
								is_active: false,
								menu_text: 'Invoices'
							},
							{
								path: '/custom-fields/manage-field-types',
								icon: 'IconScript',
								icon_size: 22,
								is_active: false,
								menu_text: 'Field Types'
							}
							
						]
					},
					{
						path: '',
						icon: 'IconSettings',
						icon_size: 22,
						menu_text: 'Settings',
						has_submenu : true,
						show_submenu : false,
						is_active: false,
						submenu: [
							{
								path: '/settings/company/details',
								icon: 'IconBuildingFactory',
								icon_size: 22,
								is_active: false,
								menu_text: 'Company'
							},
							{
								path: '/settings/invoice/general',
								icon: 'IconFileDollar',
								icon_size: 22,
								is_active: false,
								menu_text: 'Invoice'
							},
							{
								path: '/settings/email/content',
								icon: 'IconMail',
								icon_size: 22,
								is_active: false,
								menu_text: 'Email'
							},
							{
								path: '/settings/payments/integrations',
								icon: 'IconCoin',
								icon_size: 22,
								is_active: false,
								menu_text: 'Payments'
							}
							
						]
					},
					{
						path: '/admins',
						icon: 'IconUserShield',
						icon_size: 22,
						menu_text: 'Admins',
						has_submenu : false,
						show_submenu : false,
						is_active: false,
						submenu: []
					}
				],

				notifications: [
					{
						path: '/',
						notification_text: 'this is a test notification 1 this is a test notification 1 this is a test notification 1 this is a test notification 1'
					},
					{
						path: '/',
						notification_text: 'this is a test notification 2'
					},
					{
						path: '/',
						notification_text: 'this is a test notification 3'
					},
					{
						path: '/',
						notification_text: 'this is a test notification 4'
					},
					{
						path: '/',
						notification_text: 'this is a test notification 5'
					},
					{
						path: '/',
						notification_text: 'this is a test notification 6'
					},
					{
						path: '/',
						notification_text: 'this is a test notification 7'
					}
				],
				show_notification_pill_alert: true
			

		}
	},
	computed: {
		current_theme_name() : string {
			return useThemeOptions().get_theme;
		}
	},
	methods:{
		updateSidebar() : void{
			/* for touch devices */
			this.sidebar_full = !this.sidebar_full;
			this.hover_sidebar = !this.hover_sidebar;
		},
		handleTouchStart(e:any): void {
			this.touchStartX = e.touches[0].clientX;
			this.touchStartY = e.touches[0].clientY;
		},

		handleTouchEnd(e:any): void {
			const touchEndX = e.changedTouches[0].clientX;
			const touchEndY = e.changedTouches[0].clientY;
			
			const deltaX = touchEndX - this.touchStartX;
			const deltaY = Math.abs(touchEndY - this.touchStartY);
			
			if (deltaY < 50) {
				
				if (deltaX > this.minSwipeDistance && this.touchStartX < 50) {
					this.phone_show = true;
				}else if (deltaX < -this.minSwipeDistance && this.phone_show) {
					this.phone_show = false;
				}
			}
		},
		handleTouchMove(e:any) : void {
			if (this.touchStartX < 50) {
				e.preventDefault();
			}
		},

		updateScreenSize() : void{
			this.is_mobile = window.innerWidth < this.phone_breakpoint;
		},

		resetMenuItems(index:number, phone_sub = 0,mtype = '') : void{
			
			
			for(let z = 0 ; z < this.menu_items.length ; z++){

				this.menu_items[z].is_active = false;

				if(this.menu_items[z].has_submenu == true){
					for(let x = 0 ; x < this.menu_items[z].submenu.length ; x++){
						this.menu_items[z].submenu[x].is_active = false;
						if(index !== z){
							this.menu_items[z].show_submenu = false;
						}
						
					}
				}

			}

			if(mtype === ''){
				this.setActiveMenu(index);
			}
			
			if(this.is_mobile && phone_sub <= 0){
				this.phone_show = false;
			}
			
		},
		
		setActiveMenu(index:number) : void {
			this.menu_items[index].show_submenu = !this.menu_items[index].show_submenu;
			this.menu_items[index].is_active = true;
		},

		setSubActiveItem(i:number, z:number) : void {

			this.resetMenuItems(i, 0, 'sub');

			this.menu_items[i].submenu[z].is_active = true;

		},

		setCurrentTheme(theme_name:string) : void{
			
			if(theme_name == 'system'){
				useThemeOptions().set_theme(this.system_theme_name);
				
			}else{
				useThemeOptions().set_theme(theme_name);
			}

			if(this.current_theme_name == 'dark'){
				this.theme_icon = 'IconMoon';
			}else{
				this.theme_icon = 'IconSun';
			}
			
			
		},

		removeNotification(index:number) : void{

			this.notifications.splice(index, 1);

		},

		showNotificationsMenu() : void{
			this.show_notifications_menu = !this.show_notifications_menu;
			this.show_notification_pill_alert = false;
		}
		
	},
	watch:{

	},
	updated(){

	
	},
	mounted(){
		window.addEventListener('resize', this.updateScreenSize);
		this.updateScreenSize();
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			this.system_theme_name = 'dark'
			
		}else{
			this.system_theme_name = 'light'
		}

		this.menu_items = common.updateMenuActiveState(this.menu_items, window.location.href);

		/*
		setTimeout(() => {
			api.post('/test-endpoint', {
				'some' : 1
			});
		}, 5);*/
		

		
		
		
	},
	beforeUnmount() {
		window.removeEventListener('resize', this.updateScreenSize);
	}

})


</script>