<script setup>
import * as d3 from 'd3';
import {ref, computed, onMounted} from 'vue';
import sharksDataset from '../assets/data/sharksDataset.csv';
const filterSharksDataset = sharksDataset.filter(d => d.shark != "");
const sharkGroup = d3.group(filterSharksDataset, d => d.shark);

let svgContainer = ref(null);
let svgContainerHeight = ref(null);
let svgContainerWidth = ref(null);
let dimensions;
const margin = {top:50, left:20, bottom:120, right:20};
const sharks = ['Aman Gupta', 'Anupam Mittal', 'Ashneer Grover', 'Ghazal Alagh', 'Namita Thapar', 'Peyush Bansal', 'Vineeta Singh'];

const getJudgeImage = (name) => {
    const removeSpaceInSharkName = name.replace(/\s/g, '');
    
    return new URL(`../assets/images/judges/${removeSpaceInSharkName}.png`, import.meta.url).href;
  };

const circleGroupScale = d3.scaleBand().domain(sharkGroup.keys());

function getScaleValues(value) {
  if (value.width < 600) {
    return circleGroupScale.range([margin.left, value.width-margin.right])
  } else {
    return circleGroupScale.range([margin.left+50, value.width])
  }
}

function getDimensionValues(value) {
  return value - 15
}
onMounted(() => {
  dimensions = document.getElementById("exploratoryViz").getBoundingClientRect();
  svgContainer.value = dimensions;
  svgContainerWidth.value = dimensions.width;
  svgContainerHeight.value = dimensions.height;
  getScaleValues(dimensions)
  window.addEventListener('resize',(event)=>{
    dimensions = document.getElementById("exploratoryViz").getBoundingClientRect();
    svgContainer.value = dimensions;
    svgContainerHeight.value = dimensions.height;
    svgContainerWidth.value = dimensions.width;
    getScaleValues(dimensions)
  })
});
</script>

<template>
  <div class="pt-12">
    <div class="md:mx-10 lg:mx-8 mb-0 p-2">
      <p class="text-3xl text-center mb-8">Exploratory Visualization</p>
      <p class="border-2 border-gray-300 font-light text-xl p-6 rounded-lg text-justify">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error quam laudantium fugit maxime vel et at deserunt non adipisci eum rem veniam perspiciatis odit quidem esse dolore, natus nihil corrupti.
        Ex cum rem minima fugiat animi consequuntur nesciunt modi adipisci. Sunt laudantium omnis optio cum officiis quam ex neque nisi culpa ipsam, ea dolorem iusto voluptas. Esse iusto obcaecati debitis.
        Eos dolore sit non distinctio. Officia eveniet expedita vel at, fugit, velit sapiente quisquam explicabo adipisci ipsa hic culpa enim. Fugit et aliquid amet nostrum doloribus perferendis! Doloribus, ipsam natus.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat odit explicabo laudantium sequi, qui sint ipsam minus aut voluptatibus non. Est quod, provident obcaecati earum molestiae deserunt asperiores sint deleniti.
      </p>
    </div>
    <div class="grid grid-cols-12 lg:p-2">
      <div class="p-2 col-span-12" id="exploratoryViz" ref="svgContainer">
      <svg id="exploratoryViz" :width="getDimensionValues(svgContainerWidth)" class="bg-gray-100 h-[100vh]">
        <g :transform="`translate(${margin.left},${margin.top})`">
          <g :transform="`translate(0, ${svgContainerHeight-margin.bottom})`">
            <defs>
              <clipPath id="sharkImage">
                <circle v-for="(shark,index) in sharkGroup" :key="index" :cx="circleGroupScale(shark[0])" cy="0" :r="svgContainerWidth < 600 ? 20 : 35" :class="shark[0]"></circle>
              </clipPath>
            </defs>
            <image v-for="(shark, i) in sharkGroup" :key="i" :href="getJudgeImage(shark[0])" :width="svgContainerWidth < 600 ? '60px' : '85px'" :x="svgContainerWidth < 600 ? circleGroupScale(shark[0])-28 : circleGroupScale(shark[0])-42" :y="svgContainerWidth < 600 ? -28 : -45" clip-path="url(#sharkImage)"></image>
            <circle v-for="(outerCircle,o) in sharkGroup" :key="o" :cx="circleGroupScale(outerCircle[0])" cy="0" :r="svgContainerWidth < 600 ? 25 : 40" fill="none" stroke="#d1d5db" stroke-width="2"></circle>
          </g>
        </g>
      </svg>
      </div>
    </div>
  </div>
</template>