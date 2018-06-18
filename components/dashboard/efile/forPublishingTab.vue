<template>
    <div>
<template>
  <ais-index app-id="latency" api-key="3d9875e51fbd20c7754e65422f7ce5e1" index-name="bestbuy">
    <ais-search-box></ais-search-box>
    <ais-results>
      <template slot-scope="{ result }">
        <h2>{{ result.name }}</h2>
      </template>
    </ais-results>
  </ais-index>
</template>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style scoped>

</style>