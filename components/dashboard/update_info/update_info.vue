<template>
    <div>


<div class="modal" :class="{'is-active': this.isUpdateImageModalActive}">
  <div @click="toggleUpdateImageModal" class="modal-background"/>

  <div class="modal-content">
      <div class="box">

          <h3 class="subtitle is-3 has-text-centered">Update Image</h3>

            <div class="file has-name is-boxed is-centered is-danger">
                <form id="updateAvatarForm">

                    <label class="file-label">
                        <input class="file-input" type="file" name="file" ref="inputImage" v-on:change="displayImageInfoOnForm">
                        <span class="file-cta">
                        <span class="file-icon">
                            <i class="fas fa-upload"></i>
                        </span>
                        <span class="file-label">
                            Choose a image file…
                        </span>
                        </span>
                        <span class="file-name">
                            {{this.imageUploadFileName}}
                        </span>
                    </label>

                </form>
                

                            
            </div>

             <div>
                <button @click="updateAvatar" class="button is-danger is-pulled-right is-outlined">Update</button>
                <br>
             </div>   


      </div>
  </div>

</div>


        <div class="modal" :class="{'is-active': this.isUpdatePasswordModalActive}">
            <div @click="toggleUpdatePasswordModal" class="modal-background"/>

                <div class="modal-content">
                    <div class="box">
                        <p class="has-text-centered subtitle is-4">
                            Change Password:
                        </p>


                            <div class="field">
                                <label class="label">Password</label>
                                <div class="control">
                                    <input  name="password" 
                                            v-model="password"
                                            class="input" 
                                            :class="{ 'is-danger': errors.has('password') }" 
                                            v-validate="{required:true, min:6, is:confirm_password}" 
                                            type="password" 
                                            placeholder="Password">
                                    <small class="has-text-danger">{{ errors.first('password') }}</small>
                                </div>
                            </div> 

                            <div class="field">
                                <label class="label">Re-enter Password</label>
                                <div class="control">
                                    <input  name="confirm_password" 
                                            class="input" 
                                            data-vv-as ="confirm password"
                                            :class="{ 'is-danger': errors.has('password:is') }"
                                            v-model="confirm_password"
                                            v-validate="'required'" 
                                            type="password" 
                                            placeholder="Confirm Password">
                                    <small class="has-text-danger">{{ errors.first('confirm_password') }}</small><br>
                                    <small class="has-text-danger">{{ errors.first('password:is') }}</small>
                                        
                                </div>
                            </div> 


                        <div class="columns">
                            <div class="column">
                                <button @click="validateUpdatePasswordFormBeforeSubmit" class="button is-danger is-pulled-right is-outlined">Submit</button>
                            </div>
                        </div>

                    </div><!--box-->
            </div><!--modal content-->
        </div><!--modal-->



        <div class="section">
            <div class="columns">
                    
                <div class="column is-one-fifth">
                    <figure class="avatar has-text-centered image is-1by1 ">
                        <img :src=" this.$store.state.user_details.user.avatar" >
                    </figure>
                    <button @click="toggleUpdateImageModal" class="button fas fa-camera-retro fa-lg is-danger is-outlined is-fullwidth"></button> 
                </div>
                

                <div class="column">
                    <div class="columns">
                        
                        <div class="column">
                               
                               <form name="updateNameForm">

                                    <div class="field">
                                        <label class="label">First Name</label>
                                        <div class="control">
                                            <input  name="name.firstName"
                                                    data-vv-scope="updateNameForm"
                                                    v-model="firstName"
                                                    data-vv-as="first name"
                                                    class="input" 
                                                    :class="{ 'is-danger': errors.has('name.firstName') }" 
                                                    v-validate.initial="'required'" 
                                                    type="text" 
                                                    :placeholder="firstName">
                                            <small class="has-text-danger">{{ errors.first('name.firstName') }}</small>
                                        </div>
                                    </div> 

                                    <div class="field">
                                        <label class="label">Middle Name</label>
                                        <div class="control">
                                            <input  name="name.middleName"
                                                    data-vv-scope="updateNameForm"
                                                    v-model="middleName"
                                                    data-vv-as="middle name"
                                                    class="input" 
                                                    :class="{ 'is-danger': errors.has('name.middleName') }" 
                                                    v-validate.initial="'required'" 
                                                    type="text" 
                                                    placeholder="Middle Name">
                                            <small class="has-text-danger">{{ errors.first('name.middleName') }}</small>
                                        </div>
                                    </div> 

                                    <div class="field">
                                        <div class="control">
                                            <label class="label">Last Name</label>
                                            <input  name="name.lastName"
                                                    data-vv-scope="updateNameForm"
                                                    v-model="lastName"
                                                    data-vv-as="last name"
                                                    class="input" 
                                                    :class="{ 'is-danger': errors.has('name.lastName') }" 
                                                    v-validate="'required'" 
                                                    type="text" 
                                                    placeholder="Last Name">
                                            <small class="has-text-danger">{{ errors.first('name.lastName') }}</small>
                                        </div>
                                    </div> 

                               </form>


                                
                             <div class="section">
                                    <div class="level">
                                    <div class="level-left">
                                        <div class="level-item">
                                            <button @click="toggleUpdatePasswordModal" class="button is-danger is-outlined">Change Password</button>
                                        </div>
                                    </div>

                                    <div class="level-right">
                                        <div class="level-item">
                                            <button @click="validateUpdateNameFormBeforeSubmit" class="button is-danger is-outlined">Update Name</button>
                                        </div>
                                    </div>
                                </div>
                             </div>
                           

                        </div>

                        <div class="column">

                            <div class="columns">

                                <div class="column">
                                    <div class="field">
                                        <label class="label">Username</label>
                                        <p>{{this.$store.state.user_details.user.username}}</p>
                                    </div>   
                                </div>

                                <div class="column">
                                    <div class="field">
                                        <label class="label">Position</label>
                                        <p>{{this.$store.state.user_details.user.position}}</p>
                                    </div>   
                                </div>

                            </div><!--columns-->


                            <div class="columns">
                                <div class="column">
                                    <div class="field">
                                        <label class="label">Department</label>
                                        <p>{{this.$store.state.user_details.user.department}}</p>
                                    </div> 
                                </div>

                                <div class="column">
                                    <div class="field">
                                        <label class="label">Address</label>
                                        <p>{{this.$store.state.user_details.user.address}}</p>
                                    </div> 
                                </div>
                            </div><!--columns-->


                            <div class="columns">
                                <div class="column">
                                    <div class="field">
                                        <label class="label">Date of Birth</label>
                                        <p>{{this.$store.state.user_details.user.dateOfBirth}}</p>
                                    </div> 
                                </div>

                                <div class="column">
                                    <div class="field">
                                        <label class="label">Gender</label>
                                        <p>{{this.$store.state.user_details.user.gender}}</p>
                                    </div> 
                                </div>
                            </div><!--columns-->
                
                        </div><!--columns-->
                    </div><!--columns-->




                </div><!--columns-->
                
            </div><!--columns-->

            <div class="columns">
                <div class="column is-offset-10 is-2">
                    <figure class="avatar has-text-centered image is-1by1 ">
                        <img :src=" this.$store.state.user_details.user.signature" >
                    </figure>
                </div>
            </div>

        </div><!--section-->

               

        <loader :isActive="this.isLoaderActive"/>
    </div>
