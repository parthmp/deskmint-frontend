<template>
    <div>

        <!--topbar-->
        <div class="grid grid-cols-1 md:grid-cols-[minmax(260px,auto)_1fr] fixed w-full top-0">
            <div class="bg-amber-200 p-[5px] font-bold">
                <div class="flex items-center">
                    <span class=""><a @click="setMenuState()" href="javascript:;"><menu-icon :size="40" /></a></span>
                    <span class="ml-[14px] text-lg">DeskMint</span>
                </div>
                
                </div>
            <div class="bg-amber-600" v-show="!isMobile">col 2 (flexible)</div>
        </div>
          
        <div class="grid grid-cols-1 mt-12" :class="{'md:grid-cols-[minmax(260px,auto)_1fr]' : (menuState && !isMobile), 'md:grid-cols-[minmax(40px,auto)_1fr]' : (!menuState && !isMobile)}">
            <div class="mt-[5px] h-[100vh] overflow-auto in-scrollbar" v-show="conditionalShow" :class="{'max-w-[260px]' : isMobile, 'fixed': isMobile}">
                <div v-for="(item, index) in menuItems" v-bind:key="item.id" class="mb-[5px]">
                    <a href="javascript:;" @click="showHideMenuItems(index)">
                        <div class="flex bg-amber-300">
                            <span class="ml-[6px]"><menu-icon :size="32" /></span>
                            <span class="p-[5px]" v-show="menuState">{{ item.label }}</span>
                            <span class="ml-auto mr-[10px]" v-show="menuState && !isMobile"><menu-icon :size="32" /></span>
                        </div>
                    </a>
                    <div class="submenus ml-[25px]" v-show="item.showSubMenus" :class="{'absolute': !menuState, 'ml-[40px]': !menuState, 'mt-[-20px]': !menuState}">
                        <a v-for="(itemsub, indexsub) in menuItems[index].submenu" v-bind:key="indexsub" href="javascript:;">
                            <div>
                                <div class="flex bg-amber-300 mb-[5px]">
                                    <span class="ml-[6px]"><menu-icon :size="32" /></span>
                                    <span class="p-[5px]">{{ itemsub.label }}</span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <div class="bg-amber-400">content</div>
        </div>

    </div>
</template>

<script lang="ts">

    import MenuIcon from 'vue-material-design-icons/Menu.vue';

    export default{
        name: 'Dashboard',
        components: {
            MenuIcon
        },
        data : function(){
            return {
                menuState : true,
                currentSubMenuIndex: 0,
                menuItems : [
                    {
                        id: 1,
                        label: 'Menu Item 1',
                        hasSubmenu: true,
                        showSubMenus: false,
                        path: '/',
                        submenu: [
                            { label: 'Submenu 1-1', path : '/' },
                            { label: 'Submenu 1-2', path : '/' }
                        ]
                    },
                    {
                        id: 2,
                        label: 'Menu Item 2',
                        hasSubmenu: true,
                        showSubMenus: false,
                        path: '/',
                        submenu: [
                            { label: 'Submenu 1-1', path : '/' },
                            { label: 'Submenu 1-2', path : '/' }
                        ]
                    }
                ],
                isMobile: window.innerWidth < 768
            }
        },
        methods:{
            setMenuState : function(){
                this.menuState = !this.menuState;
            },
            showHideMenuItems : function(index:any){
                this.menuItems[index].showSubMenus = !this.menuItems[index].showSubMenus;

                this.menuItems.forEach(mitem => {
                    if(mitem.id != this.menuItems[index].id){
                        mitem.showSubMenus = false;
                    }
                    
                });
                
            },
            updateScreenSize() {
                this.isMobile = window.innerWidth < 768;
                if(this.isMobile){
                    this.menuState = false;
                }
            }
        },
        computed: {
            conditionalShow: function(){
                
                if(this.isMobile){
                    if(this.menuState){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return true;
                }

                
            }
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