<template><div>

    <!--search input-->
        <div class="field has-addons has-addons-centered">
            <p class="control is-expanded">
                <input @keypress.enter="searchPublicEfile" v-model="publishedEfileSearchInput" class="input " type="text" placeholder="Search efile...">
            </p>
                        
            <p class="control">
                <span class="select">
                    <!--checking by the value of the option-->
                    <select v-model="publicEfileSearchBy">
                        <option>Name</option>
                        <option>Sender</option>
                        <option>Recipients</option>
                        <option>Date Created</option>
                    </select>
                </span>
            </p>

            <p class="control">
                <button @click="searchPublicEfile" class="button is-danger is-outlined fa fa-search"></button>
            </p>
        </div>

    <!--table-->
        <div class="table-container">
            <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth ">

            <thead>
                <tr  class="has-text-centered">
                    <th>Efile Name</th>
                    <th>Sender</th>
                    <th>Recipients</th>
                    <th>Date Created</th>
                    <th class="has-text-centered">Action</th>
                </tr>
            </thead>

            <tbody>
                <tr  v-for="efile in publicEfileList.docs" :key="efile._id" >
                    <td>{{efile.name}}</td>
                    <td>{{efile.sender.name}}</td>

                        
                    <td>
                        <span v-for="recipient in efile.recipient" :key="'r'+recipient.id">
                            {{recipient.name}},&nbsp;
                        </span>
                    </td>

                    <td>{{efile.created_at}}</td>

                    <td class="has-text-centered">
                         <!-- <a :href="`dashboard/efile/view?id=${efile._id}`" target="_blank" class="button is-danger is-outlined">View</a> -->
                         <a :href="`/FR/dashboard/efile/view?id=${efile._id}`" target="_blank" class="button is-danger is-outlined">View</a>
                    </td>
                </tr>
            </tbody>
            
        <!-- {{this.publicEfileList}} -->
        </table>


        <div class="box">

            <div class="level">

                    <div class="level-item">
                        <div class="field has-addons">
                            <p class="control">
                                <a class="button" @click="firstPage"> First </a>
                            </p>

                            <p class="control">
                                <a class="button" @click="lastPage"> Last </a>
                            </p>
                        </div>
                    </div>
                          

                    <div class="level-item">
                        <div class="field has-addons">
                            <p class="control">
                                <a class="button is-static"> Page: {{publicEfileList.page}} </a>
                            </p>

                            <p class="control">
                                <a class="button is-static"> Total: {{publicEfileList.total}} </a>
                            </p>
                        </div>
                    </div>
                        

                    <div class="level-item">
                        <div class="field has-addons">
                            <p class="control">
                                <a class="button" @click="prevPage"> Previous </a>
                            </p>

                            <p class="control">
                                <a class="button" @click="nextPage"> Next </a>
                            </p>
                        </div>  
                    </div>
                        
            </div>

        </div>

        </div><!--table-container-->

        <loader :isActive="this.isLoaderActive"/>

</div></template>

