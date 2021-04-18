<template>
  <div class="info info--pt">
    <div class="container">
      <!-- <ul class="wrapper">
        <li class="circle"></li>
        <li class="circle"></li>
        <li class="circle"></li>
        <li class="circle"></li>
        <li class="circle"></li>
      </ul> -->
        <AirDrop />
    </div>
  </div>
</template>

<script>
import AirDrop from "@/components/AirDrop";
export default {
  name: "airdrop",
  
  components: {
    AirDrop
  },
}
</script>

<style lang="scss" scoped>
li {
  list-style: none;
}

.wrapper {
  margin: auto;
  max-width: 400px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto;
  grid-template-areas:

    "five-1 five-2 five-3 five-4 five-5"
    ". b-three-1 b-three-2 b-three-3 ."
    ". . b-one . .";
  grid-gap: 20px;
  align-items: center;
  will-change: transform;
}

.circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  //overflow: hidden;
  background: linear-gradient(ligten(#b4b6e9,20), #da8391);
  position: relative;
  animation: move 3s linear alternate infinite;
  -webkit-mask-image: -webkit-radial-gradient(#fff, #000);

  &:nth-child(1) { grid-area: five-1;     }
  &:nth-child(2) { grid-area: five-2;     }
  &:nth-child(3) { grid-area: five-3;     }
  &:nth-child(4) { grid-area: five-4;     }
  &:nth-child(5) { grid-area: five-5;     }

  &:before {
    content: "";
    width: 100%;
    height: 100%;
    background: var(--lightblue);
    animation: fill 5s linear alternate infinite;
    position: absolute;
    border-radius: 50%;
    z-index: 1;
  }

  &:after {
    content: "";
    width: 50%;
    height: 100%;
    right: 0;
    background: var(--grey);
    position: absolute;
  }
}

@keyframes fill {
  49.9% { background: var(--grey); }
  50%   { background: #7D9EAA; transform: rotatey(90deg); }
  99.9% { background: var(--lightblue); }
  100%  { transform: rotatey(180deg); }
}

@for $i from 1 through 5 {

  .wrapper > li:nth-child(#{$i}) {

    &:before {
      animation-delay: $i / 2 * 1s;
    }
  }
}
</style>