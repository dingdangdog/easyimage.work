<template>
  <div>
    <AppHeader />
    <main
      class="min-h-screen bg-gradient-to-r from-red-600 via-green-600 to-blue-600 pt-16"
    >
      <slot></slot>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts"></script>
