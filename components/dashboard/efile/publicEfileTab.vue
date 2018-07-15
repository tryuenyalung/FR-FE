<template><div>

    <!--table-->
        <div class="table-container">
            <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth ">

            <thead>
                <tr  class="has-text-centered">
                    <th>Efile Name</th>
                    <th>Sender</th>
                    <th>Recipients</th>
                    <th>Pending for Approval</th>
                    <th>Approved Recipients</th>
                    <th>Date Created</th>
                    <th class="has-text-centered" colspan="3">Action</th>
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

                    <td>
                        <span v-for="pending_recipient in efile.pending_recipient" :key="'p'+pending_recipient.id">
                            {{pending_recipient.name}},&nbsp;
                        </span>
                    </td>

                    <td>
                        <span v-for="approved_recipient in efile.approved_recipient" :key="'a'+approved_recipient.id">
                            {{approved_recipient.name}},&nbsp;
                        </span>
                    </td>

                    <td>{{efile.created_at}}</td>

                    <td class="has-text-centered">
                         <a :href="`dashboard/efile/view?id=${efile._id}`" target="_blank" class="button is-danger is-outlined">View</a>
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

            
            
        }
    
    }

</script>

<style scoped>

</style>