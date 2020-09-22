<template>
    <div id="citybikes">
        <h1>Citybikes</h1>

        <b-table :items="items"></b-table>
    </div>
</template>

<script>

    export default {
    name: 'CityBike',
    props: {
      items: Array,
    },
    data() {
        return {
        }
    }
  };

</script>

<style scoped>
    h1 {
        margin-top: 0;
    }
    input {
        width: 40%;

    }
    form {
        left: 50%;
        right: 50%;
    }
</style>
