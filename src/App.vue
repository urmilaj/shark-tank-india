<script setup>
import NavBar from './components/NavBar.vue';
import LandingPage from './components/LandingPage.vue';
import AboutPage from './components/AboutPage.vue';
import ExplanatoryPage from './components/ExplanatoryPage.vue';
import ExploratoryPage from './components/ExploratoryPage.vue';
</script>
<template>
  <div>
    <div class="sticky top-0 z-20">
      <NavBar></NavBar>
    </div>
    <div id="landing_page">
      <LandingPage></LandingPage>
    </div>
    <div id="About">
      <AboutPage></AboutPage>
    </div>
    <div id="Explanatory">
      <ExplanatoryPage></ExplanatoryPage>
    </div>
    <div id="Exploratory">
      <ExploratoryPage></ExploratoryPage>
    </div>
  </div>
</template>


