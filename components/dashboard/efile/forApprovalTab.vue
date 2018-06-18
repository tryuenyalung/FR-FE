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
            <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth ">

            <thead>
                <tr  class="has-text-centered">
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th class="has-text-centered" colspan="3">Action</th>
                </tr>
            </thead>

            <tbody>
                <tr  v-for="image in filteredUserImageData" :key="image.id" >
                    <td>{{image.id}}</td>
                    <td>{{image.name}}</td>
                    <td>{{image.type}}</td>
                    <td>{{image.size}}</td>
                    <td class="has-text-centered"><button class="fas fa-trash-alt button is-danger fa-lg is-outlined is-fullwidth"></button></td>
                    <td class="has-text-centered"><button @click="toggleUpdateModal" class="fas fa-edit button is-danger fa-lg is-outlined is-fullwidth"></button></td>
                    <td class="has-text-centered"><button class="fas fa-download button is-danger fa-lg is-outlined is-fullwidth"></button></td>
                </tr>
            </tbody>
            

        </table>

        <div class="box pagination is-centered " role="navigation" aria-label="pagination">
                <a class="pagination-previous">Previous</a>
                <a class="pagination-next">Next</a>
        </div>

        </div><!--table-container-->
        
    </div>
</template>

<script>
    export default {
        
        data(){
            return{

                updateModalState: false,
                imageSearchInput : '',
                selected : '',
                imageSearchBy : 'ID',

                userImageData:    
                [{
  "id": "ddbde422-1186-4fb8-bd08-a833ed3cff6b",
  "name": "curae.png",
  "type": "image/png",
  "size": "38.72.168.62/9"
}, {
  "id": "4e3c985e-4579-45af-ad72-02e05183e3f7",
  "name": "molestie_nibh.tiff",
  "type": "image/tiff",
  "size": "158.124.238.25/5"
}, {
  "id": "480c36d8-6f14-4fc5-8ece-5a413b2ab492",
  "name": "est.jpeg",
  "type": "image/pjpeg",
  "size": "171.210.139.129/27"
}, {
  "id": "9ac1c92c-6f4c-45ca-b3df-a7fee066c317",
  "name": "vel_pede_morbi.jpeg",
  "type": "image/pjpeg",
  "size": "143.66.146.154/15"
}, {
  "id": "6c83c68a-d7ef-4d80-96b1-c6ff359db641",
  "name": "sed.png",
  "type": "image/png",
  "size": "22.130.53.25/11"
}, {
  "id": "cdc45f73-9536-4092-a9c5-f3aabdb33a50",
  "name": "ante_ipsum_primis.gif",
  "type": "image/gif",
  "size": "115.116.74.104/3"
}, {
  "id": "c54bfd98-ad49-4651-9165-bf9a9efc39ee",
  "name": "blandit_nam.gif",
  "type": "image/gif",
  "size": "148.25.139.103/25"
}, {
  "id": "c8ce1b1e-526f-4c0d-8b0c-9f0ba8e083c5",
  "name": "placerat_ante_nulla.jpeg",
  "type": "image/pjpeg",
  "size": "189.81.84.241/3"
}, {
  "id": "54127c84-8772-4b7d-917e-76bceebb378c",
  "name": "ante.gif",
  "type": "image/gif",
  "size": "184.22.138.136/20"
}

]

                
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
                        return x.name.includes(this.imageSearchInput)
                   }
                   else if(this.imageSearchBy === 'Type'){
                        return x.type.includes(this.imageSearchInput)
                   }
                   else{
                       return x
                   }


                })
            },
        },//computed

        methods:{
            toggleUpdateModal(){
                this.updateModalState = !this.updateModalState
            },

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