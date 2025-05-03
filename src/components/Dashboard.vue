<template>
    <div>
        <!--topbar-->
        <div class="bg-amber-300 flex flex-col pl-0 fixed top-0 w-full md:flex-row">
            <div v-if="showMenu" class="hidden w-64 md:w-64 md:block text-center font-bold px-3 py-4">DeskMint</div>
            <a href="javascript:;" @click="showMenu = !showMenu" class="p-3 pl-4 pb-3 pr-4 mt-0 bg-amber-950 w-fit text-xl"><div class=""><menu-icon :size="32" /></div></a>
        </div>

        <div class="mt-14 bg-green-600">
            <div class="flex flex-col md:flex-row">
                <!--sidebar-->
                <div v-show="showMenu" class="fixed z-10 md:relative md:block h-[100vh] overflow-x-auto in-scrollbar bg-amber-50">
                    <aside class="w-64 md:w-64">
                        <nav>
                            <ul>
                                <li class="block bg-amber-500 block mt-2"><a href="" class="p-2 block"><menu-icon :size="26" />&nbsp;<span v-show="!isMobile && showMenu">Test</span></a></li>
                                <li class="block bg-amber-500 block mt-2"><a href="" class="p-2 block"><menu-icon :size="26" />&nbsp;<span v-show="!isMobile && showMenu">Test</span></a></li>
                                <li class="block bg-amber-500 block mt-2 relative"><a href="" class="p-2 block"><menu-icon :size="26" />&nbsp;<span v-show="!isMobile && showMenu">Test</span>
                                    <span class="absolute top-2 right-2"><menu-icon :size="26" /></span></a>
                                    <ul class="ml-2 hidden">
                                        <li class="block bg-amber-500 block mt-2"><a href="" class="p-2 block"><menu-icon :size="26" />&nbsp;Test</a></li>
                                        <li class="block bg-amber-500 block mt-2"><a href="" class="p-2 block"><menu-icon :size="26" />&nbsp;Test</a></li>
                                        <li class="block bg-amber-500 block mt-2"><a href="" class="p-2 block"><menu-icon :size="26" />&nbsp;Test</a></li>
                                        <li class="block bg-amber-500 block mt-2"><a href="" class="p-2 block"><menu-icon :size="26" />&nbsp;Test</a></li>
                                    </ul>
                                
                                </li>
                                <li class="block bg-amber-500 block mt-2"><a href="" class="p-2 block"><menu-icon :size="26" />&nbsp;<span v-show="!isMobile && showMenu">Test</span></a></li>
                            </ul>
                        </nav>
                    </aside>
                </div>

                <!--content area-->
                <div>2aa</div>
            </div>
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
                showMenu : true,
                isMobile: window.innerWidth < 768
            }
        },
        methods:{
            
        }
    }

</script>