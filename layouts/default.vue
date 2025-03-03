<template>
  <div>
    <AppHeader />
    <main
      class="min-h-screen bg-gradient-to-r from-red-700 via-green-700 to-blue-700 pt-16"
    >
      <slot></slot>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts"></script>
