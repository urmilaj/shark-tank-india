<script setup>
    const navLinks = ['About', 'Explanatory', 'Exploratory']
</script>
<template>
    <nav>
        <div class="flex flex-wrap items-center justify-between mx-auto fixed top-0 bg-white w-screen pl-2 pr-6">
            <a href="#landing_page" class="flex items-center p-4">
                <span>Shark Tank India</span>
            </a>
            <div>
                <ul class="flex flex-row">
                    <li v-for="(link, index) in navLinks" :key="index" class="p-4">
                        <a :href="`#${link}`">{{ link }}</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>