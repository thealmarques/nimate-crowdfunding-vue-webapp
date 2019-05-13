<template>
  <div class="container">
    <div class="container">
      <div class="row">
        <div class="col-md-12 py-2">
          <div class="wrapper">
            <!--Navigation Start-->
            <nav class="navigation">
              <ul>
                <li>
                  <a href="javascript:void(null);" @click="filterCategory('ALL', '2')">ALL</a>
                  <ul class="children sub-menu">
                    <li>
                      <a href="javascript:void(null);" @click="filterCategory('ALL', '0')">On going</a>
                    </li>
                    <li>
                      <a href="javascript:void(null);" @click="filterCategory('ALL', '1')">Completed</a>
                    </li>
                  </ul>
                </li>
                <li class="active">
                  <a href="javascript:void(null);" @click="filterCategory('Charity', '2')">Charity</a>
                  <ul class="children sub-menu">
                    <li>
                      <a
                        href="javascript:void(null);"
                        @click="filterCategory('Charity', '0')"
                      >On going</a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(null);"
                        @click="filterCategory('Charity', '1')"
                      >Completed</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="javascript:void(null);" @click="filterCategory('Projects', '2')">Projects</a>
                  <ul class="children sub-menu">
                    <li>
                      <a
                        href="javascript:void(null);"
                        @click="filterCategory('Projects', '0')"
                      >On going</a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(null);"
                        @click="filterCategory('Projects', '1')"
                      >Completed</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="javascript:void(null);" @click="filterCategory('Personal', '2')">Personal</a>
                  <ul class="children sub-menu">
                    <li>
                      <a
                        href="javascript:void(null);"
                        @click="filterCategory('Personal', '0')"
                      >On going</a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(null);"
                        @click="filterCategory('Personal', '1')"
                      >Completed</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
            <!--Navigation End-->
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 py-3">
          <form class="search">
            <div class="search__wrapper">
              <input type="text" name placeholder="Search for..." class="search__field">
              <button type="submit" class="fa fa-search search__icon"></button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="py-3">
      <div v-if="this.loading" class="row mb-2">
        <div v-for="campaign in campaigns" v-bind:key="campaign.id" class="col-md-6">
          <a
            class="card-link mb-4"
            href="javascript:void(null);"
            @click="navigateToCampaign(campaign.id)"
          >
            <article class="blog-card" style="height:280px;">
              <img class="post-image" :id="campaign.id" v-on:load="showImage(campaign.id)">
              <div class="article-details">
                <h4 class="post-category">{{campaign.data().category}}</h4>
                <h3 class="post-title">{{campaign.data().title}}</h3>
                <p
                  align="justify"
                  class="post-description"
                >{{ campaign.data().description.substring(0, 100) }}</p>
                <div class="progress">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    :style="getPercentage(campaign.data().balance,campaign.data().goal)"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >{{Math.round(campaign.data().balance/campaign.data().goal * 100)}}%</div>
                </div>
                <h4
                  class="post-author"
                >{{calculateDays(campaign.data().creationDate,campaign.data().duration)}}</h4>
              </div>
            </article>
          </a>
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
import { firestore, storage } from "@/firebase";
//import NProgress from "nprogress";
import objectFitImages from "object-fit-images";
require("@/assets/styles/campaigns.css");
let urlCrypt = require("url-crypt")(
  "%VKegd<T<\"'7S6,;YB'p[vnt\"x>u`49F(\\d*xdBB6EA"
);

