<template>
  <!-- eslint-disable -->
  <div class="container">
    <div class="text-center">
      <div class="container">
        <div class="row">
          <div class="mx-auto col-lg-7 col-10 p-5" style>
            <h1>Register for Free</h1>
            <p class="mb-3">Start your own campaign and fund your dreams. Simple as this.</p>
            <form id="formRegister" class="text-left" @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="form16">
                  Name
                  <br>
                </label>
                <input
                  type="text"
                  v-model="user.name"
                  data-vv-name="nameRegister"
                  v-validate="'required'"
                  name="nameRegister"
                  class="form-control"
                  ref="Name"
                  :class="{
                    'is-invalid': submitted && errors.has('nameRegister')
                  }"
                >
                <div
                  v-if="submitted && errors.has('nameRegister')"
                  class="invalid-feedback"
                >{{ errors.first("nameRegister") }}</div>
              </div>
              <div class="form-group">
                <label for="form17">
                  Email
                  <br>
                </label>
                <input
                  type="email"
                  v-model="user.email"
                  data-vv-name="email"
                  v-validate="'required'"
                  name="email"
                  class="form-control"
                  ref="email"
                  :class="{ 'is-invalid': submitted && errors.has('email') }"
                >
                <div
                  v-if="submitted && errors.has('email')"
                  class="invalid-feedback"
                >{{ errors.first("email") }}</div>
              </div>
              <div class="form-group">
                <label for="form18">Confirm Email</label>
                <input
                  type="email"
                  v-model="user.confirm_email"
                  v-validate="'required|confirmed:email'"
                  class="form-control"
                  data-vv-as="email"
                  data-vv-name="confirmEmail"
                  :class="{
                    'is-invalid': submitted && errors.has('confirmEmail')
                  }"
                >
                <div
                  v-if="submitted && errors.has('confirmEmail')"
                  class="invalid-feedback"
                >{{ errors.first("confirmEmail") }}</div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="form19">Password</label>
                  <input
                    type="password"
                    v-model="user.password"
                    v-validate="{ required: true, min: 6 }"
                    data-vv-name="password"
                    ref="password"
                    name="password"
                    class="form-control"
                    :class="{
                      'is-invalid': submitted && errors.has('password')
                    }"
                  >
                  <div
                    v-if="submitted && errors.has('password')"
                    class="invalid-feedback"
                  >{{ errors.first("password") }}</div>
                </div>
                <div class="form-group col-md-6">
                  <label for="form20">Confirm Password</label>
                  <input
                    type="password"
                    v-model="user.confirm_password"
                    v-validate="'required|confirmed:password'"
                    data-vv-as="password"
                    data-vv-name="confirmPassword"
                    ref="confirmPassword"
                    name="confirmPassword"
                    class="form-control"
                    :class="{
                      'is-invalid': submitted && errors.has('confirmPassword')
                    }"
                  >
                </div>
                <div
                  v-if="submitted && errors.has('confirmPassword')"
                  class="invalid-feedback"
                >{{ errors.first("confirmPassword") }}</div>
              </div>
              <div class="form-group">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    name="termsconditionscheck"
                    data-vv-name="termsconditionscheck"
                    ref="termsconditionscheck"
                    v-validate="'required'"
                    type="checkbox"
                    :class="{
                      'is-invalid':
                        submitted && errors.has('termsconditionscheck')
                    }"
                  >
                  <label class="form-check-label" for="form21">
                    I Agree with
                    <a
                      href="termsfeed-terms-conditions-html-english.html"
                    >Term and Conditions</a>
                    of the service
                  </label>
                </div>
              </div>
              <div
                v-if="submitted && errors.has('termsconditionscheck')"
                class="invalid-feedback"
              >{{ errors.first("termsconditionscheck") }}</div>
              <button class="btn btn-primary" id="register_signin">Sign in</button>
            </form>
            <div v-if="error" class="mt-1 alert alert-danger" role="alert">{{ message }}</div>
          </div>
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
import { SIGN_UP_USER } from "@/store/actions.type";
import { authentication } from "@/firebase";
export default {
  name: "Register",
  data() {
    return {
      user: {
        name: "",
        password: "",
        email: "",
        confirm_password: "",
        confirm_email: ""
      },
      submitted: false,
      error: false,
      message: ""
    };
  },
  methods: {
    handleSubmit: function() {
      const dict = {
        custom: {
          nameRegister: {
            required: "Your name is empty"
          },
          email: {
            required: "Your email is empty",
            email: "Please enter a valid email",
            confirmed: "Emails doesn't match"
          },
          confirmEmail: {
            required: "Your email confirmation is empty",
            email: "Please enter a valid confirmation email",
            confirmed: "Emails doesn't match"
          },
          password: {
            required: "Your password is empty",
            confirmed: "Passwords doesn't match"
          },
          confirmPassword: {
            required: "Your password is empty",
            confirmed: "Passwords doesn't match"
          }
        }
      };
      this.$validator.localize("en", dict);

      this.submitted = true;
      this.$validator.validate().then(valid => {
        if (valid) {
          let self = this;
          authentication
            .createUserWithEmailAndPassword(this.user.email, this.user.password)
            .then(
              function(user) {
                //send verification email
                authentication.currentUser
                  .sendEmailVerification()
                  .then(function() {
                    self.error = false;
                    self.$router.push({
                      name: "login",
                      params: {
                        parameter_msg:
                          "An verification email was sent. Verify your email in order to login"
                      }
                    });
                  });

                let current = authentication.currentUser;
                if (current) {
                  current
                    .updateProfile({
                      displayName: self.user.name // some displayName,
                    })
                    .then
                    // OK
                    ();
                }

                //logout user without verification
                authentication.signOut();
              },
              error => {
                // alert("Error!! :-)\n\n" + JSON.stringify(error.message));
                self.message = error.message;
                self.error = true;
                // this.error=true;
                // this.message = error.message;
              }
            );
        }
      });
    }
  }
};
</script>
