<template>
  <div class="StepThree">
    <div style="padding: 2rem 3rem; text-align: left;">
      <div class="mt-2 field">
        <label>
          NIMIQ Address
          <br />
        </label>
        <input
          placeholder="NQXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX"
          class="form-control"
          :class="['input', $v.form.address.$error ? 'is-danger' : '']"
          type="text"
          v-model="form.address"
        />
      </div>
      <p v-if="error.address" class="help is-danger">Invalid address</p>
      <div class="mt-2 field">
        <label>
          Goal
          <br />
        </label>
        <input
          placeholder="10000 (NIM)"
          class="form-control"
          :class="['input', $v.form.goal.$error ? 'is-danger' : '']"
          type="text"
          v-model="form.goal"
        />
      </div>
      <p v-if="$v.form.goal.$error" class="help is-danger">Enter your goal (in NIMs)</p>
      <div class="mt-2 field">
        <label>
          Duration
          <br />
        </label>
        <input
          placeholder="Maximum of 240 days"
          class="form-control"
          :class="['input', $v.form.days.$error ? 'is-danger' : '']"
          type="text"
          v-model="form.days"
        />
      </div>
      <p v-if="$v.form.days.$error" class="help is-danger">Enter the campaign duration</p>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "StepThree",
  props: ["clickedNext", "currentStep"],
  mixins: [validationMixin],
  data() {
    return {
      form: {
        address: "",
        goal: "",
        days: ""
      },
      error: {
        address: ""
      }
    };
  },
  validations: {
    form: {
      address: {
        required
      },
      goal: {
        required
      },
      days: {
        required
      }
    }
  },
  methods: {},
  watch: {
    currentStep: function() {
      try {
        let addr = Nimiq.Address.fromUserFriendlyAddress(this.form.address);
      } catch (error) {
        this.error.address = "Invalid address";
        this.$emit("can-continue", { value: false });
        return;
      }
      this.error.address = "";
      if (!this.$v.$invalid) {
        this.$emit("can-continue", { value: true });
      } else {
        this.$emit("can-continue", { value: false });
      }
    },
    $v: {
      handler: function(val) {
        try {
          let addr = Nimiq.Address.fromUserFriendlyAddress(this.form.address);
        } catch (error) {
          this.error.address = "Invalid address";
          this.$emit("can-continue", { value: false });
          return;
        }
        this.error.address = "";

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
    Nimiq.init();
    this.error.address = "";
    if (!this.$v.$invalid) {
      this.$emit("can-continue", { value: true });
    } else {
      this.$emit("can-continue", { value: false });
    }
  }
};
</script>

<style scoped></style>
