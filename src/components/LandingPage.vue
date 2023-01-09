<script setup>
import landingPageImage from '../assets/images/landing-page-image.png';
</script>

<template>
  <div class="h-[94vh] grid grid-cols-12 grid-rows-6">
    <div class="row-span-5 col-span-12 px-8 items-center relative" id="main-div">
      <div class="absolute top-1/2 items-center z-10">
        <h1 class="text-3xl sm:text-4xl lg:text-7xl py-1 bg-white">Let's Explore Shark Tank India.</h1>
        <h2 class="text-xl sm:text-2xl lg:text-4xl font-thin py-2 w-fit bg-white">(season one) - A dataviz project.</h2>
      </div>
      <img :src="landingPageImage" alt="landing page image" class="absolute top-0 right-0">
    </div>
    <div class="row-span-1 col-span-12 relative">
      <span class="pb-8 absolute left-1/2 bottom-0 mb-4">scroll</span>
      <span class="material-icons-round pl-1 absolute left-1/2 bottom-0 mb-4">keyboard_double_arrow_down</span>
    </div>
  </div>
</template>

<style scoped>
.material-icons-round {
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  50% {
    transform: translateY(-50%);
  }
}
</style>