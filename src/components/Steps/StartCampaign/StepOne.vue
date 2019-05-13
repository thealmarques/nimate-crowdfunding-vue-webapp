<template>
  <div class="StepOne">
    <div style="padding: 2rem 3rem; text-align: left;">
      <div class="mt-2 field">
        <label>
          Name
          <br>
        </label>
        <input
          class="form-control"
          :class="['input', $v.form.name.$error ? 'is-danger' : '']"
          type="text"
          placeholder
          v-model="form.name"
        >
      </div>
      <p v-if="$v.form.name.$error" class="help is-danger">This name is invalid</p>
      <div class="mt-2 field">
        <label>
          Phone number
          <br>
        </label>
        <vue-tel-input
          v-model="form.phone"
          @onInput="onInput"
          :preferredCountries="['us', 'gb', 'pt']"
        ></vue-tel-input>
      </div>
      <p v-if="!this.phoneValid" class="help is-danger">This number is invalid</p>
      <div class="mt-2 field">
        <label>
          Contact Email
          <br>
        </label>
        <input
          class="form-control"
          :class="['input', $v.form.email.$error ? 'is-danger' : '']"
          type="email"
          placeholder
          v-model="form.email"
        >
      </div>
      <p v-if="$v.form.email.$error" class="help is-danger">This email is invalid</p>
      <div class="mt-2 field">
        <label>
          Website (Optional)
          <br>
        </label>
        <input type="text" class="form-control">
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import VueTelInput from "vue-tel-input";
import "vue-tel-input/dist/vue-tel-input.css";

// https://www.npmjs.com/package/vue-tel-input - Não apagar
export default {
  name: "StepOne",
  props: ["clickedNext", "currentStep"],
  mixins: [validationMixin],
  data() {
    return {
      form: {
        name: "",
        phone: "",
        website: "",
        email: ""
      },
      phoneValid: true
    };
  },
  components: {
    VueTelInput
  },
  validations: {
    form: {
      name: {
        required
      },
      email: {
        required,
        email
      },
      phone: {
        required
      }
    }
  },
  methods: {
    /**
     * @param {string} number
     * the phone number inputted by user, will be formatted along with country code
     * // Ex: inputted: (AU) 0432 432 432
     * // number = '+61432421546'
     *
     * @param {Boolean} isValid
     * @param {string} country
     */
    onInput({ number, isValid, country }) {
      //console.log(number, isValid, country);
      this.form.phone = number;
      this.phoneValid = isValid;
      if (!this.$v.$invalid && this.phoneValid) {
        this.$emit("can-continue", { value: true });
      } else {
        this.$emit("can-continue", { value: false });
      }
    },
    onBack() {
      this.$emit("can-continue", { value: true });
    }
  },
  watch: {
    currentStep: function() {
      if (!this.$v.$invalid && this.phoneValid) {
        this.$emit("can-continue", { value: true });
      } else {
        this.$emit("can-continue", { value: false });
      }
    },
    $v: {
      handler: function(val) {
        if (!val.$invalid && this.phoneValid) {
          this.$emit("can-continue", { value: true });
        } else {
          this.$emit("can-continue", { value: false });
        }
      },
      deep: true
    },
    clickedNext(val) {
      if (val === true) {
        this.$v.form.$touch();
      }
    }
  },
  mounted() {
    if (!this.$v.$invalid) {
      this.$emit("can-continue", { value: true });
    } else {
      this.$emit("can-continue", { value: false });
    }
  }
};
</script>

<style scoped></style>
