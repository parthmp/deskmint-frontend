<template>
    <div class="" @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd">
        <div  class="grid grid-cols-1 transition-all duration-400 slide-in-out" :class="{'md:grid-cols-[minmax(0px,79px)_1fr]':(!pin_switch && !hovering_on_menu), 'md:grid-cols-[minmax(0px,290px)_1fr]': (pin_switch || hovering_on_menu)}">
            <transition name="sidebar-slide">
                
                <div ref="sidebar_menu_ref" @mouseover="mouseOverMenu" @mouseleave="mouseLeaveMenu" class="pt-[16px] md:sticky duration-300 sidebar_menu bg-white z-10" :class="{'fixed':is_mobile, 'top-0':is_mobile, 'left-[-60%]':!show_on_mobile, 'left-0': show_on_mobile,'w-[60%]':is_mobile, 'z-10':is_mobile, 'h-[100vh]': is_mobile}" :style="{ left: is_mobile ? mobile_sidebar_left_pos+'%' : '' }">
                    <div class="">
                        <div class="flex flex-row pl-[16px] pr-[16px]">
                            <div>
                                <svg width="51" height="40" viewBox="0 0 51 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.446 0L22.7801 8.82887C23.3936 9.35302 23.7473 10.1222 23.7473 10.9323V17.5862L13.4131 8.75734C12.7996 8.23319 12.446 7.464 12.446 6.65386V0Z" fill="#00A050"></path>
                                    <path d="M12.446 40L22.7801 31.1711C23.3936 30.647 23.7473 29.8778 23.7473 29.0677V22.4138L13.4131 31.2427C12.7996 31.7668 12.446 32.536 12.446 33.3461V40Z" fill="#00A050"></path>
                                    <path d="M0.117188 9.31034L10.3108 17.9705C10.805 18.3904 11.4308 18.6207 12.0775 18.6207H20.2982L10.1297 9.96253C9.63514 9.54141 9.00837 9.31034 8.36065 9.31034H0.117188Z" fill="#00A050"></path>
                                    <path d="M0.117188 30.6897L10.2481 22.0345C10.7432 21.6115 11.3713 21.3793 12.0206 21.3793H20.3227L10.1291 30.0394C9.63487 30.4593 9.00904 30.6897 8.36236 30.6897H0.117188Z" fill="#00A050"></path>
                                    <path d="M37.7884 0L27.4542 8.82887C26.8407 9.35302 26.4871 10.1222 26.4871 10.9323V17.5862L36.8212 8.75734C37.4347 8.23319 37.7884 7.464 37.7884 6.65386V0Z" fill="#00A050"></path>
                                    <path d="M37.7884 40L27.4542 31.1711C26.8407 30.647 26.4871 29.8778 26.4871 29.0677V22.4138L36.8212 31.2427C37.4347 31.7668 37.7884 32.536 37.7884 33.3461V40Z" fill="#00A050"></path>
                                    <path d="M50.1172 9.31034L39.9236 17.9705C39.4294 18.3904 38.8035 18.6207 38.1569 18.6207H29.9361L40.1047 9.96253C40.5992 9.54141 41.226 9.31034 41.8737 9.31034H50.1172Z" fill="#00A050"></path>
                                    <path d="M50.1172 30.6897L39.9863 22.0345C39.4912 21.6115 38.863 21.3793 38.2137 21.3793H29.9117L40.1052 30.0394C40.5995 30.4593 41.2253 30.6897 41.872 30.6897H50.1172Z" fill="#00A050"></path>
                                </svg>

                            </div>
                            <div>
                                <p v-show="(pin_switch || hovering_on_menu || is_mobile)" class="text-[24px] ml-[10px] font-bold mb-[4px] text-heading-color">DeskMint</p>
                            </div>
                            <!--<div class="flex-1 flex justify-end">
                                <a class="mt-[5px]" v-show="(pin_switch || hovering_on_menu) && pin_switch == false && !is_mobile" @click="pin_switch = !pin_switch" href="javascript:;" ref="menu_toggle_btn"><PinOutline :size="26" /></a>
                                <a class="mt-[5px]" v-show="(pin_switch || hovering_on_menu) && pin_switch == true && !is_mobile" @click="pin_switch = !pin_switch" href="javascript:;" ref="menu_toggle_btn"><PinOffOutline :size="26" /></a>
                            </div>-->
                        </div>
                        <simplebar data-simplebar-auto-hide="true">
                        
                            <div class="pt-[12px] pl-[16px] pr-[16px] ml-[1px]">
                                
                                <ul>

                                    <li class="" v-for="(item, index) in menu_items" v-bind:key="index">
                                        <a @click.stop="showHideSubMenus(index)" href="javascript:;" class="nav-menu-item block active">
                                            <span class="flex flex-row items-center">
                                                <span><component :is="item.icon" :size="28" /></span>
                                                <span v-show="(pin_switch == true || hovering_on_menu || is_mobile)">{{ item.label }}</span>
                                                <span v-show="item.hasSubmenu && (pin_switch == true || hovering_on_menu || is_mobile)" class="flex-1 flex justify-end"><ChevronRight v-if="!item.showSubMenus && (pin_switch == true || hovering_on_menu || is_mobile)" :size="28" /> <ChevronDown v-if="item.showSubMenus" :size="28" /></span>
                                            </span>
                                        </a>
                                        <transition name="slide">
                                            <ul class="submenu" v-show="item.showSubMenus && (pin_switch == true || hovering_on_menu || is_mobile)">
                                                <li v-for="(itemsub, indexsub) in item.submenu" :key="indexsub" class="">
                                                    <a href="javascript:;" class="nav-menu-item block">
                                                        <span><component :is="itemsub.icon" :size="20" /></span>
                                                        <span>{{ itemsub.label }}</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </transition>
                                    </li>

                                    
                                
                                    
                                    
                                </ul>
                            
                            </div>
                        </simplebar>
                    </div>
                </div>
            </transition>
            <div class="bg-blue-200" style="min-height: 1500px;">
                <!--topbar fixed-->
                <div class="fixed top-0 left-0 bg-white w-full md:sticky p-[12px] topbar">
                    <div class="flex pl-[5px] float-start">
                        <a class="" v-show="is_mobile" @click.stop="showHideMobileMenu()" href="javascript:;"><menu-icon :size="40" /></a>
                    </div>
                    <div class="flex custom-container justify-end">
                        <a href="javascript:;" class=" "><img class="rounded-4xl size-10 border border-[10px_solid_var(--color-mint-color)] border-wid" src=""></a>
                        <div class="flex-none absolute mt-[40px] min-w-[100px] bg-red-200 block profile-menu">
                            <ul>
                                <li><a href="">Profile</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <br>
                <br>
                <br>
                <br>
                123
            </div>
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
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.3s ease;
}
.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(-100%);
}
.sidebar-slide-enter-to,
.sidebar-slide-leave-from {
  transform: translateX(0);
}
</style>
<style>
/* Force override SimpleBar styles */
.simplebar-scrollbar {
  width: 10px !important;
  right: 0 !important;
}

