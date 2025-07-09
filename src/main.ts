import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Tailwind CSS
import './assets/tailwind.css'

// PrimeVue Temel Kurulum
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-indigo/theme.css' // ✅ Geçerli tema
import 'primevue/resources/primevue.css'                         // ✅ Temel PrimeVue stil dosyası
import 'primeicons/primeicons.css'                              // ✅ İkon seti
import 'primeflex/primeflex.css'                                // Opsiyonel: Grid ve spacing yardımcıları

// PrimeVue Bileşenleri
import Card from 'primevue/card'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Fieldset from 'primevue/fieldset'
import Dialog from 'primevue/dialog'
import ConfirmationService from 'primevue/confirmationservice'
import Galleria from 'primevue/galleria'
import Sidebar from 'primevue/sidebar'

import Menubar from 'primevue/menubar';


createApp(App)
    .use(store)
    .use(router)
    .use(PrimeVue)
    .use(ToastService)
    .use(ConfirmationService)
    .component('Card', Card)
    .component('TabPanel', TabPanel)
    .component('DataTable', DataTable)
    .component('Column', Column)
    .component('InputText', InputText)
    .component('IconField', IconField)
    .component('InputIcon', InputIcon)
    .component('Dialog', Dialog)
    .component('Button', Button)
    .component('Galleria', Galleria)
    .component('Toast', Toast)
    .component('Accordion', Accordion)
    .component('AccordionTab', AccordionTab)
    .component('Fieldset', Fieldset)
    .component('Sidebar', Sidebar)
    .component('Menubar', Sidebar)
    .mount('#app')
