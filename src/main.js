import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

import VueTippy  from 'vue-tippy';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/border.css';

const app = createApp(App)

app.use(VueTippy, {
        directive: 'tippy',
        component: 'tippy',
        componentSingleton: 'tippy-singleton',
        defaultProps: {
        allowHTML: true,
        theme: 'custom',
        touch: true
    }
});
    
app.mount('#app');
