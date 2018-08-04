<template><div>
    
            <div class="modal" :class="{'is-active': this.isDeleteModalActive}">
                <div @click="toggleDeleteModal" class="modal-background"/>

                <div class="modal-content">
                    <div class="box">
                        <p class="has-text-centered subtitle is-4">
                            Are you sure you want to delete this:
                        </p>

                        <div class="columns">
                            <div class="column">
                                <p class="subtitle is-6"> <b>Efile ID:</b> {{this.efileToBeDeletedDetails.id}}</p>
                                <p class="subtitle is-6"> <b>Efile Name:</b> {{this.efileToBeDeletedDetails.name}}</p>

                            </div>

                            <div class="column">
                                 <p class="subtitle is-6  "> <b>Reason for rejecting efile:</b> {{this.efileToBeDeletedDetails.rejection_reason}}</p>
                            </div>

                        </div>


                        <div class="columns">
                            <div class="column">
                                <a :href="`dashboard/efile/view?id=${efileToBeDeletedDetails.id}`" target="_blank" class="is-medium button is-danger is-outlined is-fullwidth">View</a>
                            </div>

                            <div class="column">
                                <button @click="deleteEfile" class="is-medium button is-danger is-outlined is-fullwidth">Delete</button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <div class="modal" :class="{'is-active': this.isUpdateModalActive}">
                <div @click="toggleUpdateModal" class="modal-background"/>

                <div class="modal-content">
                    <div class="box">
                        <p class="has-text-centered subtitle is-4">
                            Update efile content:
                        </p>

                        <div class="columns ">
                            <div class="column">
                                <p class="subtitle is-6 "> <b>Efile ID:</b> {{this.efileToBeUpdated.id}}</p>
                                <p class="subtitle is-6  "> <b>Efile Name:</b> {{this.efileToBeUpdated.name}}</p>
                                <p class="subtitle is-6  "> <b>Reason for rejecting efile:</b> {{this.efileToBeUpdated.rejection_reason}}</p>
                            </div>

                            
                        </div>

                    <div class="modal-foot">
                        <a :href="`dashboard/efile/update?id=${efileToBeUpdated.id}`" target="_blank" class=" button is-danger is-outlined is-pulled-right">Update</a>
                        <br>
                    </div>

                    </div>
                </div>

                

            </div>

       
        <!--table-->
        <div class="table-container">
            <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth ">

            <thead>
                <tr  class="has-text-centered">
                    <th>Efile Name</th>
                    <th>Rejected By</th>
                    <th>Recipients</th>
                    <th>Pending for Approval</th>
                    <th>Approved Recipients</th>
                    <th>Private Doc</th>
                    <th>Date Created</th>
                    <th class="has-text-centered" colspan="3">Action</th>
                </tr>
            </thead>

            <tbody>
                <tr  v-for="efile in rejectedEfileList.docs" :key="efile._id" >
                    <td>{{efile.name}}</td>
                    <td>{{efile.rejected_recipient.name}}</td>

                        
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

                    <td>{{efile.private_doc}}</td>
                    <td>{{efile.created_at}}</td>

                    <td class="has-text-centered"><button @click="getEfileDetailsToBeUpdated(`${efile._id}`, `${efile.name}`, `${efile.rejection_reason}`)" class="is-medium fas fa-edit button is-danger  is-outlined is-fullwidth"></button></td>
                    <td class="has-text-centered"><button @click="getEfileDetailsToBeDeleted(`${efile._id}`, `${efile.name}`, `${efile.rejection_reason}`)" class="is-medium fas fa-times-circle button is-danger is-outlined is-fullwidth"></button></td>
                    <!-- <td class="has-text-centered"> <a :href="`dashboard/efile/view?id=${efile._id}`" target="_blank" class="is-medium fas fa-search-plus button is-danger is-outlined is-fullwidth" /></td> -->
                </tr>
            </tbody>
            
        <!-- {{this.rejectedEfileList}} -->
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
                                <a class="button is-static"> Page: {{rejectedEfileList.page}} </a>
                            </p>

                            <p class="control">
                                <a class="button is-static"> Total: {{rejectedEfileTotalList}} </a>
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

    import _ from 'lodash'
    import axios from 'axios'
    import keys from '~/components/keys.js'
    import loader from '~/components/loader'


    export default {

        components: {
            loader
        },

        created(){

            this.toggleLoader()
            const config = {
                method: 'GET',
                url: `${keys.BASE_URL}/api/v1/efiles/rejected/${this.$store.state.user_details.user._id}`,
                headers:{
                    "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                }
            }

            axios(config)
                .then( res =>  {
                    console.log(res.data)
                    // this.rejectedEfileList = res.data

                    this.$store.dispatch('rejected_efile_list/STORE_REJECTED_EFILE_LIST', res.data)
                    this.rejectedEfileTotalPages = res.data.pages
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
                isDeleteModalActive: false,
                isUpdateModalActive: false,

                rejection_reason: '',

                efileToBeDeletedDetails: {},

                efileToBeUpdated: {},
                
                rejectedEfilePageNo : 1,
                // rejectedEfileTotalPages : 0,

            }//return
        },//data

        computed:{
            getUserDetails(){
                return {
                    id: this.$store.state.user_details.user._id,
                    full_name : `${this.$store.state.user_details.user.name.first_name} ${this.$store.state.user_details.user.name.middle_name} ${this.$store.state.user_details.user.name.last_name}` ,
                    name :{
                        first_name: this.$store.state.user_details.user.name.first_name,
                        middle_name: this.$store.state.user_details.user.name.middle_name,
                        last_name: this.$store.state.user_details.user.name.last_name,
                    }
                }
            },

            rejectedEfileList(){
               return this.$store.state.rejected_efile_list.rejectedEfileList
            },

            rejectedEfileTotalList :{
                // return this.$store.state.rejected_efile_list.rejectedEfileList.total
                get: function () {
                   return this.$store.state.rejected_efile_list.rejectedEfileList.total
                },
                set: function() {
                    this.$store.state.rejected_efile_list.rejectedEfileList.total
                }
            },

            rejectedEfileTotalPages :{
                // return this.$store.state.rejected_efile_list.rejectedEfileList.total
                get: function () {
                   return this.$store.state.rejected_efile_list.rejectedEfileList.pages
                },
                set: function() {
                    this.$store.state.rejected_efile_list.rejectedEfileList.pages
                }
            }


        },//computed

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

                this.rejectedEfilePageNo = 1

                const config = {
                    method: 'GET',
                    url: `${keys.BASE_URL}/api/v1/efiles/rejected/${this.$store.state.user_details.user._id}?page=${this.rejectedEfilePageNo}`,
                    headers:{
                        "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                }


                axios(config)
                    .then( res =>  {
                        this.$store.dispatch('rejected_efile_list/STORE_REJECTED_EFILE_LIST', res.data)
                        this.toggleLoader()
                    })
                    .catch( err => {
                        this.toggleLoader()
                        this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err) )
                    })
            },

            lastPage(){
                this.toggleLoader()

                this.rejectedEfilePageNo = this.rejectedEfileTotalPages


                const config = {
                    method: 'GET',
                    url: `${keys.BASE_URL}/api/v1/efiles/rejected/${this.$store.state.user_details.user._id}?page=${this.rejectedEfilePageNo}`,
                    headers:{
                        "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                }

                axios(config)
                    .then( res =>  {
                        this.$store.dispatch('rejected_efile_list/STORE_REJECTED_EFILE_LIST', res.data)
                        this.toggleLoader()
                    })
                    .catch( err => {
                        this.toggleLoader()
                        this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err) )
                    })
            },

            nextPage(){
                this.toggleLoader()

                this.rejectedEfilePageNo += 1

                const config = {
                    method: 'GET',
                    url: `${keys.BASE_URL}/api/v1/efiles/rejected/${this.$store.state.user_details.user._id}?page=${this.rejectedEfilePageNo}`,
                    headers:{
                        "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                }

                axios(config)
                    .then( res =>  {

                        if( (res.data.docs).length === 0){
                            this.rejectedEfilePageNo -= 1
                            this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle','no more data to display') )
                            this.toggleLoader()
                        }else{
                            this.$store.dispatch('rejected_efile_list/STORE_REJECTED_EFILE_LIST', res.data)
                            this.toggleLoader()
                        }
                        
                    })
                    .catch( err => {
                        this.toggleLoader()
                        this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err) )
                    })
            },

            prevPage(){
                
                if(this.rejectedEfilePageNo === 1){
                    
                }else{
                    this.rejectedEfilePageNo -= 1
                    this.toggleLoader()
                    
                    const config = {
                        method: 'GET',
                        url: `${keys.BASE_URL}/api/v1/efiles/rejected/${this.$store.state.user_details.user._id}?page=${this.rejectedEfilePageNo}`,
                        headers:{
                            "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                        }
                    }

                    axios(config)
                        .then( res => {
                            this.toggleLoader()
                            this.$store.dispatch('rejected_efile_list/STORE_REJECTED_EFILE_LIST', res.data)
                        })
                        .catch( err => {
                            this.toggleLoader()
                            this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err) )
                        })
                }
            },

            toggleDeleteModal(){
                this.isDeleteModalActive = !this.isDeleteModalActive
            },

            toggleUpdateModal(){
                this.isUpdateModalActive = !this.isUpdateModalActive
            },

            toggleLoader(){
                this.isLoaderActive = !this.isLoaderActive
            },

            getEfileDetailsToBeDeleted(id, name, rejection_reason){
                this.efileToBeDeletedDetails = {
                    id : id,
                    name: name,
                    rejection_reason: rejection_reason
                }
                this.toggleDeleteModal()
            },

            getEfileDetailsToBeUpdated(id, name, rejection_reason){
                this.efileToBeUpdated = {
                    id : id,
                    name: name,
                    rejection_reason: rejection_reason
                }
                this.toggleUpdateModal()
            },
            


            updateRejectedEfileListOnApprove(idToRemove){

                 //make a copy, do not mutate state directly
                let rejectedEfileList = _.cloneDeep(this.rejectedEfileList) 
                //find index by id on the list
                let indexToSplice = _.findIndex( rejectedEfileList , { '_id' : String(idToRemove) } )
                //remove data from rejectedEfileList
                rejectedEfileList.docs.splice(indexToSplice, 1)
                // minus the total data
                rejectedEfileList.total -= 1

                this.$store.dispatch('rejected_efile_list/STORE_REJECTED_EFILE_LIST', rejectedEfileList)
                
            },

            deleteEfile(){
                this.toggleLoader()

                const config = {
                    method: 'DELETE',
                    url: `${keys.BASE_URL}/api/v1/efiles/${this.efileToBeDeletedDetails.id}`,
                    headers:{
                        //  "Content-Type": "application/json",
                         "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                        }
                    }

                axios(config)
                    .then( res =>  {
                        this.updateRejectedEfileListOnApprove(this.efileToBeDeletedDetails.id)
                        this.toggleLoader()
                        this.toggleDeleteModal()
                        this.$notify( this.showNotif('success', 'Success', 'fa-check-circle', `efile successfully deleted`) )
                    })
                    .catch( err => {
                        this.toggleLoader()
                        this.$notify( this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response))
                    })
                this.decrementRejectedEfileNotif()
            },

            decrementRejectedEfileNotif(){
                let rejectedEfileNotif =  this.$store.state.efile_notification.rejectedEfileNotif
                if(rejectedEfileNotif > 0){
                    this.$store.dispatch('efile_notification/GET_REJECTED_EFILE_NOTIFICATION', rejectedEfileNotif - 1)
                }
            }

        }
    }
</script>

<style scoped>
.pagination-link.is-current {
    background-color: #c62828;
    border-color: #c62828;
    color: #fff;
}

</style>