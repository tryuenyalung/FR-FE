<template>
    <div>
        <table class="has-shadow table is-bordered table is-stripedtable is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Date of Birth</th>
                    <th>Gender</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="user in userList" :key="user._id">
                    <td>{{ user._id }}</td>
                    <td>{{ user.name.firstName }} {{ user.name.middleName }} {{ user.name.lastName }} </td>
                    <td>{{ user.address.street }} {{ user.address.barangay }} {{ user.address.municipality }} {{ user.address.province }}</td>
                    <td>{{ user.dateOfBirth }}</td>
                    <td>{{ user.gender }}</td>
                </tr>
            </tbody>

        </table>



        <div class="columns">
            <div class="column">
                
            </div>
        </div>

    </div>

</template>

<script>
    export default {
        props: ['userList'],
        data: ()=>{
            return{

            }
        }
    }
</script>

<style scoped>

</style>