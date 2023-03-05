<script setup>
import * as d3 from 'd3';
import {ref, onMounted} from 'vue';
import sharksDataset from '../assets/data/sharksDataset.csv';
import sharkAnnotation from '../assets/data/annotation.json';
import treemapAnnotation from '../assets/data/treemapTooltip.json';
const filterSharksDataset = sharksDataset.filter(d => d.shark != "");
const sharkGroup = d3.group(filterSharksDataset, d => d.shark);
const industryGroup = d3.group(sharksDataset, d => d.Industry, d => d.startup);
const annotationDataset = d3.group(sharkAnnotation, d => d.shark);
let svgContainer = ref(null);
let svgContainerHeight = ref(null);
let svgContainerWidth = ref(null);
let dimensions;
const sharks = ref(null);
const sharkImage = ref(null);
const startups = ref(null);
const pathLinks = ref(null);
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
};

const sharkGroupScale = d3.scaleBand().domain(sharkGroup.keys());
const industryGroupXScale = d3.scaleBand().domain(industryGroup.keys());
const industryGroupYScale = d3.scaleOrdinal().domain([...industryGroup.keys()]);
const industryGroupCrScale = d3.scaleOrdinal().domain(industryGroup.keys()).range([88, 40, 83, 50, 48, 70, 58]);
const industryGroupCxScale = d3.scaleBand().domain(industryGroup.keys());
const industryGroupCyScale = d3.scaleOrdinal().domain([...industryGroup.keys()]);
const links = (linkData) => {
  const createVerticalLinks = d3.linkVertical()
   .source(d => [d.sourceX, d.sourceY])
   .target(d => [d.targetX, d.targetY]);

  return createVerticalLinks(linkData);
};

const sharkStartupLinkData = (linksPosition, sharkPosition, startupPosition) => {
  const regex = /-?\d+(\.\d+)?/g;
  linksPosition.forEach((d,i) => {
    startupPosition.forEach(startup => {
      const sourceX = +(startup.attributes.transform.value.split(",")[0].match(regex)[0]);
      const sourceY = +(startup.attributes.transform.value.split(",")[1].match(regex)[0]);
      if (d.startup === startup.attributes.class.value) {
        d["sourceX"] = industryGroupXScale(d.Industry)+(industryGroupCxScale(d.Industry))+(sourceX);
        d["sourceY"] = industryGroupYScale(d.Industry)+(industryGroupCyScale(d.Industry))+sourceY;
      }
    });
    sharkPosition.forEach(shark => {
      if (d.shark === shark.attributes.class.value) {
        d["targetX"] = sharkGroupScale(shark.attributes.class.value);
        d["targetY"] = svgContainerWidth.value < 600 ? (svgContainerHeight.value-margin.bottom-25) : (svgContainerHeight.value-margin.bottom-40);
      }
    })
  });
}; 

function getScaleValues(value) {
  if (value.width < 500) {
    sharkGroupScale.range([margin.left, value.width]);
    industryGroupXScale.range([margin.left+30, value.width-50]);
    industryGroupYScale.range([100, 180, 120, 100, 150, 80, 80]);
    industryGroupCxScale.range([0, 15]);
    industryGroupCyScale.range([20, 290, 200, 380, 80, 20, 280]);  
  }
  if (value.width > 500 && value.width < 600) {
    sharkGroupScale.range([margin.left, value.width-margin.right]);
    industryGroupXScale.range([margin.left+50, value.width+30]);
    industryGroupYScale.range([80, 480, 220, 350, 70, 200, 50]);
    industryGroupCxScale.range([20, -80, 10, 50, 10, 50, 25]);
    industryGroupCyScale.range([18, -50, 50, 80, 30, 50, 30]);
  }
  if (value.width > 600) {
    sharkGroupScale.range([margin.left+80, value.width]);
    industryGroupXScale.range([margin.left+80, value.width]);
    industryGroupYScale.range([100, 180, 120, 100, 150, 80, 80]);
    industryGroupCxScale.range([0, 25, 20, 0, -50, 0, -20]);
    industryGroupCyScale.range([50, 20, 10, 180, 100, 100, 23]);
  }
};

