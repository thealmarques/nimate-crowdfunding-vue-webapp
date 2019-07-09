<template>
  <div class="StepFour">
    <div style="padding: 2rem 3rem; text-align: left;">
      <div
        id="my-strictly-unique-vue-upload-multiple-image"
        style="display: flex; justify-content: center;"
      >
        <vue-upload-multiple-image
          v-model="form.images"
          browseText="Choose Files"
          dragText="Drag & Drop"
          primaryText="Default"
          markIsPrimaryText="Set default"
          popupText="This will be the featured image in the campaign"
          dropText="Drop images here"
          @upload-success="uploadImageSuccess"
          @before-remove="beforeRemove"
          @edit-image="editImage"
          @data-change="dataChange"
          :data-images="form.images"
        ></vue-upload-multiple-image>
      </div>
    </div>
  </div>
</template>

<script>
import VueUploadMultipleImage from "vue-upload-multiple-image";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "StepFour",
  props: ["clickedNext", "currentStep"],
  mixins: [validationMixin],
  data() {
    return {
      validImages: true,
      form: {
        images: []
      }
    };
  },
  validations: {
    form: {
      images: {
        required
      }
    }
  },
  components: {
    VueUploadMultipleImage
  },
  methods: {
    uploadImageSuccess(formData, index, fileList) {
      console.log("data", formData, index, fileList);
      //this.form.images = fileList;
      this.validImages = true;

      if (this.validImages) {
        this.$emit("can-continue", { value: true });
      } else {
        this.$emit("can-continue", { value: false });
      }
      // Upload image api
      // axios.post('http://your-url-upload', formData).then(response => {
      //   console.log(response)
      // })
    },
    beforeRemove(index, done, fileList) {
      done();
      this.form.images = fileList;
      if (fileList.length == 0) {
        this.validImages = false;
      } else {
        this.validImages = true;
      }

      if (this.validImages) {
        this.$emit("can-continue", { value: true });
      } else {
        this.$emit("can-continue", { value: false });
      }
    },
    editImage(formData, index, fileList) {
      // console.log('edit data', formData, index, fileList);
      this.form.images = fileList;
    },
    dataChange(data) {
      //console.log(data);
    }
  },
  watch: {
    currentStep: function() {
      if (this.validImages) {
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

<style lang="css" scoped>
#my-strictly-unique-vue-upload-multiple-image {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
/deep/ .image-container {
  width: 400px;
  height: 270px;
  border: 1px dashed #d6d6d6;
  border-radius: 4px;
  background-color: #fff;
}
/deep/ .preview-image {
  height: 240px;
  padding: 5px;
  border-radius: 15px;
  box-sizing: border-box;
}
/deep/ .show-img {
  max-height: 220px;
  max-width: 370px;
  display: block;
  vertical-align: middle;
}
/deep/ .text-small {
  font-size: 15px;
}
</style>
