<template>
    <div class="section">



<div class="modal" :class="{'is-active': this.updateModalState}">
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

</div>


        <!--search input-->
        <div class="field has-addons has-addons-centered">
            <p class="control is-expanded">
                <input v-model="imageSearchInput" class="input is-medium" type="text" placeholder="Search images...">
            </p>
            
            <p class="control">
                <span class="select is-medium">
                
                <!--checking by the value of the option-->
                <select v-model="imageSearchBy">
                    <option>ID</option>
                    <option>Name</option>
                    <option>Type</option>
                </select>

                </span>
            </p>&nbsp;&nbsp;
        
            <p class="control">
                <button class="button is-danger is-pulled-right fas fa-cloud-upload-alt is-medium"/>
            </p>
        </div>
        <!--table-->
        <div class="table-container">
            <div v-if="this.userTableLoader" class="has-text-centered lds-hourglass"></div>

            <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth ">
            <thead>
                <tr  class="has-text-centered">
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Avatar</th>
                    <th class="has-text-centered" colspan="3">Action</th>
                </tr>
            </thead>

            <tbody>
                <tr  v-for="image in userImageData" :key="image.id" >
                    <td>{{image.id}}</td>
                    <td>{{image.first_name}}</td>
                    <td>{{image.last_name}}</td>
                    <td>{{image.avatar}}</td>
                    <td class="has-text-centered"><button class="fas fa-trash-alt button is-danger fa-lg is-outlined is-fullwidth"></button></td>
                    <td class="has-text-centered"><button @click="toggleUpdateModal" class="fas fa-edit button is-danger fa-lg is-outlined is-fullwidth"></button></td>
                    <td class="has-text-centered"><button class="fas fa-download button is-danger fa-lg is-outlined is-fullwidth"></button></td>
                </tr>
            </tbody>
            

        </table>

        <div class="box pagination is-centered " role="navigation" aria-label="pagination">
                <a @click="prevPage" class="pagination-previous">Previous</a>
                <a @click="nextPage" class="pagination-next">Next</a>
        </div>

        </div><!--table-container-->
        
    </div>
</template>

<script>
    import axios from 'axios'
    export default {

        created(){
            axios.get("https://reqres.in/api/users?page=1")
                .then( res =>  {
                    this.userImageData = res.data.data
                    this.userTableLoader = false
                })
                .catch( err =>  alert(err) )
        },
        mounted(){
            console.log(this.userImageData);
        },

        data(){
            return{
                userTableLoader : true,

                userPageNo : 1,
                updateModalState: false,
                imageSearchInput : '',
                selected : '',
                imageSearchBy : 'ID',

                userImageData: [],

                noResponse:[{
                    id: "no",
                    first_name: "response",
                    last_name: "from",
                    avatar: "server"
                }],

                
                
            }//return
        },//data

        computed:{
            filteredUserImageData(){
                return this.userImageData.filter( x => {
                    //cannot search Numbers
                   if(this.imageSearchBy === 'ID'){
                        return x.id.includes(this.imageSearchInput)
                   }
                   else if(this.imageSearchBy === 'Name'){
                        return x.first_name.includes(this.imageSearchInput)
                   }
                   else if(this.imageSearchBy === 'Type'){
                        return x.last_name.includes(this.imageSearchInput)
                   }
                   else{
                       return x
                   }


                })
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

            toggleUpdateModal(){
                this.updateModalState = !this.updateModalState
            },

            nextPage(){
                this.userTableLoader = !this.userTableLoader
                this.userPageNo += 1
                axios.get(`https://reqres.in/api/users?page=${this.userPageNo}`)
                .then( res =>  {
                    if( (res.data.data).length === 0){
                        this.userPageNo -= 1
                        this.$notify( this.showNotif('warn', 'Warning', 'fa-exclamation-triangle','no more data to display') )
                        this.userTableLoader = !this.userTableLoader
                    }else{
                        this.userImageData = res.data.data
                        this.userTableLoader = !this.userTableLoader
                    }
                })
                .catch( err =>  this.userImageData = this.noResponse )
            },

            prevPage(){
                this.userTableLoader = !this.userTableLoader
                
                if(this.userPageNo === 1){
                    this.userTableLoader = !this.userTableLoader
                }else{
                    this.userPageNo -= 1;
                    axios.get(`https://reqres.in/api/users?page=${this.userPageNo}`)
                        .then( res => {
                            this.userImageData = res.data.data
                            this.userTableLoader = !this.userTableLoader
                        })
                        .catch( err =>  alert(err) )
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