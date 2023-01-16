<script setup>
  import { ref, onMounted } from 'vue';
  import * as d3 from 'd3';

  import treemapData from '../assets/data/treemap.json';
  import treemapTooltip from '../assets/data/treemapTooltip.json';

  const shark = d3.group(treemapData, d=>d.shark);
  const treemapTooltipData = d3.group(treemapTooltip, d=>d.shark);

  const iconScale = d3.scaleLinear().domain([0,10]).range([0,100]);

  const getJudgeImage = (name) => {
    const removeSpaceInSharkName = name.replace(/\s/g, '');
    return new URL(`../assets/images/judges/${removeSpaceInSharkName}.png`, import.meta.url).href;
  };
  
  const getSharkStartupInvestment = (data, filterName) => {
    return data.filter(v => v.industry_name === filterName)
  }

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
      width = value?.width  === undefined ? 0 : Math.floor(value.width - 8);
      height = value?.height === undefined ? 0 : Math.floor(value.height - 8);

      const treemapLayoutType =  sharkData[0].shark === 'Vineeta Singh' && width <= 300 ? d3.treemapSlice : d3.treemapBinary;

      const treemapSharkData = d3.group(sharkData, d=>d.shark);
  
      const treeMapLayout = d3.treemap().size([width, height]);
  
      const rootNode = d3.hierarchy(treemapSharkData);
      rootNode.sum(d => d.industry_deals)

      treeMapLayout.tile(treemapLayoutType);
  
      treeMapLayout(rootNode);
  
      return rootNode.descendants().slice(2);
  };   

  const getTooltipContent = (content) => {
    const tooltip = `
    <h1 style='font-size:1.2rem; font-weight:500; padding-bottom:1px'>${content.startup_name}</h1>
    <h2 style='font-weight:300; padding-bottom:10px'>${content.description}</h2>
    <hr style='border:black solid 0.1px'>
    <p style='font-weight:400; padding-bottom:3px; padding-top:10px'>Equity Investment - ${content.equity_investment}</p>
    <p style='font-weight:400; padding-bottom:5px;'>Equity Stake - ${content.equity_stake}%</p>
    <p style='font-weight:400; padding-bottom:5px;'>Debt Investment - ${content.debt_investment}</p>
    <p style='font-weight:400; padding-bottom:5px;'>Debt Stake - ${content.interest}%</p>
    `
    return tooltip;
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
        <div v-for="(portfolio,i) in shark" :key="i" class="relative col-span-12 lg:col-span-6 xl:col-span-4 border-2  border-gray-200 rounded-lg mx-1 md:mx-14 lg:mx-1 my-10">
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
              <div class="mt-2 h-[50vh]" >
                <svg class="border border-black svg" width="100%" height="100%">
                  <g transform="translate(3,3)">
                    <g v-for="(data,i) in drawTreeMap(portfolio[1], svgDimensions)" :key="i" :transform="`translate(${data.x0},${data.y0})`">
                      <rect :width="`${data.x1-data.x0}`" :height="`${data.y1 - data.y0}`" :fill="`${data.data.fill}`" stroke="white" opacity="0.3"></rect>
                      <text dx="5" y="18" class="text-[0.7rem] md:text-[0.9rem]" >{{ data.data.industry_name }}</text>
                      <text dx="5" y="30" class="text-[0.7rem] md:text-[0.8rem]">{{ data.data.industry_percentage }}</text>
                      <text dx="5" y="42" class="text-[0.7rem] md:text-[0.8rem]">{{ data.data.investment_percentage }}</text>
                      <g :transform="`translate(${(data.x1-data.x0)/2},${10})`">
                        <path 
                          v-for="(iconData,i) in getSharkStartupInvestment(treemapTooltipData.get(portfolio[0]), data.data.industry_name)" 
                          :key="i"
                          v-tippy="{content:getTooltipContent(iconData), theme:'custom'}"
                          :transform="`translate(${iconScale(i%5*1.3)},${iconScale((Math.floor(i/5)*2.5)-0.5)})`"
                          stroke="white"
                          stroke-width="1.5"
                          :fill="`${data.data.fill}`"
                          d="M15 8.96849C14.4585 8.96849 13.995 8.77599 13.6095 8.39099C13.224 8.00549 13.0312 7.53149 13.0312 6.96899C13.0312 6.42699 13.224 5.96349 13.6095 5.57849C13.995 5.19299 14.4585 5.00024 15 5.00024C15.5415 5.00024 16.005 5.19299 16.3905 5.57849C16.776 5.96349 16.9687 6.42699 16.9687 6.96899C16.9687 7.53149 16.776 8.00549 16.3905 8.39099C16.005 8.77599 15.5415 8.96849 15 8.96849ZM12.906 24.9997V18.75H11.6565V12.7185C11.6565 12.1355 11.8647 11.6407 12.2812 11.2342C12.6977 10.8282 13.1872 10.6252 13.7497 10.6252H16.2502C16.8127 10.6252 17.3022 10.8282 17.7187 11.2342C18.1352 11.6407 18.3435 12.1355 18.3435 12.7185V18.75H17.094V24.9997H12.906Z">
                        </path>
                      </g>
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
