<script setup>

import router from "@/shared/router.service.js";

defineOptions({
  name: "home-component"
});

function goToCalculator(){
  router.push("/calculator");
}

</script>

<template>
  <div class="background">
    <main class="home-page-content">
      <h1>CALCULADORA DE AHORRO UNIMAQ S.A</h1>
      <button @click="goToCalculator" class="enter-button">Ingresar</button>
    </main>
  </div>
</template>

<style scoped>
.background {
  width: 100%;
  height: 100vh;
  background-image: url("https://energiminas.com/wp-content/uploads/2024/03/02-Unimaq-25-aniversario--1024x672.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}

.home-page-content{
  /*Size*/
  width: 100%;
  height: 100%;
  /*Display*/
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /*Margin*/
  gap: 1rem;
  /*Color*/
  color: white;
  background: linear-gradient(to top,#00000082, #00000028);
}

.enter-button{
  /*Size*/
  width: 200px;
  height: 80px;
  /*Font*/
  font-weight: bolder;
  font-size:xx-large;
  /*Color*/
  color: white;
  background-color: #E1B524;
  border: 3px solid #93771C;
  border-radius: 10px;
}
</style>