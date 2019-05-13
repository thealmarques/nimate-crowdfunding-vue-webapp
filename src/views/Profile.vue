<template>
  <div class="container">
    <div class="container py-5">
      <div class="row">
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-4">
              <div class="col-md-12">
                <li
                  class="border-0 list-group-item d-flex justify-content-between align-items-center"
                >
                  Welcome, {{this.currentUser.displayName}}
                  <i class="fa fa-user text-muted fa-user"></i>
                </li>
                <ul class="list-group list-group-flush">
                  <li
                    @click="deleteAccount()"
                    style="cursor:pointer;"
                    class="border-0 list-group-item"
                  >
                    <i class="fa text-primary mr-2 fa-trash"></i>Delete Account
                    <br>
                  </li>
                  <li @click="logout()" style="cursor:pointer;" class="border-0 list-group-item">
                    <i class="fa text-primary mr-2 fa-sign-out"></i>Log out
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-md-8">
              <div class="row">
                <div class="mx-auto col-lg-9 col-8" style>
                  <div v-if="error" class="mt-1 alert alert-danger" role="alert">{{ error }}</div>
                  <form id="formRegister" class @submit.prevent="handleSubmit">
                    <div class="form-group">
                      <label>
                        Name
                        <br>
                      </label>
                      <input
                        type="text"
                        v-model="user.name"
                        id="name"
                        name="name"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && $v.user.name.$error }"
                      >
                      <div
                        v-if="submitted && !$v.user.name.required"
                        class="invalid-feedback"
                      >Name is required</div>
                    </div>
                    <div class="form-group">
                      <label for="form17">
                        Email
                        <br>
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="emailRegister"
                        :value="this.currentUser.email"
                        disabled
                      >
                    </div>
                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="form19">Password</label>
                        <input
                          type="password"
                          v-model="user.password"
                          id="password"
                          name="password"
                          class="form-control"
                          :class="{ 'is-invalid': submitted && $v.user.password.$error }"
                        >
                        <div v-if="submitted && $v.user.password.$error" class="invalid-feedback">
                          <span
                            v-if="!$v.user.password.minLength"
                          >Password must be at least 6 characters</span>
                        </div>
                      </div>
                      <div class="form-group col-md-6">
                        <label for="form20">Confirm Password</label>
                        <input
                          type="password"
                          v-model="user.confirmPassword"
                          id="confirmPassword"
                          name="confirmPassword"
                          class="form-control"
                          :class="{ 'is-invalid': submitted && $v.user.confirmPassword.$error}"
                        >
                        <div
                          v-if="submitted && $v.user.confirmPassword.$error"
                          class="invalid-feedback"
                        >
                          <span v-if="!$v.user.confirmPassword.sameAsPassword">Passwords must match</span>
                        </div>
                      </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="mySmallModalLabel"
      aria-hidden="true"
      id="mi-modal"
    >
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="myModalLabel">Confirmar</h4>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" id="modal-btn-si">Si</button>
            <button type="button" class="btn btn-primary" id="modal-btn-no">No</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, sameAs } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
import {
  LOGOUT_USER,
  UPDATE_USER,
  DELETE_ACCOUNT,
  CHANGE_PASSWORD
} from "@/store/actions.type";

export default {
  name: "Profile",
  data() {
    return {
      user: {
        name: "",
        password: "",
        confirmPassword: ""
      },
      submitted: false
    };
  },
  validations: {
    user: {
      name: { required },
      password: { minLength: minLength(6) },
      confirmPassword: { sameAsPassword: sameAs("password") }
    }
  },
  computed: {
    ...mapGetters(["currentUser", "error"])
  },
  created: function() {
    this.user.name = this.currentUser.displayName;
  },
  methods: {
    handleSubmit: function() {
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      let self = this;
      if (this.user.password != "") {
        this.$store
          .dispatch(CHANGE_PASSWORD, self.user.password)
          .then(function() {
            if (!self.error) {
              if (self.user.name != self.currentUser.displayName) {
                self.$store
                  .dispatch(UPDATE_USER, { displayName: self.user.name })
                  .then(function() {
                    if (!self.error) {
                      self.$dialog
                        .alert("User account updated successfully")
                        .then(function() {
                          location.reload();
                        })
                        .catch(function() {
                          location.reload();
                        });
                    }
                  });
              } else {
                self.$dialog
                  .alert("User account updated successfully")
                  .then(function() {
                    location.reload();
                  })
                  .catch(function() {
                    location.reload();
                  });
              }
            }
          });
      } else if (self.user.name != self.currentUser.displayName) {
        this.$store
          .dispatch(UPDATE_USER, { displayName: self.user.name })
          .then(function() {
            if (!self.error) {
              self.$dialog
                .alert("User account updated successfully")
                .then(function() {
                  location.reload();
                })
                .catch(function() {
                  location.reload();
                });
            }
          });
      }
    },
    deleteAccount: function() {
      var self = this;

      // Trigger a confirmation dialog
      this.$dialog
        .confirm(
          "Are you sure you want to delete your account? This action is irreversible."
        )
        .then(function() {
          self.$store.dispatch(DELETE_ACCOUNT).then(function() {
            if (!self.error) {
              self.$router.push({
                name: "login",
                params: {
                  register_info: "We are sorry to see you go."
                }
              });
            }
          });
        });
    },
    logout: function() {
      this.$store.dispatch(LOGOUT_USER);
      this.$router.push({
        name: "login",
        params: {
          parameter_msg: "Hope to see you soon"
        }
      });
    }
  }
};
</script>