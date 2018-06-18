<template>
    <div>
        
        
        <div class="container">
            <div class="columns">
                <div class="column">
                    <tableUser v-bind:userList="userList"></tableUser>
                </div>
            </div>
        </div>



    </div>
</template>

<script>
    import axios from 'axios'
    import tableUser from '~/components/tableUser'
    export default {
        components:{
            tableUser
        },
        data: ()=> {
            return{
                userList : null
            }
        },
        beforeMount(){
            axios.get(`https://file-repo.herokuapp.com/api/v1/users`)
            .then(res =>  this.userList = res.data )
            .catch(err => console.log(err))
            console.log(this.userList);
        }  
    }
</script>

<style scoped>

</style>