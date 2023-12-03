const model = require('../models');
const { BadRequestError } = require('../core/error.response');

const {
  findAllDraftsForShop,
  publishProductByShop,
  unpublishProductByShop ,
  findAllPublishForShop,
  getListSearchProduct,
  findAllProducts,
  findProductById,
  updateProductById
} = require('../models/repositories/product.repo')

class ProductFactory {
  static productRegistry = {}

  static registerProductType = (type, classRef) => {
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) {
      throw new BadRequestError(`Invalid product type ${type}`)
    }

    return new productClass(type, payload).createProduct()
  }

  static async updateProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) {
      throw new BadRequestError(`Invalid product type ${type}`)
    }

    return new productClass(type, payload).updateProduct(payload.product_id)
  }


  static async publishProductByShop({product_shop, product_id}) {
    return await publishProductByShop(product_shop, product_id)
  }

  static async unpublishProductByShop({product_shop, product_id}) {
    return await unpublishProductByShop(product_shop, product_id)
  }

  // QUERY ///

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true }
    return await findAllDraftsForShop({ query, limit, skip })
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true }
    return await findAllPublishForShop({ query, limit, skip })
  }


  static async getListSearchProduct({keySearch}) {
    return await getListSearchProduct({keySearch})
  }

  static async findAllProducts({limit=50, page=1, sort='ctime',filter = {isPublished:true}}) {
    return await findAllProducts({
      limit,
      sort,
      filter,
      page,
      select :['product_name','product_description','product_thumb']
    })
  }

  static async findProductById({product_id}) {
    return await findProductById({product_id, unSelect:["__v"]})
  }
}

class Product {
  constructor(product_type, payload) {
    const {
      product_name, product_thumb, product_description,
      product_price, product_quantity, product_attributes, product_shop,
    } = payload;

    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_shop = product_shop;
    this.product_type = product_type;
    this.product_attributes = product_attributes || [];
  }

  async createProduct(productId) {
    return await model.Product.create({ ...this, _id: productId });
  }

  async updateProduct(product_id, bodyUpdate) {
    return await updateProductById(product_id, bodyUpdate,model.Product);
  }
}


class Electronic extends Product {
  async createProduct() {
    const newElectronic = await model.Electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })

    if (!newElectronic) throw new BadRequestError("Create electronic error !")

    const newProduct = super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestError("Create product error !")

    return newProduct
  }

  async updateProduct(product_id) {
    const objectParams = this
    if(objectParams.product_attributes){
      await updateProductById(product_id, objectParams.product_attributes, model.Electronic)
    }

    const product = await  super.updateProduct(product_id, objectParams)
    return product
   }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await model.Clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })

    if (!newClothing) throw new BadRequestError("Create clothing error !")

    const newProduct = super.createProduct(newClothing._id)
    if (!newProduct) throw new BadRequestError("Create product error !")

    return newProduct
  }

  async updateProduct(product_id) {
   const objectParams = this
   if(objectParams.product_attributes){
     await updateProductById(product_id, objectParams.product_attributes, model.Clothing)
   }

   const product = await  super.updateProduct(product_id, objectParams)
   return product
  }
}

ProductFactory.registerProductType("Electronics", Electronic)
ProductFactory.registerProductType("Clothing", Clothing)

module.exports = ProductFactory
