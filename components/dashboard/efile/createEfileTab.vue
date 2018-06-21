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

                            <tr v-for="users in filteredUserList" :key="users.id">
                                <td>
                                    <input v-model="recipientList" :value="{id: users.id, name: users.name}" class="yuen" type="checkbox">
                                </td>
                                <td>{{users.name}}</td>
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
        
        components:{
            TinyMce
        },

        computed: {

            filteredUserList() {
                return this.userList.filter(x => {

                     //cannot search Numbers
                   if(this.userSearchBy === 'Name'){
                        return x.name.toLowerCase().includes( this.userSearchInput.toLowerCase() )
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
                    content_style: " body {padding: 3em;}, p{padding: 0 !important;}",
                    theme: 'modern',
                    plugins: ' code print fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link template table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
                    toolbar1: 'formatselect fontselect fontsize fontsizeselect  | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat pagebreak ',
                    image_advtab: true,
                    templates: [
                        { title: 'Sample Document', content: unescape("%3C%21DOCTYPE%20html%3E%0A%3Chtml%3E%0A%3Chead%3E%0A%3C/head%3E%0A%3Cbody%3E%0A%3Cp%3E%3Cimg%20style%3D%22width%3A%20100%25%3B%20height%3A%20120px%3B%20top%3A%200px%20%21important%3B%20left%3A%200px%20%21important%3B%20z-index%3A%20-20%20%21important%3B%20position%3A%20absolute%20%21important%3B%22%20src%3D%22https%3A//www.toyotafinance.co.in/images/banner-document-784x199.jpg%22%20alt%3D%22%20width%3D%22%20height%3D%22199%22%20/%3E%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Ch1%20style%3D%22text-align%3A%20center%3B%22%3E%26nbsp%3B%3C/h1%3E%0A%3Ch1%20style%3D%22text-align%3A%20center%3B%22%3ESample%20Document%3C/h1%3E%0A%3Cp%3Easdiasdfasdtyasrdyats%20ausydtua%20sytduaystd%20uasytd%20asdtasuy%20dtasd%20auysdtasuydt%20auysdtasasdas%20asd%20ad%20asd%20asd%20asd%20asdu%20tdasuydtas%20ydtasyud%20tasyu%20tdausyt%20dasdt%20auysdtasyu%20tdasuydtasuydt%20asudtasudt%20ausydtauydtasduyats%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%3Cimg%20style%3D%22float%3A%20right%3B%22%20src%3D%22https%3A//camo.githubusercontent.com/805e05b94844e39d7edd518f492c8599c71835b3/687474703a2f2f692e696d6775722e636f6d2f646e5873344e442e706e67%22%20alt%3D%22%20width%3D%22%20height%3D%2296%22%20/%3E%3C/p%3E%0A%3Cp%20style%3D%22padding-left%3A%2060px%3B%20text-align%3A%20right%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20right%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20right%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20right%3B%22%3EJohn%20S%20Doe%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/p%3E%0A%3C/body%3E%0A%3C/html%3E") },
                        { title: 'Test template 2', content: 'Test 2' }
                    ]
                },//tinymce

                userList: [
                        {
                        "id": "fc7d4200-4f7c-48c5-86c8-758910377bb0",
                        "name": "Arlina Fawks",
                        "username": "afawks0@multiply.com",
                        "department": "Marketing",
                        "position": "Systems Administrator I"
                        }, {
                        "id": "b2e53561-9d1b-41ab-977c-54b54ec66c11",
                        "name": "Heath Machel",
                        "username": "hmachel1@spiegel.de",
                        "department": "Support",
                        "position": "Research Nurse"
                        }, {
                        "id": "711550e9-56f0-4bb4-a003-3573d2ba520a",
                        "name": "Chrystel Roddy",
                        "username": "croddy2@dagondesign.com",
                        "department": "Sales",
                        "position": "Media Manager I"
                        }, {
                        "id": "e8688131-6508-49dc-a905-06520eb36bf1",
                        "name": "Ina Tooke",
                        "username": "itooke3@ning.com",
                        "department": "Support",
                        "position": "Help Desk Operator"
                        }, {
                        "id": "061d2462-a63c-40da-916a-f7404b501aa3",
                        "name": "Ferne Hanny",
                        "username": "fhanny4@rakuten.co.jp",
                        "department": "Accounting",
                        "position": "Community Outreach Specialist"
                        }, {
                        "id": "804841ea-43f8-4368-a6fb-4ce1645cb5ab",
                        "name": "Nilson Haresign",
                        "username": "nharesign5@google.com.au",
                        "department": "Accounting",
                        "position": "Analog Circuit Design manager"
                        }, {
                        "id": "e2c0be51-1c88-4a81-b2a0-2bc6cb89baf5",
                        "name": "Etan Hukins",
                        "username": "ehukins6@ycombinator.com",
                        "department": "Sales",
                        "position": "Senior Financial Analyst"
                        }, {
                        "id": "fa68ac67-d247-4e01-bdc5-20a0ab52e66b",
                        "name": "Anita Blinerman",
                        "username": "ablinerman7@thetimes.co.uk",
                        "department": "Research and Development",
                        "position": "Assistant Manager"
                        }, {
                        "id": "ef81ae90-4d78-4233-af0c-8fcb1020795a",
                        "name": "Angelico Allanson",
                        "username": "aallanson8@networkadvertising.org",
                        "department": "Human Resources",
                        "position": "General Manager"
                        }, {
                        "id": "426b19e0-cc99-4554-b747-c7c6db639eeb",
                        "name": "Kippy Biggam",
                        "username": "kbiggam9@netlog.com",
                        "department": "Training",
                        "position": "VP Product Management"
                        }, {
                        "id": "435f40b4-a956-4ed9-ae6f-bbec8b8b15f5",
                        "name": "Ringo Meysham",
                        "username": "rmeyshama@twitter.com",
                        "department": "Product Management",
                        "position": "Analog Circuit Design manager"
                        }, {
                        "id": "06b58d13-b8e9-4a04-af0a-0e0edd9eac84",
                        "name": "Xenos Grooby",
                        "username": "xgroobyb@nyu.edu",
                        "department": "Sales",
                        "position": "VP Product Management"
                        }, {
                        "id": "242bb59c-ac5b-4270-9221-2dd39b2aa07f",
                        "name": "Jerald Sillis",
                        "username": "jsillisc@nih.gov",
                        "department": "Business Development",
                        "position": "Safety Technician III"
                        }, {
                        "id": "aeff1ee6-90b9-497f-a886-ad4eccb4e7c4",
                        "name": "Dianna Craigie",
                        "username": "dcraigied@admin.ch",
                        "department": "Training",
                        "position": "General Manager"
                        }, {
                        "id": "3c65831a-031b-455c-a348-6a17db46eb1f",
                        "name": "Penelope Tallyn",
                        "username": "ptallyne@taobao.com",
                        "department": "Marketing",
                        "position": "Human Resources Assistant II"
                        }, {
                        "id": "eca5199d-88b3-404e-b158-453306774224",
                        "name": "Onofredo Honnan",
                        "username": "ohonnanf@alexa.com",
                        "department": "Human Resources",
                        "position": "Project Manager"
                        }, {
                        "id": "483b7a7d-04ff-44ea-9a33-cf78ab10e5a7",
                        "name": "Zeb Hilary",
                        "username": "zhilaryg@globo.com",
                        "department": "Business Development",
                        "position": "Database Administrator I"
                        }, {
                        "id": "c3ca8d20-74ec-4757-9e92-ea979ae73fc8",
                        "name": "Vivianne Paynton",
                        "username": "vpayntonh@apache.org",
                        "department": "Accounting",
                        "position": "Structural Analysis Engineer"
                        }, {
                        "id": "5bb11023-d6d9-4782-a4ca-51e1718ca3da",
                        "name": "Vina Keywood",
                        "username": "vkeywoodi@topsy.com",
                        "department": "Legal",
                        "position": "Engineer IV"
                        }, {
                        "id": "d26fc043-08cc-4c1d-ac7e-d78808b1d6f8",
                        "name": "Alon Grumble",
                        "username": "agrumblej@smh.com.au",
                        "department": "Sales",
                        "position": "Chemical Engineer"
                        }, {
                        "id": "6ab502a1-bb5e-48d2-a088-ee5794fee559",
                        "name": "Mac Vasechkin",
                        "username": "mvasechkink@mediafire.com",
                        "department": "Business Development",
                        "position": "Environmental Tech"
                        }, {
                        "id": "440cf585-b8ce-4ce1-83dd-94bc37c23789",
                        "name": "Jourdain Ciccerale",
                        "username": "jcicceralel@eepurl.com",
                        "department": "Business Development",
                        "position": "Automation Specialist III"
                        }, {
                        "id": "b30f591c-a2c1-46cb-a3de-2dc9b73800dd",
                        "name": "Simeon Beaney",
                        "username": "sbeaneym@harvard.edu",
                        "department": "Engineering",
                        "position": "Senior Editor"
                        }, {
                        "id": "2de2ec96-67ab-4e32-8935-26e574577861",
                        "name": "Parnell Oscroft",
                        "username": "poscroftn@seattletimes.com",
                        "department": "Accounting",
                        "position": "VP Sales"
                        }, {
                        "id": "145052da-c9bd-4182-94ea-6f833dba79d7",
                        "name": "Flory Stourton",
                        "username": "fstourtono@about.com",
                        "department": "Research and Development",
                        "position": "Web Developer II"
                        }, {
                        "id": "14fd80b2-bd72-469a-aa9b-c34a9dfbfa83",
                        "name": "Larine Aggott",
                        "username": "laggottp@amazon.co.jp",
                        "department": "Training",
                        "position": "Senior Financial Analyst"
                        }, {
                        "id": "68e95678-0893-4b38-8942-43d45539f412",
                        "name": "Jackie Vandenhoff",
                        "username": "jvandenhoffq@joomla.org",
                        "department": "Business Development",
                        "position": "Sales Representative"
                        }, {
                        "id": "6040d21b-7d01-46f5-9334-bf5f2dd09a53",
                        "name": "Golda Stansell",
                        "username": "gstansellr@dell.com",
                        "department": "Human Resources",
                        "position": "Speech Pathologist"
                        }, {
                        "id": "176e4f85-c87a-4769-a587-7ed30ace894a",
                        "name": "Dorree Gittings",
                        "username": "dgittingss@unicef.org",
                        "department": "Marketing",
                        "position": "VP Sales"
                        }, {
                        "id": "3af7d9ea-0917-4b0b-8196-60779a0c2e80",
                        "name": "Nicolette Matchett",
                        "username": "nmatchettt@samsung.com",
                        "department": "Training",
                        "position": "Statistician II"
                        }, {
                        "id": "8c2a1241-7b8a-402a-a71a-4e4fd693794d",
                        "name": "Sunny Have",
                        "username": "shaveu@mail.ru",
                        "department": "Human Resources",
                        "position": "Paralegal"
                        }, {
                        "id": "e2346907-bdb2-4ecd-b2ae-5e2749ca5174",
                        "name": "Nesta Streather",
                        "username": "nstreatherv@topsy.com",
                        "department": "Product Management",
                        "position": "Recruiting Manager"
                        }, {
                        "id": "973730a6-e05c-4191-abb4-0ed13462eaf4",
                        "name": "Caren Petrolli",
                        "username": "cpetrolliw@ameblo.jp",
                        "department": "Support",
                        "position": "Research Nurse"
                        }, {
                        "id": "1ec16bfb-eb9f-4b85-b9f7-2c0486a27182",
                        "name": "Dinny Negal",
                        "username": "dnegalx@sphinn.com",
                        "department": "Legal",
                        "position": "GIS Technical Architect"
                        }, {
                        "id": "b5ace8a1-4a9b-43e6-a3a1-a8c07bcb58bf",
                        "name": "Tatum Yurikov",
                        "username": "tyurikovy@bandcamp.com",
                        "department": "Product Management",
                        "position": "Structural Analysis Engineer"
                        }, {
                        "id": "f52a4dc9-95a9-44ee-942c-d841a6431acc",
                        "name": "Kelbee Rodolfi",
                        "username": "krodolfiz@epa.gov",
                        "department": "Business Development",
                        "position": "Analog Circuit Design manager"
                        }, {
                        "id": "1e45d853-b8d1-4eb1-a078-06daabe5a613",
                        "name": "Virgie Riguard",
                        "username": "vriguard10@nih.gov",
                        "department": "Support",
                        "position": "Marketing Manager"
                        }, {
                        "id": "5e15856c-5564-4102-a1e5-40c16a504da1",
                        "name": "Lorilyn Latan",
                        "username": "llatan11@statcounter.com",
                        "department": "Training",
                        "position": "Web Designer IV"
                        }, {
                        "id": "2390cb4e-c030-4d45-b2e8-b5ba54f83320",
                        "name": "Donny Dolan",
                        "username": "ddolan12@howstuffworks.com",
                        "department": "Marketing",
                        "position": "Professor"
                        }, {
                        "id": "c18d4422-3797-404e-a6bc-b46938980593",
                        "name": "Artemas Laden",
                        "username": "aladen13@scientificamerican.com",
                        "department": "Legal",
                        "position": "Professor"
                        }, {
                        "id": "ed636985-69ed-408b-badb-1d2d4fa03769",
                        "name": "Mamie Conen",
                        "username": "mconen14@cam.ac.uk",
                        "department": "Business Development",
                        "position": "Software Test Engineer II"
                        }, {
                        "id": "fa3e2589-923d-475d-a323-8ff2b4f4c999",
                        "name": "Hephzibah Galgey",
                        "username": "hgalgey15@digg.com",
                        "department": "Research and Development",
                        "position": "Social Worker"
                        }, {
                        "id": "4f65b6b6-188d-4519-8f05-4c6b8606b1a4",
                        "name": "Elenore Riley",
                        "username": "eriley16@apple.com",
                        "department": "Business Development",
                        "position": "General Manager"
                        }, {
                        "id": "7fa126cb-58e3-4be9-ae8a-554e2547f213",
                        "name": "Livvyy Glanz",
                        "username": "lglanz17@yellowbook.com",
                        "department": "Support",
                        "position": "Executive Secretary"
                        }, {
                        "id": "4448e63c-1b68-40f9-819c-6e4657f577fe",
                        "name": "Gerrie Fer",
                        "username": "gfer18@eepurl.com",
                        "department": "Sales",
                        "position": "Electrical Engineer"
                        }, {
                        "id": "89c72bed-db4b-419e-bbc0-7de38ef64790",
                        "name": "Carr Harberer",
                        "username": "charberer19@so-net.ne.jp",
                        "department": "Services",
                        "position": "Assistant Media Planner"
                        }, {
                        "id": "5e23d4df-7f00-4b45-8cf5-b33c4707c6dc",
                        "name": "Denyse Bockman",
                        "username": "dbockman1a@ycombinator.com",
                        "department": "Sales",
                        "position": "Legal Assistant"
                        }, {
                        "id": "6b383f21-a862-44a2-8745-c0e6de355f79",
                        "name": "Herby Falconbridge",
                        "username": "hfalconbridge1b@360.cn",
                        "department": "Research and Development",
                        "position": "Human Resources Manager"
                        }, {
                        "id": "b00224a8-7529-445a-bee5-b12659b4c988",
                        "name": "Jasper Montez",
                        "username": "jmontez1c@macromedia.com",
                        "department": "Business Development",
                        "position": "Executive Secretary"
                        }, {
                        "id": "cc16df01-6202-40f0-b59b-ff8ba7b9de0e",
                        "name": "Kalila O'Doran",
                        "username": "kodoran1d@virginia.edu",
                        "department": "Legal",
                        "position": "Nurse Practicioner"
                        }
                ]

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