<script>

    import loader from '~/components/loader'
    import axios from 'axios'
    import keys from '~/components/keys.js'

    export default {
        
    components: {
            loader
        },

        created(){
            this.toggleLoader()

            const config = {
                method: 'GET',
                url: `${keys.BASE_URL}/api/v1/efiles/published/public`,
                headers:{
                    "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                }
                
            }

            axios(config)
                .then( res =>  {
                    console.log(res.data)
                    this.publicEfileList = res.data
                    this.publicEfileTotalPageNo = res.data.pages
                    this.toggleLoader()
                })
                .catch( err => {
                    this.toggleLoader()
                    alert(err)
                })
        },

        data(){
            return{

                isLoaderActive: false,
                publicEfileList: [],
                publicEfilePageNo : 1,
                publicEfileTotalPageNo : 0,
                publishedEfileSearchInput: '',
                publicEfileSearchBy: "Name",

            }//return
        },//data

    

        methods:{

            showNotif(type, title, icon, msg){
                return{
                    type: type,
                    group: 'vnotif',
                    title: `<span ><span class='fas ${icon} fa-2x'></span><span class='title is-5'> ${title}:</span></span>`,
                    text: `<p class='subtitle is-5'>${msg}</p>`
                }
            },

            firstPage(){
                this.toggleLoader()

                this.publicEfilePageNo = 1
                
                const config = {
                    method: 'GET',
                    url: `${keys.BASE_URL}/api/v1/efiles/published/public?page=${this.publicEfilePageNo}`,
                    headers:{
                        "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                }

                axios(config)
                    .then( res =>  {
                        this.publicEfileList = res.data 
                        this.toggleLoader()
                    })
                    .catch( err => {
                        this.toggleLoader()
                        this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err) )
                    })
            },

            lastPage(){
                this.toggleLoader()

                this.publicEfilePageNo = this.publicEfileTotalPageNo

                const config = {
                    method: 'GET',
                    url: `${keys.BASE_URL}/api/v1/efiles/published/public?page=${this.publicEfilePageNo}`,
                    headers:{
                        "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                }

                axios(config)
                    .then( res =>  {
                        this.publicEfileList = res.data 
                        this.toggleLoader()
                    })
                    .catch( err => {
                        this.toggleLoader()
                        this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err) )
                    })
            },

            nextPage(){
                this.toggleLoader()

                this.publicEfilePageNo += 1

                const config = {
                    method: 'GET',
                    url: `${keys.BASE_URL}/api/v1/efiles/published/public?page=${this.publicEfilePageNo}`,
                    headers:{
                        "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                }

                axios(config)
                    .then( res =>  {

                        if( (res.data.docs).length === 0){
                            this.publicEfilePageNo -= 1
                            this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle','no more data to display') )
                            this.toggleLoader()
                        }else{
                            this.publicEfileList = res.data 
                            this.toggleLoader()
                        }
                        
                    })
                    .catch( err => {
                        this.toggleLoader()
                        this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err) )
                    })
            },

            prevPage(){
                
                if(this.publicEfilePageNo === 1){
                    
                }else{
                    this.publicEfilePageNo -= 1
                    this.toggleLoader()
                    
                    const config = {
                        method: 'GET',
                        url: `${keys.BASE_URL}/api/v1/efiles/published/public?page=${this.publicEfilePageNo}`,
                        headers:{
                            "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                        }
                    }

                    axios(config)
                        .then( res => {
                            this.toggleLoader()
                            this.publicEfileList = res.data 
                        })
                        .catch( err => {
                            this.toggleLoader()
                            this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err) )
                        })
                }
            },

            

            toggleLoader(){
                this.isLoaderActive = !this.isLoaderActive
            },

            searchPublicEfile(){
                this.toggleLoader()

                let queryString = ''

                if(this.publicEfileSearchBy === 'Name'){
                    queryString = `name=${this.publishedEfileSearchInput}`
                }
                else if(this.publicEfileSearchBy === 'Sender'){
                    queryString = `sender=${this.publishedEfileSearchInput}`
                }
                else if(this.publicEfileSearchBy === 'Recipients'){
                    queryString = `recipient=${this.publishedEfileSearchInput}`
                }
                else if(this.publicEfileSearchBy === 'Date Created'){
                    queryString = `createdAt=${this.publishedEfileSearchInput}`
                }
                else{
                    queryString = ''
                }

                const config = {
                    method: 'GET',
                    url: `${keys.BASE_URL}/api/v1/efiles/published/public?${queryString}`,
                    headers: {
                    "Authorization": `Bearer ${this.$store.state.user_details.token}`
                    }

                }

                axios(config)
                    .then(res => {
                        this.publicEfileList = res.data
                        this.publicEfileTotalPageNo = res.data.pages
                        this.toggleLoader()
                    })
                    .catch(err => {
                        this.toggleLoader()
                        alert(err)
                    })
            },

            
            
        }
    
    }

</script>

<style scoped>

</style>