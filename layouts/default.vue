<template>
  <div>
    <nuxt/>

    <notifications position="top right" group="vnotif"/>
    
  </div>
</template>

<script>

</script>
<style lang="scss">

// 1. Import the initial variables
@import "./../node_modules/bulma/sass/utilities/initial-variables";
@import "./../node_modules/bulma/sass/utilities/functions";
// @import url('https://fonts.googleapis.com/css?family=Dosis:300');
@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed:300');
// @import url('https://fonts.googleapis.com/css?family=Didact+Gothic');

$family-serif: 'Roboto Condensed', sans-serif;
// $family-serif: 'Didact Gothic', sans-serif;
$family-primary: $family-serif;

$cyan: #4054b0;
$red:  #c62828;
$green: #388e3c;
$yellow: #ffa726;
$turquoise: #26a69a;

// 6. Import the rest of Bulma
@import "./../node_modules/bulma/bulma";

.tab-padding{
  padding-top: 20px;
}

.tabs li.is-active a {
  border-bottom-color: #c62828;
  color: #c62828;
}

.table-container{
  border: 1px solid #c62828;;
  border-radius : 3px;
}

.menu-list a.is-active {
  background-color: #c62828;
}

.menu-list a:hover {
  background-color: #dbdbdb;
}

.menu-list a.is-active:hover {
  background-color: #c62828;
}

// spinner
.lds-hourglass {
  position: relative;
  width: 104px;
  height: 104px;
  margin: auto;
}
.lds-hourglass:after {
  content: " ";
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  margin: 6px;
  box-sizing: border-box;
  border: 46px solid #c62828;
  border-color: #c62828 transparent #c62828 transparent;
  animation: lds-hourglass 1.2s infinite;
}
@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
}

</style>
