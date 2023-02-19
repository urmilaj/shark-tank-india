<script setup>
import * as d3 from 'd3';
import {ref, computed, onMounted} from 'vue';
import sharksDataset from '../assets/data/sharksDataset.csv';
import sharkInvestmentLinks from '../assets/data/sharkInvestmentLinks.csv';
const filterSharksDataset = sharksDataset.filter(d => d.shark != "");
const sharkGroup = d3.group(filterSharksDataset, d => d.shark);
const industryGroup = d3.group(sharksDataset, d => d.Industry, d => d["Startup Name"]);

let svgContainer = ref(null);
let svgContainerHeight = ref(null);
let svgContainerWidth = ref(null);
let dimensions;
const sharks = ref();
const startups = ref();
const margin = {top:50, left:20, bottom:120, right:20};

const getJudgeImage = (name) => {
    const removeSpaceInSharkName = name.replace(/\s/g, '');
    
    return new URL(`../assets/images/judges/${removeSpaceInSharkName}.png`, import.meta.url).href;
};

const simulation = (dataset) => {
  const forces = d3.forceSimulation([...dataset]).force("collide",d3.forceCollide(10.5));
  for (let i = 0; i < dataset.size; ++i) {
    forces.tick();
  }
  return forces;
}

const sharkGroupScale = d3.scaleBand().domain(sharkGroup.keys());
const industryGroupXScale = d3.scaleBand().domain(industryGroup.keys());
const industryGroupYScale = d3.scaleOrdinal().domain(industryGroup.keys());
const industryGroupCrScale = d3.scaleOrdinal().domain(industryGroup.keys()).range([88, 40, 83, 50, 48, 70, 58]);
const industryGroupCxScale = d3.scaleOrdinal().domain(industryGroup.keys());
const industryGroupCyScale = d3.scaleOrdinal().domain(industryGroup.keys());
const links = d3.linkVertical()
  .source(d => [d.sourceX, d.sourceY])
  .target(d => [d.targetX, d.targetY]);

const sharkStartupLinkData = (linksPosition, sharkPosition, startupPosition) => {
  linksPosition.forEach(d => {
    sharkPosition.forEach(v => {
    let parentX = +v.parentElement.attributes.transform.value.split(",")[0].replace(/\D/g,'');
    let parentY = +v.parentElement.attributes.transform.value.split(",")[1].replace(/\D/g,'');
    let cx = +v.attributes.cx.nodeValue;
    let cy = +v.attributes.cy.nodeValue;
    if(d.shark === v.__data__[0]) {
      d["sourceX"] = (parentX)+(cx);
      d["sourceY"] = (parentY)+(cy)-25;
    }
    });
    startupPosition.forEach(s => {
      let targetParentX = +s.parentElement?.attributes.transform.value.split(",")[0].replace(/^\D+/g, '');
      let targetParentY = +s.parentElement?.attributes.transform.value.split(",")[1].replace(/\D/g,'');
      let targetX = s.__data__.x //+s.attributes.transform.value.split(",")[0].replace(/^\D+/g, '');
      let targetY = s.__data__.y //+s.attributes?.transform.value.split(",")[1].replace(/^\D+/g, '');
      if(d.startup_name === s.__data__[0]) {
        d["targetX"] = targetParentX+targetX+20;
        d["targetY"] = targetParentY+targetY+33;
      }
      })
  });
}; 

//sharkStartupLinkData(sharkInvestmentLinks, sharks, startups)

function getScaleValues(value) {
  if (value.width < 600) {
    sharkGroupScale.range([margin.left, value.width-margin.right]);
    industryGroupXScale.range([margin.left+50, value.width-80]);
    industryGroupYScale.range([80, 350, 220, 350, 100, 200, 50]);
    industryGroupCxScale.range([20, -80, 10, 50, 10, 50, 25]);
    industryGroupCyScale.range([18, -50, 50, 80, 30, 50, 30]);
  }
   else {
    sharkGroupScale.range([margin.left+80, value.width]);
    industryGroupXScale.range([margin.left+80, value.width]);
    industryGroupYScale.range([50, 180, 50, 200, 150, 80, 20]);
    industryGroupCxScale.range([0, 25, 20, 0, -50, 0, -20]);
    industryGroupCyScale.range([50, 20, 10, 180, 100, 100, 23]);
  }
}

function getDimensionValues(value) {
  if (value < 600) {
    return value - 0
  } else {
    return value - 15
  }
}
onMounted(() => {
  dimensions = document.getElementById("exploratoryViz").getBoundingClientRect();
  svgContainer.value = dimensions;
  svgContainerWidth.value = dimensions.width;
  svgContainerHeight.value = dimensions.height;
  //sharkStartupLinkData(sharkInvestmentLinks, sharks.value, startups.value);
  getScaleValues(dimensions)
  window.addEventListener('resize',(event)=>{
    dimensions = document.getElementById("exploratoryViz").getBoundingClientRect();
    svgContainer.value = dimensions;
    svgContainerHeight.value = dimensions.height;
    svgContainerWidth.value = dimensions.width;
    getScaleValues(dimensions)
    //sharkStartupLinkData(sharkInvestmentLinks, sharks.value, startups.value);
  })
});
</script>