.simplebar-scrollbar::before {
  background-color: var(--color-mint-color) !important;
  opacity: 0.3 !important; /* Start hidden */
  width: 6px !important;
  border-radius: 3px !important;
  margin: 2px !important;
  transition: opacity 0.5s ease !important;
}

.simplebar-scrollbar.simplebar-visible::before {
  opacity: 0.5 !important; /* Show on hover/scroll */
}

.simplebar-track {
  background: transparent !important;
  width: 10px !important;
}
</style>
<script lang="ts">
    import MenuIcon from 'vue-material-design-icons/Menu.vue';
    import ChevronLeft from 'vue-material-design-icons/ChevronLeft.vue';
    import ChevronRight from 'vue-material-design-icons/ChevronRight.vue';
    import ChevronDown from 'vue-material-design-icons/ChevronDown.vue';
    import CircleOutline from 'vue-material-design-icons/CircleOutline.vue';
    import PlusBox from 'vue-material-design-icons/PlusBox.vue';
    import ViewDashboard from 'vue-material-design-icons/ViewDashboard.vue';
    import AccountGroup from 'vue-material-design-icons/AccountGroup.vue';
    import Message from 'vue-material-design-icons/Message.vue';
    import PinOutline from 'vue-material-design-icons/Pin.vue';
    import PinOffOutline from 'vue-material-design-icons/PinOffOutline.vue';
    
    import simplebar from 'simplebar-vue';
    import 'simplebar-vue/dist/simplebar.min.css';

    export default {
        name: 'Dashboard',
        components: {
            ChevronLeft,
            ChevronRight,
            ChevronDown,
            PinOffOutline,
            PinOutline,
            CircleOutline,
            ViewDashboard,
            AccountGroup,
            PlusBox,
            Message,
            MenuIcon,
            simplebar
        },
        data : function() {
            return {
                
                show_sidebar: true, /* to show/hide sidebar menu */
                dark_mode: false,
                touch_start_x: 0,
                current_swipe_x: 0,
                max_swipe_distance: 60, // Minimum horizontal swipe distance (px)
                pin_switch: true,
                hovering_on_menu: false,
                show_on_mobile: false,
                mobile_menu_counter: 0,
                mobile_sidebar_left_pos: -60,
                is_swiping: false,
                sidebar_left: 60,
                menu_items: [
                    {
                        id: 10,
                        label: 'Home',
                        hasSubmenu: false,
                        showSubMenus: false,
                        path: '/',
                        icon: 'ViewDashboard'
                    },
                    {
                        id: 1,
                        label: 'Dashboard',
                        hasSubmenu: true,
                        showSubMenus: false,
                        path: '/',
                        icon: 'ViewDashboard',
                        submenu: [
                            { label: 'Submenu 1-1', path : '/', icon: 'ViewDashboard' },
                            { label: 'Submenu 1-2', path : '/', icon: 'ViewDashboard' }
                        ]
                    },
                    
                    {
                        id: 2,
                        label: 'Clients',
                        hasSubmenu: true,
                        showSubMenus: true,
                        path: '/',
                        icon: 'AccountGroup',
                        submenu: [
                            { label: 'Create client', path : '/', icon: 'PlusBox' },
                            { label: 'Temp View Menu', path : '/', icon: 'PlusBox' }
                        ]
                    },
                    {
                        id: 3,
                        label: 'Chats',
                        hasSubmenu: true,
                        showSubMenus: false,
                        path: '/',
                        icon: 'Message',
                        submenu: [
                            { label: 'Submenu 1-1', path : '/', icon: 'ViewDashboard' },
                            { label: 'Submenu 1-2', path : '/', icon: 'ViewDashboard' }
                        ]
                    }
                ],
                is_mobile: window.innerWidth < 768
            }
        },
        methods: {
            mouseOverMenu : function(){
                this.hovering_on_menu = false;
                if(!this.is_mobile){
                    this.hovering_on_menu = true;
                }
            },

            mouseLeaveMenu : function(){
                if(!this.is_mobile){
                    this.hovering_on_menu = false;
                }
            },

            showHideSubMenus : function(index:number){
                this.menu_items[index].showSubMenus = !this.menu_items[index].showSubMenus;
            },

            updateScreenSize : function(){
                this.is_mobile = window.innerWidth < 768;
                this.mobile_menu_counter = 1;
                if(this.is_mobile){
                    /*this.pin_switch = false;*/
                    
                }
            },
            onTouchStart(event:any) {
                this.touch_start_x = event.touches[0].clientX;
                this.is_swiping = true;
            },
            onTouchMove(event:any) {
                this.current_swipe_x = event.touches[0].clientX;
                
                if(this.is_mobile){
                
                    
                    const distance = Math.min(this.current_swipe_x - this.touch_start_x, this.max_swipe_distance);
                    const percentage = (distance / this.max_swipe_distance) * 100;

                    let sidebar_width_px = window.innerWidth * 0.6;
                    
                    const newPositionPercentage = Math.min((sidebar_width_px * (percentage / 100)), sidebar_width_px);
                    //this.mobile_sidebar_left_pos = `-${sidebar_width_px - newPositionPercentage}`;
                    this.mobile_sidebar_left_pos = -(sidebar_width_px - newPositionPercentage);

                }
            },
            onTouchEnd() {
                
                if(this.is_mobile){
                    
                    let mobile_sidebar_left_pos_abs = Math.abs(this.mobile_sidebar_left_pos);
                    if(mobile_sidebar_left_pos_abs == 0){
                        this.show_on_mobile = false;
                    }
                    this.pin_switch = !this.pin_switch;
                    this.show_on_mobile = true;
                    
                    if (this.current_swipe_x - this.touch_start_x >= this.max_swipe_distance) {
                        this.show_on_mobile = true;
                    } else {
                        this.show_on_mobile = false;
                    }
                }
            },
            handleClickOutside(event: any) {
            if (this.is_mobile) {
                const sidebar_menu_ref = this.$refs.sidebar_menu_ref as HTMLElement;
                const toggleBtn = this.$refs.menu_toggle_btn as HTMLElement;
                
                if (sidebar_menu_ref && !sidebar_menu_ref.contains(event.target) && 
                    this.is_mobile && (!toggleBtn || !toggleBtn.contains(event.target))) {
                    this.pin_switch = false;
                    this.show_on_mobile = false;
                    this.mobile_sidebar_left_pos = -60;
                }
            }
        },
            showHideMobileMenu : function(){
                /*this.pin_switch = !this.pin_switch;*/
                this.show_on_mobile = true;
                this.mobile_sidebar_left_pos = 0;
            },
          
        },
        computed: {
            
        },
        mounted() {
            this.updateScreenSize();
            window.addEventListener('resize', this.updateScreenSize);
            document.addEventListener('click', this.handleClickOutside);
        },
        beforeUnmount() {
            window.removeEventListener('resize', this.updateScreenSize);
            document.removeEventListener('click', this.handleClickOutside);
        }
    }
</script>