<script setup>
  import { ref, computed, onMounted ,onUpdated, watchEffect, defineExpose, watch } from 'vue';
  import * as d3 from 'd3';
  import treemapData from '../assets/data/treemap.json';

  const shark = d3.group(treemapData, d=>d.shark);

  const getJudgeImage = (name) => {
    const removeSpaceInSharkName = name.replace(/\s/g, '');
    return new URL(`../assets/images/judges/${removeSpaceInSharkName}.png`, import.meta.url).href;
  };
  
  let svgDimensions =  ref(null);

  onMounted(() => {
      svgDimensions.value = document.querySelector('svg').getBoundingClientRect();
      window.addEventListener('resize',(event)=>{
        svgDimensions.value = document.querySelector('svg').getBoundingClientRect();
      });
    });

  function drawTreeMap(sharkData , value) {
      let width;
      let height;
      width = value?.width  === undefined ? 0 : Math.floor(value.width - 20);
      height = value?.height === undefined ? 0 : Math.floor(value.height - 20);

      const treemapSharkData = d3.group(sharkData, d=>d.shark);
  
      const treeMapLayout = d3.treemap().size([width, height]);
  
      const rootNode = d3.hierarchy(treemapSharkData);
      rootNode.sum(d => d.industry_deals)
  
      treeMapLayout(rootNode);
  
      return rootNode.descendants().slice(2);  
  };   

</script>

<template>
  <div class="pt-10">
    <div class="mx-4 mb-10 p-2">
      <p class="text-3xl text-center mb-8">Explanatory Visualization</p>
      <p class="border-2 border-gray-200 font-light text-xl p-10 rounded-lg text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore perferendis sunt reprehenderit at facere eum? Repellendus, optio aliquid molestias harum eaque recusandae suscipit perferendis incidunt ut distinctio vero tenetur deserunt!
      Molestias odio deleniti possimus nostrum voluptas saepe maxime quia quam corporis sunt sapiente, dolorem at assumenda, molestiae ut illum, nesciunt a rem repellendus sed numquam inventore aperiam culpa? Nihil, nobis?
      Voluptate repudiandae et natus eligendi nemo officiis, minima assumenda. Excepturi repellendus odio unde voluptate debitis expedita eos atque vitae quo! Ex repellendus temporibus provident eligendi blanditiis sint tempora, quibusdam iusto?</p>
    </div>
    <div class="grid grid-cols-12 lg:p-2">
        <div v-for="(portfolio,i) in shark" :key="i" class="relative col-span-12 lg:col-span-6 xl:col-span-4 border-2  border-gray-200 rounded-lg mx-1 md:mx-14 lg:mx-4 my-10">
          <img class="absolute p-1 bg-white inset-x-0.5 -top-14 mx-auto w-28 rounded-full border-2 border-gray-200" :src="getJudgeImage(portfolio[0])">
          <p class="mx-auto mt-20 mb-4 text-xl text-center font-semibold">{{ portfolio[0] }}</p>
          <div class="mx-4">
            <div class="grid grid-cols-12 border border-b border-gray-200 rounded p-2 my-4 items-center">
              <p class="col-span-3"><img src="../assets/images/rupee.png" alt="Rupee icon"></p>
              <p class="col-span-6 text-center">Total money invested</p>
              <p class="col-span-3 text-center">{{ portfolio[1][0].total_investment }}</p>
            </div>
            <div class="grid grid-cols-12 border border-b border-gray-200 rounded p-2 my-4">
              <p class="col-span-3"><img src="../assets/images/deal.png" alt="Handshake icon"></p>
              <p class="col-span-6 text-center">Number of deals made</p>
              <p class="col-span-3 text-center">{{ portfolio[1][0].number_of_deals }}</p>
            </div>
            <div class="border border-b border-gray-200 rounded p-2 my-4">
              <p class="mx-2 text-center">Industry Investment Mix</p>
              <div class="mt-2 h-[50vh]">
                <svg class="border border-black svg" width="100%" height="100%">
                  <g transform="translate(10,10)">
                    <g v-for="(s,i) in drawTreeMap(portfolio[1], svgDimensions)" :key="i" :transform="`translate(${s.x0},${s.y0})`">
                      <rect :width="`${s.x1-s.x0}`" :height="`${s.y1 - s.y0}`" fill="#F2F2F2" stroke="white"></rect>
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>