<template>
  <div class="pt-2">
    <div class="md:mx-10 lg:mx-8 mb-0 p-2">
      <p class="text-3xl text-center mb-8">Exploratory Visualization</p>
      <p class="border-2 border-gray-300 font-light text-xl p-6 rounded-lg text-justify">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error quam laudantium fugit maxime vel et at deserunt non adipisci eum rem veniam perspiciatis odit quidem esse dolore, natus nihil corrupti.
        Ex cum rem minima fugiat animi rovident obcaecati earum molestiae deserunt asperiores sint deleniti.
      </p>
    </div>
    <div class="grid grid-cols-12 lg:p-2">
      <div class="p-2 col-span-12" id="exploratoryViz" ref="svgContainer">
      <svg id="exploratoryViz" :width="getDimensionValues(svgContainerWidth)" class="bg-gray-100 h-[100vh]">
        <g :transform="`translate(${margin.left},${margin.top})`">
          <g :transform="`translate(0, ${svgContainerHeight-margin.bottom})`">
            <defs>
              <clipPath id="sharkImage">
                <circle v-for="(shark,index) in sharkGroup" :key="index" :cx="sharkGroupScale(shark[0])" cy="0" :r="svgContainerWidth < 600 ? 20 : 35" :class="shark[0]"/>
              </clipPath>
            </defs>
            <image v-for="(shark, i) in sharkGroup" :key="i" :href="getJudgeImage(shark[0])" :width="svgContainerWidth < 600 ? '60px' : '85px'" :x="svgContainerWidth < 600 ? sharkGroupScale(shark[0])-28 : sharkGroupScale(shark[0])-42" :y="svgContainerWidth < 600 ? -28 : -45" clip-path="url(#sharkImage)"></image>
            <circle
            v-for="(outerCircle,o) in sharkGroup"
            :key="o"
            :ref="sharks"
            :cx="sharkGroupScale(outerCircle[0])"
            cy="0"
            :r="svgContainerWidth < 600 ? 25 : 40"
            fill="none"
            stroke="#d1d5db"
            stroke-width="2">
            </circle>
          </g>
          <g v-for="(industry, i) in industryGroup" :key="i" :transform="`translate(${industryGroupXScale(industry[0])},${industryGroupYScale(industry[0])})`">
            <circle :cx="industryGroupCxScale(industry[0])" :cy="industryGroupCyScale(industry[0])" :r="industryGroupCrScale(industry[0])" fill="white" stroke="#F9E272" stroke-width="2"/>
            <path
            class="industryPath"
            :id="`industryPath_${i}`"
            :d="`M${industryGroupCxScale(industry[0])-industryGroupCrScale(industry[0])} ${industryGroupCyScale(industry[0])} a ${industryGroupCrScale(industry[0])},${industryGroupCrScale(industry[0])} 0 1,1 ${industryGroupCrScale(industry[0])*2}, 0`"
            fill="none"
            />
            <text class="industryPathText" dy="-5">
              <textPath startOffset="49%" text-anchor="middle" :href="`#industryPath_${i}`">{{ industry[0] }}</textPath>
            </text>
            <g :transform="`translate(${industryGroupCxScale(industry[0])-20},${industryGroupCyScale(industry[0])-20})`">
              <path 
                v-for="(force, f) in simulation(industry[1]).nodes()"
                :key="f" class="startUpPath"
                :ref="startups"
                :transform="`translate(${force.x},${force.y})`"
                d="M20 11.958q-1.083 0-1.854-.77-.771-.771-.771-1.896 0-1.084.771-1.854.771-.771 1.854-.771 1.083 0 1.854.771.771.77.771 1.854 0 1.125-.771 1.896-.771.77-1.854.77Zm-2.792 21.375V25h-1.666v-8.042q0-1.166.833-1.979.833-.812 1.958-.812h3.334q1.125 0 1.958.812.833.813.833 1.979V25h-1.666v8.333Z"
                :fill="`${force[1][0].shark === '' ? 'gray':'white'}`"
                :opacity="`${force[1][0].shark === '' ? 0.3 : 1}`"
                stroke="gray"
              />
            </g>
          </g>
          <g>
            <path
            v-for="(links, l) in sharkInvestmentLinks"
            :key="l"
            fill="none"
            stroke="#AB59A0"
            stroke-width="0.1"
            />
          </g>
        </g>
      </svg>
      </div>
    </div>
  </div>
</template>