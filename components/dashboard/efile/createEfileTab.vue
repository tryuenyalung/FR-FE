<template>
    <div>

        <div class="modal " :class="{'is-active' : this.isRecipientModalActive}">
            <div class="modal-background" @click="toggleRecipientModal()"/> 

            <div class="modal-content">

                <div class="box">
                    <p class="subtitle is-4">List of Recipients</p>

                    <div class="columns">

                        <div class="column">
                            <p class="label">Efile Name:</p>
                            <input class="input" type="text" v-model="efileName" placeholder="Document for Example..">
                        </div>

                        <div class="column has-text-centered">
                            <p class="label">Private Document:</p>
                            <span class="control">
                                <label class="radio">
                                    <input type="radio" id="rb" value="true" v-model="private_doc">
                                    Yes
                                </label>

                                <label class="radio">
                                    <input type="radio" id="rb" value="false" v-model="private_doc">
                                    No
                                </label>
                            </span>
                        </div>
                    </div><!--columns-->

                    

                    <!--search input-->
                    <div class="field has-addons has-addons-centered">
                        <p class="control is-expanded">
                            <input v-model="userSearchInput" class="input " type="text" placeholder="Search recipients...">
                        </p>
                        
                        <p class="control">
                            <span class="select">
                            
                            <!--checking by the value of the option-->
                            <select v-model="userSearchBy">
                                <option>Name</option>
                                <option>Username</option>
                                <option>Department</option>
                                <option>Position</option>
                            </select>

                            </span>
                        </p>
                    </div>



                    <table class="table is-table-scrollable is-bordered is-striped is-narrow is-hoverable is-fullwidth">

                        <tbody >

                            <tr v-for="users in filteredUserList" :key="users._id">
                                <td>
                                    <input v-model="recipientList" :value="{id: users._id, name: `${users.name.first_name} ${users.name.middle_name} ${users.name.last_name}` }" class="yuen" type="checkbox">
                                </td>
                                <td>{{users.name.first_name}} {{users.name.middle_name}} {{users.name.last_name}} </td>
                                <td>{{users.username}}</td>
                                <td>{{users.department}}</td>
                                <td>{{users.position}}</td>
                            </tr> 

                        </tbody>

                        <tfoot><br>
                            <button @click="validateEfileBeforeSubmit" class="button is-danger is-pulled-right">Send</button>
                        </tfoot>

                    </table>

                </div><!--box-->
            </div><!--modal-content-->
        </div><!--modal-->


        <div class="modal" :class="{'is-active' : this.submiteEfileLoader}" >
            <div class="modal-background"></div>
            <div class="modal-content" style="overflow: hidden;">
                <div id="cssSpiner" />
            </div>
        </div>

        <section class="section">
            <TinyMce v-model="efileContent" :init="tinymce"></TinyMce><br>
            <button @click="validateEfileContent()" class="is-pulled-right button is-danger is-medium"><b>Send To</b></button>
        </section>

    </div>
</template>

