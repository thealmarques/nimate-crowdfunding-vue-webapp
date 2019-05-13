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
      alert("TODO");
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