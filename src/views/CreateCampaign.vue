<template>
  <div class="container">
    <div class="columns">
      <div class="column is-8 is-offset-2 mt-5">
        <horizontal-stepper
          ref="horizontal"
          :steps="demoSteps"
          :keep-alive="keepalive"
          @completed-step="completeStep"
          @active-step="isStepActive"
          @stepper-finished="alertFinish"
        ></horizontal-stepper>
      </div>
    </div>
    <div class="py-3">
      <div class="text-center">
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
import HorizontalStepper from "vue-stepper";
import { firestore, storage } from "@/firebase";
import { mapGetters } from "vuex";

// This components will have the content for each stepper step.
import StepOne from "@/components/Steps/StartCampaign/StepOne.vue";
import StepTwo from "@/components/Steps/StartCampaign/StepTwo.vue";
import StepThree from "@/components/Steps/StartCampaign/StepThree";
import StepFour from "@/components/Steps/StartCampaign/StepFour";

export default {
  name: "CreateCampaign",
  data() {
    return {
      images: [],
      keepalive: true,
      demoSteps: [
        {
          icon: "mail",
          name: "first",
          title: "General information",
          subtitle: "Personal information",
          component: StepOne,
          completed: false
        },
        {
          icon: "info",
          name: "two",
          title: "Description",
          subtitle: "Describe your campaign",
          component: StepTwo,
          completed: false
        },
        {
          icon: "settings",
          name: "three",
          title: "NIMIQ",
          subtitle: "Account",
          component: StepThree,
          completed: false
        },
        {
          icon: "photo_camera",
          name: "four",
          title: "Add pictures",
          subtitle: "Personalize your campaign",
          component: StepFour,
          completed: false
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["currentUser", "error"])
  },
  components: {
    HorizontalStepper
  },
  methods: {
    // Executed when @completed-step event is triggered
    completeStep(payload) {
      this.demoSteps.forEach(step => {
        if (step.name === payload.name) {
          step.completed = true;
        }
      });
    },
    // Executed when @active-step event is triggered
    isStepActive(payload) {
      this.demoSteps.forEach(step => {
        if (step.name === payload.name) {
          if (step.completed === true) {
            step.completed = true;
          }
        }
      });
    },
    // Executed when @stepper-finished event is triggered
    alertFinish(payload) {
      let self = this;
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      let yyyy = today.getFullYear();
      today = mm + "/" + dd + "/" + yyyy;

      firestore
        .collection("campaigns")
        .add({
          name: this.$children[0].$children[0].form.name,
          phone: this.$children[0].$children[0].form.phone,
          email: this.$children[0].$children[0].form.email,
          website: this.$children[0].$children[0].form.website,
          title: this.$children[0].$children[1].form.title,
          description: this.$children[0].$children[1].form.description,
          category: this.$children[0].$children[1].form.category,
          goal: this.$children[0].$children[2].form.goal,
          address: this.$children[0].$children[2].form.address,
          duration: this.$children[0].$children[2].form.days,
          creationDate: today,
          balance: 0,
          user: this.currentUser.uid,
          images: self.$children[0].$children[3].$children[0].images.length
        })
        .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          var pushed = false;
          var index = 0;
          var highlight = 0;
          for (
            let i = 0;
            i < self.$children[0].$children[3].$children[0].images.length;
            i++
          ) {
            let img = new Image();

            if (
              !pushed &&
              self.$children[0].$children[3].$children[0].images[i].highlight ==
                1
            ) {
              //PUSH to firebase
              highlight = i;
              if (
                self.$children[0].$children[3].$children[0].images.length > 1
              ) {
                i = 0;
              }
              pushed = true;
              img.onload = function() {
                storage
                  .ref("/campaigns/" + docRef.id)
                  .child("img_pos" + index)
                  .putString(
                    self.$children[0].$children[3].$children[0].images[i].path,
                    "data_url",
                    {
                      contentType: "image/jpg",
                      customMetadata: {
                        height: img.height,
                        width: img.width
                      }
                    }
                  );
                index++;
              };
              img.src =
                self.$children[0].$children[3].$children[0].images[i].path;
              //firebase.storage().ref('/campaigns/' + docRef.id).child('img_pos' + index).putString(self.$children[0].$children[3].$children[0].images[i].path.substring(23), 'base64', {contentType:'image/jpg'});;
            } else if (pushed && highlight != i) {
              //PUSH to firebase
              img.onload = function() {
                storage
                  .ref("/campaigns/" + docRef.id)
                  .child("img_pos" + index)
                  .putString(
                    self.$children[0].$children[3].$children[0].images[i].path,
                    "data_url",
                    {
                      contentType: "image/jpg",
                      customMetadata: {
                        height: img.height,
                        width: img.width
                      }
                    }
                  );
                index++;
              };
              img.src =
                self.$children[0].$children[3].$children[0].images[i].path;
            }
          }
          self.$router.push({
            name: "campaigns"
          });
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
          alert("Error");
        });
    }
  }
};
</script>

<style scoped>
#my-strictly-unique-vue-upload-multiple-image {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}

.myfooter {
  display: flex;
  align-content: flex-end;
}
</style>

// Change Horizontal Stepper component style
<style src="@/assets/styles/stepper.scss" scoped lang="scss"></style>