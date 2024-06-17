// import productsRoutes from "./routes/products.js";
// import express from 'express';
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(bodyParser.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/mywebsite-2-online")
  .then(() => {
    console.log("mongoDB connected jitu");
  })
  .catch((err) => {
    console.log("mongo error here jitu", err);
  });

//---------------------- (1) product schema ----------------------
const insideoutItemsSchema = new mongoose.Schema({
  entity_id: { type: String, required: true },
  sku: { type: String, required: true },
  type: { type: String, required: true },
  url_key: { type: String, required: true },
});

//---------------------- (2) parent child schema----------------------
const parentchildSchema = new mongoose.Schema({
  entity_id: { type: Number, required: true },
  parent_id: { type: Number, required: true },
});

//---------------------- (3) atribute schema ----------------------
const atributeSchema = new mongoose.Schema({
  entity_id: { type: String },
  attribute: { type: String },
  option_id: { type: String },
  option_value: { type: String },
});

//---------------------- (4) resourceSchema ----------------------
const sourceSchema = new mongoose.Schema({
  entity_id: { type: Number },
  desc: { type: String },
});

// ==========================================================================

//---------------------- (1) mapping ----------------------
const InsideoutItems = mongoose.model("insideout_items", insideoutItemsSchema);

//---------------------- (2) mapping ----------------------

const parentchild = mongoose.model("parent_child", parentchildSchema);

//---------------------- (3) atribute mapping ----------------------

const atribute = mongoose.model("atributeSchema", atributeSchema);

//---------------------- (4) resourceSchema maping ----------------------

const resource = mongoose.model("sourceSchema", sourceSchema);

// =========================================================================

// ----------------(1) get API for save product schema------------
app.get("/saveproducts", (req, res) => {
  const apiUrl =
    "http://199.249.0.178/insideout.php?action=get_insideout_items";
  axios
    .get(apiUrl)
    .then(async (response) => {
      const item = response.data.data;
      await item.forEach(async (obj, index) => {
        await saveProducts(obj);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  console.log(arr);
  return res.send("Save SucessFully");
});

// --------------(2) get API for save parent_child schema-----------------

app.get("/saveparent_child", (req, res) => {
  const apiUrl2 =
    "http://199.249.0.178/insideout.php?action=get_insideout_parent_child_id";
  axios.get(apiUrl2).then(async (response) => {
    const item1 = response.data.data;
    await item1.map((item, index) => {
      saveparentchild(item);
    });
  });
  return res.send("Save SucessFully");
});

// ----------------(3) get API for save atribute schema-------------------

app.get("/atribute", async (req, res) => {
  await saveAttributeByid("87");
  await saveAttributeByid("73");
  await saveAttributeByid("77");
  await saveAttributeByid("158");
  await saveAttributeByid("186");
  await saveAttributeByid("275");
  await saveAttributeByid("278");
  await saveAttributeByid("279");
  await saveAttributeByid("283");
  await saveAttributeByid("296");

  await saveAttributeByid("297");
  await saveAttributeByid("299");
  await saveAttributeByid("302");
  await saveAttributeByid("305");
  await saveAttributeByid("97");
  await saveAttributeByid("280");

  return res.send("Save SucessFully");
});

function saveAttributeByid(attribyte) {
  const apiUrl3 =
    "http://199.249.0.178/insideout.php?action=get_insideout_items_attribute&attribute=" +
    attribyte;
  console.log(apiUrl3);
  axios.get(apiUrl3).then(async (response) => {
    const item1 = response.data.data;
    await item1.map((item, index) => {
      saveatribute(item);
    });
  });
}

//=========================================================================
// ---------------------- save products (1) ----------------------

function saveProducts(item) {
  new InsideoutItems({
    entity_id: item.entity_id,
    sku: item.sku,
    type: item.type,
    url_key: item.url_key,
  }).save();
}

// -------------- save parent_child function (2) ---------------------

function saveparentchild(data) {
  new parentchild({
    entity_id: data.entity_id,
    parent_id: data.parent_id,
  }).save();
}

// ----------------- atribute (3) --------------------------
function saveatribute(pro) {
  new atribute({
    entity_id: pro.entity_id,
    attribute: pro.attribute,
    option_id: pro.option_id,
    option_value: pro.option_value,
  }).save();
}

//--------------------- GET data from DATABASE ------------------------

app.get("/resouce", (req, res) => {
  InsideoutItems.find({ type: "configurable" }).then((item) => {
    item.map((data) => {
      const url =
        "http://199.249.0.178/insideout.php?action=get_insideout_item_description&entity_id=" +
        data.entity_id;
      axios.get(url).then((responce) => {
        saveresource(responce.data.data);
      });
    });
  });
  return res.send("jeelo lal today............");
});

//---------------------save resource DATABASE ------------------------

function saveresource(data) {
  new resource({
    entity_id: data.entity_id,
    desc: data.desc,
  }).save();
}

InsideoutItems.find({ type: "configurable" }).then((item) => {
  item.map((data) => console.log(data.entity_id));
});

//------------------------------ port --------------------------------

app.listen(8000, () => {
  console.log("server start jitu");
});
