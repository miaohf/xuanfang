<template>
  <div id="world" class="world">
    <h1 class="ground">ground</h1>

    <ul class="building block-1">
      Building
      <li class="top">roof</li>
      <li class="west">wall</li>
      <li class="north">north wall</li>
      <li class="east">east wall</li>
      <li class="south">south wall</li>
    </ul>

    <ul class="building block-2">
      Building
      <li class="top">roof</li>
      <li class="west">wall</li>
      <li class="north">north wall</li>
      <li class="east">east wall</li>
      <li class="south">south wall</li>
    </ul>

    <ul class="building block-3">
      Building
      <li class="top">roof</li>
      <li class="west">wall</li>
      <li class="north">north wall</li>
      <li class="east">east wall</li>
      <li class="south">south wall</li>
    </ul>

    <ul class="building block-4">
      Building
      <li class="top">roof</li>
      <li class="west">wall</li>
      <li class="north">north wall</li>
      <li class="east">east wall</li>
      <li class="south">south wall</li>
    </ul>

    <ul class="building block-5">
      Building
      <li class="top">roof</li>
      <li class="west">wall</li>
      <li class="north">north wall</li>
      <li class="east">east wall</li>
      <li class="south">south wall</li>
    </ul>

    <ul class="building block-6">
      Building
      <li class="top">roof</li>
      <li class="west">wall</li>
      <li class="north">north wall</li>
      <li class="east">east wall</li>
      <li class="south">south wall</li>
    </ul>

    <ul class="building block-7">
      Building
      <li class="top">roof</li>
      <li class="west">wall</li>
      <li class="north">north wall</li>
      <li class="east">east wall</li>
      <li class="south">south wall</li>
    </ul>

    <ul class="building block-8">
      Building

      <li class="top">roof</li>
      <li class="west">wall</li>
      <li class="north">north wall</li>
      <li class="east">east wall</li>
      <li class="south">south wall</li>
    </ul>

    <ul class="building block-9">
      Building
      <li class="top">roof</li>
      <li class="west">wall</li>
      <li class="north">north wall</li>
      <li class="east">east wall</li>
      <li class="south">south wall</li>
    </ul>

    <ul class="building block-10">
      Building
      <li class="top">roof</li>
      <li class="west">wall</li>
      <li class="north">north wall</li>
      <li class="east">east wall</li>
      <li class="south">south wall</li>
    </ul>

    <ul class="building block-11">
      <v-simple-table class="test wall">
        <template v-slot:default>
          <tbody>
            <tr v-for="(b,i) in buildings" :key="i">
              <td>
                  {{b.floor}}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </ul>

    <!-- <ul class="car car-1">
      Car
      <li class="roof">roof</li>
      <li class="door-left">door left</li>
      <li class="front">front</li>
      <li class="door-right">door right</li>
      <li class="trunk">trunk</li>
    </ul>

    <ul class="car car-2">
      Car
      <li class="roof">roof</li>
      <li class="door-left">door left</li>
      <li class="front">front</li>
      <li class="door-right">door right</li>
      <li class="trunk">trunk</li>
    </ul>

    <ul class="car car-3">
      Car
      <li class="roof">roof</li>
      <li class="door-left">door left</li>
      <li class="front">front</li>
      <li class="door-right">door right</li>
      <li class="trunk">trunk</li>
    </ul> -->

    <p class="road road-1">road</p>
    <p class="road road-2">road</p>
    <p class="road road-3">road</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    buildings: [
      { floor: 1 },
      { floor: 2 },
      { floor: 3 },
      { floor: 4 },
      { floor: 5 },
      { floor: 6 },
      { floor: 7 },
      { floor: 8 },
      { floor: 9 },
      { floor: 10 },
      { floor: 11 },
      { floor: 12 }
    ]
  })
};
</script>

<style scoped>
body {
  transform-style: preserve-3d;
  perspective: 1000;
}

h1,
h2,
h3,
h4,
h5,
h6,
p,
a,
input,
label,
button,
textarea,
ul,
li,
label {
  position: relative;
  vertical-align: top;
  display: inline-block;
  padding: 0;
  margin: 0;
}

* {
  user-select: none;
}

@keyframes rotate {
  0% {
    transform: rotate3d(1, 0, 0, 60deg) rotate3d(0, 0, 1, 20deg);
  }
  40% {
    transform: rotate3d(1, 0, 0, 88deg) rotate3d(0, 0, 1, 120deg);
  }
  70% {
    transform: rotate3d(1, 0, 0, 88deg) rotate3d(0, 0, 1, 260deg);
  }
  90% {
    transform: rotate3d(1, 0, 0, 70deg) rotate3d(0, 0, 1, 260deg);
  }
  100% {
    transform: rotate3d(1, 0, 0, 60deg) rotate3d(0, 0, 1, 380deg);
  }
}

.world {
  float: left;
  zoom: 1;
  font-size: 0;
  position: absolute;
  left: 25%;
  top: 10%;
  width: 800px;
  height: 800px;
  transform-style: preserve-3d;
  transform: rotate3d(1, 0, 0, 60deg) rotate3d(0, 0, 1, 30deg);
  /* animation: rotate 60s ease-in-out infinite; */
}
.world:hover {
  color: blue;
}

.ground {
  font-size: 0;
  position: absolute;
  display: block;
  top: -25%;
  left: -25%;
  width: 150%;
  height: 150%;
  border: 10px dotted #ccc;
  overflow: visible;
  transform: translate3d(0, 0, -1px);
  transform-style: preserve-3d;
}

