<template>
    <div class="section">


<!-- <div class="modal" :class="{'is-active': this.updateModalState}">
  <div @click="toggleUpdateModal" class="modal-background"/>

  <div class="modal-content">
      <div class="box">

          <h3 class="subtitle is-3 has-text-centered">Update Image</h3>

            <div class="file has-name is-boxed is-centered is-danger">
                <label class="file-label">
                    <input class="file-input" type="file" name="resume">
                    <span class="file-cta">
                    <span class="file-icon">
                        <i class="fas fa-upload"></i>
                    </span>
                    <span class="file-label">
                        Choose a image file…
                    </span>
                    </span>
                    <span class="file-name">
                    Screen Shot 2017-07-29 at 15.54.25.png
                    </span>
                </label>

                            
            </div>

             <div>
                <button class="button is-danger is-pulled-right is-outlined">Update</button>
                <br>
             </div>   


      </div>
  </div>

</div> -->


            <div class="modal" :class="{'is-active': this.isRejectModalActive}">
                <div @click="toggleRejectModal" class="modal-background"/>

                <div class="modal-content">
                    <div class="box">
                        <p class="has-text-centered subtitle is-4">
                            Are you sure you want to reject this:
                        </p>

                        <div class="columns">
                            <div class="column">
                                <p class="subtitle is-6"> <b>Efile ID:</b> {{this.efileToBeRejectedDetails.id}}</p>
                            </div>

                            <div class="column">
                                <p class="subtitle is-6"> <b>Efile Name:</b> {{this.efileToBeRejectedDetails.name}}</p>
                            </div>

                        </div>

                        <div class="columns">
                            <div class="column">
                                <p class="label">Reason to Reject:</p>
                                <textarea class="textarea" placeholder="Reason of Rejection" rows="10" v-model="rejection_reason"/>
                            </div>
                        </div>

                        <div class="columns">
                            <div class="column">
                                <a :href="`dashboard/efile/view?id=${efileToBeRejectedDetails.id}`" target="_blank" class="is-medium button is-danger is-outlined is-fullwidth">View</a>
                            </div>

                            <div class="column">
                                <button @click="validateRejectionReason" class="is-medium button is-danger is-outlined is-fullwidth">Reject</button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <div class="modal" :class="{'is-active': this.isApproveModalActive}">
                <div @click="toggleApproveModal" class="modal-background"/>

                <div class="modal-content">
                    <div class="box">
                        <p class="has-text-centered subtitle is-4">
                            Are you sure you want to approve this:
                        </p>

                        <div class="columns">
                            <div class="column">
                                <p class="subtitle is-6"> <b>Efile ID:</b> {{this.efileToBeApprovedDetails.id}}</p>
                            </div>

                            <div class="column">
                                <p class="subtitle is-6"> <b>Efile Name:</b> {{this.efileToBeApprovedDetails.name}}</p>
                            </div>

                        </div>

                        <div class="columns">
                            <div class="column">
                                <a @click="toggleApproveModal" class="is-medium button is-danger is-outlined is-fullwidth">Cancel</a>
                            </div>

                            <div class="column">
                                <a @click="approveEfile" class="is-medium button is-danger is-outlined is-fullwidth">Approve</a>
                            </div>
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
                    <th>Efile Category</th>
                    <th>Sender</th>
                    <th>Recipients</th>
                    <th>Pending for Approval</th>
                    <th>Approved Recipients</th>
                    <th>Efile Status</th>
                    <th>Date Created</th>
                    <th class="has-text-centered" colspan="3">Action</th>
                </tr>
            </thead>

            <tbody>
                <tr  v-for="efile in pendingEfileList.docs" :key="efile._id" >
                    <td>{{efile.name}}</td>
                    <td>{{efile.file_tag}}</td>
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

                    <td>{{efile.private_doc}}</td>
                    <td>{{efile.created_at | dateTimeFormatter  }}</td>
                    
                    <!-- <td class="has-text-centered"><a :href="`dashboard/efile/view?id=${efile._id}`" target="_blank" class="is-medium fas fa-eye button is-danger  button is-danger is-outlined is-fullwidth"></a></td> -->
                    <td class="has-text-centered"><a :href="`/FR/dashboard/efile/view?id=${efile._id}`" target="_blank" class="is-medium fas fa-eye button is-danger  button is-danger is-outlined is-fullwidth"></a></td>
                    <td class="has-text-centered"><button @click="getEfileDetailsToBeApproved(`${efile._id}`, `${efile.name}`)" class="is-medium fas fa-file-signature button is-danger  is-outlined is-fullwidth"></button></td>
                    <td class="has-text-centered"><button @click="getEfileDetailsToBeRejected(`${efile._id}`, `${efile.name}`)" class="is-medium fas fa-times-circle button is-danger is-outlined is-fullwidth"></button></td>
                    <!-- <td class="has-text-centered"> <a :href="`dashboard/efile/view?id=${efile._id}`" target="_blank" class="is-medium fas fa-search-plus button is-danger is-outlined is-fullwidth" /></td> -->
                </tr>
            </tbody>
            
        <!-- {{this.pendingEfileList}} -->
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
                                <a class="button is-static"> Page: {{pendingEfileList.page}} </a>
                            </p>

                            <p class="control">
                                <a class="button is-static"> Total: {{pendingEfileList.total}} </a>
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
    </div>
