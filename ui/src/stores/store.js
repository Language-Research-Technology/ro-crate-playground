import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import {ROCrate} from "ro-crate";

export const useStore = defineStore('store', {
    state: () => ({
        crate: {},
        json: {},
        examples: [],
        example: {},
        loading: false
    }),
    getters: {},
    actions: {
        async newCrate() {
            this.loading = true;
            try {
                const res = await fetch('/app/crate.json');
                this.crate = await res.json();
            } catch (error) {
                return error;
            } finally {
                this.loading = false;
            }
        },
        async fetchData() {
            this.loading = true;
            try {
                const res = await fetch('/app/examples');
                this.examples = await res.json();
                //TODO: if you have something else need to pre-load do it here.
            } catch (error) {
                return error;
            } finally {
                this.loading = false;
            }
        },
        async setExampleCrate() {
            this.loading = true;
            try {
                const res = await fetch('/app/example/' + this.example.name);
                this.crate = await res.json();
                //TODO: if you have something else need to pre-load do it here.
            } catch (error) {
                return error;
            } finally {
                this.loading = false;
            }
        }
    }
});
