<template>
    <div> 
      <NuxtPage />
    </div>
  </template>
  
  <script setup> 
import { useRouter, useRoute } from 'vue-router'; 

// ===== VARIABLES DE CONFIGURACIÓN ===== 
const router = useRouter();
const route = useRoute();
  </script>