function getDimensionValues(value) {
  if (value > 600) {
    return value - 15
  }
  if (value < 600) {
    return value - 0
  } 
};

const showSharkInvestments = (value) => {
  const getTreemapTooltip = treemapAnnotation.filter((d) => d.shark === value[0]);
  const highestInvestment = getTreemapTooltip.reduce((prev, current) => ((prev.equity_investment_number + prev.debt_investment_number) > (current.equity_investment_number + current.debt_investment_number)) ? prev : current);
  const lowestInvestment = getTreemapTooltip.reduce((prev, current) => ((prev.equity_investment_number + prev.debt_investment_number) < (current.equity_investment_number + current.debt_investment_number)) ? prev : current);
  const getAnnotation = annotationDataset.get(value[0])
  const numberOfInvestments = value[1].length;
  const tooltip = `
  <h1 style='font-size:1.2rem; font-weight:500; padding-bottom:5px;'>${value[0]} - ${numberOfInvestments} investments.</h1>
  <hr style='border:black solid 0.1px;'>
  <p style='font-weight:400; padding-top:5px;'>${getAnnotation[0].annotation}</p><br>
  <p style='font-weight:400; padding-top:5px;'>${value[0].split(" ")[0]}'s highest investment was ${highestInvestment.startup_name} at ₹ ${(highestInvestment.equity_investment_number+highestInvestment.debt_investment_number).toLocaleString('en-IN')} and lowest investment was ${lowestInvestment.startup_name} ₹ ${(lowestInvestment.equity_investment_number+lowestInvestment.debt_investment_number).toLocaleString('en-IN')}.</p>
  <br>
  `
  return tooltip;
}

const showStartupInvestments = (value) => {
  const getTreemapTooltip = treemapAnnotation.filter((d) => d.startup_name === value[0]);
  const totalEquityInvestment = d3.sum(getTreemapTooltip, (d) => d.equity_investment_number)
  const totalDebtInvesment = d3.sum(getTreemapTooltip, (d) => d.debt_investment_number)
  const debtAnnotation = totalDebtInvesment === 0 ? 'It was an all equity deal with no debt.' : `Along with a debt of ₹ ${totalDebtInvesment.toLocaleString('en-IN')}.`
  const equityStakeAnnotation = value[1].length === 1 ? `${getTreemapTooltip[0].shark} settled for an equity stake of ${getTreemapTooltip[0].equity_stake}%` : `Each shark settled for an equity stake of ${(getTreemapTooltip[0].equity_stake)}%`
  let names = []
  value[1].forEach(d => {
    if (d.shark) {
      names.push(d.shark)
    }
  })
  const tooltip = `
  <h1 style='font-size:1.2rem; font-weight:400; padding-bottom:3px'>${value[0]} - ${value[1].length} ${value[1].length === 1 ? 'shark.' : 'sharks.'}</h1>
  <h2 style='font-size:1rem; font-weight:300; padding-bottom:10px'>${value[1][0]["Business Description"]}</h2>
  <hr style='border:black solid 0.1px'>
  <p style='font-weight:400; padding-top:5px;'>${value[0]} received a total equity investment of ₹ ${totalEquityInvestment.toLocaleString('en-IN')}. ${debtAnnotation} ${equityStakeAnnotation}.</p>
  `
  return tooltip;
}

const activateLinkPaths = (sharkData) => {
  const sharkName = sharkData[0].replace(/ /g,'');
  const sharkDataValues = sharkData[1];
  const tooltipData = showSharkInvestments(sharkData);
  sharkDataValues.forEach((shark) => {
    pathLinks.value.forEach((link) => {
      if(link.attributes.class.value === `${shark.startup.replace(/ /g,'')}_${sharkName}`) {
        link.style.strokeWidth = svgContainerWidth.value < 600 ? 1 : 1.8 ;  
      }
    })
    startups.value.forEach((startup) => {
      if(startup.attributes.class.value === shark.startup) {
        startup.style.fill = '#AB59A0';
        startup.style.stroke = '#AB59A0';
      }
    })
    sharkImage.value.forEach((sharkImg) => {
      if(sharkImg.attributes.class.value === sharkData[0]) {
        sharkImg._tippy.setContent(`${tooltipData}`);
        sharkImg._tippy.show();
      }
    })
  })
}