<script>

    import TinyMce from '@tinymce/tinymce-vue'
    import axios from 'axios'
    import keys from '~/components/keys.js'

    export default {
        
        created(){
            const config = {
                method: 'GET',
                url: `${keys.BASE_URL}/api/v1/users/search?status=y`,
            }

            axios(config)
                .then(res => {
                    this.userList = res.data
                })
                .catch(err => {
                    this.$notify( this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
                })
        },

        components:{
            TinyMce
        },

        computed: {

            filteredUserList() {
                return this.userList.filter(x => {


                     //cannot search Numbers
                   if(this.userSearchBy === 'Name'){
                        return x.name.first_name.toLowerCase().includes( this.userSearchInput.toLowerCase() )
                   }
                   else if(this.userSearchBy === 'Userame'){
                        return x.username.toLowerCase().includes( this.userSearchInput.toLowerCase() )
                   }
                   else if(this.userSearchBy === 'Department'){
                        return x.department.toLowerCase().includes( this.userSearchInput.toLowerCase() )
                   }
                   else if(this.userSearchBy === 'Position'){
                        return x.position.toLowerCase().includes( this.userSearchInput.toLowerCase() )
                   }
                   else{
                       return x
                   }

                })
            },//filteredUserList

            buildEfileForm(){
                let body = {
                        name: this.efileName,
                        content: escape( this.efileContent ),
                        recipient: this.recipientList,
                        sender: {
                            id : this.$store.state.user_details.user._id,
                            name: `${this.$store.state.user_details.user.name.first_name} ${this.$store.state.user_details.user.name.middle_name} ${this.$store.state.user_details.user.name.last_name}`
                        },
                        private_doc: this.private_doc
                    }

                return JSON.stringify( body )
            },


        },

        data(){
            return{
                submiteEfileLoader: false,
                userSearchInput : '',
                userSearchBy : 'Name',
                isRecipientModalActive: false,

                //form
                efileName : null,
                efileContent: null,
                recipientList: [],
                private_doc: null,


                tinymce:{
                    height: 500,
                    content_style: keys.TINYMCE_STYLE,
                    theme: 'modern',
                    plugins: ' code print fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link template table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
                    toolbar1: 'formatselect fontselect fontsize fontsizeselect  | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat pagebreak ',
                    image_advtab: true,
                    templates: [
                        { title: 'Sample Document', content: unescape("%3C%21DOCTYPE%20html%3E%0A%3Chtml%3E%0A%3Chead%3E%0A%3C/head%3E%0A%3Cbody%3E%0A%3Cp%3E%3Cimg%20style%3D%22width%3A%20100%25%3B%20height%3A%20120px%3B%20top%3A%200px%20%21important%3B%20left%3A%200px%20%21important%3B%20z-index%3A%20-20%20%21important%3B%20position%3A%20absolute%20%21important%3B%22%20src%3D%22https%3A//www.toyotafinance.co.in/images/banner-document-784x199.jpg%22%20alt%3D%22%20width%3D%22%20height%3D%22199%22%20/%3E%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Ch1%20style%3D%22text-align%3A%20center%3B%22%3E%26nbsp%3B%3C/h1%3E%0A%3Ch1%20style%3D%22text-align%3A%20center%3B%22%3ESample%20Document%3C/h1%3E%0A%3Cp%3Easdiasdfasdtyasrdyats%20ausydtua%20sytduaystd%20uasytd%20asdtasuy%20dtasd%20auysdtasuydt%20auysdtasasdas%20asd%20ad%20asd%20asd%20asd%20asdu%20tdasuydtas%20ydtasyud%20tasyu%20tdausyt%20dasdt%20auysdtasyu%20tdasuydtasuydt%20asudtasudt%20ausydtauydtasduyats%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%3Cimg%20style%3D%22float%3A%20right%3B%22%20src%3D%22https%3A//camo.githubusercontent.com/805e05b94844e39d7edd518f492c8599c71835b3/687474703a2f2f692e696d6775722e636f6d2f646e5873344e442e706e67%22%20alt%3D%22%20width%3D%22%20height%3D%2296%22%20/%3E%3C/p%3E%0A%3Cp%20style%3D%22padding-left%3A%2060px%3B%20text-align%3A%20right%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20right%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20right%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20right%3B%22%3EJohn%20S%20Doe%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/p%3E%0A%3C/body%3E%0A%3C/html%3E") },
                        { title: 'Test template 2', content: 'Test 2' }
                    ]
                },//tinymce

                userList:[],

            }//return
        }, 

        methods: {

            showNotif(type, title, icon, msg){
                return{
                    type: type,
                    group: 'vnotif',
                    title: `<span ><span class='fas ${icon} fa-2x'></span><span class='title is-5'> ${title}:</span></span>`,
                    text: `<p class='subtitle is-5'>${msg}</p>`
                }
            },

            clearEfileVModel(){
                this.efileName = null
                this.efileContent = null
                this.recipientList = []
                this.private_doc = null
            },

            validateEfileContent(){
                console.log(this.efileContent);
                (this.efileContent !== null) ? this.toggleRecipientModal()
                : this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle','empty content is not allowed') )
            },

            toggleRecipientModal(){
                this.isRecipientModalActive = !this.isRecipientModalActive
            },

            toggleUserSubmitLoader(){
                this.submiteEfileLoader = !this.submiteEfileLoader
            },

            validateEfileBeforeSubmit(){
                if(this.recipientList.length === 0 || this.private_doc === null){
                    this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle','complete the form !') )
                }else{
                    this.toggleUserSubmitLoader()
                    this.submitEfile()
                }
            },

            submitEfile(){
                  
                 const config = {
                    method: 'POST',
                    url: `${keys.BASE_URL}/api/v1/efiles`,
                    data:  this.buildEfileForm,
                    headers: { 
                        "Content-Type": "application/json"
                    }
                }

                axios(config)
                    .then(res => {
                        this.clearEfileVModel()
                        this.toggleUserSubmitLoader()
                        this.toggleRecipientModal()
                        this.$notify( this.showNotif('success', 'Success', 'fa-check-circle','Efile succesfully created.'));
                    })
                    .catch(err => {
                        this.toggleUserSubmitLoader()
                        this.$notify( this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
                    })
            },
            
            

        }
    }
</script>

<style scoped>



.is-table-scrollable{
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
}

.is-table-scrollable tbody{
  display:block;
  width: 100%;
  overflow: auto;
  height: 400px;
}


.is-table-scrollable th, .is-table-scrollable td {
  padding: 5px;
  text-align: left;
  width: 200px;
}

.yuen {
    height: 30px;
    width: 30px;
}
 

      
</style>