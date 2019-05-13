<template>
  <!-- eslint-disable -->
  <div class="container">
    <div class="text-center">
      <div class="container">
        <div class="row">
          <div class="mx-auto col-md-6 col-10 bg-white p-5" style>
            <h1 class="mb-3">Log in</h1>
            <form @submit.prevent="handleSubmit" data-vv-scope="form_login">
              <div class="form-group">
                <input
                  type="email"
                  placeholder="example@youremail.com"
                  v-model="email"
                  data-vv-name="email"
                  v-validate="'required|email'"
                  name="email"
                  class="form-control"
                  ref="email"
                  :class="{
                    'is-invalid': submitted && errors.has('form_login.email')
                  }"
                >
                <div
                  v-if="submitted && errors.has('form_login.email')"
                  class="invalid-feedback"
                >{{ errors.first("form_login.email") }}</div>
              </div>
              <div class="form-group mb-3">
                <input
                  type="password"
                  placeholder="••••"
                  v-model="password"
                  v-validate="{ required: true }"
                  data-vv-name="password"
                  ref="password"
                  name="password"
                  class="form-control"
                  :class="{
                    'is-invalid': submitted && errors.has('form_login.password')
                  }"
                >
                <div
                  v-if="submitted && errors.has('form_login.password')"
                  class="invalid-feedback"
                >{{ errors.first("form_login.password") }}</div>
                <small class="form-text text-muted text-right">
                  <a href="javascript:void(null);" @click="openReset = true">Reset password</a>
                </small>
              </div>
              <button class="btn btn-primary">Login</button>
            </form>
            <div v-if="info_prop" class="mt-1 alert alert-warning" role="alert">{{ info_prop }}</div>
            <div v-if="error" class="mt-1 alert alert-danger" role="alert">{{ error }}</div>
            <div v-if="!verification">
              <vue-modaltor :visible="open" @hide="hideModal" :animation-panel="'modal-slide-left'">
                <div>
                  <div class="container">
                    <div class="row">
                      <div class="col-md-12">
                        <form @submit.prevent="handleVerification" data-vv-scope="form_verify">
                          <div class="form-group">
                            <label>Email address</label>
                            <input
                              type="email"
                              placeholder="Enter email"
                              v-model="emailVerify"
                              data-vv-name="emailVerify"
                              name="emailVerify"
                              class="form-control"
                            >
                            <small class="form-text text-muted">
                              We'll never share your email with anyone
                              else.
                            </small>
                          </div>
                          <button type="submit" class="btn btn-primary">Send</button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </vue-modaltor>
              <div class="mt-1 alert alert-dark" role="alert">
                <label class="mt-3">
                  Your email isn't verified.
                  <a
                    href="javascript:void(null);"
                    class="alert-link"
                    @click="
                      open = true;
                      emailVerify = email;
                    "
                  >Resend confirmation</a>
                </label>
              </div>
            </div>
            <div v-if="message" class="mt-1 alert alert-success" role="alert">{{ message }}</div>
          </div>
        </div>
        <div>
          <vue-modaltor
            :visible="openReset"
            @hide="hideModal"
            :animation-panel="'modal-slide-left'"
          >
            <div>
              <div class="container">
                <h2>Reset Password</h2>
                <div class="row">
                  <div class="col-md-12">
                    <form @submit.prevent="handleReset" data-vv-scope="form_reset">
                      <div class="form-group">
                        <label>Email address</label>
                        <input
                          type="email"
                          placeholder="Enter email"
                          v-model="emailReset"
                          data-vv-name="emailReset"
                          v-validate="'required|email'"
                          name="emailReset"
                          class="form-control"
                          ref="emailReset"
                          :class="{
                            'is-invalid':
                              reset_submitted &&
                              errors.has('form_reset.emailReset')
                          }"
                        >
                        <small
                          class="form-text text-muted"
                        >An email with your new password will be sent.</small>
                        <div
                          v-if="
                            reset_submitted &&
                              errors.has('form_reset.emailReset')
                          "
                          class="invalid-feedback"
                        >{{ errors.first("form_reset.emailReset") }}</div>
                      </div>
                      <button class="btn btn-primary">Reset</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </vue-modaltor>
        </div>
      </div>
    </div>
    <div class="py-3">
      <div class="container">
        <div class="row">
          <div class="col-md-12 text-center">
            <p class="mb-0">© 2019 NIMIQ Funding. All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { LOGIN_USER, VERIFY_USER, RESET_PASSWORD } from "@/store/actions.type";
import {
  SET_ERROR,
  CLEAR_ERROR,
  SET_VERIFICATION,
  CLEAR_VERIFICATION
} from "@/store/mutations.type";
import { mapGetters } from "vuex";

export default {
  name: "Login",
  props: ["parameter_msg"],
  data() {
    return {
      submitted: false,
      email: "",
      password: "",
      open: false,
      emailVerify: "",
      verify_submitted: false,
      openReset: false,
      emailReset: "",
      reset_submitted: false,
      info_prop: this.parameter_msg
    };
  },
  computed: {
    ...mapGetters(["error", "verification", "message"])
  },
  methods: {
    hideModal: function() {
      this.open = false;
      this.openReset = false;
      this.verify_submitted = false;
      this.emailVerify = "";
      this.emailReset = "";
      this.reset_submitted = false;
    },
    handleReset: function() {
      this.reset_submitted = true;

      const dict = {
        custom: {
          emailReset: {
            required: "Your email is empty",
            email: "Your email isn't valid"
          }
        }
      };
      this.$validator.localize("en", dict);

      this.$validator.validateAll("form_reset").then(valid => {
        if (valid) {
          let self = this;
          this.$store
            .dispatch(RESET_PASSWORD, this.emailReset)
            .then(function() {
              self.hideModal();
            });
        }
      });
    },
    handleVerification: function() {
      this.verify_submitted = true;
      this.info_prop = null;

      this.$store.commit(CLEAR_ERROR);

      const dict = {
        custom: {
          emailVerify: {
            required: "Your email is empty",
            email: "Your email isn't valid"
          }
        }
      };
      this.$validator.localize("en", dict);

      let self = this;
      //send verification email
      this.$store.dispatch(VERIFY_USER).then(function() {
        self.hideModal();
      });
    },
    handleSubmit: function() {
      this.submitted = true;
      this.info_prop = null;

      const dict = {
        custom: {
          email: {
            required: "Your email is empty",
            email: "Your email isn't valid"
          },
          password: {
            required: "Your password is empty"
          }
        }
      };
      this.$validator.localize("en", dict);
      this.$validator.validateAll("form_login").then(valid => {
        if (valid) {
          let credentials = {
            email: this.email,
            password: this.password
          };

          let self = this;
          this.$store.dispatch(LOGIN_USER, credentials).then(function() {
            if (self.verification) {
              if (!self.error) {
                self.$router.push({
                  name: "campaigns"
                });
              }
            }
          });
        }
      });
    }
  }
};
</script>