const deactivateLinkPaths = (sharkData) => {
  const sharkDataValues = sharkData[1];
  pathLinks.value.forEach((link) => {
    link.style.strokeWidth = 0.1
  })
  sharkDataValues.forEach((shark) => {
    startups.value.forEach((startup) => {
      if(startup.attributes.class.value === shark.startup) {
        startup.style.fill = 'white'
        startup.style.stroke = 'gray'
      }
    })
    sharkImage.value.forEach((sharkImg) => {
      if(sharkImg.attributes.class.value === sharkData[0]) {
        sharkImg._tippy.hide()
      }
    })
  })
}

const activateStartupLinkPaths = (startupData) => {
  const startupName = startupData[0].replace(/ /g,'');
  const startupDataValues = startupData[1].filter((d) => d.shark != '');
  const tooltipData = showStartupInvestments(startupData)
  startupDataValues.forEach((startup) => {
    pathLinks.value.forEach((link) => {
      if (link.attributes.class.value === `${startupName}_${startup.shark.replace(/ /g,'')}`) {
        link.style.strokeWidth = 2.5 
      }
    })
    startups.value.forEach((startupValue) => {
      if (startupValue.attributes.class.value === startupData[0]) {
        startupValue.style.fill = '#AB59A0'
        startupValue.style.stroke = '#AB59A0'
        startupValue._tippy.setContent(`${tooltipData}`)
        startupValue._tippy.show()
      }
    })
  })
}

const deactivateStartupLinkPaths = (startupData) => {
  const startupDataValues = startupData[1].filter((d) => d.shark != '');
  pathLinks.value.forEach((link) => {
    link.style.strokeWidth = 0.1
  })
  startupDataValues.forEach((startup) => {
    startups.value.forEach((startupValue) => {
      if (startupValue.attributes.class.value === startupData[0]) {
        startupValue.style.fill = 'white'
        startupValue.style.stroke = 'gray'
        startupValue._tippy.hide()
      }
    })
  })
}


onMounted(() => {
  dimensions = document.getElementById("exploratoryViz").getBoundingClientRect();
  svgContainer.value = dimensions;
  svgContainerWidth.value = dimensions.width;
  svgContainerHeight.value = dimensions.height;
  getScaleValues(dimensions);
  sharkStartupLinkData(filterSharksDataset, sharks.value, startups.value);
  window.addEventListener('resize',(event)=>{
    dimensions = document.getElementById("exploratoryViz").getBoundingClientRect();
    svgContainer.value = dimensions;
    svgContainerHeight.value = dimensions.height;
    svgContainerWidth.value = dimensions.width;
    getScaleValues(dimensions);
    sharkStartupLinkData(filterSharksDataset, sharks.value, startups.value);
  });
});
</script>

