<template>
  <div class="StepTwo">
    <div style="padding: 2rem 3rem; text-align: left;">
      <div class="mt-2 field">
        <label>
          Title
          <br>
        </label>
        <input
          class="form-control"
          :class="['input', $v.form.title.$error ? 'is-danger' : '']"
          type="text"
          placeholder
          v-model="form.title"
        >
      </div>
      <p v-if="$v.form.title.$error" class="help is-danger">
        Title can't be empty and has a limit of 45 characters (and a minimum of
        5)
      </p>
      <div class="mt-2 field">
        <label>Describe your campaign (100 characters minimum)</label>
        <textarea
          class="form-control"
          rows="8"
          v-model="form.description"
          :class="[$v.form.description.$error ? 'is-danger' : '']"
        ></textarea>
      </div>
      <p
        v-if="$v.form.description.$error"
        class="help is-danger"
      >Description needs to have a minimum of 100 characters</p>
      <div class="mt-2 field">
        <label for="sel1">Category</label>
        <select
          v-model="form.category"
          class="form-control"
          id="sel1"
          :class="[$v.form.category.$error ? 'is-danger' : '']"
        >
          <option>Charity</option>
          <option>Projects</option>
          <option>Personal</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  name: "StepTwo",
  props: ["clickedNext", "currentStep"],
  mixins: [validationMixin],
  data() {
    return {
      form: {
        description: "",
        category: ""
      }
    };
  },
  validations: {
    form: {
      title: {
        required,
        maxLength: maxLength(45),
        minLength: minLength(5)
      },
      description: {
        required,
        minLength: minLength(100)
      },
      category: {
        required
      }
    }
  },
  methods: {},
  watch: {
    currentStep: function() {
      if (!this.$v.$invalid) {
        this.$emit("can-continue", { value: true });
      } else {
        this.$emit("can-continue", { value: false });
      }
    },
    $v: {
      handler: function(val) {
        if (!val.$invalid) {
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
