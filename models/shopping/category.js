'use strict'

import mongoose from 'mongoose'
import categoryData from '../../initData/category'

const categorySchema = new mongoose.Schema(
  {
    id: Number,
    is_in_serving: Boolean,
    description: String,
    title: String,
    link: String,
    image_url: String,
    icon_url: String,
    title_color: String
  },
  {
    versionKey: false
  }
)

const Category = mongoose.model('Category', categorySchema)

Category.findOne((err, data) => {
  if (err) throw err
  if (!data) {
    categoryData.forEach(item => {
      Category.create(item)
    })
  }
})

export default Category