</template>

<script>


    import axios from 'axios'
    import keys from '~/components/keys.js'
    import loader from '~/components/loader'

    export default {
        components: {
            loader
        },//components

        data(){
            return{
                isLoaderActive : false,
                isUpdatePasswordModalActive: false,
                isUpdateImageModalActive: false,


                password: "", 
                confirm_password: "",

                imageUploadFileName : null,

                firstName: this.$store.state.user_details.user.name.first_name,  
                middleName: this.$store.state.user_details.user.name.middle_name,  
                lastName: this.$store.state.user_details.user.name.last_name, 

                // firstName: this.$store.state.user_details.user.name.first_name,  
                // middleName: this.$store.state.user_details.user.name.middle_name,  
                // lastName: this.$store.state.user_details.user.name.last_name,
            }
        },//data

        methods: {

            showNotif(type, title, icon, msg){
                return{
                    type: type,
                    group: 'vnotif',
                    title: `<span ><span class='fas ${icon} fa-2x'></span><span class='title is-5'> ${title}:</span></span>`,
                    text: `<p class='subtitle is-5'>${msg}</p>`
                }
            },

            toggleLoader(){
                this.isLoaderActive = !this.isLoaderActive
            },

            toggleUpdatePasswordModal(){
                this.isUpdatePasswordModalActive = !this.isUpdatePasswordModalActive
            },

            toggleUpdateImageModal(){
                this.isUpdateImageModalActive = !this.isUpdateImageModalActive
            },

            displayImageInfoOnForm(){
                this.imageUploadFileName = this.$refs.inputImage.value
            },


            validateUpdateNameFormBeforeSubmit() {
                this.$validator.validateAll("updateNameForm").then((res) => {
                    //check if the form has no error and the signature has been saved
                    !res ? this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle','form not valid ..!') )
                    : this.updateUserName()
                })
            },

            validateUpdatePasswordFormBeforeSubmit() {
                this.$validator.validateAll("updatePasswordForm").then((res) => {
                    //check if the form has no error and the signature has been saved
                    !res ? this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle','form not valid ..!') )
                    : this.updateUserPassword()
                })
            },

            serializeUpdateNameForm(){
                const body ={
                    name: {
                        first_name: this.firstName,
                        middle_name: this.middleName,
                        last_name: this.lastName,
                    }
                }
                return JSON.stringify(body)
            },

            serializeUpdatePasswordForm(){
                const body ={
                    password : this.password
                }
                return JSON.stringify(body)
            },

            updateUserName(){
                this.toggleLoader()

                const config = {
                    method: 'PUT',
                    url: `${keys.BASE_URL}/api/v1/users/${this.$store.state.user_details.user._id}`,
                    data: this.serializeUpdateNameForm() ,
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                }
 
                axios(config)
                    .then(res => {  
                        this.$store.dispatch('user_details/UPDATE_USER_NAME', res.data)
                        this.toggleLoader()
                        this.$notify( this.showNotif('success', 'Success', 'fa-check-circle','name updated..'));
                    })
                    .catch(err => {
                        this.toggleLoader()
                        this.$notify( this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
                    })
            },

            updateUserPassword(){
                this.toggleLoader()

                const config = {
                    method: 'PUT',
                    url: `${keys.BASE_URL}/api/v1/users/password/${this.$store.state.user_details.user._id}`,
                    data: this.serializeUpdatePasswordForm() ,
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                }

                axios(config)
                    .then(res => {  
                        this.toggleLoader()
                        this.toggleUpdatePasswordModal()
                        this.$notify( this.showNotif('success', 'Success', 'fa-check-circle','password updated..'))
                    })
                    .catch(err => {
                        this.toggleLoader()
                        this.toggleUpdatePasswordModal()
                        this.$notify( this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
                    })
            },

            updateAvatar(){
                this.toggleLoader()

                let formData = new FormData(updateAvatarForm) //new FormData(formNameHere)
                    
                const config = {
                    method: 'POST',
                    url: `${keys.BASE_URL}/api/v1/files`,
                    data: formData,
                    headers: { 
                        "Content-Type": "multipart/form-data",
                        "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                }

                axios(config)
                    .then(res => {  
                        this.updateAvatarUrlOnUser(res.data.file.filename)
                    })
                    .catch(err => {
                        this.toggleLoader()
                        this.toggleUpdateImageModal()
                        this.$notify( this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
                    })

            },

            updateAvatarUrlOnUser(filename){
                let avatarUrl = `${keys.BASE_URL}/api/v1/files/${filename}` 

                this.$store.dispatch('user_details/UPDATE_USER_AVATAR', {avatar : avatarUrl})
                    
                const config = {
                    method: 'PUT',
                    url: `${keys.BASE_URL}/api/v1/users/${this.$store.state.user_details.user._id}`,
                    data: {
                        "avatar": avatarUrl
                    },
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                }

                axios(config)
                    .then(res => {  
                        this.toggleLoader()
                        this.toggleUpdateImageModal()
                        this.$notify( this.showNotif('success', 'Success', 'fa-check-circle','avatar updated..'))
                    })
                    .catch(err => {
                        this.toggleLoader()
                        this.toggleUpdateImageModal()
                        this.$notify( this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
                    })

            }
        },//methods


    }
</script>

<style scoped>

</style>