<template>
    <!-- <div class="h-screen  grid grid-cols-12 justify-items-center content-center">
    <div class="col-span-12">
      <h1 class="text-center text-[3rem]">Under Construction</h1>
      <h2 class="text-center text-[1.5rem] font-light">About Page</h2>
    </div>
    </div> -->
    <div class="pt-10">
      <div class="md:mx-10 lg:mx-8 mb-10 p-2">
        <p class="text-3xl text-center mb-8">About</p>
        <div class="grid grid-cols-12 pb-8 lg:p-2 border-2 border-gray-300 rounded-lg">
          <p class="col-span-12 font-light text-xl p-6 rounded-lg text-justify">
            Shark Tank India started to air in December, 2021. Season One of the show had seven sharks. Here's a brief introduction of each shark.
          </p>
          <div class="relative col-span-12 lg:col-span-6 xl:col-span-4 border-2  border-gray-300 rounded-lg mx-8 md:mx-14 lg:mx-8 my-5">
            <img class="absolute p-1 bg-white -top-1 -left-5 mx-auto w-20 rounded-full border-2 border-gray-300" src="../assets/images/judges/AmanGupta.png">
            <div class="ml-20 mr-2 py-2">
              <p class="pt-2">
                <span class="text-xl">Aman Gupta : </span>
                <span class="font-normal text-lg">Co-founder and Chief Marketing Officer at boAt Lifestyle.</span><br>
                <span class="font-light">boAt Lifestyle is a one of the biggest consumer electronics wearable brand established in 2014 and headquartered in Delhi, with over 5,000 stores across India.</span>
              </p>
            </div>
          </div>
          <div class="relative col-span-12 lg:col-span-6 xl:col-span-4 border-2  border-gray-300 rounded-lg mx-8 md:mx-14 lg:mx-8 my-5">
            <img class="absolute p-1 bg-white -top-1 -left-5 mx-auto w-20 rounded-full border-2 border-gray-300" src="../assets/images/judges/AnupamMittal.png">
            <div class="ml-20 mr-1 py-2">
              <p class="pt-2">
                <span class="text-xl">Anupam Mittal : </span>
                <span class="font-normal text-lg">Founder and CEO of Shaadi.com – People Group.</span><br>
                <span class="font-light">Shaadi.com is an Indian online wedding service founded in 1997, with more than 30 million users on the platform.</span>
              </p>
            </div>
          </div>
          <div class="relative col-span-12 lg:col-span-6 xl:col-span-4 border-2  border-gray-300 rounded-lg mx-8 md:mx-14 lg:mx-8 my-5">
            <img class="absolute p-1 bg-white -top-1 -left-5 mx-auto w-20 rounded-full border-2 border-gray-300" src="../assets/images/judges/AshneerGrover.png">
            <div class="ml-20 mr-1 py-2">
              <p class="pt-2">
                <span class="text-xl">Ashneer Grover : </span>
                <span class="font-normal text-lg">Founder and Managing Director of BharatPe.</span><br>
                <span class="font-light">BharatPe is a fintech company, that makes payment acceptance simple by offering merchants a single QR to accept all payments.</span>
              </p>
            </div>
          </div>
          <div class="relative col-span-12 lg:col-span-6 xl:col-span-4 border-2  border-gray-300 rounded-lg mx-8 md:mx-14 lg:mx-8 my-5">
            <img class="absolute p-1 bg-white -top-1 -left-5 mx-auto w-20 rounded-full border-2 border-gray-300" src="../assets/images/judges/GhazalAlagh.png">
            <div class="ml-20 mr-1 py-2">
              <p class="pt-2">
                <span class="text-xl">Ghazal Alagh : </span>
                <span class="font-normal text-lg">Co-founder of Mamaearth.</span><br>
                <span class="font-light">Mamaearth is a skincare brand, headquartered in Gurgaon, Haryana. Originally, the company focused on organic products for babies and expectant mothers but currently they cater to all personal products.</span>
              </p>
            </div>
          </div>
          <div class="relative col-span-12 lg:col-span-6 xl:col-span-4 border-2  border-gray-300 rounded-lg mx-8 md:mx-14 lg:mx-8 my-5">
            <img class="absolute p-1 bg-white -top-1 -left-5 mx-auto w-20 rounded-full border-2 border-gray-300" src="../assets/images/judges/NamitaThapar.png">
            <div class="ml-20 mr-1 py-2">
              <p class="pt-2">
                <span class="text-xl">Namita Thapar : </span>
                <span class="font-normal text-lg">Executive Director of Emcure Pharmaceuticals.</span><br>
                <span class="font-light">Emcure is a multinational technology-based pharma company founded in 1983, it has a wide portfolio of products that includes tablets, capsules, injectables, etc. and their operations span 70 countries.</span>
              </p>
            </div>
          </div>
          <div class="relative col-span-12 lg:col-span-6 xl:col-span-4 border-2  border-gray-300 rounded-lg mx-8 md:mx-14 lg:mx-8 my-5">
            <img class="absolute p-1 bg-white -top-1 -left-5 mx-auto w-20 rounded-full border-2 border-gray-300" src="../assets/images/judges/PeyushBansal.png">
            <div class="ml-20 mr-1 py-2">
              <p class="pt-2">
                <span class="text-xl">Peyush Bansal : </span>
                <span class="font-normal text-lg">Founder & CEO of Lenskart.</span><br>
                <span class="font-light">Lenskart is an multinational optical prescription eyewear retail chain with 1,000 stores across 223 cities in India.</span>
              </p>
            </div>
          </div>
          <div class="relative col-span-12 lg:col-span-6 xl:col-span-4 border-2  border-gray-300 rounded-lg mx-8 md:mx-14 lg:mx-8 my-5">
            <img class="absolute p-1 bg-white -top-1 -left-5 mx-auto w-20 rounded-full border-2 border-gray-300" src="../assets/images/judges/VineetaSingh.png">
            <div class="ml-20 mr-1 py-2">
              <p class="pt-2">
                <span class="text-xl">Vineeta Singh : </span>
                <span class="font-normal text-lg">CEO & Co-founder of SUGAR Cosmetics.</span><br>
                <span class="font-light">SUGAR Cosmetics is a cosmetics brands, headquartered in Mumbai. The company has an omni-channel distribution network of around 10,000 retail outlets across 130 cities in India.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>