.building {
  font-size: 0;
  position: absolute;
  display: block;
  top: 50%;
  left: 50%;
  background: rgb(61, 61, 63);
  width: 50px;
  height: 50px;
  cursor: move;
  overflow: visible;
  transition: all 0.5s ease-out;
  transform: rotate3d(0, 0, 1, 0deg);
  transform-style: preserve-3d;
}
.block-1 {
  top: 0;
  left: 60%;
  transform: scaleZ(10.5);
}
.block-2 {
  top: 0;
  left: 30%;
  transform: scaleZ(1.5);
}
.block-3 {
  top: 20%;
  left: 10%;
  transform: scaleZ(2);
}
.block-4 {
  top: 20%;
  left: 30%;
  transform: scaleZ(1.8);
}
.block-5 {
  top: 20%;
  left: 50%;
  transform: scaleZ(1.8);
}
.block-6 {
  top: 60%;
  left: 70%;
  transform: scaleZ(1.8);
}
.block-7 {
  top: 60%;
  left: 20%;
  transform: scaleZ(1.5);
}
.block-8 {
  top: 80%;
  left: 60%;
  transform: scaleZ(2.8);
}
.block-9 {
  top: 80%;
  left: 0;
  transform: scaleZ(2.9);
}
.block-10 {
  top: 80%;
  left: 40%;
  transform: scaleZ(3.9);
}
.block-11 {
  top: 80%;
  left: 20%;
  transform: scaleZ(2.9);
}

.building:hover {
  transform: rotate3d(0, 0, 1, 900deg) scale3d(1, 1, 4);
  background: #0ae;
}
.building:hover > li {
  background: #0ae;
  opacity: 0.5;
}
.building:active {
  transform: translateZ(50px) scale3d(1, 1, 4);
  background: #09c;
}
.building:active > li {
  background: #09c;
  opacity: 0.75;
}

.building > li {
  font-size: 0;
  display: inline-block;
  position: absolute;
  background: #fc0;
  transition: all 0.3s ease-out;
}
.building .top {
  background: rgba(90, 140, 240, 1);
  width: 50px;
  height: 50px;
  transform: translate3d(0, 0, 50px);
}
.building .west {
  background: rgb(100, 150, 250, 1);
  width: 50px;
  height: 50px;
  transform-origin: 0 0;
  transform: rotate3d(0, 1, 0, -90deg);
}
.building .east {
  background: rgba(80, 120, 230, 1);
  width: 50px;
  height: 50px;
  transform-origin: 100% 0;
  transform: rotate3d(0, 1, 0, 90deg);
}
.building .north {
  background: rgba(70, 110, 220, 1);
  width: 50px;
  height: 50px;
  transform-origin: 0 0;
  transform: rotate3d(1, 0, 0, 90deg);
}

.building .south {
  background: rgb(172, 157, 121);
  width: 50px;
  height: 50px;
  transform-origin: 100% 100%;
  transform: rotate3d(1, 0, 0, -90deg);
}

.building .test {
  background: rgba(70, 110, 220, 1);
  width: 50px;
  height: 1px;
  transform-origin: 0 0;
  transform: rotate3d(1, 0, 0, 90deg);
}

.road {
  font-size: 0;
  position: absolute;
  display: block;
  top: 50%;
  left: 50%;
  background: #ccc;
  width: 350px;
  height: 30px;
  overflow: visible;
  transition: all 0.5s ease-out;
  transform: rotate3d(0, 0, 1, 0deg);
  transform-style: preserve-3d;
}
.road-1 {
  top: 60%;
  left: 40%;
  transform: translateZ(0.9px) rotate3d(0, 0, 1, 90deg);
}
.road-2 {
  top: 40%;
  left: 20%;
  transform: rotate3d(0, 0, 1, 180deg);
}
.road-3 {
  top: 100%;
  left: 0;
  transform: rotate3d(0, 0, 1, 180deg);
}

.car {
  font-size: 0;
  position: absolute;
  display: block;
  /* cursor: move; */
  top: 60%;
  left: 50%;
  background: #666;
  width: 5px;
  height: 10px;
  overflow: visible;
  transition: all 0.5s ease-out;
  transform: translateZ(2px) rotate3d(0, 0, 1, 90deg);
  transform-style: preserve-3d;
}
/*
.car:hover
{
	transform: rotate3d(0,0,1,900deg) scale3d(4, 4, 4);
	background:#fff;
}
	.car:hover>li
	{
		background:#fff;
		opacity:.5;
	}
.car:active
{
	transform: translateZ(50px) scale3d(4, 4, 4);
}
	.car:active>li
	{
		background:#0ae;
	}
*/
.car > li {
  font-size: 0;
  display: inline-block;
  position: absolute;
  background: #fc0;
  transition: all 0.3s ease-out;
}
.car .roof {
  background: #777;
  width: 5px;
  height: 10px;
  transform: translate3d(0, 0, 5px);
}
.car .door-left {
  background: #555;
  width: 5px;
  height: 10px;
  transform-origin: 0 0;
  transform: rotate3d(0, 1, 0, -90deg);
}
.car .door-right {
  background: #777;
  width: 5px;
  height: 10px;
  transform-origin: 100% 0;
  transform: rotate3d(0, 1, 0, 90deg);
}
.car .front {
  background: #666;
  width: 5px;
  height: 5px;
  transform-origin: 0 0;
  transform: rotate3d(1, 0, 0, 90deg);
}
.car .trunk {
  background: #444;
  width: 5px;
  height: 5px;
  transform-origin: 100% 100%;
  transform: translateY(5px) rotate3d(1, 0, 0, -90deg);
}
.car-1 {
  top: 40%;
  left: 60%;
}
.car-2 {
  top: 40%;
  left: 80%;
}
.car-3 {
  top: 60%;
  left: 95%;
  transform: translateZ(2px) rotate3d(0, 0, 1, 0deg);
}
</style>
