<template>
    <div>


        <p for="label">{{formLabel}}</p>

        <input  
                v-validate="'required|min:6'" 
                class="input"
                :name = formName
                :type= type
                :placeholder= formLabel>


    </div>
</template>

<script>
       export default {
        props: ['formLabel', 'formName', 'type']

       }
</script>

<style scoped>

</style>