export default {
  name: "Campaigns",
  data() {
    return {
      campaigns: [],
      loading: false
    };
  },
  methods: {
    navigateToCampaign(id) {
      let data = {
        id: id
      };
      var base64 = urlCrypt.cryptObj(data);

      this.$router.push({
        name: "campaign",
        params: {
          hash: base64
        }
      });
    },
    getPercentage: function(balance, goal) {
      let percentagem = Math.round((balance / goal) * 100);
      return "width: " + percentagem + "%";
    },
    showImage: function(id) {
      document.getElementById(id).classList.remove("hidden");
    },
    calculateDays: function(date, duration) {
      let auxDate = new Date(date);
      let date1 = new Date();
      let days = parseInt(duration);
      auxDate.setDate(auxDate.getDate() + days);
      if (date1 > auxDate) {
        return "Ended";
      }

      let timeDiff = Math.abs(auxDate.getTime() - date1.getTime());
      let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (diffDays == 1) {
        return diffDays + " day left";
      }
      return diffDays + " days left";
    },
    filterCategory: function(category, status) {
      //NProgress.start();
      this.loading = false;
      let self = this;
      let campaignRef = null;
      if (category == "ALL") {
        campaignRef = firestore.collection("campaigns");
      } else {
        campaignRef = firestore
          .collection("campaigns")
          .where("category", "==", category);
      }
      this.campaigns = [];
      campaignRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          //doc.data() is never undefined for query doc snapshots
          let days = self.calculateDays(
            doc.data().creationDate,
            doc.data().duration
          );
          let flag = false;
          switch (status) {
            case "0":
              if (days.indexOf("Ended") == -1) {
                self.campaigns.push(doc);
                flag = true;
              }
              break;
            case "1":
              if (days.indexOf("Ended") != -1) {
                self.campaigns.push(doc);
                flag = true;
              }
              break;
            case "2":
              self.campaigns.push(doc);
              flag = true;
              break;
          }
          if (flag) {
            storage
              .ref()
              .child("/campaigns/" + doc.id + "/img_pos0")
              .getMetadata()
              .then(function(metadata) {
                if (metadata.customMetadata.height < 370) {
                  document.getElementById(doc.id).style.objectFit = "contain";
                  //IE
                  document.getElementById(doc.id).style.fontFamily =
                    "object-fit: contain;";
                }
              })
              .catch(function(error) {
                // Uh-oh, an error occurred!
              });

            storage
              .ref()
              .child("/campaigns/" + doc.id + "/img_pos0")
              .getDownloadURL()
              .then(function(url) {
                document.getElementById(doc.id).src = url;
              })
              .catch(function(error) {
                console.error(error);
              });
          }
        });
        self.loading = true;
      });
    }
  },
  mounted: function() {
    objectFitImages();
    var self = this;
    firestore
      .collection("campaigns")
      .get()
      .then(function(querySnapshot) {
        self.campaigns = querySnapshot.docs;
        querySnapshot.forEach(function(doc) {
          //doc.data() is never undefined for query doc snapshots

          storage
            .ref()
            .child("/campaigns/" + doc.id + "/img_pos0")
            .getMetadata()
            .then(function(metadata) {
              if (metadata.customMetadata.height < 370) {
                document.getElementById(doc.id).style.objectFit = "contain";
                //IE
                document.getElementById(doc.id).style.fontFamily =
                  "object-fit: contain;";
              }
              //metadata.customMetadata.width
            })
            .catch(function(error) {
              // Uh-oh, an error occurred!
            });

          storage
            .ref()
            .child("/campaigns/" + doc.id + "/img_pos0")
            .getDownloadURL()
            .then(function(url) {
              document.getElementById(doc.id).src = url;
            })
            .catch(function(error) {
              console.error(error);
            });
        });
        //NProgress.done();
        self.loading = true;
      });
  },
  created: function() {
    //NProgress.start();
  }
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Roboto:400,700");

$bg: #eedfcc;
$text: #777;
$black: #121212;
$white: #fff;
$gold: #e9b213;
$border: #ebebeb;
$shadow: rgba(0, 0, 0, 0.2);

@mixin transition($args...) {
  transition: $args;
}

* {
  box-sizing: border-box;
  &::before,
  &::after {
    box-sizing: border-box;
  }
}

body {
  display: flex;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  color: $text;
  background: $bg;
  font-size: 0.9375rem;
  min-height: 100vh;
  margin: 0;
  line-height: 1.6;
  align-items: center;
  justify-content: center;
  text-rendering: optimizeLegibility;
}

#container {
  width: 30rem;
  height: 13.625rem;
}

.blog-card {
  display: flex;
  flex-direction: row;
  background: $white;
  box-shadow: 0 0.1875rem 1.5rem $shadow;
  border-radius: 0.375rem;
  overflow: hidden;
}

.card-link {
  position: relative;
  display: block;
  color: inherit;
  text-decoration: none;
  &:hover .post-title {
    color: $gold;
  }
  &:hover .post-image {
    opacity: 0.9;
  }
}

.post-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
  font-family: "object-fit: cover;";
}

//Target IE and Edge
_:-ms-lang(x),
.post-image {
  width: 210px;
  height: 280px;
  object-fit: cover;
  font-family: "object-fit: cover;";
}

.article-details {
  padding: 1.5rem;
}

.post-category {
  display: inline-block;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.0625rem;
  margin: 0 0 0.75rem 0;
  padding: 0 0 0.25rem 0;
  border-bottom: 0.125rem solid $border;
}

.post-title {
  @include transition(color 0.3s ease);
  font-size: 1.125rem;
  line-height: 1.4;
  color: $black;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.post-author {
  font-size: 0.875rem;
  line-height: 1;
  margin: 1.125rem 0 0 0;
  padding: 1.125rem 0 0 0;
  border-top: 0.0625rem solid $border;
}

@media (max-width: 40rem) {
  #container {
    width: 18rem;
    height: 27.25rem;
  }

  .blog-card {
    flex-wrap: wrap;
  }
}

@supports (display: grid) {
  body {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 0.625rem;
    grid-template-areas: ". main main ." ". main main .";
  }

  #container {
    grid-area: main;
    align-self: center;
    justify-self: center;
  }

  .post-image {
    height: 100%;
  }

  .blog-card {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 1fr;
  }

  @media (max-width: 40rem) {
    .blog-card {
      grid-template-columns: auto;
      grid-template-rows: 12rem 1fr;
    }
  }
}
</style>
