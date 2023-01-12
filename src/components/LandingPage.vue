<script setup>
  import landingPageImage from '../assets/images/landing-page-image.png';
</script>

<template>
  <div class="h-[93vh] grid grid-cols-12 grid-rows-6">
    <div class="row-span-5 col-span-12 px-8 items-center relative" id="main-div">
      <div class="absolute top-2/3 md:top-3/4 lg:top-1/2 items-center z-10">
        <h1 class="text-3xl md:text-5xl lg:text-7xl py-1 bg-white">Let's Explore Shark Tank India.</h1>
        <h2 class="text-2xl md:text-4xl lg:text-4xl font-thin py-2 w-fit bg-white">(season one) - A dataviz project.</h2>
      </div>
      <img :src="landingPageImage" alt="landing page image" class="absolute top-0 right-0 h-[80%] md:h-3/4 lg:h-[100%]">
    </div>
    <div class="row-span-1 col-span-12">
      <div class="grid grid-row-3">
        <p class="px-8 font-light">Data Visualization and Design - 
          <a href="https://github.com/urmilaj" class="text-sky-500">Urmila J</a>
        </p>
        <p class="px-8 font-light">Data Source - 
          <a href="https://www.kaggle.com/datasets/thirumani/shark-tank-india" class="text-sky-500">[Kaggle: Dataset] - Satya Thirumani</a>
        </p>
        <span class="material-icons-round mx-auto mt-4">keyboard_double_arrow_down</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-icons-round {
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  45% {
    transform: translateY(-45%);
  }
}
</style>