<template>
  <div class="container mx-auto w-3/6 mt-20">
    <form class="gap-2" v-if="!showTable">
      <div class="mb-4">
        <label for="mainCategory" class="block text-gray-700 text-sm font-bold mb-2">Main Category</label>
        <Dropdown filter 
          :loading="MainCategoriesPending"
          :placeholder="MainCategoriesPending ? 'Loading...' : 'Select Main Category'"
          id="mainCategory" v-model="selectedMainCategories"
          :options="mainCategorys?.data?.categories"
          optionLabel="name" class="w-full"/>
      </div>
      <div class="mb-4">
        <label for="subCategory" class="block text-gray-700 text-sm font-bold mb-2">Sub Category</label>
        <Dropdown filter 
          @change="getProperties"
          id="subCategory" 
          v-model="selectedSubCategory"
          :options="selectedMainCategories?.children"
          optionLabel="name" class="w-full"/>
      </div>

      <div class="mb-4" v-for="(property, index) in propertiesList" :key="property?.id"> <!-- propertiesList -->
        <label :for="'processType'[index]" class="block text-gray-700 text-sm font-bold mb-2">{{ property?.name }}</label>
        <Dropdown filter 
          :id="'property'[index]"
          @change="saveProperties(property, $event)"
          v-model="selectedProperties[index]"
          :options="property?.options"
          optionLabel="name" class="w-full"/>
        <InputText 
          v-if="selectedProperties[index]?.name === 'Other'"
          @change="saveOtherProperties(property, $event.target.value)"
          v-model="inputOther[index]" 
          class="form-input px-4 py-3 mt-2 mb-2 border w-full" type="text" />
      </div> 
      <Button label="Submit" @click="onSubmit" 
      class="mt-2 mb-5 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" />
    </form>

    <DataTable :value="savedPropertiesArr" tableStyle="min-width: 50rem" v-if="showTable">
      <Column field="name" header="Name"></Column>
      <Column field="value" header="value"></Column>
    </DataTable>

  </div>
</template>

<script setup>
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

name: 'App'

let selectedMainCategories = ref();
let selectedSubCategory = ref();
const { data: mainCategorys, pending: MainCategoriesPending } = await useCustomFetch('get_all_cats', {
  pick: ['data']
});

let propertiesList = ref([]);
let selectedProperties = ref([]);
function getProperties () {
  const { data } = useCustomFetch(`properties?cat=${selectedSubCategory?.value?.id}`, {
    pick: ['data'],
    transform: (data) => {
      propertiesList.value = data.data
      .filter( item => item.options.length) // show item with options only
      .map(item => { // add 'Other' option
        item.options.push({ name: 'Other'})
        return item
      });
    },
  });
}

let savedPropertiesArr = ref([]);
function saveProperties ({name}, {value}) {
  let savedObj = {
    'name' : name,
    'value' : value.name
  }
  // if the property already exists
  if ( savedPropertiesArr.value.some(item => item['name'] == name) ) {
    savedPropertiesArr.value = savedPropertiesArr.value.map(item => {
      if (item.name === name) {
        item['value'] = value.name
      }
      return item
    })
  }
  else{
    savedPropertiesArr.value = [...savedPropertiesArr.value, savedObj]
  }
  getPropertyChildren(value)
}
function getPropertyChildren ({id}) {
  useCustomFetch(`get-options-child/${id}`, {
    pick: ['data'],
    transform: (data) => {
      if (!data.data.length) return;
      
      if (data.data.filter(({ name }) => propertiesList.value.some((e) => e.name === name)).length > 0 ) { // if there is duplicate
        let map = {};
        propertiesList.value.forEach(item => map[item.name] = item);
        data.data.forEach(item => map[item.name] = item);
        
        propertiesList.value = Object.values(map).map(item => { // add 'Other' option
          item.options.push({ name: 'Other'})
          return item
        });
      }
      else { // if there is no duplicate
        let index = propertiesList.value.findIndex(property => savedPropertiesArr.value[savedPropertiesArr.value.length - 1]?.name === property.name);
        data.data.map(item => { // add 'Other' option
          item.options.push({ name: 'Other'})
          return item
        });
        propertiesList.value.splice(index + 1, 0, ...data.data)
      }
    }
  })
}

let inputOther = ref([]);
function saveOtherProperties ({name}, otherValue) { // when the user select 'Other'
  if ( savedPropertiesArr.value.some(item => item['name'] == name) ) {
    savedPropertiesArr.value = savedPropertiesArr.value.map(item => {
      if (item.name === name) {
        item['value'] = otherValue
      }
      return item
    })
  }
  else{
    savedPropertiesArr.value = [...savedPropertiesArr.value, {'name': name, 'value': otherValue}]
  }
}

let showTable = ref(false);
function onSubmit () {
  if (!selectedProperties.value.length) return;
  showTable.value = true
}
</script>

<style>
.p-dropdown, .form-input  {
  border: 1px solid #424b57;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  border-radius: 6px;
}
.p-dropdown.p-invalid.p-component {
  border-color: #FCA5A5;
  border-width: 1px;
}
</style>