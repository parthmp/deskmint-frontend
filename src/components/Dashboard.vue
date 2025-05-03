<template>
    <div>
        <div class="topbar bg-amber-300 flex flex-col md:flex-row">
            <div class="hidden w-64 md:w-64 md:block">123</div>
            <div><menu-icon /></div>
        </div>
    </div>
</template>

<script lang="ts">
    import MenuIcon from 'vue-material-design-icons/Menu.vue';

    export default{
        name: 'Dashboard',
        components: {
            MenuIcon
        }
    }

</script>