<script setup>
    import { ref } from 'vue';

    const navLinks = ['About', 'Explanatory', 'Exploratory'];
    const navMobileLinks = ['Home', 'About', 'Explanatory', 'Exploratory'];

    const showSideNav = ref(false);
    const toggleSideNav = () => {
        showSideNav.value = !showSideNav.value
    }
</script>
<template>
    <nav>
        <div class="sm:hidden flex  flex-col justify-between mx-auto pl-2 pr-6 bg-white relative">
            <a class="flex py-2 hover:cursor-pointer" @click="toggleSideNav">
                <span class="material-icons-round">menu</span>
                <span class="pl-1">Shark Tank India</span>
            </a>
            <div v-if="showSideNav === true" class="mb-4 basis-6/12 absolute top-10 bg-white w-3/4">
                <ul>
                    <li v-for="(link, index) in navMobileLinks" :key="index" class="p-2">
                        <a v-if="link === 'Home'" href="#landing_page" @click="toggleSideNav">Home</a>
                        <a v-else :href="`#${link}`" @click="toggleSideNav">{{ link }}</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="hidden md:flex flex-wrap items-center justify-between mx-auto  bg-white pl-2 pr-6">
            <a href="#landing_page" class="flex items-center p-4 hover:text-[#016DAC]">
                <span>Shark Tank India</span>
            </a>
            <div>
                <ul class="flex flex-row">
                    <li v-for="(link, index) in navLinks" :key="index" class="p-4">
                        <a :href="`#${link}`" class="hover:text-[#016DAC]">{{ link }}</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>