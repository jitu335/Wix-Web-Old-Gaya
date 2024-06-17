import productsModel from "../models/products.js";


class productsController {

    static getParentProducts = async (req, res) => {
        const fetchProducts = await productsModel.find({});
        return res.status(200).json(fetchProducts); 
      }
}

export default productsController;
