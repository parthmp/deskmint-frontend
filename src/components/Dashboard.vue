<template>
    <div>

       <div class="grid grid-cols-1 md:grid-cols-[minmax(0px,290px)_1fr]">
            <div class="bg-amber-3050">

                <div class="flex items-center p-[16px] pl-[22px]">
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
                        <p class='text-[24px] ml-[10px] font-bold mb-[4px] text-heading-color'>DeskMint</p>
                    </div>
                </div>
                <div>
                    <div class="p-[12px] overflow-auto h-[100vh] in-scrollbar">
                        <ul>
                            
                            <li class="" v-for="(item, index) in menuItems" v-bind:key="index">
                                <a href="javascript:;" @click="showHideSubMenu(index)" class="nav-menu-item block">
                                    <span><MenuIcon :size="28" /></span>
                                    <span>{{ item.label }}</span>
                                    <span v-if="item.hasSubmenu" class="float-right"><ChevronRight v-if="!item.showSubMenus" :size="28" /> <ChevronDown v-if="item.showSubMenus" :size="28" /></span>
                                </a>
                                <ul v-if="item.hasSubmenu" v-show="item.showSubMenus" class="submenu">
                                    <li v-for="(itemsub, indexsub) in item.submenu" :key="indexsub" class="">
                                        <a href="javascript:;" class="nav-menu-item block active">
                                            <span><CircleOutline :size="20" /></span>
                                            <span>Menu 1</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                         
                            
                            
                        </ul>
                    </div>
                </div>
            </div>
            <div>2</div>
       </div>

    </div>
</template>

<script lang="ts">

    import MenuIcon from 'vue-material-design-icons/Menu.vue';
    import ChevronLeft from 'vue-material-design-icons/ChevronLeft.vue';
    import ChevronRight from 'vue-material-design-icons/ChevronRight.vue';
    import ChevronDown from 'vue-material-design-icons/ChevronDown.vue';
    import CircleOutline from 'vue-material-design-icons/CircleOutline.vue';
    import PlusBox from 'vue-material-design-icons/PlusBox.vue';
    import ViewDashboard from 'vue-material-design-icons/ViewDashboard.vue';
    

    export default{
        name: 'Dashboard',
        components: {
            ChevronLeft,
            ChevronRight,
            ChevronDown,
            CircleOutline,
            ViewDashboard,
            PlusBox,
            MenuIcon
        },
        data : function(){
            return {
                menuState : true,
                darkMode: false,
                currentSubMenuIndex: 0,
                menuItems : [
                    {
                        id: 10,
                        label: 'BLA',
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
                        showSubMenus: false,
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
                isMobile: window.innerWidth < 768
            }
        },
        methods:{
            showHideSubMenu : function(index:number){

                this.menuItems[index].showSubMenus = !this.menuItems[index].showSubMenus;

            },
            updateScreenSize() {
                this.isMobile = window.innerWidth < 768;
                if(this.isMobile){
                    this.menuState = false;
                }
            }
        },
        computed: {
           
        },
        mounted() {
            this.updateScreenSize();
            window.addEventListener('resize', this.updateScreenSize);
        },
        beforeUnmount() {
            window.removeEventListener('resize', this.updateScreenSize);
        }
    }

</script>