<template>
  <div class="pt-10">
    <div class="md:mx-10 lg:mx-8 mb-0 p-2">
      <p class="text-3xl text-center mb-8">Exploratory Visualization</p>
      <p class="border-2 border-gray-300 font-light text-xl p-6 rounded-lg text-justify">
        In season one 121 startups participated in Shark Tank India. Only 67 of these 121 startups made successful pitches and subsequently received funding from atleast one or more sharks. <br><br>
        The visualization below is interactive. <b> Hover over the icons </b> to see which of the sharks invested in that particular startup OR <b>hover over individual sharks</b> to see all of the startups that they invested in. <br><br> The icons below with gray fill indicate startups that did not receive any funding from sharks or rejected the shark deal that was offered to them.
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
            <image
              v-for="(shark, i) in sharkGroup" 
              :key="i"
              ref="sharkImage"
              :class="shark[0]"
              :href="getJudgeImage(shark[0])"
              :width="svgContainerWidth < 600 ? '60px' : '85px'"
              :x="svgContainerWidth < 600 ? sharkGroupScale(shark[0])-28 : sharkGroupScale(shark[0])-42"
              :y="svgContainerWidth < 600 ? -28 : -45"
              clip-path="url(#sharkImage)"
              v-tippy="{theme:'custom', trigger:'manual'}"
              @click="($event) => activateLinkPaths(shark)"
              @mouseover="($event) => activateLinkPaths(shark)"
              @mouseleave="($event) => deactivateLinkPaths(shark)"
            >
            </image>
            <circle
              v-for="(outerCircle,o) in sharkGroup"
              :key="o"
              ref="sharks"
              :class="outerCircle[0]"
              :cx="sharkGroupScale(outerCircle[0])"
              cy="0"
              :r="svgContainerWidth < 600 ? 25 : 40"
              fill="none"
              stroke="#d1d5db"
              stroke-width="2"
            />
          </g>
          <g v-for="(industry, i) in industryGroup" :key="i" class="industryGroupCircle" :transform="`translate(${industryGroupXScale(industry[0])},${industryGroupYScale(industry[0])})`">
            <circle
              :cx="industryGroupCxScale(industry[0])"
              :cy="industryGroupCyScale(industry[0])"
              :r="industryGroupCrScale(industry[0])"
              fill="white"
              stroke="#F9E272"
              stroke-width="2"
              :class="industry[0]"
            />
            <path
            class="industryPath"
            :id="`industryPath_${i}`"
            :d="`M${industryGroupCxScale(industry[0])-industryGroupCrScale(industry[0])} ${industryGroupCyScale(industry[0])} a ${industryGroupCrScale(industry[0])},${industryGroupCrScale(industry[0])} 0 1,1 ${industryGroupCrScale(industry[0])*2}, 0`"
            fill="none"
            />
            <text class="industryPathText" dy="-5">
              <textPath startOffset="49%" text-anchor="middle" :href="`#industryPath_${i}`">{{ industry[0] }}</textPath>
            </text>
            <g class="pathLinksGroup" :transform="`translate(${industryGroupCxScale(industry[0])-20},${industryGroupCyScale(industry[0])-20})`">
              <path 
                v-for="(force, f) in simulation(industry[1]).nodes()"
                :key="f"
                :class="force[0]"
                ref="startups"
                :transform="`translate(${force.x},${force.y})`"
                d="M20 11.958q-1.083 0-1.854-.77-.771-.771-.771-1.896 0-1.084.771-1.854.771-.771 1.854-.771 1.083 0 1.854.771.771.77.771 1.854 0 1.125-.771 1.896-.771.77-1.854.77Zm-2.792 21.375V25h-1.666v-8.042q0-1.166.833-1.979.833-.812 1.958-.812h3.334q1.125 0 1.958.812.833.813.833 1.979V25h-1.666v8.333Z"
                :fill="`${force[1][0].shark === '' ? 'gray':'white'}`"
                :opacity="`${force[1][0].shark === '' ? 0.3 : 1}`"
                stroke="gray"
                v-tippy="{theme:'custom', trigger:'manual'}"
                @mouseover="($event) => activateStartupLinkPaths(force)"
                @mouseleave="($event) => deactivateStartupLinkPaths(force)"
              />
            </g>
          </g>
          <g class="linksMainGroup">
            <path v-for="(link, l) in filterSharksDataset" :key="l" ref="pathLinks" :class="`${link.startup.replace(/ /g,'')}`+'_'+`${link.shark.replace(/ /g,'')}`" fill="none" stroke="#AB59A0" stroke-width="0.1" :d="links(link)"/>
          </g>
        </g>
      </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pathLinksGroup path:hover {
  cursor: pointer;
}
.linksMainGroup path {
  pointer-events: none;
}
image:hover {
  cursor: pointer;
}

</style>