</template>

<script>
    import _ from 'lodash'
    import axios from 'axios'
    import keys from '~/components/keys.js'
    import loader from '~/components/loader'
    import moment from 'moment'

    export default {

        components: {
            loader
        },


        created(){
            this.toggleLoader()

            const config = {
                method: 'GET',
                url: `${keys.BASE_URL}/api/v1/efiles/pending/${this.$store.state.user_details.user._id}`,
                headers:{
                    "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                }
                
            }

            axios(config)
                .then( res =>  {
                    console.log(res.data)
                    this.pendingEfileList = res.data
                    this.pendingEfileTotalPageNo = res.data.pages
                    this.toggleLoader()
                })
                .catch( err => {
                    this.toggleLoader()
                    alert(err)
                })
        },


        filters: {

            dateTimeFormatter: function (value) {
                if (value) 
                return moment(String(value)).format('MMMM Do YYYY, h:mm:ss a')
            }

        },

        data(){
            return{

                isLoaderActive: false,
                isRejectModalActive: false,
                isApproveModalActive: false,

                pendingEfileList: [],

                rejection_reason: '',

                efileToBeRejectedDetails: {},

                efileToBeApprovedDetails: {},
                
                pendingEfilePageNo : 1,
                pendingEfileTotalPageNo : 0,

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

                this.pendingEfilePageNo = 1
                
                const config = {
                    method: 'GET',
                    url: `${keys.BASE_URL}/api/v1/efiles/pending/${this.$store.state.user_details.user._id}?page=${this.pendingEfilePageNo}`,
                    headers:{
                        "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                }

                axios(config)
                    .then( res =>  {
                        this.pendingEfileList = res.data 
                        this.toggleLoader()
                    })
                    .catch( err => {
                        this.toggleLoader()
                        this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err) )
                    })
            },

            lastPage(){
                this.toggleLoader()

                this.pendingEfilePageNo = this.pendingEfileTotalPageNo

                const config = {
                    method: 'GET',
                    url: `${keys.BASE_URL}/api/v1/efiles/pending/${this.$store.state.user_details.user._id}?page=${this.pendingEfilePageNo}`,
                    headers:{
                        "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                }

                axios(config)
                    .then( res =>  {
                        this.pendingEfileList = res.data 
                        this.toggleLoader()
                    })
                    .catch( err => {
                        this.toggleLoader()
                        this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err) )
                    })
            },

            nextPage(){
                this.toggleLoader()

                this.pendingEfilePageNo += 1

                const config = {
                    method: 'GET',
                    url: `${keys.BASE_URL}/api/v1/efiles/pending/${this.$store.state.user_details.user._id}?page=${this.pendingEfilePageNo}`,
                    headers:{
                        "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                }

                axios(config)
                    .then( res =>  {

                        if( (res.data.docs).length === 0){
                            this.pendingEfilePageNo -= 1
                            this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle','no more data to display') )
                            this.toggleLoader()
                        }else{
                            this.pendingEfileList = res.data 
                            this.toggleLoader()
                        }
                        
                    })
                    .catch( err => {
                        this.toggleLoader()
                        this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err) )
                    })
            },

            prevPage(){
                
                if(this.pendingEfilePageNo === 1){
                    
                }else{
                    this.pendingEfilePageNo -= 1
                    this.toggleLoader()
                    
                    const config = {
                        method: 'GET',
                        url: `${keys.BASE_URL}/api/v1/efiles/pending/${this.$store.state.user_details.user._id}?page=${this.pendingEfilePageNo}`,
                        headers:{
                            "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                        }
                    }

                    axios(config)
                        .then( res => {
                            this.toggleLoader()
                            this.pendingEfileList = res.data 
                        })
                        .catch( err => {
                            this.toggleLoader()
                            this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle', err) )
                        })
                }
            },

            toggleRejectModal(){
                this.isRejectModalActive = !this.isRejectModalActive
            },

            toggleApproveModal(){
                this.isApproveModalActive = !this.isApproveModalActive
            },

            toggleLoader(){
                this.isLoaderActive = !this.isLoaderActive
            },

            getEfileDetailsToBeRejected(id, name){
                this.efileToBeRejectedDetails = {
                    id : id,
                    name: name
                }
                this.toggleRejectModal()
            },

            getEfileDetailsToBeApproved(id, name){
                this.efileToBeApprovedDetails = {
                    id : id,
                    name: name
                }
                this.toggleApproveModal()
            },
            
            updatePendingEfileListOnApprove(idToRemove){
                //find index by id on the list
                let indexToSplice = _.findIndex( this.pendingEfileList.docs , { '_id' :  String(idToRemove) } )
                //remove data from pendingEfileList
                this.pendingEfileList.docs.splice(indexToSplice, 1)
            },

            approveEfile(){
                this.toggleLoader()
                
                const body =  {
                    name:{
                        first_name : this.$store.state.user_details.user.name.first_name,
                        middle_name : this.$store.state.user_details.user.name.middle_name,
                        last_name : this.$store.state.user_details.user.name.last_name,
                    },
                    position: this.$store.state.user_details.user.position,
                    signature:  this.$store.state.user_details.user.signature
                }

                const config = {
                    method: 'PUT',
                    url: `${keys.BASE_URL}/api/v1/efiles/approve/${this.efileToBeApprovedDetails.id}`,
                    data : JSON.stringify(body),
                    headers:{
                         "Content-Type": "application/json",
                         "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                       
                }

                axios(config)
                    .then( res =>  {
                        this.updatePendingEfileListOnApprove(this.efileToBeApprovedDetails.id)
                        this.toggleLoader()
                        this.toggleApproveModal()
                        this.$notify( this.showNotif('success', 'Success', 'fa-check-circle', `efile was approved & sign`) )
                    })
                    .catch( err => {
                        this.toggleLoader()
                        this.$notify( this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
                    })

                this.decrementPendingEfileNotif()

            },

            rejectEfile(){
                this.toggleLoader()

                const body =  {
                    rejected_recipient:{
                        id: this.getUserDetails.id,
                        name: this.getUserDetails.full_name
                    },
                    rejection_reason:  this.rejection_reason
                }

                const config = {
                    method: 'PUT',
                    url: `${keys.BASE_URL}/api/v1/efiles/${this.efileToBeRejectedDetails.id}`,
                    data : JSON.stringify(body),
                    headers:{
                         "Content-Type": "application/json",
                         "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                       
                }

                axios(config)
                    .then( res =>  {
                        this.updatePendingEfileListOnApprove(this.efileToBeRejectedDetails.id)
                        this.toggleLoader()
                        this.toggleRejectModal()
                        this.$notify( this.showNotif('success', 'Success', 'fa-check-circle', `efile was rejected, notifying the sender`) )
                    })
                    .catch( err => {
                        this.toggleLoader()
                        this.$notify( this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
                       
                    })
                
                this.decrementPendingEfileNotif()
            },

            validateRejectionReason(){
                if(this.rejection_reason.length === 0  || this.rejection_reason === null || /^\s*$/.test(this.rejection_reason)){
                    this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle','write a valid reason to reject this efile') )
                }else{
                    this.rejectEfile()
                }
            },

            decrementPendingEfileNotif(){
                let pendingEfileNotif =  this.$store.state.efile_notification.pendingEfileNotif
                if(pendingEfileNotif > 0){
                    this.$store.dispatch('efile_notification/GET_PENDING_EFILE_NOTIFICATION', pendingEfileNotif - 1)
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