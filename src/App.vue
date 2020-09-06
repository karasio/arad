<template>
    <div id="app" class="small-container">
        <citybike/>
    </div>
</template>

<script>
  import Citybike from '@/components/Citybike.vue';

  export default {
    name: 'app',
    components: {
      Citybike,
    },
  };

</script>

<style>
    button {
        background: #009435;
        border: 1px solid #009435;
    }

    .small-container {
        max-width: 85%;
    }
</style>

